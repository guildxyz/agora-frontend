import { GetServerSideProps } from "next"
import type { Community } from "temporaryData/communities"
import tokens from "temporaryData/tokens"

const Sitemap = () => null

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = {
    development: "http://localhost:3000",
    production: "https://app.agora.space",
  }[process.env.NODE_ENV]

  const communityPages = await fetch(
    `${process.env.NEXT_PUBLIC_API}/community`
  ).then((response: Response) => (response.ok ? response.json() : []))

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${communityPages
        .map(
          (community: Community) => `
        <url>
          <loc>${baseUrl}/${community.urlName}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>1.0</priority>
        </url>
      `
        )
        .join("")}
        ${tokens
          .map(
            (token: Community) => `
          <url>
            <loc>${baseUrl}/${token.urlName}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.5</priority>
          </url>
        `
          )
          .join("")}
    </urlset>
  `

  res.setHeader("Content-Type", "text/xml")
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default Sitemap
