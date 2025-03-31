// Mock billing data for the TennisPro Portal application

import { Profile } from './supabase';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  category: 'membership' | 'tournament' | 'equipment' | 'coaching' | 'travel' | 'food' | 'other';
  location?: string;
}

export interface BillingCycle {
  id: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  dueDate: string;
  isPaid: boolean;
  transactions: Transaction[];
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  isDefault: boolean;
  lastFour: string;
  expiryDate?: string;
  cardType?: 'visa' | 'mastercard' | 'amex' | 'discover';
  bankName?: string;
}

// Mock transactions data
export const mockTransactions: Transaction[] = [
  {
    id: 'txn_1',
    date: '2025-03-28T14:30:00Z',
    description: 'Premium Membership - Monthly',
    amount: 249.00,
    status: 'completed',
    category: 'membership'
  },
  {
    id: 'txn_2',
    date: '2025-03-25T10:15:00Z',
    description: 'Tournament Registration - Miami Open',
    amount: 350.00,
    status: 'completed',
    category: 'tournament',
    location: 'Miami, FL'
  },
  {
    id: 'txn_3',
    date: '2025-03-22T16:45:00Z',
    description: 'Pro Shop - Tennis Racquet',
    amount: 289.99,
    status: 'completed',
    category: 'equipment'
  },
  {
    id: 'txn_4',
    date: '2025-03-20T09:30:00Z',
    description: 'Coaching Session - Advanced Techniques',
    amount: 150.00,
    status: 'completed',
    category: 'coaching'
  },
  {
    id: 'txn_5',
    date: '2025-03-18T12:00:00Z',
    description: 'Player Lounge - Meal',
    amount: 35.50,
    status: 'completed',
    category: 'food',
    location: 'Indian Wells Tennis Garden'
  },
  {
    id: 'txn_6',
    date: '2025-03-15T08:20:00Z',
    description: 'Court Booking - Practice Session',
    amount: 75.00,
    status: 'completed',
    category: 'other'
  },
  {
    id: 'txn_7',
    date: '2025-03-10T11:45:00Z',
    description: 'Premium Membership - Monthly',
    amount: 249.00,
    status: 'completed',
    category: 'membership'
  },
  {
    id: 'txn_8',
    date: '2025-03-05T15:30:00Z',
    description: 'Travel Booking - Flight to Paris',
    amount: 1250.00,
    status: 'completed',
    category: 'travel',
    location: 'Paris, France'
  },
  {
    id: 'txn_9',
    date: '2025-03-01T14:30:00Z',
    description: 'Hotel Reservation - Roland Garros',
    amount: 1800.00,
    status: 'pending',
    category: 'travel',
    location: 'Paris, France'
  },
  {
    id: 'txn_10',
    date: '2025-02-28T09:15:00Z',
    description: 'Equipment Service - Racquet Stringing',
    amount: 45.00,
    status: 'completed',
    category: 'equipment'
  }
];

// Mock billing cycles
export const mockBillingCycles: BillingCycle[] = [
  {
    id: 'bill_1',
    startDate: '2025-03-01T00:00:00Z',
    endDate: '2025-03-31T23:59:59Z',
    totalAmount: 3493.49,
    dueDate: '2025-04-05T00:00:00Z',
    isPaid: false,
    transactions: mockTransactions.filter(t => 
      new Date(t.date) >= new Date('2025-03-01') && 
      new Date(t.date) <= new Date('2025-03-31')
    )
  },
  {
    id: 'bill_2',
    startDate: '2025-02-01T00:00:00Z',
    endDate: '2025-02-28T23:59:59Z',
    totalAmount: 2150.75,
    dueDate: '2025-03-05T00:00:00Z',
    isPaid: true,
    transactions: mockTransactions.filter(t => 
      new Date(t.date) >= new Date('2025-02-01') && 
      new Date(t.date) <= new Date('2025-02-28')
    ).slice(0, 2) // Just use a couple transactions for the previous month
  }
];

// Mock payment methods
export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_1',
    type: 'card',
    isDefault: true,
    lastFour: '4242',
    expiryDate: '04/28',
    cardType: 'visa'
  },
  {
    id: 'pm_2',
    type: 'card',
    isDefault: false,
    lastFour: '5555',
    expiryDate: '09/26',
    cardType: 'mastercard'
  },
  {
    id: 'pm_3',
    type: 'bank',
    isDefault: false,
    lastFour: '9876',
    bankName: 'Chase Bank'
  }
];

// Function to get current billing cycle
export const getCurrentBillingCycle = (): BillingCycle => {
  return mockBillingCycles[0];
};

// Function to get billing history
export const getBillingHistory = (): BillingCycle[] => {
  return mockBillingCycles;
};

// Function to get user's transactions
export const getUserTransactions = (limit?: number): Transaction[] => {
  if (limit) {
    return mockTransactions.slice(0, limit);
  }
  return mockTransactions;
};

// Function to get user's payment methods
export const getUserPaymentMethods = (): PaymentMethod[] => {
  return mockPaymentMethods;
};

// Function to get default payment method
export const getDefaultPaymentMethod = (): PaymentMethod | undefined => {
  return mockPaymentMethods.find(pm => pm.isDefault);
};

// Function to generate a unique member ID based on profile
export const generateMemberId = (profile: Profile): string => {
  // Create a deterministic ID based on user_id
  const userId = profile.user_id;
  const membershipLevel = profile.membership_level.toUpperCase().charAt(0);
  
  // Take last 8 characters of user_id and format them
  const idPart = userId.slice(-8).toUpperCase();
  
  // Format: M-[Level Initial]-[8 chars from user_id]
  return `M-${membershipLevel}-${idPart}`;
};
