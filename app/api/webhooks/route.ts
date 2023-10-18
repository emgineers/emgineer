import type { Stripe } from "stripe";

import { NextResponse } from "next/server";

import { stripe } from "lib/stripe";
import { db } from "lib/db";
import { eventSignUps } from "lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  let event: Stripe.DiscriminatedEvent;

  try {
    event = stripe.webhooks.constructEvent(
      await (await req.blob()).text(),
      req.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    ) as Stripe.DiscriminatedEvent;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    // On error, log and return the error message.
    if (err! instanceof Error) console.log(err);
    console.log(`❌ Error message: ${errorMessage}`);
    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  // Successfully constructed event.
  console.log("Event", event.id);

  const permittedEvents: string[] = [
    "checkout.session.completed",
    "payment_intent.succeeded",
    "payment_intent.payment_failed",
  ];

  if (permittedEvents.includes(event.type)) {
    let data;

    try {
      switch (event.type) {
        case "checkout.session.completed":
          data = event.data.object;
          //   const userId = data.client_reference_id;
          const email = data?.customer_details?.email as string;
          //   const customerId = data.customer;
          const successUrl = data.success_url as string;
          const eventId = successUrl.split("/").pop() as string;
          const crsId = email.split("@")[0];
          const eventSignUpId = crsId + "-" + eventId;

          const payment_intent = await stripe.paymentIntents.retrieve(
            data.payment_intent as string
          );
          const paymentStatus = payment_intent.status === "succeeded";
          console.log(
            `💰 CheckoutSession status: ${data.payment_status}`,
            data,
            paymentStatus
          );
          await db
            .update(eventSignUps)
            .set({
              paid: paymentStatus,
            })
            .where(eq(eventSignUps.id, eventSignUpId))
            .run();

          break;
        case "payment_intent.payment_failed":
          data = event.data.object;
          console.log(`❌ Payment failed: ${data.last_payment_error?.message}`);
          break;
        case "payment_intent.succeeded":
          data = event.data.object as Stripe.PaymentIntent;
          console.log(`💰 PaymentIntent status: ${data.status}`);
          break;
        default:
          throw new Error(`Unhhandled event: ${event.type}`);
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { message: "Webhook handler failed" },
        { status: 500 }
      );
    }
  }
  // Return a response to acknowledge receipt of the event.
  return NextResponse.json({ message: "Received" }, { status: 200 });
}
