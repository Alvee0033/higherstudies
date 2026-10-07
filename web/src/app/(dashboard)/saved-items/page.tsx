import { Metadata } from "next";
import { SavedItemsView } from "@/components/screens/saved-items/saved-items-view";

export const metadata: Metadata = {
  title: "Saved Items | HigherStudy",
  description: "Manage your shortlisted universities and bookmarked professors.",
};

export default function SavedItemsPage() {
  return <SavedItemsView />;
}
