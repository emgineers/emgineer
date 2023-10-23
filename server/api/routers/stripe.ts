import { eq } from "drizzle-orm";
import { users } from "lib/db/schema";
import { stripe } from "lib/stripe";
import { getUrl } from "lib/utils";
import { createTRPCRouter, protectedProcedure } from "server/api/trpc";
import { z } from "zod";

export const stripeRouter = createTRPCRouter({
  createSession: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { eventId } = input;
      const {
        session: { user },
        db,
        notion,
      } = ctx;

      const { stripePriceId } = await notion.getParsedEvent(eventId);

      if (!stripePriceId) {
        throw new Error("Stripe price ID not found");
      }

      const userQuery = await ctx.db.query.users.findFirst({
        where: eq(users.id, user.id),
      });

      let stripeId = userQuery?.stripeId;

      if (!stripeId) {
        // create stripe customer
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
        });
        const customerId = customer.id;

        await db
          .update(users)
          .set({
            stripeId: customerId,
          })
          .where(eq(users.id, user.id))
          .returning({
            stripeId: users.stripeId,
          })
          .run();

        stripeId = customerId as string;
      }

      const url = getUrl() + "/events/" + eventId;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        client_reference_id: user.id,
        customer: stripeId,
        cancel_url: url,
        success_url: url,
        line_items: [
          {
            price: stripePriceId,
            quantity: 1,
          },
        ],
      });

      if (!session.url) return { success: false as const };
      return { success: true as const, url: session.url };
    }),
});
