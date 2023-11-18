import { CommitteeMember } from "types/committe";
import committee from "./committee.json";

const siteConfig = {
  blogDatabaseId: "83e70927-9083-4a1c-af7a-f690b371768c",
  eventsDatabaseId: "7c5bc493-7a66-404e-9f10-1b93edc91e7a",
  commmittee: committee as CommitteeMember[],
  fundingUrl: "https://youtu.be/dQw4w9WgXcQ",
  primarySiteUrl: "https://emgineer.vercel.app",
  admins: ["ls914", "basiltfake", "th621", "jm2455"],
};

export default siteConfig;
