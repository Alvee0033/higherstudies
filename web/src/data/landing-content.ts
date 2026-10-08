import rawLandingData from "@/data/json/landing/landing-content.json";

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

export const HERO_CONTENT = rawLandingData.hero;

export const SERVICES_SECTION = {
  badge: rawLandingData.services.badge,
  title: rawLandingData.services.title,
  subtitle: rawLandingData.services.subtitle,
  services: rawLandingData.services.items as ServiceItem[],
};

export const PACKAGES_SECTION = {
  badge: rawLandingData.packages.badge,
  title: rawLandingData.packages.title,
  subtitle: rawLandingData.packages.subtitle,
  plans: rawLandingData.packages.plans as PricingPlan[],
};

export const WHY_CHOOSE_SECTION = {
  badge: rawLandingData.whyChoose.badge,
  title: rawLandingData.whyChoose.title,
  items: rawLandingData.whyChoose.items as WhyChooseItem[],
};

export const TESTIMONIALS_SECTION = {
  badge: rawLandingData.testimonials.badge,
  title: rawLandingData.testimonials.title,
  reviews: rawLandingData.testimonials.reviews as TestimonialItem[],
};

export const MISSION_SECTION = {
  badge: rawLandingData.mission.badge,
  title: rawLandingData.mission.title,
  description: rawLandingData.mission.description,
  ctaText: rawLandingData.mission.ctaText,
  stats: rawLandingData.mission.stats as MissionStat[],
  ctaBanner: rawLandingData.mission.ctaBanner,
};

export const FOOTER_CONTENT = rawLandingData.footer;
