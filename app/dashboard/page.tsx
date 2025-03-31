"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { 
  initializeLocalStorage, 
  getUserTournaments, 
  getNextUpcomingTournament,
  formatDate,
  daysUntil
} from "@/lib/tournament-api"

import {
  initializePracticeCourtStorage,
  getUserPracticeCourtBookings,
  getUpcomingUserPracticeCourtBookings,
  formatCourtDate,
  formatCourtTime
} from "@/lib/practice-court-api"

import {
  getPracticeCourtById,
  getTournamentById
} from "@/lib/mock-data"

// Mock player data
const playerData = {
  name: "Alex Thompson",
  username: "alexthompson",
  email: "alex.thompson@example.com",
  phone: "+1 (555) 123-4567",
  profileImage: "/player-avatar.jpg", // This is a placeholder, we'll use a fallback
  joinDate: "June 15, 2023",
  membership: {
    level: "Premium",
    expiration: "April 30, 2026",
    status: "Active",
    benefits: [
      "Tournament management",
      "Practice court booking",
      "Hitting partner finder",
      "Concierge service access",
      "Priority bookings",
      "VIP hotel & jet rates",
      "Monthly performance analyst session",
      "Secure file vault",
    ],
  },
  stats: {
    currentRank: 87,
    highestRank: 62,
    tournamentsPlayed: 24,
    tournamentsWon: 3,
    matchesPlayed: 142,
    matchesWon: 98,
    winPercentage: 69,
  },
}

// Mock services data
const servicesData = [
  {
    id: 1,
    name: "Tournament Management",
    icon: "calendar",
    status: "Active",
    statusColor: "green",
    progress: 75,
    latestInfo: [], // Will be populated dynamically
  },
  {
    id: 2,
    name: "Practice Court Booking",
    icon: "court",
    status: "Active",
    statusColor: "green",
    progress: 100,
    latestInfo: [
      {
        title: "Next Practice",
        description: "Hard Court - Court 5",
        date: "Tomorrow, 9:00 AM - 11:00 AM",
        status: "Confirmed",
      },
      {
        title: "Upcoming Practice",
        description: "Clay Court - Court 3",
        date: "April 2, 2025, 2:00 PM - 4:00 PM",
        status: "Confirmed",
      },
      {
        title: "Recent Practice",
        description: "Indoor Court - Court 2",
        date: "March 28, 2025, 10:00 AM - 12:00 PM",
        status: "Completed",
      },
    ],
  },
  {
    id: 3,
    name: "Hitting Partner Finder",
    icon: "users",
    status: "Active",
    statusColor: "green",
    progress: 50,
    latestInfo: [
      {
        title: "Upcoming Session",
        description: "Practice with Carlos Rodriguez",
        date: "April 1, 2025, 1:00 PM - 3:00 PM",
        status: "Confirmed",
      },
      {
        title: "Partner Request",
        description: "From Maria Sanchez",
        date: "For April 5, 2025",
        status: "Pending",
      },
      {
        title: "Recent Session",
        description: "Practice with John Smith",
        date: "March 27, 2025",
        status: "Completed",
      },
    ],
  },
  {
    id: 4,
    name: "Racquet Stringing",
    icon: "racquet",
    status: "Active",
    statusColor: "green",
    progress: 90,
    latestInfo: [
      {
        title: "Next Stringing",
        description: "2 Racquets - Babolat RPM Blast 55lbs",
        date: "March 31, 2025",
        status: "Scheduled",
      },
      {
        title: "Racquet Inventory",
        description: "8 Racquets Total - 5 Match Ready",
        date: "Updated March 29, 2025",
        status: "Good",
      },
      {
        title: "Recent Stringing",
        description: "3 Racquets - Luxilon ALU Power 52lbs",
        date: "March 25, 2025",
        status: "Completed",
      },
    ],
  },
  {
    id: 5,
    name: "Travel & Logistics",
    icon: "travel",
    status: "Active",
    statusColor: "green",
    progress: 60,
    latestInfo: [
      {
        title: "Upcoming Flight",
        description: "TennisPro Airways - Miami to Paris",
        date: "May 20, 2025 - June 10, 2025",
        status: "Confirmed",
      },
      {
        title: "Hotel Reservation",
        description: "Roland Garros Suites - Premium Suite",
        date: "May 20, 2025 - June 10, 2025",
        status: "Confirmed",
      },
      {
        title: "New Booking Options",
        description: "Book flights, hotels, and rental cars",
        date: "For upcoming tournaments",
        status: "Available",
      },
    ],
  },
  {
    id: 6,
    name: "Health & Wellness",
    icon: "health",
    status: "Attention Needed",
    statusColor: "amber",
    progress: 30,
    latestInfo: [
      {
        title: "Upcoming Appointment",
        description: "Physiotherapy Session",
        date: "April 2, 2025, 3:00 PM",
        status: "Confirmed",
      },
      {
        title: "Nutrition Plan",
        description: "Tournament Preparation Diet",
        date: "Updated March 20, 2025",
        status: "Review Needed",
      },
      {
        title: "Recovery Metrics",
        description: "Sleep Quality: 85%, Muscle Recovery: 70%",
        date: "Last 7 Days Average",
        status: "Good",
      },
    ],
  },
]

