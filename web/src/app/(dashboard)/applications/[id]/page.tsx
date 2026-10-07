import { Metadata } from "next";
import { ApplicationDetailsView } from "@/components/screens/applications/application-details-view";

export const metadata: Metadata = {
  title: "Application Overview | HigherStudy",
  description: "Review your university application status, checklist, and deadlines.",
};

export function generateStaticParams() {
  return [
    { id: "1" },
    { id: "mit" },
    { id: "stanford" },
    { id: "harvard" },
  ];
}

export default async function ApplicationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ApplicationDetailsView id={id} />;
}
