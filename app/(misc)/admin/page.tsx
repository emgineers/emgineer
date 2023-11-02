import { getParsedEventPages } from "app/get";
import { Title } from "components/text";
import { inArray } from "drizzle-orm";
import { db } from "lib/db";
import { eventSignUps } from "lib/db/schema";
import { FC } from "react";
import { getServerAuthSession } from "server/auth";
import siteConfig from "site.config";
import RevalidateButton, {
  RevalidateDialog,
} from "./_components/revalidate-button";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { RedeployDialog } from "./_components/redeploy-button";

type EventSignUp = typeof eventSignUps.$inferSelect;

interface AdminPageProps {}

const AdminPage: FC<AdminPageProps> = async ({}) => {
  const session = await useAdminOnly();
  const events = await getParsedEventPages(false);
  const eventIds = events.map((event) => event.parsed.eventId);
  const eventNames = events.map((event) => event.parsed.title);

  const signUps = await db
    .select()
    .from(eventSignUps)
    .where(inArray(eventSignUps.eventId, eventIds))
    .all();

  return (
    <main className="flex flex-col items-center justify-center px-12 pt-2">
      <div className="flex flex-col my-6 gap-6 w-[80vw]">
        <Title size="sm">Event Sign Ups</Title>
        <DataTable
          data={fixSignUps(signUps)}
          columns={columns}
          events={eventNames}
        />
      </div>
      <div className="flex flex-col my-6">
        <Title size="sm">Updated Website</Title>
        <div className="flex flex-row gap-6 mt-4">
          <RevalidateDialog />
          <RedeployDialog />
        </div>
      </div>
    </main>
  );
};

const useAdminOnly = async () => {
  const session = await getServerAuthSession();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const crsid = session.user.email.split("@")[0];

  if (!siteConfig.admins.includes(crsid)) {
    throw new Error("Unauthorized");
  }
  return session;
};

export default AdminPage;

type FixedEventSignUp = Omit<EventSignUp, "createdAt" | "updatedAt"> & {
  createdAt: Date;
  updatedAt: Date;
};

const fixSignUps = (signUps: EventSignUp[]): FixedEventSignUp[] => {
  return signUps.map((signUp) => {
    return {
      ...signUp,
      createdAt: signUp.createdAt ? new Date(signUp.createdAt) : new Date(),
      updatedAt: signUp.updatedAt ? new Date(signUp.updatedAt) : new Date(),
    };
  });
};
