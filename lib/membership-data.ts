import { MembershipLevel } from './supabase';

export const membershipLevels: MembershipLevel[] = [
  {
    id: 'standard',
    name: 'Standard',
    price: 99,
    description: 'Essential tools for professional players',
    features: [
      'Tournament management',
      'Practice court booking',
      'Hitting partner finder',
      'Basic travel booking',
      'Equipment tracking'
    ],
    is_invite_only: false
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 249,
    description: 'Advanced features for serious competitors',
    features: [
      'Everything in Standard',
      'Concierge service access',
      'Priority bookings',
      'VIP hotel & jet rates',
      'Monthly performance analyst session',
      'Secure file vault'
    ],
    is_invite_only: false
  },
  {
    id: 'black',
    name: 'Black Tier',
    price: 999, // Custom pricing, but we need a value for the mock
    description: 'For top 20 ATP/WTA players',
    features: [
      'Everything in Premium',
      'Personal concierge representative',
      'Ultra-lux travel with private jet access',
      'Elite hospitality services',
      'Match & training intelligence with AI',
      'Security & privacy features'
    ],
    is_invite_only: true
  }
];

export const getMembershipById = (id: string): MembershipLevel | undefined => {
  return membershipLevels.find(level => level.id === id);
};

export const getMembershipByName = (name: string): MembershipLevel | undefined => {
  return membershipLevels.find(level => level.name === name);
};
