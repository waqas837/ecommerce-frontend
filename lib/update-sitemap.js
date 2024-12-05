"use server";
import fs from "fs";
import path from "path";
import { frontendUrl } from "./apiUrl";
 
const sitemapDirectory = path.join(process.cwd(), "public", "sitemaps");
const sitemapIndexFilePath = path.join(
  process.cwd(),
  "public",
  "sitemaps/sitemap-index.xml",
);

function getSitemapFileName(index) {
  return `sitemap-${index}.xml`;
}

function createNewSitemapFile(index) {
  const newSitemapPath = path.join(sitemapDirectory, getSitemapFileName(index));
  const initialContent = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    </urlset>`;
  fs.writeFileSync(newSitemapPath, initialContent, "utf8");
  return newSitemapPath;
}

function updateSitemapIndex(sitemapIndex) {
  const sitemapFileName = getSitemapFileName(sitemapIndex);
  const existingIndex = fs.existsSync(sitemapIndexFilePath)
    ? fs.readFileSync(sitemapIndexFilePath, "utf8")
    : `<?xml version="1.0" encoding="UTF-8"?>
      <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      </sitemapindex>`;

  const sitemapEntryRegex = new RegExp(
    `<sitemap>\\s*<loc>${frontendUrl}\\.com/sitemaps/${sitemapFileName}</loc>[\\s\\S]*?</sitemap>`,
    "i",
  );

  const newSitemapEntry = `
    <sitemap>
      <loc>${frontendUrl}/sitemaps/${sitemapFileName}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </sitemap>
  `;

  let updatedIndex;
  if (sitemapEntryRegex.test(existingIndex)) {
    // Update existing entry
    updatedIndex = existingIndex.replace(sitemapEntryRegex, newSitemapEntry);
  } else {
    // Add new entry
    updatedIndex = existingIndex.replace(
      "</sitemapindex>",
      `${newSitemapEntry}</sitemapindex>`,
    );
  }

  fs.writeFileSync(sitemapIndexFilePath, updatedIndex, "utf8");
}

export async function appendPostToSitemap(post) {
  if (!fs.existsSync(sitemapDirectory)) {
    fs.mkdirSync(sitemapDirectory, { recursive: true });
  }

  let sitemapIndex = 0;
  let currentSitemapFilePath;

  // Find the latest sitemap file
  do {
    sitemapIndex++;
    currentSitemapFilePath = path.join(
      sitemapDirectory,
      getSitemapFileName(sitemapIndex),
    );
  } while (fs.existsSync(currentSitemapFilePath));

  sitemapIndex--; // Go back to the last existing file

  if (sitemapIndex === 0) {
    // If no sitemap exists, create the first one
    sitemapIndex = 1;
    currentSitemapFilePath = createNewSitemapFile(sitemapIndex);
    updateSitemapIndex(sitemapIndex);
  } else {
    currentSitemapFilePath = path.join(
      sitemapDirectory,
      getSitemapFileName(sitemapIndex),
    );
  }

  let currentSitemap = fs.readFileSync(currentSitemapFilePath, "utf8");
  // Check if current sitemap exceeds 2 <url> tags
  const urlCount = (currentSitemap.match(/<url>/g) || []).length;
  if (urlCount >= 50000) {
    sitemapIndex++;
    currentSitemapFilePath = createNewSitemapFile(sitemapIndex);
    updateSitemapIndex(sitemapIndex);
    currentSitemap = fs.readFileSync(currentSitemapFilePath, "utf8");
  }

  const sitemapEntry = `
    <url>
      <loc>${frontendUrl}/blog/${post.slug}</loc>
      <lastmod>${new Date(post.date_created_in).toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.7</priority>
    </url>
  `;

  // Insert the new post before the closing tag
  currentSitemap = currentSitemap.replace(
    "</urlset>",
    `${sitemapEntry}</urlset>`,
  );

  // Write the updated sitemap back to the file
  fs.writeFileSync(currentSitemapFilePath, currentSitemap, "utf8");
}
