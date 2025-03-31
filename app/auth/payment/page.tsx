"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { getMembershipById } from "@/lib/membership-data"
import { createPaymentMethod, createPaymentIntent } from "@/lib/stripe-service"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"

// Define the form schema
const formSchema = z.object({
  cardNumber: z.string().min(16, { message: "Card number must be at least 16 digits" }).max(19),
  cardExpMonth: z.string().min(1).max(2),
  cardExpYear: z.string().min(2).max(4),
  cardCvc: z.string().min(3).max(4),
});

type FormValues = z.infer<typeof formSchema>;

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const membershipId = searchParams.get("membership") || "standard"
  const [membership, setMembership] = useState(getMembershipById(membershipId))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardNumber: "",
      cardExpMonth: "",
      cardExpYear: "",
      cardCvc: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    if (!membership) return;
    
    setIsLoading(true)
    setError(null)

    try {
      // Create a payment method (mock)
      const paymentMethod = await createPaymentMethod(
        data.cardNumber,
        parseInt(data.cardExpMonth),
        parseInt(data.cardExpYear),
        data.cardCvc
      );

      // Create a payment intent (mock)
      const paymentIntent = await createPaymentIntent(
        membership.price * 100, // Convert to cents
        "usd",
        paymentMethod.id
      );

      // In a real app, we would confirm the payment intent here
      // For our mock, we'll just simulate a successful payment
      
      // Store payment record in Supabase (this would be done server-side in a real app)
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        const userId = session.session.user.id;
        
        // Store payment record
        await supabase.from('payments').insert({
          user_id: userId,
          amount: membership.price,
          currency: 'usd',
          status: 'succeeded',
          payment_method: `${paymentMethod.card.brand} ending in ${paymentMethod.card.last4}`,
        });
        
        // Update user's profile with membership level
        await supabase.from('profiles').upsert({
          user_id: userId,
          membership_level: membershipId,
          updated_at: new Date().toISOString(),
        });
        
        // Create subscription record
        await supabase.from('subscriptions').insert({
          user_id: userId,
          membership_level: membershipId,
          status: 'active',
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        });
      }

      setSuccess(true);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      setError("Payment processing failed. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // If membership not found, redirect to register
  useEffect(() => {
    if (!membership) {
      router.push('/auth/register');
    }
  }, [membership, router]);

  if (!membership) {
    return null;
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.logo className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">Complete Your Subscription</h1>
          <p className="text-sm text-muted-foreground">
            Enter your payment details to activate your {membership.name} membership
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>
              You are subscribing to the {membership.name} plan at ${membership.price}/month
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-6">
                <div className="rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900 dark:text-green-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium">Payment Successful!</h3>
                <p className="text-center text-sm text-muted-foreground">
                  Your {membership.name} membership is now active. Redirecting to dashboard...
                </p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="4242 4242 4242 4242" 
                            disabled={isLoading}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="cardExpMonth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Exp. Month</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="MM" 
                              disabled={isLoading}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cardExpYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Exp. Year</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="YY" 
                              disabled={isLoading}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cardCvc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVC</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="123" 
                              disabled={isLoading}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {error && (
                    <div className="text-sm font-medium text-destructive">
                      {error}
                    </div>
                  )}
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Pay $${membership.price}`
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-xs text-muted-foreground">
              Your subscription will automatically renew each month
            </p>
          </CardFooter>
        </Card>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>
            By subscribing, you agree to our{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
