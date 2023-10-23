import { Title } from "components/text";
import { Skeleton } from "components/ui/skeleton";
import { Suspense } from "react";
import { getParsedEventPages } from "../get";
import ClientEventSignUpStatus from "./_components/client-even-sign-up-status";
import { EventCard } from "./_components/event-card";
import { getMetaData } from "lib/meta";

export const runtime = "nodejs";
export const revalidate = 86400;

export const metadata = getMetaData({
  title: "Events",
  description: "Events hosted by the Emgineers",
});

export default async function EventIndex() {
  const pages = await getParsedEventPages();
  const upcomingPages = pages.filter((page) => page.parsed.date > new Date());
  const pastPages = pages.filter((page) => page.parsed.date < new Date());

  return (
    <div>
      <Title variant="h3" size="sm" className="mt-4">
        Upcoming Events
      </Title>
      <div className="space-y-10 max-w-[800px] mx-auto p-12">
        {upcomingPages.map((page) => (
          <EventCard page={page} key={page.id}>
            <Suspense
              fallback={<Skeleton className="w-full p-5 mt-4"></Skeleton>}
            >
              <ClientEventSignUpStatus {...page} />
            </Suspense>
          </EventCard>
        ))}
      </div>
      <Title variant="h3" size="sm">
        Past Events
      </Title>
      <div className="space-y-10 max-w-[800px] mx-auto p-12">
        {pastPages.map((page) => (
          <EventCard page={page} key={page.id} />
        ))}
      </div>
    </div>
  );
}
