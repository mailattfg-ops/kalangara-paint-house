export interface Project {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  category?: string;
  client?: string;
  location?: string;
  year?: string;
  images?: string[];
  thumbnail_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Service {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  icon: any; // Lucide icon type
}

export interface Review {
  id: string;
  author: string;
  content: string;
  rating: number;
  date: string;
  avatar_url?: string;
}
