export interface HeroInfo {
  avatar: string // url
  fullName: string
  birthDate: string // ISO
  city: string
  education: string
  specialization: string
  stack: string
  experienceStart: string // ISO
  bio: string
}

export interface ServerHeroInfo {
  avatar: string
  full_name: string
  birth_date: string
  city: string
  education: string
  specialization: string
  stack: string
  experience_start: string
  bio: string
  id?: number
  created_at?: string
  updated_at?: string
} 