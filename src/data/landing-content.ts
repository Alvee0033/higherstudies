export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: "GraduationCap" | "Search" | "Mail" | "FileText" | "Star";
  accentBg: string;
  accentColor: string;
  imageSrc: string;
  tag: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  subtitle: string;
  priceBDT: number;
  isPopular: boolean;
  ctaText: string;
  ctaVariant: "outline" | "primary";
  features: string[];
}

export interface WhyChooseItem {
  id: string;
  text: string;
  iconName: "Sparkles" | "Database" | "Bell" | "Users" | "Award";
}

export interface TestimonialItem {
  id: string;
  name: string;
  university: string;
  quote: string;
  rating: number;
  avatarSrc: string;
}

export interface MissionStat {
  value: string;
  label: string;
  iconName: "GraduationCap" | "Building2" | "Globe" | "Star";
}

export const HERO_CONTENT = {
  badge: "Your Journey, Our Guidance, Your Future.",
  titleStart: "Find the Right\nUniversity. Connect\nwith the ",
  titleHighlight: "Right\nProfessor.",
  subtitle: "Smart recommendations, powerful tracking and AI tools to help you get admitted.",
  primaryCta: "Get Started Free",
  secondaryCta: "Explore Packages",
  socialProofCount: "10K+",
  socialProofText: "Students have trusted HigherStudy",
};

export const SERVICES_SECTION = {
  badge: "OUR SERVICES",
  title: "Everything You Need for Study Abroad Success",
  subtitle: "From university shortlisting to visa support, we're with you at every step.",
  services: [
    {
      id: "shortlisting",
      title: "University Shortlisting",
      description: "Get personalized university recommendations based on your profile and preferences.",
      iconName: "GraduationCap",
      accentBg: "bg-indigo-50",
      accentColor: "text-indigo-600",
      imageSrc: "/images/services/shortlist.jpg",
      tag: "Top Universities",
    },
    {
      id: "professors",
      title: "Professor Research",
      description: "Access up-to-date professor database and find the best research match.",
      iconName: "Search",
      accentBg: "bg-sky-50",
      accentColor: "text-sky-600",
      imageSrc: "/images/services/professor.jpg",
      tag: "Faculty Database",
    },
    {
      id: "email-tracker",
      title: "Email & Follow-up Tracker",
      description: "Track emails, follow-ups, and responses in one place. Never miss a reply.",
      iconName: "Mail",
      accentBg: "bg-purple-50",
      accentColor: "text-purple-600",
      imageSrc: "/images/services/email.jpg",
      tag: "Cold Outreach",
    },
    {
      id: "application-tracker",
      title: "Application Tracker",
      description: "Track your applications, deadlines, documents, and statuses in real-time.",
      iconName: "FileText",
      accentBg: "bg-amber-50",
      accentColor: "text-amber-600",
      imageSrc: "/images/services/application.jpg",
      tag: "Live Pipeline",
    },
    {
      id: "visa-support",
      title: "Visa & Pre-Departure",
      description: "Get guidance on visa process, accommodation, travel and pre-departure essentials.",
      iconName: "Star",
      accentBg: "bg-violet-50",
      accentColor: "text-violet-600",
      imageSrc: "/images/services/visa.jpg",
      tag: "Pre-Departure",
    },
  ] as ServiceItem[],
};

