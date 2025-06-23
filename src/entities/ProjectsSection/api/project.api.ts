import { api } from 'src/boot/axios'
import type { Project, ProjectForm } from '../model/project.model'

export const projectApi = {
  getProjects: () => {
    return api.get<Project[]>('/projects')
  },

  createProject: (data: ProjectForm) => {
    return api.post<Project>('/projects', data)
  },

  updateProject: (id: number, data: ProjectForm) => {
    return api.put<Project>(`/projects/${id}`, data)
  },

  deleteProject: (id: number) => {
    return api.delete(`/projects/${id}`)
  }
} 