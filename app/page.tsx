"use client"

import * as React from "react"
import { Navbar } from "@/components/portfolio/navbar"
import { HeroSection } from "@/components/portfolio/hero-section"
import { AboutSection } from "@/components/portfolio/about-section"
import { SkillsSection } from "@/components/portfolio/skills-section"
import { ProjectsSection } from "@/components/portfolio/projects-section"
import { ExperienceSection } from "@/components/portfolio/experience-section"
import { ContactSection } from "@/components/portfolio/contact-section"
import { Footer } from "@/components/portfolio/footer"
import { MainPageLoader } from "@/components/portfolio/main-page-loader"
import { Toaster } from "@/components/ui/toaster"
import { apiFetch } from "@/lib/api"

export default function HomePage() {
  const [isProcessing, setIsProcessing] = React.useState(true)

  React.useEffect(() => {
    let active = true
    Promise.allSettled([
      apiFetch("/profile"),
      apiFetch("/skills"),
      apiFetch("/projects"),
      apiFetch("/experience"),
    ]).finally(() => {
      if (active) {
        setIsProcessing(false)
      }
    })

    return () => {
      active = false
    }
  }, [])

  if (isProcessing) {
    return <MainPageLoader />
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <ContactSection />
      <Footer />
      <Toaster />
    </main>
  )
}
