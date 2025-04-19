// @/lib/generateSlug.ts

export function generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // remove special chars
      .replace(/\s+/g, "-")         // replace spaces with dashes
      .replace(/-+/g, "-");         // remove multiple dashes
  }
  