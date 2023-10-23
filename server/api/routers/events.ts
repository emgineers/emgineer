import { eq } from "drizzle-orm";
import { eventSignUps } from "lib/db/schema";
import { createTRPCRouter, protectedProcedure } from "server/api/trpc";
import { z } from "zod";

export const signUp = protectedProcedure
  .input(
    z.object({
      going: z.enum(["Yes", "No", "Maybe"]),
      eventId: z.string(),
      extraDetails: z.string().optional(),
    })
  )
  .mutation(async ({ ctx, input: { going, eventId, extraDetails } }) => {
    const { name, email, crsid, id } = ctx.session.user;
    const { title, price } = await ctx.notion.getParsedEvent(eventId);

    const requiresPayment = price ? (price > 0 ? true : false) : false;

    const dbRes = await ctx.db
      .insert(eventSignUps)
      .values({
        name,
        id: crsid + "-" + eventId,
        userId: id,
        extraDetails,
        email: email,
        going: going,
        paid: requiresPayment ? false : null, // by default, if payment is required, then the user has not paid
        eventId: eventId,
        event: title,
        updatedAt: new Date().toISOString(),
      })
      .onConflictDoUpdate({
        target: eventSignUps.id,
        set: {
          going,
          extraDetails,
        },
      })
      .run();

    return {
      success: true,
    };
  });

export const userSignUpStatus = protectedProcedure
  .input(z.object({ eventId: z.string() }))
  .query(async ({ ctx, input: { eventId } }) => {
    const { crsid } = ctx.session.user;

    const id = crsid + "-" + eventId;
    const signUpRow = await ctx.db.query.eventSignUps.findFirst({
      where: eq(eventSignUps.id, id),
    });

    interface SignUpStatus {
      status:
        | "RVSP"
        | "Going"
        | "Going (Paid)"
        | "Awaiting Payment/Approval"
        | "Not Going"
        | "Maybe";

      extraDetails?: string;
      going?: "Yes" | "No" | "Maybe";
      paid?: boolean | null;
    }

    if (!signUpRow) {
      return {
        status: "RVSP",
        extraDetails: "",
        going: undefined,
      } as SignUpStatus;
    }
    const { going, paid } = signUpRow;

    let status = "RVSP";

    if (going === "No") {
      status = "Not Going";
    }
    if (going === "Maybe") {
      status = "Maybe";
    }

    if (going === "Yes" && paid === true) {
      status = "Going (Paid)";
    }

    if (going === "Yes" && paid === false) {
      status = "Awaiting Payment/Approval";
    }

    if (going === "Yes" && paid === null) {
      // payment not required
      status = "Going";
    }

    return {
      status,
      // @ts-ignore
      extraDetails: signUpRow.extraDetails,
      going,
      paid,
    } as SignUpStatus;
  });

export const eventRouter = createTRPCRouter({
  signUp: signUp,
  signUpStatus: userSignUpStatus,
});
