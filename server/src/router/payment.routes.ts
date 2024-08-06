import express from "express";

import {
  createSession,
  handleStripeWebhook,
  getSession,
} from "../controllers/payment.controller";

export default (router: express.Router) => {
  router.post("/create-payment-intent", createSession);
  router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    handleStripeWebhook
  );
  router.get("/session/:sessionId", getSession);

  return router;
};
