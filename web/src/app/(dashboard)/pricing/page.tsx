import * as React from "react";
import { PurchasePlanView } from "@/components/screens/pricing/pricing-view";

export const metadata = {
  title: "Purchase Plan | HigherStudy",
  description: "Choose the perfect plan to supercharge your study abroad journey.",
};

export const instant = false;

export default function PricingPage() {
  return <PurchasePlanView />;
}
