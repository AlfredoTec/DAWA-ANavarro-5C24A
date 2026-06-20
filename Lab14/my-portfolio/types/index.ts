export interface TechIcon {
  name: string;
  icon: string;
  invert?: boolean;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  techIcons: TechIcon[];
  browserUrl: string;
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

export interface Skill {
  name: string;
  icon: string;
  level: 'Mid' | 'Junior' | 'Learning';
  years: string;
  pct: number;
  invert?: boolean;
}

export interface Metadata {
  title: string;
  description: string;
  keywords?: string[];
  author?: string;
  ogImage?: string;
}
