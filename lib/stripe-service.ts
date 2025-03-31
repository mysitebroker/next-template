import { MembershipLevel } from './supabase';

// This is a mock Stripe service for demonstration purposes
// In a real application, you would use the actual Stripe API

export type PaymentMethod = {
  id: string;
  type: 'card';
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
};

export type PaymentIntent = {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'processing' | 'requires_payment_method' | 'canceled';
  created: number;
  payment_method?: string;
};

export type Subscription = {
  id: string;
  customer: string;
  status: 'active' | 'canceled' | 'past_due';
  current_period_end: number;
  items: {
    data: Array<{
      price: {
        product: string;
      };
    }>;
  };
};

// Mock function to create a payment method
export const createPaymentMethod = async (
  cardNumber: string,
  expMonth: number,
  expYear: number,
  cvc: string
): Promise<PaymentMethod> => {
  // In a real implementation, this would call Stripe API
  return {
    id: `pm_${Math.random().toString(36).substring(2, 15)}`,
    type: 'card',
    card: {
      brand: cardNumber.startsWith('4') ? 'visa' : 'mastercard',
      last4: cardNumber.slice(-4),
      exp_month: expMonth,
      exp_year: expYear,
    },
  };
};

// Mock function to create a payment intent
export const createPaymentIntent = async (
  amount: number,
  currency: string = 'usd',
  paymentMethodId?: string
): Promise<PaymentIntent> => {
  // In a real implementation, this would call Stripe API
  return {
    id: `pi_${Math.random().toString(36).substring(2, 15)}`,
    amount,
    currency,
    status: 'succeeded',
    created: Date.now(),
    payment_method: paymentMethodId,
  };
};

// Mock function to create a subscription
export const createSubscription = async (
  customerId: string,
  membershipLevel: MembershipLevel
): Promise<Subscription> => {
  // In a real implementation, this would call Stripe API
  return {
    id: `sub_${Math.random().toString(36).substring(2, 15)}`,
    customer: customerId,
    status: 'active',
    current_period_end: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
    items: {
      data: [
        {
          price: {
            product: membershipLevel.id,
          },
        },
      ],
    },
  };
};

// Mock function to get a subscription
export const getSubscription = async (subscriptionId: string): Promise<Subscription | null> => {
  // In a real implementation, this would call Stripe API
  // For demo purposes, we'll just return a mock subscription
  return {
    id: subscriptionId,
    customer: `cus_${Math.random().toString(36).substring(2, 15)}`,
    status: 'active',
    current_period_end: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
    items: {
      data: [
        {
          price: {
            product: 'premium', // Default to premium for mock
          },
        },
      ],
    },
  };
};

// Mock function to cancel a subscription
export const cancelSubscription = async (subscriptionId: string): Promise<Subscription> => {
  // In a real implementation, this would call Stripe API
  return {
    id: subscriptionId,
    customer: `cus_${Math.random().toString(36).substring(2, 15)}`,
    status: 'canceled',
    current_period_end: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
    items: {
      data: [
        {
          price: {
            product: 'premium', // Default to premium for mock
          },
        },
      ],
    },
  };
};
