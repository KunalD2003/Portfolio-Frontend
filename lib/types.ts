export interface Profile {
  name: string
  title: string
  email: string
  phone: string
  location: string
  bio: string
  aboutHeading?: string
  aboutParagraph1?: string
  aboutParagraph2?: string
  highlights?: {
    yearsExperience?: string
    projectsCompleted?: string
    happyClients?: string
  }
  social: {
    github: string
    linkedin: string
    twitter: string
  }
  avatarUrl?: string
}

export interface Project {
  id: number
  title: string
  description: string
  image: string
  tech: string[]
  liveUrl: string
  githubUrl: string
}

export interface Skill {
  id: number
  name: string
  category: string
  level: number
}

export interface Experience {
  id: number
  company: string
  role: string
  duration: string
  description: string
  technologies: string[]
}

export interface Message {
  id: number
  name: string
  email: string
  subject: string
  message: string
  date: string
  unread: boolean
  archived: boolean
}

export interface NotificationSettings {
  emailNotifications: boolean
  newMessages: boolean
  weeklyReport: boolean
}
