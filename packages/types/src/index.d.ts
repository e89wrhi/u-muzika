export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type MainNavItem = NavItem;

// for hero nav bar options
export type HeroConfig = {
  mainNav: MainNavItem[];
};

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    telegram: string;
    tiktok: string;
    instagram: string;
    facebook: string;
    youtube: string;
    noteline: string;
  };
};

// for about page features
export type AboutFeatureItem = {
  id: number;
  rightdirection: boolean;
  title: string;
  description: string;
  link: string;
  button: string;
  image: string;
};
export type AboutFeatureConfig = {
  items: AboutFeatureItem[];
};

// for contact us main link
export type ContactusFeatureItem = {
  id: number;
  icon?: React.ElementType;
  title: string;
  description: string;
  button: string;
  link: string;
};
export type ContactusFeatureConfig = {
  items: ContactusFeatureItem[];
};

// for contact us socials
export type ContactusSocialItem = {
  id: number;
  title: string;
  description: string;
  button: string;
  link: string;
  icon?: React.ElementType;
};
export type ContactusSocialConfig = {
  items: ContactusSocialItem[];
};

// for contact us contacts
export type ContactusContactItem = {
  id: number;
  title: string;
  action: string; // copy email, phone,....
  button: string;
  link: string;
  icon?: React.ElementType;
};
export type ContactusContactConfig = {
  items: ContactusContactItem[];
};

// for download page download app options
export type DownloadAppItem = {
  id: number;
  icon?: React.ElementType;
  illustration: string;
  slogan: string;
  name: string;
  avaliableios: boolean;
  ioslink: string;
  avaliableandroid: boolean;
  androidlink: string;
  avaliablewindows: boolean;
  windowslink: string;
};
export type DownloadAppConfig = {
  items: DownloadAppItem[];
};

// hero page main features
export type HeroFeatureItem = {
  id: number;
  rightdirection: boolean;
  name: string;
  icon?: React.ElementType;
  title: string;
  description: string;
  button: string;
  link: string;
  illustration: string;
  more: FeatureRelatedLinkItem[];
};
export type HeroFeatureConfig = {
  items: HeroFeatureItem[];
};

export type FeatureRelatedLinkItem = {
  link: string;
  text: string;
  button: string;
};
// blogs feature items
export type BlogFeatureItem = {
  id: number;
  rightdirection: boolean;
  icon?: React.ElementType;
  name: string;
  title: string;
  description: string;
  button: string;
  link: string;
  illustration: string;
  more: FeatureRelatedLinkItem[];
};
export type BlogFeatureConfig = {
  items: BlogFeatureItem[];
};

// doc feature items
export type DocFeatureItem = {
  id: number;
  rightdirection: boolean;
  icon?: React.ElementType;
  name: string;
  title: string;
  description: string;
  button: string;
  link: string;
  illustration: string;
  more: FeatureRelatedLinkItem[];
};
export type DocFeatureConfig = {
  items: DocFeatureItem[];
};

// faq feature items
export type FaqFeatureItem = {
  id: number;
  rightdirection: boolean;
  icon?: React.ElementType;
  name: string;
  title: string;
  description: string;
  button: string;
  link: string;
  illustration: string;
  more: FeatureRelatedLinkItem[];
};
export type FaqFeatureConfig = {
  items: FaqFeatureItem[];
};

// form feature items
export type FormFeatureItem = {
  id: number;
  rightdirection: boolean;
  icon?: React.ElementType;
  name: string;
  title: string;
  description: string;
  button: string;
  link: string;
  illustration: string;
  more: FeatureRelatedLinkItem[];
};
export type FormFeatureConfig = {
  items: FormFeatureItem[];
};

// policy features items
export type PolicyFeatureItem = {
  id: number;
  rightdirection: boolean;
  icon?: React.ElementType;
  name: string;
  title: string;
  description: string;
  button: string;
  link: string;
  illustration: string;
  more: FeatureRelatedLinkItem[];
};
export type PolicyFeatureConfig = {
  items: PolicyFeatureItem[];
};

// profile features items
export type ProfileFeatureItem = {
  id: number;
  rightdirection: boolean;
  icon?: React.ElementType;
  name: string;
  title: string;
  description: string;
  button: string;
  link: string;
  illustration: string;
  more: FeatureRelatedLinkItem[];
};
export type ProfileFeatureConfig = {
  items: ProfileFeatureItem[];
};
