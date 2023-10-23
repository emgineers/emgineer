"use client";

import { Button } from "components/ui/button";
import { FC, use, useEffect, useState } from "react";
import { RouterOutputs, api } from "trpc/client";
import Login from "./login-in";
import { Skeleton } from "components/ui/skeleton";
import { ParsedEventsPageObjectResponse } from "app/get";

interface EventSignUpStatusProps extends ParsedEventsPageObjectResponse {}

const ClientEventSignUpStatus: FC<EventSignUpStatusProps> = ({
  parsed: { eventId, price, stripePriceId },
}) => {
  const slug = eventId;

  const [userSignUpStatus, setUserSignUpStatus] = useState<
    RouterOutputs["events"]["signUpStatus"] | undefined
  >(undefined);
  const [unauthorized, setUnauthorized] = useState<boolean>(false);

  useEffect(() => {
    async function getUserSignUpStatus() {
      try {
        const res = await api.events.signUpStatus.query({
          eventId: eventId,
        });
        setUserSignUpStatus(res);
      } catch (error) {
        if ((error as { message: string }).message === "UNAUTHORIZED") {
          setUnauthorized(true);
        }
      }
    }
    getUserSignUpStatus();
  }, [eventId]);

  if (unauthorized && !userSignUpStatus) {
    return <Login />;
  }

  if (!userSignUpStatus && !unauthorized) {
    return (
      <Skeleton className="mt-4">
        <Button className={"w-full"} variant="ghost"></Button>
      </Skeleton>
    );
  }

  if (!userSignUpStatus) {
    return <div>Uh oh: contact Webmaster</div>;
  }

  let buttonClassName = "w-full mt-4 ";

  if (price && !stripePriceId) {
    return (
      <Button className="bg-gray-500 hover:bg-gray-600 text-white">
        Sign Ups Closed
      </Button>
    );
  }

  switch (userSignUpStatus.status) {
    case "Going":
      buttonClassName += "bg-green-500 hover:bg-green-600";
      break;
    case "Going (Paid)":
      buttonClassName += "bg-green-500 hover:bg-green-600";
      break;
    case "Not Going":
      buttonClassName += "bg-red-500 hover:bg-red-600";
      break;
    case "Maybe":
      buttonClassName += "bg-yellow-500 hover:bg-yellow-600";
      break;
    case "RVSP":
      buttonClassName += "bg-blue-500 hover:bg-blue-600";
      break;
    case "Awaiting Payment/Approval":
      buttonClassName += "bg-orange-500 hover:bg-orange-600";
      break;
  }

  return (
    <Button className={buttonClassName} href={`/events/${slug}`}>
      {userSignUpStatus.status}
    </Button>
  );
};

export default ClientEventSignUpStatus;
