import { CommitteeMember } from "types/committe";
import committee from "./committee.json";

const siteConfig = {
  blogDatabaseId: "83e70927-9083-4a1c-af7a-f690b371768c",
  eventsDatabaseId: "7c5bc493-7a66-404e-9f10-1b93edc91e7a",
  commmittee: committee as CommitteeMember[],
  fundingUrl: "https://www.vle.cam.ac.uk/mod/resource/view.php?id=19037905",
  primarySiteUrl: "https://emmaengsoc.com",
  admins: ["ls914", "basiltfake", "th621", "jm2455"],
};

export default siteConfig;
