import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    });
  }

  async retrieveCheckoutSession(sessionId: string) {
    return await this.stripe.checkout.sessions.retrieve(sessionId);
  }
  async createCheckoutSession(checkoutDetails:any) {
    return await this.stripe.checkout.sessions.create({...checkoutDetails} );
  }
  async retrieveRefund(refundId: string) {
    return await this.stripe.refunds.retrieve(refundId);
  }
  async createRefund(payment_intent: any,amount:number) {
    return await this.stripe.refunds.create({
      payment_intent,
      amount,
    });
  }
}
