"use client"

import * as React from "react"
import { Plus, MoreHorizontal, Pencil, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { apiFetch } from "@/lib/api"
import type { Experience } from "@/lib/types"

export default function ExperiencePage() {
  const { toast } = useToast()
  const [experiences, setExperiences] = React.useState<Experience[]>([])
  const loadExperiences = React.useCallback(async () => {
    const response = await apiFetch<{ data: Experience[] }>("/admin/experience")
    setExperiences(response.data)
  }, [])

  React.useEffect(() => {
    loadExperiences().catch(() => {
      toast({
        title: "Failed to load experience",
        description: "Please refresh the page.",
        variant: "destructive",
      })
    })
  }, [loadExperiences, toast])

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<number | null>(null)
  const [techInput, setTechInput] = React.useState("")
  const [formData, setFormData] = React.useState({
    company: "",
    role: "",
    duration: "",
    description: "",
    technologies: [] as string[],
  })

  const handleAddTech = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()],
      })
      setTechInput("")
    }
  }

  const handleRemoveTech = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((t) => t !== tech),
    })
  }

  const resetForm = () => {
    setFormData({
      company: "",
      role: "",
      duration: "",
      description: "",
      technologies: [],
    })
    setTechInput("")
    setEditingId(null)
  }

  const handleSaveExperience = () => {
    if (!formData.company.trim() || !formData.role.trim()) return
    if (editingId !== null) {
      apiFetch<{ data: Experience }>(`/admin/experience/${editingId}`, {
        method: "PATCH",
        body: formData,
      })
        .then((response) => {
          setExperiences(
            experiences.map((item) =>
              item.id === editingId ? response.data : item
            )
          )
          setDialogOpen(false)
          resetForm()
          toast({
            title: "Experience updated",
            description: "The experience entry has been updated.",
          })
        })
        .catch((err) => {
          toast({
            title: "Failed to update experience",
            description: err instanceof Error ? err.message : "Please try again.",
            variant: "destructive",
          })
        })
      return
    }

    apiFetch<{ data: Experience }>("/admin/experience", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        setExperiences([response.data, ...experiences])
        setDialogOpen(false)
        resetForm()
        toast({
          title: "Experience added",
          description: "Your work experience has been added.",
        })
      })
      .catch((err) => {
        toast({
          title: "Failed to add experience",
          description: err instanceof Error ? err.message : "Please try again.",
          variant: "destructive",
        })
      })
  }

  const handleEdit = (experience: Experience) => {
    setEditingId(experience.id)
    setFormData({
      company: experience.company,
      role: experience.role,
      duration: experience.duration,
      description: experience.description,
      technologies: [...experience.technologies],
    })
    setTechInput("")
    setDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    apiFetch<{ success: boolean }>(`/admin/experience/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setExperiences(experiences.filter((e) => e.id !== id))
        toast({
          title: "Experience deleted",
          description: "The experience entry has been removed.",
        })
      })
      .catch((err) => {
        toast({
          title: "Failed to delete experience",
          description: err instanceof Error ? err.message : "Please try again.",
          variant: "destructive",
        })
      })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Experience</h1>
          <p className="text-muted-foreground mt-1">
            Manage your work history
          </p>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm()
                setDialogOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId !== null ? "Edit Work Experience" : "Add Work Experience"}
              </DialogTitle>
              <DialogDescription>
                {editingId !== null
                  ? "Update this position in your work history."
                  : "Add a new position to your work history."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company</label>
                  <Input
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    placeholder="Company name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Input
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    placeholder="Job title"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration</label>
                <Input
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  placeholder="e.g., 2020 - Present"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your responsibilities and achievements"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Technologies</label>
                <div className="flex gap-2">
                  <Input
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="Add technology"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTech()
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTech} variant="secondary">
                    Add
                  </Button>
                </div>
                {formData.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => handleRemoveTech(tech)}
                      >
                        {tech}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDialogOpen(false)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveExperience}>
                {editingId !== null ? "Save Changes" : "Add Experience"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <Card key={exp.id} className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{exp.role}</CardTitle>
                  <p className="text-muted-foreground">{exp.company}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{exp.duration}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(exp)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(exp.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {exp.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {exp.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
