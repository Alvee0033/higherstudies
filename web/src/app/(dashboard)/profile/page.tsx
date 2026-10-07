import * as React from "react";
import { StudentProfileView } from "@/components/screens/profile/student-profile-view";

export const metadata = {
  title: "Student Profile | HigherStudy",
  description: "Manage your academic history, test scores, research background, and study abroad preferences.",
};

export default function ProfilePage() {
  return <StudentProfileView />;
}
