import { expect, test, type Page } from "@playwright/test";

const ROUTES = ["/", "/solutions", "/demo", "/book-demo", "/about", "/contact", "/faq", "/disclaimer"];

/** Collect real errors (ignore noisy WebGL / devtools informational logs). */
function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    if (/WebGL|GPU stall|GL_|swiftshader/i.test(t)) return;
    errors.push(t);
  });
  return errors;
}

for (const route of ROUTES) {
  test(`${route} renders, has one h1, no errors, no horizontal overflow`, async ({ page }) => {
    const errors = trackErrors(page);
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1")).toHaveCount(1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    // Concept indicator must always be visible somewhere on screen.
    await expect(page.getByText(/concept demo/i).first()).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("unknown route shows the 404 page with a way home", async ({ page }) => {
  const res = await page.goto("/this-page-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("link", { name: /home/i }).first()).toBeVisible();
});

test("every internal link on marketing pages resolves", async ({ page, request }) => {
  const seen = new Set<string>();
  for (const route of ROUTES.filter((r) => r !== "/demo")) {
    await page.goto(route);
    const hrefs = await page.$$eval("a[href^='/']", (as) => as.map((a) => a.getAttribute("href")!));
    hrefs.forEach((h) => seen.add(h.split("#")[0].split("?")[0] || "/"));
  }
  for (const href of seen) {
    const res = await request.get(href);
    expect(res.status(), `link ${href}`).toBe(200);
  }
});

test.describe("navigation", () => {
  test("desktop nav reaches each page", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop only");
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main" });
    await nav.getByRole("link", { name: "Solutions" }).click();
    await expect(page).toHaveURL(/\/solutions$/);
    await nav.getByRole("link", { name: "FAQ" }).click();
    await expect(page).toHaveURL(/\/faq$/);
    await page.getByRole("banner").getByRole("link", { name: "Book a Demo" }).click();
    await expect(page).toHaveURL(/\/book-demo/);
  });

  test("mobile menu opens, navigates and closes", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile only");
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Open menu" });
    await toggle.click();
    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await page.getByRole("button", { name: "Open menu" }).click();
    await dialog.getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.getByRole("dialog", { name: "Site menu" })).toBeHidden();
  });
});

test.describe("homepage", () => {
  test("hero copy and CTAs", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Run Every Event.");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Workspace.");
    const hero = page.locator("section[aria-labelledby='hero-title']");
    await expect(hero.getByRole("link", { name: /Explore Demo/ })).toHaveAttribute("href", "/demo");
    await expect(hero.getByRole("link", { name: /Book a Demo/ })).toHaveAttribute("href", "/book-demo");
  });

  test("3D hero mounts (WebGL or 2D fallback)", async ({ page }) => {
    await page.goto("/");
    const stage = page.locator("[data-hero-mode]:visible").first();
    await expect(stage).toHaveAttribute("data-hero-mode", /webgl|fallback/, { timeout: 15_000 });
  });

  test("quotation teaser recalculates correctly", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("section[aria-labelledby='showcase-title']");
    await section.scrollIntoViewIfNeeded();
    // Reference scenario: 450 guests, Signature menu + décor, 5% discount
    await expect(section.getByText("₹8,79,985")).toBeVisible();
    // Toggle discount off → 785000 × 1.18 = 926300
    await section.getByRole("switch").uncheck({ force: true });
    await expect(section.getByText("₹9,26,300")).toBeVisible();
    // Classic menu: 450×950=427500 + 185000 + 42000 = 654500 × 1.18 = 772310
    await section.getByText("Classic", { exact: true }).click();
    await expect(section.getByText("₹7,72,310")).toBeVisible();
    // Guests → 100: 95000 + 185000 + (max(4, round(100/32)=3)=4 × 3000) = 292000 × 1.18 = 344560
    await section.getByLabel("Guests").fill("100");
    await expect(section.getByText("₹3,44,560")).toBeVisible();
  });

  test("audience tabs switch content and support arrow keys", async ({ page }) => {
    await page.goto("/");
    const tabs = page.getByRole("tablist", { name: "Industries" });
    await tabs.getByRole("tab", { name: /Decorators/ }).click();
    await expect(page.getByRole("tabpanel")).toContainText("mandap");
    await page.keyboard.press("ArrowDown");
    await expect(tabs.getByRole("tab", { name: /Wedding planners/ })).toHaveAttribute("aria-selected", "true");
  });
});
