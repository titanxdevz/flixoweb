import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://flixo.fun";
  const now = new Date();

  const routes = [
    "",
    "/commands",
    "/filters",
    "/status",
    "/premium",
    "/roles",
    "/sources",
    "/terms",
    "/privacy",
    "/cookies",
    "/acceptable-use",
    "/refund",
    "/dmca",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/status" ? "daily" : "monthly",
    priority: route === "" ? 1.0 : route === "/commands" || route === "/filters" ? 0.9 : 0.7,
  }));
}
