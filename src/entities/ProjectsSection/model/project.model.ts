export interface Project {
  id: number
  title: string
  description: string
  image: string
  order: number
  created_at: string
  updated_at: string
}

export interface ProjectForm {
  title: string
  description: string
  image: string
  order: number
} 