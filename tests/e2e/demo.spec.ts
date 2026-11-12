import { expect, test, type Page } from "@playwright/test";

/** "₹8,16,400.00" → 816400 */
const money = (s: string) => Number(s.replace(/[^\d.]/g, ""));

async function freshDemo(page: Page, hash: string) {
  await page.goto(`/demo#${hash}`);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForLoadState("networkidle");
}

test.describe("interactive demo", () => {
  test.skip(({ isMobile }) => isMobile, "Flows are exercised at desktop size; mobile layout is covered by site.spec");

  test("menu builder: adding a dish and changing guests updates the catering subtotal", async ({ page }) => {
    await freshDemo(page, "menu");
    const subtotal = page.locator('dt:has-text("Catering subtotal") + dd');
    await expect(subtotal).toBeVisible();
    const before = money(await subtotal.innerText());
    await page.getByRole("button", { name: "Add Aam panna", exact: true }).click();
    await expect.poll(async () => money(await subtotal.innerText())).toBe(before + 55 * 520);
    const perPlate = (before + 55 * 520) / 520;
    await page.getByRole("button", { name: "Increase Guest count" }).click();
    await expect.poll(async () => money(await subtotal.innerText())).toBe(perPlate * 530);
    const guests = page.getByRole("textbox", { name: "Guest count" });
    await guests.fill("99999");
    await guests.press("Enter");
    await expect(guests).toHaveValue("5000");
  });

  test("quotation: discount recalculates the grand total exactly; mark as sent is honest", async ({ page }) => {
    await freshDemo(page, "quotation");
    const doc = page.locator("#quote-document");
    await expect(doc).toBeVisible();
    const subtotal = money(await doc.locator('dt:has-text("Subtotal") + dd').innerText());
    await page.getByLabel("Discount percentage").fill("10");
    const expected = Math.round(Math.round(subtotal * 100 * 0.9) * 1.18) / 100;
    await expect
      .poll(async () => money(await page.locator('dt:has-text("Grand total") + dd').innerText()))
      .toBeCloseTo(expected, 1);
    const markSent = page.getByRole("button", { name: "Mark as sent" });
    if (await markSent.isEnabled()) {
      await markSent.click();
      await expect(page.getByText(/nothing was emailed/i)).toBeVisible();
    }
  });

  test("events: drawer status change, Escape closes, empty state + clear filters", async ({ page }) => {
    await freshDemo(page, "events");
    const search = page.getByPlaceholder("Search client, event or venue…");
    await search.fill("Orbitra");
    await page.getByRole("button", { name: /Orbitra Devices Product Launch/ }).first().click();
    const drawer = page.getByRole("dialog", { name: /Event details/ });
    await expect(drawer).toBeVisible();
    await drawer.getByLabel("Status").selectOption("confirmed");
    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
    await expect(page.locator("tbody tr").first()).toContainText("Confirmed");
    await search.fill("zzzz");
    await expect(page.getByText("No events match these filters")).toBeVisible();
    await page.getByRole("button", { name: "Clear filters" }).click();
    expect(await page.locator("tbody tr").count()).toBeGreaterThanOrEqual(18);
  });

  test("new enquiry validates and creates an event", async ({ page }) => {
    await freshDemo(page, "overview");
    await page.getByRole("button", { name: "New enquiry" }).first().click();
    const modal = page.getByRole("dialog", { name: "New enquiry" });
    await modal.getByRole("button", { name: "Add enquiry" }).click();
    await expect(modal.getByText("Enter the client's name")).toBeVisible();
    await modal.getByLabel("Client name").fill("Test Client");
    await modal.getByLabel("Event date").fill("2026-12-24");
    await modal.getByLabel("Venue").fill("Test Lawns");
    await modal.getByRole("button", { name: "Add enquiry" }).click();
    await expect(page.getByRole("dialog", { name: /Event details: Test Client/ })).toBeVisible();
  });

  test("team: move a task forward", async ({ page }) => {
    await freshDemo(page, "team");
    const doing = page.locator("#col-doing + span");
    const before = money(await doing.innerText());
    await page.getByRole("button", { name: /move “.*” to In progress$/ }).first().click();
    await expect.poll(async () => money(await doing.innerText())).toBe(before + 1);
  });

  test("deep links, persistence and reset", async ({ page }) => {
    await freshDemo(page, "customer");
    await page.getByRole("tab", { name: "Feedback" }).click();
    await page.locator('label:has-text("5 stars")').click();
    await page.getByLabel("Your name").fill("E2E Guest");
    await page.getByRole("button", { name: "Send feedback" }).click();
    await expect(page.getByText("Thank you")).toBeVisible();

    await page.goto("/demo#feedback");
    await expect(page.getByText("E2E Guest").first()).toBeVisible();

    await page.goto("/demo#staff");
    await expect(page.getByRole("tab", { name: /My follow-ups/, selected: true })).toBeVisible();

    await page.evaluate(() => {
      location.hash = "quotation";
    });
    await expect(page.locator("#quote-document")).toBeVisible();
    await expect(page.locator('nav[aria-label="Demo views"] a[aria-current="page"]')).toHaveText(/Quotation/);

    await page.getByRole("button", { name: "Reset sample data" }).first().click();
    await page.getByRole("dialog", { name: "Reset sample data?" }).getByRole("button", { name: "Reset demo" }).click();
    await expect(page.getByText("Sample data restored")).toBeVisible();
    await page.goto("/demo#feedback");
    await expect(page.getByText("Average rating")).toBeVisible();
    await expect(page.getByText("E2E Guest")).toHaveCount(0);
  });
});

test("book-demo form: validation errors, then simulated success", async ({ page }) => {
  await page.goto("/book-demo?module=customer");
  const submit = page.getByRole("button", { name: "Request a walkthrough" });
  await page.getByLabel(/Full name/).fill("A");
  await submit.click();
  const firstInvalid = page.locator('[aria-invalid="true"]').first();
  await expect(firstInvalid).toBeVisible();
  await expect(firstInvalid).toBeFocused();

  await page.getByLabel(/Full name/).fill("Test Person");
  await page.getByLabel(/Business name/).fill("Test Caterers");
  await page.getByLabel(/Business industry/).selectOption("Catering");
  await page.getByLabel(/Work email/).fill("not-an-email");
  await page.getByLabel(/Phone/).fill("12345");
  await submit.click();
  await expect(page.getByLabel(/Work email/)).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByLabel(/Phone/)).toHaveAttribute("aria-invalid", "true");

  await page.getByLabel(/Work email/).fill("person@example.com");
  await page.getByLabel(/Phone/).fill("+91 98765 43210");
  // ?module=customer prefill
  await expect(page.getByRole("radio", { name: /Customer App/ })).toBeChecked();
  await submit.click();
  await expect(page.getByRole("heading", { name: /Request captured/ })).toBeVisible({ timeout: 5_000 });
  await expect(page.getByText(/Nothing was sent/)).toBeVisible();
});
