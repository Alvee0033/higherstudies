import { ProfessorProfileView } from "@/components/screens/professors/professor-profile-view";

export const metadata = {
  title: "Prof. Jonathan Smith - Faculty Profile | HigherStudy",
  description: "View research areas, publications, grants, and openings for Prof. Jonathan Smith at MIT",
};

export function generateStaticParams() {
  return [
    { id: "jonathan-smith" },
    { id: "maria-chen" },
    { id: "arjun-patel" },
  ];
}

export default async function ProfessorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProfessorProfileView id={id} />;
}
