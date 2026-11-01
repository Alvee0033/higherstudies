import { ProfessorProfileView } from "@/components/screens/professors/professor-profile-view";

export const metadata = {
  title: "Faculty Profile | HigherStudy",
  description: "View sourced faculty information in the HigherStudy catalogue.",
};

export const instant = false;

export default async function ProfessorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProfessorProfileView id={id} />;
}
