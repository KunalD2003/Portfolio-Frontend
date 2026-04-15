"use client"

import * as React from "react"
import Image from "next/image"
import { MoreHorizontal, Pencil, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ProjectFormDialog } from "@/components/admin/project-form-dialog"
import { useToast } from "@/hooks/use-toast"
import { apiFetch } from "@/lib/api"
import type { Project } from "@/lib/types"

export default function ProjectsPage() {
  const { toast } = useToast()
  const [projects, setProjects] = React.useState<Project[]>([])

  const loadProjects = React.useCallback(async () => {
    const response = await apiFetch<{ data: Project[] }>("/admin/projects")
    setProjects(response.data)
  }, [])

  React.useEffect(() => {
    loadProjects().catch(() => {
      toast({
        title: "Failed to load projects",
        description: "Please refresh the page.",
        variant: "destructive",
      })
    })
  }, [loadProjects, toast])

  const handleDelete = async (id: number) => {
    await apiFetch<{ success: boolean }>(`/admin/projects/${id}`, {
      method: "DELETE",
    })
    setProjects(projects.filter((p) => p.id !== id))
    toast({
      title: "Project deleted",
      description: "The project has been removed from your portfolio.",
    })
  }

  const handleSave = async (project: Project) => {
    if (project.id) {
      const response = await apiFetch<{ data: Project }>(
        `/admin/projects/${project.id}`,
        {
          method: "PATCH",
          body: {
            title: project.title,
            description: project.description,
            image: project.image,
            tech: project.tech,
            liveUrl: project.liveUrl,
            githubUrl: project.githubUrl,
          },
        }
      )
      setProjects(
        projects.map((item) => (item.id === project.id ? response.data : item))
      )
      toast({
        title: "Project updated",
        description: "Project changes saved successfully.",
      })
      return
    }

    const response = await apiFetch<{ data: Project }>("/admin/projects", {
      method: "POST",
      body: project,
    })
    setProjects([...projects, response.data])
    toast({
      title: "Project added",
      description: "The new project has been added to your portfolio.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your portfolio projects
          </p>
        </div>
        <ProjectFormDialog onSave={handleSave} />
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Tech Stack</TableHead>
                <TableHead className="hidden lg:table-cell">Links</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className="relative w-16 h-10 rounded overflow-hidden bg-secondary">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">
                        {project.title}
                      </p>
                      <p className="text-sm text-muted-foreground truncate max-w-[380px]">
                        {project.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {project.tech.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.tech.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.tech.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <Button asChild variant="ghost" size="sm">
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <ProjectFormDialog
                          project={project}
                          onSave={handleSave}
                          trigger={
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          }
                        />
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(project.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
