"use client"

import * as React from "react"
import Image from "next/image"
import { Plus, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { apiFetch } from "@/lib/api"

interface Project {
  id?: number
  title: string
  description: string
  image: string
  tech: string[]
  liveUrl: string
  githubUrl: string
}

interface ProjectFormDialogProps {
  project?: Project
  trigger?: React.ReactNode
  onSave?: (project: Project) => void
}

export function ProjectFormDialog({
  project,
  trigger,
  onSave,
}: ProjectFormDialogProps) {
  const { toast } = useToast()
  const emptyProject: Project = React.useMemo(
    () => ({
      title: "",
      description: "",
      image: "",
      tech: [],
      liveUrl: "",
      githubUrl: "",
    }),
    []
  )
  const [open, setOpen] = React.useState(false)
  const [techInput, setTechInput] = React.useState("")
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const [isUploadingImage, setIsUploadingImage] = React.useState(false)
  const [formData, setFormData] = React.useState<Project>(project || emptyProject)

  React.useEffect(() => {
    if (!open) return
    setFormData(project || emptyProject)
    setTechInput("")
  }, [open, project, emptyProject])

  const handleAddTech = () => {
    if (techInput.trim() && !formData.tech.includes(techInput.trim())) {
      setFormData({
        ...formData,
        tech: [...formData.tech, techInput.trim()],
      })
      setTechInput("")
    }
  }

  const handleRemoveTech = (tech: string) => {
    setFormData({
      ...formData,
      tech: formData.tech.filter((t) => t !== tech),
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave?.(formData)
    setOpen(false)
  }

  const handleProjectImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return
    setIsUploadingImage(true)
    const payload = new FormData()
    payload.append("image", file)
    try {
      const response = await apiFetch<{ success: boolean; data: { url: string } }>(
        "/admin/upload/project-image",
        {
          method: "POST",
          body: payload,
        }
      )
      setFormData((prev) => ({ ...prev, image: response.data.url }))
      toast({
        title: "Image uploaded",
        description: "Project image uploaded successfully.",
      })
    } catch (err) {
      toast({
        title: "Image upload failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploadingImage(false)
      event.target.value = ""
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Add New Project"}</DialogTitle>
          <DialogDescription>
            {project
              ? "Make changes to your project details."
              : "Add a new project to your portfolio."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Project title"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Project description"
                rows={3}
                required
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium">Project Image</label>
              <div className="relative w-full h-40 rounded-md overflow-hidden bg-secondary border border-border">
                <Image
                  src={formData.image || "/placeholder.svg?height=300&width=500"}
                  alt={formData.title || "Project image"}
                  fill
                  className="object-cover"
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploadingImage ? "Uploading..." : "Upload Image"}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProjectImageUpload}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tech Stack</label>
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
              {formData.tech.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tech.map((tech) => (
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="liveUrl" className="text-sm font-medium">
                  Live URL
                </label>
                <Input
                  id="liveUrl"
                  value={formData.liveUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, liveUrl: e.target.value })
                  }
                  placeholder="https://example.com"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="githubUrl" className="text-sm font-medium">
                  GitHub URL
                </label>
                <Input
                  id="githubUrl"
                  value={formData.githubUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, githubUrl: e.target.value })
                  }
                  placeholder="https://github.com/..."
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{project ? "Save Changes" : "Add Project"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
