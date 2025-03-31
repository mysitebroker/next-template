# TennisPro Portal Authentication System

This document provides information about the authentication system implemented for the TennisPro Portal.

## Features

- User registration with membership selection
- Login/logout functionality
- Password reset flow
- Profile management
- Membership subscription with Stripe payment integration
- Protected routes for authenticated users
- Developer account for testing

## Tech Stack

- Next.js 13 App Router
- Supabase for authentication and database
- Stripe for payment processing (mock implementation)
- React Hook Form for form handling
- Zod for form validation
- Tailwind CSS for styling
- shadcn/ui components

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Supabase Setup

1. Create a new Supabase project
2. Set up the following tables in your Supabase database:

#### profiles
```sql
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  user_id uuid references auth.users on delete cascade not null,
  full_name text,
  avatar_url text,
  membership_level text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own profile."
  on profiles for update
  using ( auth.uid() = user_id );
```

#### subscriptions
```sql
create table subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  membership_level text not null,
  status text not null,
  current_period_end timestamp with time zone not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table subscriptions enable row level security;

-- Create policies
create policy "Users can view their own subscriptions."
  on subscriptions for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own subscriptions."
  on subscriptions for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own subscriptions."
  on subscriptions for update
  using ( auth.uid() = user_id );
```

#### payments
```sql
create table payments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  amount numeric not null,
  currency text not null,
  status text not null,
  payment_method text,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table payments enable row level security;

-- Create policies
create policy "Users can view their own payments."
  on payments for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own payments."
  on payments for insert
  with check ( auth.uid() = user_id );
```

### 3. Developer Account

For testing purposes, you can use the following developer account credentials:

```bash
# Display developer account credentials
node scripts/create-dev-account.js
```

Developer account credentials:
- Email: dev@tennispro.com
- Password: TennisPro2025!
- Membership: Premium

This is a special developer account that bypasses Supabase authentication entirely. It allows you to log in without email verification during development. The implementation:

1. Checks for dev credentials in the login form
2. If matched, creates a mock user session without contacting Supabase
3. Stores the authentication state in localStorage and cookies
4. Middleware recognizes the dev auth cookie and allows access to protected routes

Regular users still go through the normal Supabase authentication flow. This approach allows for easy development and testing without modifying Supabase settings or creating actual accounts.

## Authentication Flow

1. **Registration**:
   - User fills out registration form with personal details
   - User selects a membership level
   - User is redirected to payment page
   - After successful payment, user account is created

2. **Login**:
   - User enters email and password
   - If credentials are valid, user is redirected to dashboard
   - If credentials are invalid, error message is displayed

3. **Password Reset**:
   - User enters email address
   - Reset link is sent to email
   - User clicks link and enters new password

4. **Protected Routes**:
   - Routes like `/dashboard`, `/profile`, etc. are protected
   - Unauthenticated users are redirected to login page
   - Authenticated users trying to access auth pages are redirected to dashboard

## File Structure

- `lib/auth-context.tsx` - Authentication context provider
- `lib/supabase.ts` - Supabase client and types
- `lib/membership-data.ts` - Membership level data
- `lib/stripe-service.ts` - Mock Stripe service
- `middleware.ts` - Route protection middleware
- `app/auth/login/page.tsx` - Login page
- `app/auth/register/page.tsx` - Registration page
- `app/auth/payment/page.tsx` - Payment page
- `app/auth/forgot-password/page.tsx` - Forgot password page
- `app/profile/page.tsx` - User profile page
- `scripts/create-dev-account.js` - Script to create developer account

## Usage

### Login

Use the developer account credentials to log in:
- Email: dev@tennispro.com
- Password: TennisPro2025!

### Registration

To test the registration flow:
1. Click "Sign Up" in the header
2. Fill out the registration form
3. Select a membership level
4. Enter mock payment details (any valid-format card number will work)
5. Submit the form

### Profile Management

Once logged in, you can:
1. View and update your profile information
2. Change your password
3. View your current membership
4. Upgrade your membership

## Notes

- This is a mock implementation of Stripe payment processing
- In a production environment, you would integrate with the actual Stripe API
- The password reset flow sends a mock email (in a real app, you would configure email sending)
