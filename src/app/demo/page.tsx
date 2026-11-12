import type { Metadata } from "next";
import { DemoApp } from "@/components/demo/demo-app";

export const metadata: Metadata = {
  title: "Interactive Demo",
  description:
    "Try the EVENTOS concept workspace: bookings calendar, events, menu builder, live quotations, team tasks, a guest app and feedback — all with fictional sample data stored only in your browser.",
};

export default function DemoPage() {
  return <DemoApp />;
}
