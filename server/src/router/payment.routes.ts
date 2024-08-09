import express from "express";

import {
  createSession,
  handleStripeWebhook,
  getSession,
} from "../controllers/payment.controller";

export default (router: express.Router) => {
  router
    .post("/create-payment-intent", createSession)
    .post(
      "/webhook",
      express.raw({ type: "application/json" }),
      handleStripeWebhook
    )
    .get("/session/:sessionId", getSession);

  return router;
};
