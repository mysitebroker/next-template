import Link from "next/link"
import Image from "next/image"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { HeroAnimations, ButtonAnimation } from "@/components/hero-animations"
import { ContactForm } from "@/components/contact-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function IndexPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-green-600 to-blue-600 py-20 md:py-32 relative">
        <HeroAnimations />
        <div className="container flex flex-col items-center justify-center gap-4 text-center relative z-10">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-7xl">
              TennisPro Portal
            </h1>
            <p className="mx-auto max-w-[700px] text-lg text-white/90 md:text-xl">
              The ultimate sports management app for professional tennis players.
              Manage your tournaments, training, travel, and wellness in one place.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className={buttonVariants({
                size: "lg",
                className: "bg-white text-black hover:bg-white/90 relative",
              })}
            >
              <ButtonAnimation />
              Go to Dashboard
            </Link>
            <Link
              href="#features"
              className={buttonVariants({
                size: "lg",
                className: "bg-white text-black hover:bg-white/90 relative",
              })}
            >
              <ButtonAnimation />
              Explore Features
            </Link>
            <Link
              href="#membership"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "border-white text-white hover:bg-white/20 relative",
              })}
            >
              <ButtonAnimation />
              View Membership
            </Link>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="container py-16 md:py-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Core Features</h2>
          <p className="mt-4 text-muted-foreground">
            Everything you need to manage your professional tennis career
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {/* Tournament Management */}
          <Card className="flex flex-col transition-all hover:shadow-md hover:scale-[1.01]">
            <div className="h-1.5 w-full bg-blue-600 rounded-t-lg"></div>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                <Icons.calendar className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <CardTitle>Tournament Management</CardTitle>
              <CardDescription>
                Track and manage your tournament schedule
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="ml-6 list-disc text-sm text-muted-foreground">
                <li>Browse & enter ATP/WTA/ITF tournaments</li>
                <li>Track registration deadlines & entry status</li>
                <li>View draws & match schedules</li>
                <li>Ranking and point tracking</li>
              </ul>
            </CardContent>
          </Card>

          {/* Practice Court Booking */}
          <Card className="flex flex-col transition-all hover:shadow-md hover:scale-[1.01]">
            <div className="h-1.5 w-full bg-green-600 rounded-t-lg"></div>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                <Icons.court className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <CardTitle>Practice Court Booking</CardTitle>
              <CardDescription>
                Reserve courts for your training sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="ml-6 list-disc text-sm text-muted-foreground">
                <li>Reserve courts by surface (hard/clay/grass/indoor)</li>
                <li>Location-based filtering</li>
                <li>Partner availability coordination</li>
                <li>Facility info & reviews</li>
              </ul>
            </CardContent>
          </Card>

          {/* Hitting Partner Finder */}
          <Card className="flex flex-col transition-all hover:shadow-md hover:scale-[1.01]">
            <div className="h-1.5 w-full bg-purple-600 rounded-t-lg"></div>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                <Icons.users className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <CardTitle>Hitting Partner Finder</CardTitle>
              <CardDescription>
                Find the perfect practice partner
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="ml-6 list-disc text-sm text-muted-foreground">
                <li>Match based on ranking/availability/location</li>
                <li>Messaging & scheduling</li>
                <li>Coach recommendations</li>
                <li>Rating system for partners</li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6 lg:grid-cols-2">
          {/* Travel Booking */}
          <Card className="flex flex-col transition-all hover:shadow-md hover:scale-[1.01]">
            <div className="h-1.5 w-full bg-amber-600 rounded-t-lg"></div>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900">
                <Icons.travel className="h-6 w-6 text-amber-600 dark:text-amber-300" />
              </div>
              <CardTitle>Travel Booking</CardTitle>
              <CardDescription>
                Streamline your tournament travel arrangements
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="ml-6 list-disc text-sm text-muted-foreground">
                <li>Flight booking with sports equipment included</li>
                <li>Hotel reservations near tournament venues</li>
                <li>Car rentals with equipment space</li>
                <li>Tournament-linked itineraries</li>
              </ul>
            </CardContent>
          </Card>

          {/* Racquet Stringing Services */}
          <Card className="flex flex-col transition-all hover:shadow-md hover:scale-[1.01]">
            <div className="h-1.5 w-full bg-red-600 rounded-t-lg"></div>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900">
                <Icons.racquet className="h-6 w-6 text-red-600 dark:text-red-300" />
              </div>
              <CardTitle>Racquet Stringing</CardTitle>
              <CardDescription>
                Manage your equipment and stringing needs
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="ml-6 list-disc text-sm text-muted-foreground">
                <li>On-site and remote stringing bookings</li>
                <li>Tension presets and string type preferences</li>
                <li>Track stringing history</li>
                <li>Equipment inventory management</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Feature Categories */}
      <section className="w-full bg-muted py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Comprehensive Management
            </h2>
            <p className="mt-4 text-muted-foreground">
              TennisPro Portal covers every aspect of your professional tennis career
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Travel & Logistics */}
            <div className="rounded-lg bg-card p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                <Icons.travel className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Travel & Logistics</h3>
              <ul className="ml-6 list-disc text-sm text-muted-foreground">
                <li>Travel booking with sports baggage included</li>
                <li>Private jet charter access</li>
                <li>Tournament-linked itineraries</li>
                <li>Hotel & vacation booking</li>
                <li>Transport coordination</li>
              </ul>
            </div>

            {/* Health & Wellness */}
            <div className="rounded-lg bg-card p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                <Icons.health className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Health & Wellness</h3>
              <ul className="ml-6 list-disc text-sm text-muted-foreground">
                <li>Physio & massage booking</li>
                <li>Nutrition planning with certified nutritionists</li>
                <li>Mental coaching sessions</li>
                <li>Recovery & injury care</li>
                <li>Supplement tracking</li>
              </ul>
            </div>

            {/* Player Services */}
            <div className="rounded-lg bg-card p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                <Icons.briefcase className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Player Services</h3>
              <ul className="ml-6 list-disc text-sm text-muted-foreground">
                <li>Agent & team management</li>
                <li>Equipment inventory tracking</li>
                <li>Sponsorship management</li>
                <li>Contract uploads & alerts</li>
                <li>Payments & invoicing</li>
              </ul>
            </div>

            {/* Insights & Stats */}
            <div className="rounded-lg bg-card p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
                <Icons.stats className="h-6 w-6 text-orange-600 dark:text-orange-300" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Insights & Stats</h3>
              <ul className="ml-6 list-disc text-sm text-muted-foreground">
                <li>Match & training analytics</li>
                <li>Performance dashboard</li>
                <li>Wearables integration</li>
                <li>Goal setting tools</li>
                <li>Weekly/monthly data summaries</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section id="membership" className="container py-16 md:py-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Membership Tiers
          </h2>
          <p className="mt-4 text-muted-foreground">
            Choose the plan that fits your professional needs
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Standard Tier */}
          <Card>
            <CardHeader>
              <CardTitle>Standard</CardTitle>
              <CardDescription>
                Essential tools for professional players
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 text-4xl font-bold">$99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Icons.tennis className="mr-2 h-4 w-4 text-primary" />
                  <span>Tournament management</span>
                </li>
                <li className="flex items-center">
                  <Icons.tennis className="mr-2 h-4 w-4 text-primary" />
                  <span>Practice court booking</span>
                </li>
                <li className="flex items-center">
                  <Icons.tennis className="mr-2 h-4 w-4 text-primary" />
                  <span>Hitting partner finder</span>
                </li>
                <li className="flex items-center">
                  <Icons.tennis className="mr-2 h-4 w-4 text-primary" />
                  <span>Basic travel booking</span>
                </li>
                <li className="flex items-center">
                  <Icons.tennis className="mr-2 h-4 w-4 text-primary" />
                  <span>Equipment tracking</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link
                href="/auth/register?membership=standard"
                className={buttonVariants({
                  className: "w-full",
                })}
              >
                Get Started
              </Link>
            </CardFooter>
          </Card>

          {/* Premium Tier */}
          <Card className="border-primary">
            <CardHeader className="bg-primary text-primary-foreground">
              <div className="mb-1 text-sm font-medium uppercase tracking-wide">
                Most Popular
              </div>
              <CardTitle>Premium</CardTitle>
              <CardDescription className="text-primary-foreground/90">
                Advanced features for serious competitors
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-4 text-4xl font-bold">$249<span className="text-sm font-normal text-muted-foreground">/month</span></div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Icons.tennis className="mr-2 h-4 w-4 text-primary" />
                  <span>Everything in Standard</span>
                </li>
                <li className="flex items-center">
                  <Icons.premium className="mr-2 h-4 w-4 text-primary" />
                  <span>Concierge service access</span>
                </li>
                <li className="flex items-center">
                  <Icons.premium className="mr-2 h-4 w-4 text-primary" />
                  <span>Priority bookings</span>
                </li>
                <li className="flex items-center">
                  <Icons.premium className="mr-2 h-4 w-4 text-primary" />
                  <span>VIP hotel & jet rates</span>
                </li>
                <li className="flex items-center">
                  <Icons.premium className="mr-2 h-4 w-4 text-primary" />
                  <span>Monthly performance analyst session</span>
                </li>
                <li className="flex items-center">
                  <Icons.premium className="mr-2 h-4 w-4 text-primary" />
                  <span>Secure file vault</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link
                href="/auth/register?membership=premium"
                className={buttonVariants({
                  className: "w-full",
                })}
              >
                Upgrade Now
              </Link>
            </CardFooter>
          </Card>

          {/* Black Tier */}
          <Card className="bg-black text-white">
            <CardHeader>
              <div className="mb-1 text-sm font-medium uppercase tracking-wide text-yellow-500">
                Invite Only
              </div>
              <CardTitle>Black Tier</CardTitle>
              <CardDescription className="text-white/70">
                For top 20 ATP/WTA players
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-4 text-4xl font-bold">Custom</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Icons.tennis className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Everything in Premium</span>
                </li>
                <li className="flex items-center">
                  <Icons.premium className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Personal concierge representative</span>
                </li>
                <li className="flex items-center">
                  <Icons.premium className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Ultra-lux travel with private jet access</span>
                </li>
                <li className="flex items-center">
                  <Icons.premium className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Elite hospitality services</span>
                </li>
                <li className="flex items-center">
                  <Icons.premium className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Match & training intelligence with AI</span>
                </li>
                <li className="flex items-center">
                  <Icons.premium className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Security & privacy features</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link
                href="/auth/register?membership=black"
                className={buttonVariants({
                  variant: "outline",
                  className: "w-full border-yellow-500 text-yellow-500 hover:bg-yellow-500/10",
                })}
              >
                Request Invitation
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container py-16 md:py-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            About TennisPro Portal
          </h2>
          <p className="mt-4 text-muted-foreground">
            The story behind the ultimate tennis management platform
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-2xl font-bold tracking-tight">Our Mission</h3>
              <p className="text-muted-foreground">
                TennisPro Portal (formerly BaselineAgent) was founded in 2014 with a clear mission: to simplify the complex logistics of professional tennis careers. 
                We believe that players should focus on their performance, not paperwork.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-bold tracking-tight">Our Team</h3>
              <p className="text-muted-foreground">
                Our team consists of former professional players, tech experts, and sports management professionals who understand the unique challenges of the tennis world.
                Together, we&apos;ve created a platform that addresses the real needs of today&apos;s tennis professionals.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-bold tracking-tight">Our Approach</h3>
              <p className="text-muted-foreground">
                We take a holistic approach to tennis career management, integrating everything from tournament scheduling to travel logistics and equipment management.
                Our platform is constantly evolving based on player feedback and industry developments.
              </p>
            </div>
          </div>
          
          <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-green-600/20 z-10"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                {/* Tennis Court Background */}
                <div className="absolute inset-0 opacity-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 800 400"
                    width="100%"
                    height="100%"
                    preserveAspectRatio="none"
                    className="text-primary"
                  >
                    {/* Outer court */}
                    <rect
                      x="50"
                      y="50"
                      width="700"
                      height="300"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    
                    {/* Center line */}
                    <line
                      x1="400"
                      y1="50"
                      x2="400"
                      y2="350"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    
                    {/* Service lines */}
                    <line
                      x1="50"
                      y1="150"
                      x2="750"
                      y2="150"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <line
                      x1="50"
                      y1="250"
                      x2="750"
                      y2="250"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    
                    {/* Service boxes */}
                    <line
                      x1="200"
                      y1="150"
                      x2="200"
                      y2="250"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <line
                      x1="600"
                      y1="150"
                      x2="600"
                      y2="250"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    
                    {/* Net */}
                    <line
                      x1="50"
                      y1="200"
                      x2="750"
                      y2="200"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeDasharray="15,10"
                    />
                  </svg>
                </div>
                
                {/* Stats and Figures */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div className="grid grid-cols-2 gap-8 w-full max-w-md">
                    <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                      <div className="text-4xl font-bold text-primary">5000+</div>
                      <div className="text-sm font-medium">Active Players</div>
                    </div>
                    <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                      <div className="text-4xl font-bold text-primary">120+</div>
                      <div className="text-sm font-medium">Countries</div>
                    </div>
                    <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                      <div className="text-4xl font-bold text-primary">98%</div>
                      <div className="text-sm font-medium">Satisfaction</div>
                    </div>
                    <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                      <div className="text-4xl font-bold text-primary">24/7</div>
                      <div className="text-sm font-medium">Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 flex justify-center">
          <div className="inline-flex items-center rounded-full border px-6 py-3 text-sm font-medium">
            <Icons.info className="mr-2 h-4 w-4" />
            <span>Founded by former ATP and WTA professionals</span>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="w-full bg-muted py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full opacity-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 800 800"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              className="text-primary"
            >
              {/* Tennis ball pattern */}
              <circle cx="150" cy="150" r="40" fill="currentColor" />
              <circle cx="350" cy="250" r="40" fill="currentColor" />
              <circle cx="550" cy="150" r="40" fill="currentColor" />
              <circle cx="650" cy="350" r="40" fill="currentColor" />
              <circle cx="450" cy="450" r="40" fill="currentColor" />
              <circle cx="250" cy="550" r="40" fill="currentColor" />
              <circle cx="150" cy="650" r="40" fill="currentColor" />
              <circle cx="350" cy="750" r="40" fill="currentColor" />
              <circle cx="650" cy="650" r="40" fill="currentColor" />
              <circle cx="750" cy="250" r="40" fill="currentColor" />
              
              {/* Tennis racquet outlines */}
              <path
                d="M100,200 a60,30 0 1,0 120,0 a60,30 0 1,0 -120,0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M300,400 a60,30 0 1,0 120,0 a60,30 0 1,0 -120,0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M500,600 a60,30 0 1,0 120,0 a60,30 0 1,0 -120,0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M600,200 a60,30 0 1,0 120,0 a60,30 0 1,0 -120,0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M200,600 a60,30 0 1,0 120,0 a60,30 0 1,0 -120,0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
        
        <div className="container relative z-10">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Get In Touch
            </h2>
            <p className="mt-4 text-muted-foreground">
              Have questions or feedback? We&apos;d love to hear from you
            </p>
          </div>

          {/* Import the ContactForm component */}
          <ContactForm />
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full bg-gradient-to-r from-blue-600 to-green-600 py-16">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Ready to Elevate Your Tennis Career?
          </h2>
          <p className="mx-auto mb-8 max-w-[600px] text-lg text-white/90">
            Join thousands of professional players who trust TennisPro Portal to manage their career and lifestyle.
          </p>
          <Link
            href="/auth/register"
            className={buttonVariants({
              size: "lg",
              className: "bg-white text-black hover:bg-white/90",
            })}
          >
            Start Your Free Trial
          </Link>
          <Link
            href="/auth/login"
            className={buttonVariants({
              size: "lg",
              variant: "outline",
              className: "border-white text-white hover:bg-white/20",
            })}
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-background py-12">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <Icons.logo className="h-6 w-6" />
              <span className="text-lg font-bold">{siteConfig.name}</span>
            </div>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-foreground">
                About Us
              </Link>
              <Link href="#" className="hover:text-foreground">
                Contact
              </Link>
              <Link href="#" className="hover:text-foreground">
                Support
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href={siteConfig.links.instagram}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} TennisPro Portal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
