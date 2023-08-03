import Link from "next/link";
import Image from "next/image";
import _mediaMap from "public/notion-media/media-map.json";
import { mediaMapInterface } from "notion-on-next/types/types";
import siteConfig from "site.config";
import { ParsedEventsPageObjectResponse } from "app/get";
import { Badge } from "components/ui/badge";
import UserDetails from "components/auth/user-details";
const mediaMap = _mediaMap as mediaMapInterface;

export const EventCard = ({
  page,
}: {
  page: ParsedEventsPageObjectResponse;
}) => {
  const image = mediaMap[siteConfig.eventsDatabaseId]?.[page.id]?.cover;

  return (
    <article
      className={`max-w-md mx-auto md:max-w-none grid gap-6 md:gap-8 ${
        image ? "md:grid-cols-2" : ""
      }`}
    >
      {image && (
        <Link className="relative block group" href={`/blog/${page.slug}`}>
          <Image
            alt={page.title || "Cover Image for " + page.id}
            src={image}
            className="max-h-[300px] w-full rounded-md  object-cover object-center"
            width={300}
            height={300}
          />
        </Link>
      )}
      <div>
        <header>
          <h2 className="text-xl sm:text-2xl font-bold leading-snug mb-2 font-heading">
            <Link
              className="text-emma-text hover:text-emma-text-secondary underline underline-offset-4 decoration-1 transition ease-in duration-200"
              href={`/events/${page.slug}`}
            >
              {page.title}
            </Link>
          </h2>
        </header>
        <p className="text-md sm:text-lg flex-grow">
          {/* @ts-ignore -- Notion Team currently has incorrect type for RichTextObjectResponse. The API returns an an array of RichTextObjectResponse inside of RichTextPropertyItemObjectResponse, but the type definition is not aware of that yet  */}
          {page.properties?.Description?.rich_text[0]?.plain_text}
        </p>
        <footer className="mt-4">
          <div className="flex flex-col">
            <span className="text-gray-500 dark:text-slate-400">
              {formatDate(page.parsed.date)} @ {page.parsed.location}
            </span>
            <span className="text-gray-500 dark:text-slate-400">
              Duration ~ {page.parsed.duration} hrs
              <UserDetails />
            </span>
            {page.parsed.requiresPayment && (
              <div>
                <Badge variant="destructive" className="mt-2">
                  Requires Payment
                </Badge>
              </div>
            )}
          </div>
        </footer>
      </div>
    </article>
  );
};

export const formatDate = (date: Date) => {
  const days = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // time: HH:MM AM/PM
  const time = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return `${time}, ${days}`;
};