export default function DashboardPage() {
  // Initialize local storage on component mount
  useEffect(() => {
    // Initialize tournament and practice court storage
    initializeLocalStorage();
    initializePracticeCourtStorage();
    
    // Update the Tournament Management card with user's registered tournaments
    const userTournaments = getUserTournaments();
    const nextTournament = getNextUpcomingTournament();
    
    if (userTournaments.length > 0) {
      const tournamentInfo = [];
      
      // Add next upcoming tournament if available
      if (nextTournament) {
        const days = daysUntil(nextTournament.startDate);
        tournamentInfo.push({
          title: "Upcoming Tournament",
          description: `${nextTournament.name} - ${days} days to go`,
          date: `${formatDate(nextTournament.startDate)} - ${formatDate(nextTournament.endDate)}`,
          status: "Confirmed",
        });
      }
      
      // Add other tournaments
      userTournaments.forEach(tournament => {
        // Skip the next tournament as it's already added
        if (nextTournament && tournament.id === nextTournament.id) {
          return;
        }
        
        const now = new Date();
        const startDate = new Date(tournament.startDate);
        const endDate = new Date(tournament.endDate);
        
        if (endDate < now) {
          // Completed tournament
          tournamentInfo.push({
            title: "Recent Result",
            description: `${tournament.name} - Participated`,
            date: `${formatDate(tournament.startDate)} - ${formatDate(tournament.endDate)}`,
            status: "Completed",
          });
        } else if (startDate > now) {
          // Upcoming tournament
          tournamentInfo.push({
            title: "Registered Tournament",
            description: tournament.name,
            date: `${formatDate(tournament.startDate)} - ${formatDate(tournament.endDate)}`,
            status: "Confirmed",
          });
        } else {
          // Ongoing tournament
          tournamentInfo.push({
            title: "Ongoing Tournament",
            description: tournament.name,
            date: `${formatDate(tournament.startDate)} - ${formatDate(tournament.endDate)}`,
            status: "Active",
          });
        }
      });
      
      // Update the services data
      servicesData[0].latestInfo = tournamentInfo.slice(0, 3);
    } else {
      // No registered tournaments
      servicesData[0].latestInfo = [
        {
          title: "No Registered Tournaments",
          description: "Browse available tournaments to register",
          date: "No upcoming events",
          status: "Available",
        }
      ];
    }
    
    // Update the Practice Court Booking card with user's bookings
    const upcomingBookings = getUpcomingUserPracticeCourtBookings();
    
    if (upcomingBookings.length > 0) {
      const practiceInfo: {
        title: string;
        description: string;
        date: string;
        status: string;
      }[] = [];
      
      // Process upcoming bookings
      upcomingBookings.forEach(booking => {
        const court = getPracticeCourtById(booking.courtId);
        const tournament = getTournamentById(booking.tournamentId);
        
        if (court && tournament) {
          const bookingDate = new Date(`${booking.date}T${booking.startTime}`);
          const today = new Date();
          const tomorrow = new Date();
          tomorrow.setDate(today.getDate() + 1);
          
          let dateLabel = formatCourtDate(booking.date);
          
          // If the booking is today or tomorrow, show "Today" or "Tomorrow" instead of the date
          if (bookingDate.toDateString() === today.toDateString()) {
            dateLabel = "Today";
          } else if (bookingDate.toDateString() === tomorrow.toDateString()) {
            dateLabel = "Tomorrow";
          }
          
          practiceInfo.push({
            title: tournament.name,
            description: `${court.surface} - ${court.name}`,
            date: `${dateLabel}, ${formatCourtTime(booking.startTime)} - ${formatCourtTime(booking.endTime)}`,
            status: booking.status,
          });
        }
      });
      
      // Update the services data
      servicesData[1].latestInfo = practiceInfo.slice(0, 3);
    } else {
      // No practice court bookings
      servicesData[1].latestInfo = [
        {
          title: "No Practice Court Bookings",
          description: "Book practice courts for your tournaments",
          date: "No upcoming bookings",
          status: "Available",
        }
      ];
    }
  }, []);
  return (
    <div className="container py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Player Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your tennis career and services
        </p>
      </div>

      {/* Player Profile Section */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Player Info Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">Player Profile</CardTitle>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4 pt-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={playerData.profileImage} alt={playerData.name} />
                <AvatarFallback className="text-2xl">
                  {playerData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1 text-center">
                <h3 className="text-2xl font-bold">{playerData.name}</h3>
                <p className="text-sm text-muted-foreground">@{playerData.username}</p>
              </div>
              <div className="w-full space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Email:</span>
                  <span className="text-sm text-muted-foreground">{playerData.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Phone:</span>
                  <span className="text-sm text-muted-foreground">{playerData.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Member Since:</span>
                  <span className="text-sm text-muted-foreground">{playerData.joinDate}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Membership Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">Membership</CardTitle>
              <Badge
                variant={playerData.membership.status === "Active" ? "default" : "destructive"}
              >
                {playerData.membership.status}
              </Badge>
            </div>
            <CardDescription>
              Your current membership details and benefits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-primary">
                    {playerData.membership.level} Plan
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    Expires: {playerData.membership.expiration}
                  </span>
                </div>
                <Progress value={75} className="h-2" />
              </div>

              <div>
                <h4 className="mb-2 font-medium">Membership Benefits</h4>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {playerData.membership.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Icons.tennis className="h-4 w-4 text-primary" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Manage Membership</Button>
          </CardFooter>
        </Card>
      </div>

      {/* Player Stats Section */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Player Statistics</CardTitle>
            <CardDescription>Your performance metrics and rankings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-7">
              <div className="space-y-1 rounded-lg bg-muted p-3 text-center">
                <h4 className="text-sm font-medium text-muted-foreground">Current Rank</h4>
                <p className="text-2xl font-bold">{playerData.stats.currentRank}</p>
              </div>
              <div className="space-y-1 rounded-lg bg-muted p-3 text-center">
                <h4 className="text-sm font-medium text-muted-foreground">Highest Rank</h4>
                <p className="text-2xl font-bold">{playerData.stats.highestRank}</p>
              </div>
              <div className="space-y-1 rounded-lg bg-muted p-3 text-center">
                <h4 className="text-sm font-medium text-muted-foreground">Tournaments</h4>
                <p className="text-2xl font-bold">{playerData.stats.tournamentsPlayed}</p>
              </div>
              <div className="space-y-1 rounded-lg bg-muted p-3 text-center">
                <h4 className="text-sm font-medium text-muted-foreground">Tournaments Won</h4>
                <p className="text-2xl font-bold">{playerData.stats.tournamentsWon}</p>
              </div>
              <div className="space-y-1 rounded-lg bg-muted p-3 text-center">
                <h4 className="text-sm font-medium text-muted-foreground">Matches Played</h4>
                <p className="text-2xl font-bold">{playerData.stats.matchesPlayed}</p>
              </div>
              <div className="space-y-1 rounded-lg bg-muted p-3 text-center">
                <h4 className="text-sm font-medium text-muted-foreground">Matches Won</h4>
                <p className="text-2xl font-bold">{playerData.stats.matchesWon}</p>
              </div>
              <div className="space-y-1 rounded-lg bg-muted p-3 text-center">
                <h4 className="text-sm font-medium text-muted-foreground">Win Rate</h4>
                <p className="text-2xl font-bold">{playerData.stats.winPercentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Section */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Your Services</h2>
        <p className="text-muted-foreground">
          Manage your enrolled services and their status
        </p>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {servicesData.map((service) => {
          // Get the icon component dynamically
          const IconComponent = Icons[service.icon as keyof typeof Icons];

          return (
            <Card key={service.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-primary/10`}>
                      {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                    </div>
                  </div>
                  <Badge
                    variant={service.status === "Active" ? "default" : "outline"}
                    className={service.status === "Attention Needed" ? "bg-amber-500 hover:bg-amber-600 text-white" : ""}
                  >
                    {service.status}
                  </Badge>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Completion</span>
                    <span>{service.progress}%</span>
                  </div>
                  <Progress value={service.progress} className="h-1" />
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-3">
                  {service.latestInfo.map((info, index) => (
                    <div
                      key={index}
                      className="rounded-md border p-3 shadow-sm transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{info.title}</h4>
                        <Badge
                          variant={
                            info.status === "Confirmed" || info.status === "Completed" || info.status === "Good"
                              ? "default"
                              : info.status === "Pending" || info.status === "Scheduled"
                              ? "secondary"
                              : info.status === "Available"
                              ? "outline"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {info.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm">{info.description}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{info.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                {service.name === "Travel & Logistics" ? (
                  <Link href="/travel-booking" className="w-full">
                    <Button variant="outline" className="w-full">
                      Book Travel
                    </Button>
                  </Link>
                ) : service.name === "Tournament Management" ? (
                  <Link href="/tournaments" className="w-full">
                    <Button variant="outline" className="w-full">
                      Manage Tournaments
                    </Button>
                  </Link>
                ) : service.name === "Practice Court Booking" ? (
                  <Link href="/practice-courts" className="w-full">
                    <Button variant="outline" className="w-full">
                      Book Practice Courts
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" className="w-full">
                    Manage {service.name}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  )
}