export const PACKAGES_SECTION = {
  badge: "PACKAGES",
  title: "Choose the Perfect Plan for Your Journey",
  subtitle: "Student friendly pricing that offers the most value for you.",
  plans: [
    {
      id: "free",
      name: "Free",
      subtitle: "Get started with basic tools.",
      priceBDT: 0,
      isPopular: false,
      ctaText: "Current Plan",
      ctaVariant: "outline",
      features: [
        "Track up to 3 applications",
        "Access to 500+ universities",
        "Basic email tracking",
        "AI Tools (Limited)",
        "Community support",
      ],
    },
    {
      id: "starter",
      name: "Starter",
      subtitle: "For serious applicants.",
      priceBDT: 2000,
      isPopular: true,
      ctaText: "Purchase Now",
      ctaVariant: "primary",
      features: [
        "Track up to 20 applications",
        "Advanced email tracker",
        "AI Tools (Standard)",
        "Document templates",
        "Application deadline alerts",
        "Priority support",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      subtitle: "For advanced planning.",
      priceBDT: 5000,
      isPopular: false,
      ctaText: "Purchase Now",
      ctaVariant: "primary",
      features: [
        "Unlimited applications",
        "Professor & university insights",
        "AI Tools (Advanced)",
        "Personalized recommendations",
        "Visa tracking",
        "Custom reminders",
        "Priority support",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      subtitle: "For complete success.",
      priceBDT: 10000,
      isPopular: false,
      ctaText: "Purchase Now",
      ctaVariant: "primary",
      features: [
        "1-on-1 expert consultation",
        "SOP & LOR review (2x/month)",
        "Interview preparation",
        "Application review",
        "Dedicated success manager",
        "24/7 premium support",
      ],
    },
  ] as PricingPlan[],
};

export const WHY_CHOOSE_SECTION = {
  badge: "WHY CHOOSE US",
  title: "Why Thousands of Students Trust HigherStudy",
  items: [
    { id: "1", text: "AI-powered personalized guidance", iconName: "Sparkles" },
    { id: "2", text: "Comprehensive professor database", iconName: "Database" },
    { id: "3", text: "Smart tracking and real-time alerts", iconName: "Bell" },
    { id: "4", text: "Expert support every step of the way", iconName: "Users" },
    { id: "5", text: "Built for passionate students", iconName: "Award" },
  ] as WhyChooseItem[],
};

export const TESTIMONIALS_SECTION = {
  badge: "WHAT STUDENTS SAY",
  title: "Success Stories from Around the World",
  reviews: [
    {
      id: "arshi",
      name: "Arshi H.",
      university: "University of Munich",
      quote: "HigherStudy helped me find the perfect professor and got admission to my dream university. So convenient!",
      rating: 5,
      avatarSrc: "/images/avatar-arshi.png",
    },
    {
      id: "nusrat",
      name: "Nusrat J.",
      university: "Leeds University",
      quote: "The email tracker and templates saved me so much time. I got my replies rather weekly!",
      rating: 5,
      avatarSrc: "/images/avatar-nusrat.png",
    },
    {
      id: "tanvir",
      name: "Tanvir R.",
      university: "University of Toronto",
      quote: "The SOP review and guidance were top-notch. Highly recommended for any student!",
      rating: 5,
      avatarSrc: "/images/avatar-tanvir.png",
    },
  ] as TestimonialItem[],
};

export const MISSION_SECTION = {
  badge: "ABOUT US",
  title: "We're on a Mission to Make Study Abroad Simple",
  description: "HigherStudy is a smart platform helping students find the right universities, connect with professors, and manage applications with ease.",
  ctaText: "Learn More",
  stats: [
    { value: "10K+", label: "Students", iconName: "GraduationCap" },
    { value: "500+", label: "Universities", iconName: "Building2" },
    { value: "30+", label: "Countries", iconName: "Globe" },
    { value: "5 ★", label: "Rated by Students", iconName: "Star" },
  ] as MissionStat[],
  ctaBanner: {
    badge: "READY TO START?",
    title: "Start Your Journey Today",
    description: "Join thousands of successful students and take the first step towards your global education.",
    primaryCta: "Get Started Free",
    secondaryCta: "View Packages",
  },
};

export const FOOTER_CONTENT = {
  tagline: "Your intelligent companion for success.",
  quickLinks: [
    { label: "Home", href: "#" },
    { label: "Services", href: "#services" },
    { label: "Packages", href: "#packages" },
    { label: "About Us", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
  resources: [
    { label: "Blog", href: "#" },
    { label: "FAQ", href: "#" },
    { label: "Guides", href: "#" },
    { label: "Universities List", href: "/universities" },
    { label: "Professor Database", href: "/professors" },
  ],
  support: [
    { label: "Help Center", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Refund Policy", href: "#" },
  ],
  newsletterText: "Get the latest updates and study abroad guides.",
  copyright: "© 2026 HigherStudy. All rights reserved.",
};
