export type Link = { label: string; href: string }

export type ImageSlot = {
  /** Built-in file under /public. Absent while the image is still a placeholder. */
  src?: string
  width?: number
  height?: number
  alt: string
  /** CSS object-position for the crop inside the frame, for example '53% 50%'. */
  position?: string
  /** Shown in place of the image until it is supplied. */
  placeholder?: string
}

export type Meta = { title: string; description: string }

export type TeamMember = {
  slug: string
  name: string
  role: string
  bio: string
  quote?: string
  button?: Link
  clinician: boolean
  photo: ImageSlot
}
