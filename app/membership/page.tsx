"use client"

import { useState, useEffect } from "react"
import Barcode from "react-barcode"
import QRCode from "react-qr-code"
import { useAuth } from "@/lib/auth-context"
import { getMembershipById } from "@/lib/membership-data"
import { 
  getCurrentBillingCycle, 
  getUserTransactions, 
  getUserPaymentMethods,
  getDefaultPaymentMethod,
  generateMemberId,
  Transaction,
  PaymentMethod
} from "@/lib/billing-data"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"

export default function MembershipPage() {
  const { user, profile } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("membership")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState<PaymentMethod | undefined>()
  const [memberId, setMemberId] = useState<string>("")
  
  const membership = profile?.membership_level 
    ? getMembershipById(profile.membership_level) 
    : null;
  
  const currentBillingCycle = getCurrentBillingCycle();
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Get card icon based on card type
  const getCardIcon = (cardType?: string) => {
    switch (cardType) {
      case 'visa':
        return <Icons.visa className="h-6 w-6" />;
      case 'mastercard':
        return <Icons.mastercard className="h-6 w-6" />;
      case 'amex':
        return <Icons.amex className="h-6 w-6" />;
      case 'discover':
        return <Icons.discover className="h-6 w-6" />;
      default:
        return <Icons.creditCard className="h-6 w-6" />;
    }
  };
  
  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'membership':
        return <Icons.premium className="h-4 w-4" />;
      case 'tournament':
        return <Icons.tennis className="h-4 w-4" />;
      case 'equipment':
        return <Icons.racquet className="h-4 w-4" />;
      case 'coaching':
        return <Icons.users className="h-4 w-4" />;
      case 'travel':
        return <Icons.travel className="h-4 w-4" />;
      case 'food':
        return <Icons.nutrition className="h-4 w-4" />;
      default:
        return <Icons.activity className="h-4 w-4" />;
    }
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  // Load data
  useEffect(() => {
    if (profile) {
      setTransactions(getUserTransactions());
      setPaymentMethods(getUserPaymentMethods());
      setDefaultPaymentMethod(getDefaultPaymentMethod());
      setMemberId(generateMemberId(profile));
      setIsLoading(false);
    }
  }, [profile]);
  
  if (isLoading || !user || !profile) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <div className="text-center">
          <Icons.spinner className="mx-auto h-8 w-8 animate-spin" />
          <p className="mt-2 text-lg">Loading membership details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-10">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Membership Account</h1>
        <p className="text-muted-foreground">
          Manage your membership, view your billing history, and access your membership card
        </p>
      </div>
      
      <Tabs defaultValue="membership" className="space-y-8" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="membership">Membership</TabsTrigger>
          <TabsTrigger value="card">Membership Card</TabsTrigger>
          <TabsTrigger value="billing">Billing & Charges</TabsTrigger>
        </TabsList>
        
        {/* Membership Tab */}
        <TabsContent value="membership" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Membership</CardTitle>
                <CardDescription>
                  Current membership details and benefits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || "User"} />
                    <AvatarFallback className="text-xl">
                      {profile.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-medium">{profile.full_name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="mt-1">
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {membership?.name || "No active membership"}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg bg-primary/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-primary">{membership?.name} Membership</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(membership?.price || 0)}/month
                      </p>
                    </div>
                    <Icons.premium className="h-8 w-8 text-primary" />
                  </div>
                </div>
                
                <div>
                  <h4 className="mb-2 font-medium">Membership Benefits</h4>
                  <ul className="space-y-2">
                    {membership?.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Icons.check className="mr-2 h-5 w-5 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Change Plan</Button>
                <Button>Renew Membership</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Membership Status</CardTitle>
                <CardDescription>
                  Your current membership status and renewal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Member Since</h4>
                    <span>{formatDate(profile.created_at)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Membership ID</h4>
                    <span className="font-mono">{memberId}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Status</h4>
                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      Active
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Next Billing Date</h4>
                    <span>{formatDate(currentBillingCycle.endDate)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Payment Method</h4>
                    <div className="flex items-center">
                      {defaultPaymentMethod?.type === 'card' && (
                        <>
                          {getCardIcon(defaultPaymentMethod.cardType)}
                          <span className="ml-2">•••• {defaultPaymentMethod.lastFour}</span>
                        </>
                      )}
                      {defaultPaymentMethod?.type === 'bank' && (
                        <>
                          <Icons.bank className="h-5 w-5" />
                          <span className="ml-2">{defaultPaymentMethod.bankName} •••• {defaultPaymentMethod.lastFour}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-950">
                  <div className="flex items-start">
                    <Icons.info className="mr-3 h-5 w-5 text-amber-500" />
                    <div>
                      <h4 className="font-medium text-amber-800 dark:text-amber-300">Auto-Renewal Active</h4>
                      <p className="text-sm text-amber-700 dark:text-amber-400">
                        Your membership will automatically renew on {formatDate(currentBillingCycle.endDate)}. 
                        You can cancel auto-renewal at any time.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Manage Auto-Renewal
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Upgrade Your Membership</CardTitle>
              <CardDescription>
                Explore other membership options to enhance your experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {membership?.id !== 'standard' && (
                  <div className={`rounded-lg border p-4 ${membership?.id === 'standard' ? 'bg-primary/5 border-primary' : ''}`}>
                    <h4 className="text-lg font-medium">Standard</h4>
                    <p className="text-2xl font-bold">$99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                    <p className="mt-2 text-sm text-muted-foreground">Essential tools for professional players</p>
                    <Button variant={membership?.id === 'standard' ? 'default' : 'outline'} className="mt-4 w-full">
                      {membership?.id === 'standard' ? 'Current Plan' : 'Downgrade'}
                    </Button>
                  </div>
                )}
                
                <div className={`rounded-lg border p-4 ${membership?.id === 'premium' ? 'bg-primary/5 border-primary' : ''}`}>
                  <h4 className="text-lg font-medium">Premium</h4>
                  <p className="text-2xl font-bold">$249<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                  <p className="mt-2 text-sm text-muted-foreground">Advanced features for serious competitors</p>
                  <Button variant={membership?.id === 'premium' ? 'default' : 'outline'} className="mt-4 w-full">
                    {membership?.id === 'premium' ? 'Current Plan' : membership?.id === 'black' ? 'Downgrade' : 'Upgrade'}
                  </Button>
                </div>
                
                <div className={`rounded-lg border p-4 ${membership?.id === 'black' ? 'bg-primary/5 border-primary' : ''}`}>
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium">Black Tier</h4>
                    <Badge>Exclusive</Badge>
                  </div>
                  <p className="text-2xl font-bold">$999<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                  <p className="mt-2 text-sm text-muted-foreground">For top 20 ATP/WTA players</p>
                  <Button variant={membership?.id === 'black' ? 'default' : 'outline'} className="mt-4 w-full">
                    {membership?.id === 'black' ? 'Current Plan' : 'Request Upgrade'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Membership Card Tab */}
        <TabsContent value="card" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
            <Card>
              <CardHeader>
                <CardTitle>Your Membership Card</CardTitle>
                <CardDescription>
                  Present this card at events for check-in and purchases
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <div className="relative w-full max-w-md overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary-foreground p-6 text-white shadow-lg transition-all hover:shadow-xl">
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"></div>
                  <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10"></div>
                  
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icons.tennis className="h-8 w-8" />
                      <span className="text-xl font-bold">TennisPro</span>
                    </div>
                    <Badge className="bg-white/20 text-white hover:bg-white/30">
                      {membership?.name}
                    </Badge>
                  </div>
                  
                  <div className="mb-6 space-y-1">
                    <h3 className="text-lg font-medium">{profile.full_name}</h3>
                    <p className="text-sm text-white/80">Member ID: {memberId}</p>
                  </div>
                  
                  <div className="mb-4 w-full">
                    <Barcode 
                      value={memberId} 
                      width={1.5}
                      height={50}
                      fontSize={12}
                      background="transparent"
                      lineColor="white"
                      margin={0}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Valid thru: {formatDate(currentBillingCycle.endDate)}</span>
                    <span className="font-medium">MEMBER</span>
                  </div>
                </div>
                
                <div className="mt-8 text-center text-sm text-muted-foreground">
                  <p>Your membership card can be used for event check-in and on-site purchases.</p>
                  <p>All charges will be billed to your account.</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button>Download Card</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>QR Code</CardTitle>
                <CardDescription>
                  Scan for quick access to your membership
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <div className="rounded-lg bg-white p-4">
                  <QRCode 
                    value={`TENNISPRO:MEMBER:${memberId}`} 
                    size={180}
                    level="H"
                  />
                </div>
                
                <div className="mt-6 text-center">
                  <p className="font-medium">Member ID</p>
                  <p className="font-mono text-lg">{memberId}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline">Share QR Code</Button>
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>How to Use Your Membership Card</CardTitle>
              <CardDescription>
                Learn how to use your membership card at events and facilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-3">
                    <Icons.scan className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="mb-2 font-medium">Event Check-In</h4>
                  <p className="text-sm text-muted-foreground">
                    Present your card or QR code at the registration desk for quick check-in at tournaments and events.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-3">
                    <Icons.creditCard className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="mb-2 font-medium">On-Site Purchases</h4>
                  <p className="text-sm text-muted-foreground">
                    Use your membership card to make purchases at pro shops, restaurants, and other facilities.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-3">
                    <Icons.court className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="mb-2 font-medium">Court Access</h4>
                  <p className="text-sm text-muted-foreground">
                    Scan your card to access practice courts and training facilities at partner locations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>
                  Recent charges and payments on your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          {getCategoryIcon(transaction.category)}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(transaction.date)}
                            {transaction.location && ` • ${transaction.location}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(transaction.amount)}</p>
                        <Badge variant="outline" className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Transactions</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Current Billing Cycle</CardTitle>
                <CardDescription>
                  {formatDate(currentBillingCycle.startDate)} - {formatDate(currentBillingCycle.endDate)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-primary/5 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-medium">Total Due</h4>
                    <span className="text-xl font-bold">{formatCurrency(currentBillingCycle.totalAmount)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Due by {formatDate(currentBillingCycle.dueDate)}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Membership Fee</h4>
                    <span>{formatCurrency(membership?.price || 0)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Tournament Fees</h4>
                    <span>{formatCurrency(350)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Equipment & Services</h4>
                    <span>{formatCurrency(289.99 + 45)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Other Charges</h4>
                    <span>{formatCurrency(currentBillingCycle.totalAmount - (membership?.price || 0) - 350 - 289.99 - 45)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Pay Now</Button>
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage your payment methods and billing preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center space-x-4">
                      {method.type === 'card' ? (
                        <>
                          {getCardIcon(method.cardType)}
                          <div>
                            <p className="font-medium">
                              {method.cardType?.charAt(0).toUpperCase()}{method.cardType?.slice(1)} •••• {method.lastFour}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Expires {method.expiryDate}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Icons.bank className="h-6 w-6" />
                          <div>
                            <p className="font-medium">{method.bankName}</p>
                            <p className="text-sm text-muted-foreground">
                              Account ending in {method.lastFour}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {method.isDefault && (
                        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          Default
                        </Badge>
                      )}
                      <Button variant="ghost" size="sm">
                        <Icons.edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Set Default</Button>
              <Button>Add Payment Method</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
