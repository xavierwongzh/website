export interface Project {
  id: string;
  featured?: boolean;
  mark?: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  githubLink?: string;
  demoLink?: string;
  detailedDescription?: string;
  features?: string[];
  challenges?: string[];
  outcomes?: string[];
  duration?: string;
  role?: string;
}

export interface Education {
  id: string;
  year: string;
  title: string;
  institution: string;
  description?: string;
  specializations?: string[];
  minors?: string[];
  activities?: string[];
  awards?: string[];
  projects?: string[];
  exchange?: string;
}

export interface WorkExperience {
  id: string;
  year: string;
  title: string;
  company: string;
  location?: string;
  description?: string;
  responsibilities?: string[];
  achievements?: string[];
  technologies?: string[];
}

export interface Interest {
  id: string;
  name: string;
}

