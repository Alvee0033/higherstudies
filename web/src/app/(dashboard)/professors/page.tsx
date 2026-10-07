import { ProfessorListView } from "@/components/screens/professors/professor-list-view";

export const metadata = {
  title: "Professors at MIT | HigherStudy",
  description: "Explore professors, faculty research areas, and openings at MIT",
};

export default function ProfessorsPage() {
  return <ProfessorListView />;
}
