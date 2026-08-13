import type { MarketingIconName } from "@/components/marketing/MarketingIcon";

export type ResourceType =
  | "guides"
  | "documentation"
  | "videos"
  | "webinars"
  | "security-basics"
  | "whitepapers"
  | "platform-help";

export type ResourceFilterId = "all" | ResourceType;

export type AssetStatus = "available" | "coming-soon" | "draft" | "external";

export type Tone = "cyan" | "blue" | "violet" | "amber" | "green" | "rose";

export type ResourceFilter = {
  id: ResourceFilterId;
  label: string;
  icon: MarketingIconName;
};

export type ResourceItem = {
  id: string;
  type: ResourceType;
  title: string;
  description: string;
  meta: string;
  cta: string;
  icon: MarketingIconName;
  keywords: string[];
  href?: string;
  assetStatus?: AssetStatus;
  external?: boolean;
  featured?: boolean;
  thumbnailSrc?: string;
  imageAlt?: string;
  downloadUrl?: string;
  videoUrl?: string;
  posterSrc?: string;
  transcriptUrl?: string;
  webinarRegistrationUrl?: string;
};

export type HeroPreviewResource = {
  badge: string;
  title: string;
  description: string;
  meta?: string;
  cta: string;
  icon: MarketingIconName;
  href?: string;
  assetStatus?: AssetStatus;
  position: "guide" | "video" | "documentation" | "webinar";
};

export type DocumentationItem = {
  title: string;
  description: string;
  icon: MarketingIconName;
  href?: string;
  assetStatus?: AssetStatus;
};

export type MediaResource = {
  type: "Video" | "Webinar";
  title: string;
  description: string;
  duration: string;
  cta: string;
  icon: MarketingIconName;
  tone: Tone;
  thumbnailSrc?: string;
  videoUrl?: string;
  href?: string;
  assetStatus?: AssetStatus;
};

export type LearningPath = {
  title: string;
  description: string;
  resources: string[];
  icon: MarketingIconName;
  tone: Tone;
  href?: string;
};

export type PopularTopic = {
  title: string;
  description: string;
  icon: MarketingIconName;
  href: string;
  tone: Tone;
};

export type ValuePoint = {
  title: string;
  description: string;
  icon: MarketingIconName;
};
