import Image from "next/image";
import { notFound } from "next/navigation";
import { mediaMapInterface, NotionPageBody } from "notion-on-next";
import _mediaMap from "public/notion-media/media-map.json";
import React from "react";
import siteConfig from "site.config";
import { cachedGetBlocks, getBlogPages } from "../../get";
import { formatDate } from "../blog-post-card";

export const revalidate = 60;

const mediaMap = _mediaMap as mediaMapInterface;

interface PageProps {
  slug: string;
}
const databaseId = siteConfig.blogDatabaseId;

export default async function BlogPage({
  params,
}: {
  params: PageProps;
}): Promise<React.ReactNode> {
  const { slug } = params;
  const pages = await getBlogPages();
  const page = pages.find((page) => page.slug === slug);
  if (!page) {
    notFound();
  }
  const blocks = await cachedGetBlocks(page.id);
  const image = mediaMap[databaseId]?.[page.id]?.cover;

  return (
    <div className="p-8 md:p-12 max-w-[800px] mx-auto">
      <div className="">
        {image && (
          <Image
            src={image}
            alt={page.title || "Blog Post"}
            width={500}
            height={500}
            className="w-full h-[200px] md:h-[400px] rounded-md object-cover object-center"
          />
        )}

        <div className="mt-4">
          <div className="text-3xl font-extrabold text-emma-text hover:text-emma-text-secondary transition ease-in duration-200 mb-2">
            {page.title}
          </div>
          <div className="text-gray-400">
            {formatDate(page.properties.Date.date?.start) || "No Date"}
          </div>
        </div>
      </div>
      <NotionPageBody
        blocks={blocks}
        pageId={page.id}
        databaseId={databaseId}
        mediaMap={mediaMap}
      />
    </div>
  );
}

export async function generateStaticParams() {
  // This generates routes using the slugs created from getParsedPages
  const pages = await getBlogPages();
  return pages.map((page) => ({
    slug: page.slug,
  }));
}
