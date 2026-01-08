export type Language = 'en' | 'ar';

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  link?: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  imageUrl: string;
  link?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string[];
  tags: string[]; // Added tags for filtering
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
}

export interface ProfileData {
  name: string;
  title: string;
  bio: string;
  location: string;
  avatarUrl: string;
  skills: {
    category: string;
    items: string[];
  }[];
  experience: Experience[];
  projects: Project[];
  certificates: Certificate[];
  blog: BlogPost[];
}

export interface GlobalData {
  email: string;
  cvUrl: string;
  socials: {
    linkedin: string;
    github: string;
    twitter: string;
    telegram?: string;
    whatsapp?: string;
  };
  content: Record<Language, ProfileData>;
}