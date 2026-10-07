import { ProfessorProfileData } from "./profile-types";

export const JONATHAN_SMITH_PROFILE: ProfessorProfileData = {
  id: "jonathan-smith",
  name: "Prof. Jonathan Smith",
  verified: true,
  title: "Professor of Computer Science and Engineering",
  university: "Massachusetts Institute of Technology (MIT)",
  department: "Department of Electrical Engineering & Computer Science",
  avatar: "/images/prof-jonathan-smith.png",
  acceptingStudents: true,
  tags: ["Machine Learning", "Deep Learning", "Computer Vision", "Human-AI Interaction"],
  metrics: {
    hIndex: 45,
    citations: "12,567",
    publications: 156,
    yearsAtMit: 8,
    avgResponseTime: "2-3 days",
    currentStudents: 12,
  },
  about:
    "Prof. Jonathan Smith is a Professor of Computer Science and Engineering at MIT. His research lies at the intersection of Machine Learning, Computer Vision, and Human-AI Interaction. He has published extensively in top-tier venues including CVPR, ICCV, NeurIPS, and ICML.",
  degrees: [
    {
      degree: "Ph.D. in Computer Science",
      institution: "Stanford University",
      year: "2012",
    },
    {
      degree: "M.S. in Computer Science",
      institution: "UC Berkeley",
      year: "2008",
    },
    {
      degree: "B.S. in Computer Science",
      institution: "UC Berkeley",
      year: "2006",
    },
  ],
  researchInterests: [
    "Machine Learning",
    "Deep Learning",
    "Computer Vision",
    "Human-AI Interaction",
    "Representation Learning",
  ],
  experience: [
    {
      period: "2016 - Present",
      role: "Professor, MIT",
      institution: "MIT",
    },
    {
      period: "2013 - 2016",
      role: "Associate Professor, MIT",
      institution: "MIT",
    },
    {
      period: "2010 - 2013",
      role: "Assistant Professor, MIT",
      institution: "MIT",
    },
    {
      period: "2012 - 2013",
      role: "Postdoctoral Researcher, Stanford University",
      institution: "Stanford University",
    },
  ],
  researchAreas: [
    "Machine Learning",
    "Deep Learning",
    "Computer Vision",
    "Human-AI Interaction",
    "Robotics",
    "Representation Learning",
  ],
  publications: [
    {
      title: "Learning to See in the Dark: Low-light Imaging with Deep Networks",
      venue: "CVPR 2024",
      citations: "2,345",
    },
    {
      title: "Vision Transformers for Dense Prediction Tasks",
      venue: "ICCV 2023",
      citations: "1,876",
    },
    {
      title: "Interactive Perception: Bridging Human and Machine Intuition",
      venue: "NeurIPS 2023",
      citations: "1,421",
    },
  ],
  totalPublications: 156,
  contact: {
    email: "smith@mit.edu",
    phone: "+1 (617) 253-XXXX",
    office: "32-G524, Stata Center, MIT",
    website: "https://web.mit.edu/smith/",
    lastEmailSent: "May 10, 2024",
    lastReplied: "May 12, 2024",
  },
  atAGlance: {
    orcid: "0000-0002-1825-0097",
    scholarUrl: "https://scholar.google.com",
    researchGateUrl: "https://researchgate.net",
    linkedInUrl: "https://linkedin.com",
    twitterHandle: "@jonathansmith",
    labWebsite: "https://smithlab.mit.edu/",
  },
  openPositions: [
    {
      title: "2 PhD Positions",
      term: "Fall 2025",
    },
    {
      title: "1 Postdoctoral Position",
      term: "Available Now",
    },
    {
      title: "1 Research Assistant (RA)",
      term: "Summer 2025",
    },
  ],
  projects: [
    {
      title: "Self-Supervised Learning for 3D Perception",
      period: "2023 -2026",
      funder: "NSF",
      funderBadgeClass: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Human-AI Collaborative Perception",
      period: "2023 -2026",
      funder: "ONR",
      funderBadgeClass: "bg-blue-50 text-blue-700",
    },
    {
      title: "Efficient Vision Transformers",
      period: "2023 -2026",
      funder: "Google",
      funderBadgeClass: "bg-purple-50 text-purple-700",
    },
    {
      title: "Robust AI for Real-World Deployment",
      period: "2023 -2026",
      funder: "MIT Seed",
      funderBadgeClass: "bg-amber-50 text-amber-700",
    },
  ],
  totalProjects: 12,
  funding: [
    {
      grant: "NSF CAREER Award",
      year: "2020 - 2025",
      amount: "$500,000",
      role: "PI",
    },
    {
      grant: "ONR Young Investigator Program",
      year: "2022 - 2025",
      amount: "$600,000",
      role: "PI",
    },
    {
      grant: "Google Research Award",
      year: "2021 - 2026",
      amount: "$500,000",
      role: "PI",
    },
    {
      grant: "MIT Seed Fund",
      year: "2024 - 2025",
      amount: "$150,000",
      role: "PI",
    },
  ],
  totalGrants: 8,
  teaching: [
    "6.036 Introduction to Machine Learning (Fall 2024)",
    "6.869 Computer Vision (Spring 2024)",
    "6.867 Human-AI Interaction (Fall 2023)",
    "Supervised Graduate Research (Ongoing)",
  ],
};

export const PROFILES_REGISTRY: Record<string, ProfessorProfileData> = {
  "jonathan-smith": JONATHAN_SMITH_PROFILE,
};

export function getProfessorProfile(id?: string): ProfessorProfileData {
  if (id && PROFILES_REGISTRY[id]) {
    return PROFILES_REGISTRY[id];
  }
  return JONATHAN_SMITH_PROFILE;
}
