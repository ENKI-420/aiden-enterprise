import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://agiledefensesystems.us"
  const now = new Date().toISOString()

  const routes = [
    { path: "/", frequency: "weekly", priority: 1 },
    { path: "/features", frequency: "monthly", priority: 0.8 },
    { path: "/contact", frequency: "monthly", priority: 0.8 },
    { path: "/about", frequency: "monthly", priority: 0.7 },
  ]

  return routes.map(({ path, frequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: frequency,
    priority,
  }))
}
