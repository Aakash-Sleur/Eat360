import { Request, Response } from "express";
import Stripe from "stripe";
import { ObjectId } from "mongodb";

import Recipe from "../models/recipe.model";

// Check if the environment variables are correctly loaded
if (!process.env.STRIPE_PRIVATE_KEY) {
  throw new Error("STRIPE_PRIVATE_KEY is not set in environment variables.");
}

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!, {
  apiVersion: "2024-06-20",
});

const createSession = async (req: Request, res: Response) => {
  try {
    const { name, description, recipe_price, recipeId, userId } = req.body;

    if (!name || !description || !recipe_price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "INR",
            product_data: {
              name,
              description,
            },
            unit_amount: recipe_price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}&recipeId=${recipeId}`,
      cancel_url: `${process.env.CLIENT_URL}/failure?recipeId=${recipeId}?status=failure`,
      metadata: {
        recipeId,
        userId,
      },
    });

    return res.json({ url: session.url });
  } catch (error) {
    if (error instanceof Stripe.errors.StripeCardError) {
      return res.status(402).json(error.message);
    } else {
      return res.status(500).json(error.message);
    }
  }
};

async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SIGNIN_SECRET;

  let event: Stripe.Event;
  try {
    if (!sig || !endpointSecret) {
      throw new Error("Stripe signature is missing.");
    }

    //@ts-ignore
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    console.log(`❌ Error message: ${errorMessage}`);
    return res.status(400).send(`Webhook Error: ${errorMessage}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const recipeId = session.metadata?.recipeId;

    if (userId && recipeId) {
      await Recipe.findByIdAndUpdate(recipeId, {
        $push: { boughtBy: new ObjectId(userId) },
      });
    }
  }

  return res.status(200).json({ received: true });
}

async function getSession(req: Request, res: Response) {
  const { sessionId } = req.params;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return res.status(200).json(session);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

export { createSession, handleStripeWebhook, getSession };
