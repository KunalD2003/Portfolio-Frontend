 "use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { apiFetch } from "@/lib/api"
import type { Experience } from "@/lib/types"

export function ExperienceSection() {
  const [experiences, setExperiences] = React.useState<Experience[]>([])

  React.useEffect(() => {
    let active = true
    apiFetch<{ data: Experience[] }>("/experience")
      .then((response) => {
        if (active) {
          const sortedByLatest = [...response.data].sort((a, b) => b.id - a.id)
          setExperiences(sortedByLatest)
        }
      })
      .catch(() => {
        if (active) setExperiences([])
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <section id="experience" className="py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-accent font-medium mb-2">My journey</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Work Experience
            </h2>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <div
                  key={exp.id}
                  className={`relative flex flex-col md:flex-row gap-8 ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-0 md:left-1/2 w-3 h-3 bg-accent rounded-full md:-translate-x-1.5 translate-y-2 ring-4 ring-background" />

                  {/* Content */}
                  <div className="flex-1 pl-8 md:pl-0">
                    <div
                      className={`bg-card border border-border rounded-xl p-6 hover:border-accent/50 transition-colors ${
                        index % 2 === 0 ? "md:mr-12" : "md:ml-12"
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-accent">
                          {exp.duration}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-1">
                        {exp.role}
                      </h3>
                      <p className="text-muted-foreground font-medium mb-3">
                        {exp.company}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {exp.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech) => (
                          <Badge
                            key={tech}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
