"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/icons";

import { Tournament, getTournamentById } from "@/lib/mock-data";
import {
  initializeLocalStorage,
  isRegisteredForTournament,
  getUserRegistrationForTournament,
  formatDate,
  formatCurrency,
  daysUntil,
} from "@/lib/tournament-api";

// Tournament status badge variants
const statusVariants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
  "registration_open": { variant: "default", label: "Registration Open" },
  "registration_closed": { variant: "outline", label: "Registration Closed" },
  "upcoming": { variant: "secondary", label: "Upcoming" },
  "ongoing": { variant: "default", label: "Ongoing" },
  "completed": { variant: "outline", label: "Completed" }
};

// Surface badge variants
const surfaceVariants: Record<string, { color: string, label: string }> = {
  "Hard": { color: "bg-blue-100 text-blue-800", label: "Hard" },
  "Clay": { color: "bg-orange-100 text-orange-800", label: "Clay" },
  "Grass": { color: "bg-green-100 text-green-800", label: "Grass" },
  "Carpet": { color: "bg-purple-100 text-purple-800", label: "Carpet" }
};

export default function TournamentDetailsPage({ params }: { params: { tournamentId: string } }) {
  const router = useRouter();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeLocalStorage();
    const tournamentData = getTournamentById(params.tournamentId);
    
    if (tournamentData) {
      setTournament(tournamentData);
      setIsRegistered(isRegisteredForTournament(params.tournamentId));
    }
    
    setLoading(false);
  }, [params.tournamentId]);

  if (loading) {
    return (
      <div className="container flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg font-medium">Loading tournament details...</p>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="container py-10">
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
          <Icons.calendar className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-medium">Tournament not found</h3>
          <p className="mb-6 text-muted-foreground">
            The tournament you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button onClick={() => router.push("/tournaments")}>
            Back to Tournaments
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = statusVariants[tournament.status];
  const surfaceConfig = surfaceVariants[tournament.surface];
  const userRegistration = getUserRegistrationForTournament(tournament.id);
  
  // Calculate days until tournament starts
  const daysToStart = daysUntil(tournament.startDate);
  const daysToDeadline = daysUntil(tournament.registrationDeadline);

  return (
    <div className="container py-10">
      {/* Back button */}
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/tournaments")}
          className="flex items-center gap-1"
        >
          <Icons.calendar className="h-4 w-4" />
          <span>Back to Tournaments</span>
        </Button>
      </div>

      {/* Tournament Hero Section */}
      <div className="relative mb-8 overflow-hidden rounded-lg">
        {/* Banner Image */}
        <div className="relative h-64 w-full">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${tournament.bannerImage || "https://images.unsplash.com/photo-1595819857003-f33f0f52171d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80"})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
          
          {/* Tournament Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={statusConfig.variant} className="text-sm">
                {statusConfig.label}
              </Badge>
              <Badge className={surfaceConfig.color}>
                {surfaceConfig.label}
              </Badge>
              <Badge className="bg-yellow-100 text-yellow-800">
                {tournament.category}
              </Badge>
              {isRegistered && (
                <Badge variant="default" className="bg-green-600">
                  Registered
                </Badge>
              )}
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">{tournament.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/80">
              <div className="flex items-center gap-1">
                <Icons.location className="h-4 w-4" />
                <span>{tournament.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icons.calendar className="h-4 w-4" />
                <span>
                  {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Icons.award className="h-4 w-4" />
                <span>Prize: {formatCurrency(tournament.prize)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icons.stats className="h-4 w-4" />
                <span>Points: {tournament.points}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-8 flex flex-wrap gap-4">
        {tournament.status === "registration_open" && !isRegistered && (
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-blue-800"
            onClick={() => router.push(`/tournaments/${tournament.id}/register`)}
          >
            Register Now
          </Button>
        )}
        
        {isRegistered && (
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/tournaments/my-tournaments")}
          >
            Manage Registration
          </Button>
        )}
        
        <Link href={`/travel-booking?tournament=${tournament.id}`}>
          <Button
            size="lg"
            className="bg-gradient-to-r from-green-600 to-green-800"
          >
            Book Travel
          </Button>
        </Link>
        
        {tournament.website && (
          <Link href={tournament.website} target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="outline">
              Official Website
            </Button>
          </Link>
        )}
      </div>

      {/* Registration Status Card */}
      {tournament.status === "registration_open" && (
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.calendar className="h-5 w-5 text-primary" />
              Registration Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Registration Deadline</p>
                  <p className="font-medium">{formatDate(tournament.registrationDeadline)}</p>
                </div>
                <Badge variant="outline" className="text-sm">
                  {daysToDeadline > 0
                    ? `${daysToDeadline} days remaining`
                    : "Deadline passed"}
                </Badge>
              </div>
              
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Tournament Starts</p>
                  <p className="font-medium">{formatDate(tournament.startDate)}</p>
                </div>
                <Badge variant="outline" className="text-sm">
                  {daysToStart > 0
                    ? `${daysToStart} days until start`
                    : "Tournament started"}
                </Badge>
              </div>
              
              {tournament.entryFee !== undefined && (
                <div>
                  <p className="text-sm text-muted-foreground">Entry Fee</p>
                  <p className="font-medium">
                    {tournament.entryFee > 0
                      ? formatCurrency(tournament.entryFee)
                      : "No entry fee"}
                  </p>
                </div>
              )}
              
              <div>
                <p className="text-sm text-muted-foreground">Draw Size</p>
                <p className="font-medium">{tournament.drawSize} players</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {!isRegistered ? (
              <Button
                className="w-full"
                onClick={() => router.push(`/tournaments/${tournament.id}/register`)}
              >
                Register Now
              </Button>
            ) : (
              <div className="w-full rounded-md bg-green-100 p-3 text-center text-green-800">
                You are registered for this tournament
              </div>
            )}
          </CardFooter>
        </Card>
      )}

      {/* Registration Status for Registered Users */}
      {isRegistered && userRegistration && (
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Icons.tennis className="h-5 w-5" />
              Your Registration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Registration Date</p>
                  <p className="font-medium">{formatDate(userRegistration.registrationDate)}</p>
                </div>
                <Badge className="bg-green-600">{userRegistration.status}</Badge>
              </div>
              
              {userRegistration.entryCategory && (
                <div>
                  <p className="text-sm text-muted-foreground">Entry Category</p>
                  <p className="font-medium">{userRegistration.entryCategory}</p>
                </div>
              )}
              
              {userRegistration.drawPosition && (
                <div>
                  <p className="text-sm text-muted-foreground">Draw Position</p>
                  <p className="font-medium">{userRegistration.drawPosition}</p>
                </div>
              )}
              
              {userRegistration.matchResults && userRegistration.matchResults.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Match Results</p>
                  <div className="space-y-2">
                    {userRegistration.matchResults.map((match, index) => (
                      <div
                        key={index}
                        className="rounded-md border border-green-200 bg-white p-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{match.round}</span>
                          <Badge
                            variant={match.result === "win" ? "default" : "outline"}
                            className={
                              match.result === "win"
                                ? "bg-green-600"
                                : "border-red-300 text-red-600"
                            }
                          >
                            {match.result === "win" ? "Win" : "Loss"}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm">vs. {match.opponent}</p>
                        <p className="text-sm text-muted-foreground">{match.score}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.push("/tournaments/my-tournaments")}
            >
              Manage Registration
            </Button>
            <Link href={`/travel-booking?tournament=${tournament.id}`} className="flex-1">
              <Button className="w-full bg-gradient-to-r from-green-600 to-green-800">
                Book Travel
              </Button>
            </Link>
          </CardFooter>
        </Card>
      )}

      {/* Tournament Details Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="venue">Venue</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-xl font-bold">About the Tournament</h3>
              <p className="text-muted-foreground">{tournament.description}</p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="mb-4 text-xl font-bold">Tournament Details</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Dates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Start Date:</span>
                        <span>{formatDate(tournament.startDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">End Date:</span>
                        <span>{formatDate(tournament.endDate)}</span>
                      </div>
                      {tournament.status === "registration_open" && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Registration Deadline:</span>
                          <span>{formatDate(tournament.registrationDeadline)}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Prize & Points</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Prize Money:</span>
                        <span>{formatCurrency(tournament.prize)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Winner Points:</span>
                        <span>{tournament.points}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Draw Size:</span>
                        <span>{tournament.drawSize} players</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Tournament Info</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span>{tournament.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Surface:</span>
                        <span>{tournament.surface}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={statusConfig.variant}>
                          {statusConfig.label}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Schedule Tab */}
        <TabsContent value="schedule" className="mt-6">
          {tournament.schedule && tournament.schedule.length > 0 ? (
            <div className="space-y-6">
              {tournament.schedule.map((day, dayIndex) => (
                <Card key={dayIndex}>
                  <CardHeader>
                    <CardTitle>{formatDate(day.date)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {day.events.map((event, eventIndex) => (
                        <div
                          key={eventIndex}
                          className="flex flex-col rounded-md border p-4 shadow-sm transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="mb-2 sm:mb-0">
                            <p className="font-medium">{event.round}</p>
                            {event.players && (
                              <p className="text-sm text-muted-foreground">
                                {event.players.join(" vs. ")}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {event.court && (
                              <Badge variant="outline">{event.court}</Badge>
                            )}
                            <Badge variant="secondary">{event.time}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
              <Icons.calendar className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">Schedule not available</h3>
              <p className="text-muted-foreground">
                The tournament schedule has not been published yet.
              </p>
            </div>
          )}
        </TabsContent>
        
        {/* Participants Tab */}
        <TabsContent value="participants" className="mt-6">
          {tournament.participants && tournament.participants.length > 0 ? (
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-4 border-b bg-muted p-4 font-medium">
                <div className="col-span-1">Seed</div>
                <div className="col-span-5">Player</div>
                <div className="col-span-3">Country</div>
                <div className="col-span-3">Ranking</div>
              </div>
              <div className="divide-y">
                {tournament.participants.map((participant, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="col-span-1">
                      {participant.seed ? (
                        <Badge variant="outline">{participant.seed}</Badge>
                      ) : (
                        "-"
                      )}
                    </div>
                    <div className="col-span-5 font-medium">{participant.name}</div>
                    <div className="col-span-3">{participant.country}</div>
                    <div className="col-span-3">{participant.ranking}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
              <Icons.users className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">Participants not available</h3>
              <p className="text-muted-foreground">
                The participant list has not been published yet.
              </p>
            </div>
          )}
        </TabsContent>
        
        {/* Venue Tab */}
        <TabsContent value="venue" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{tournament.venue.name}</CardTitle>
              <CardDescription>{tournament.venue.address}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 font-medium">Facilities</h4>
                  <div className="flex flex-wrap gap-2">
                    {tournament.venue.facilities.map((facility, index) => (
                      <Badge key={index} variant="outline">
                        {facility}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Placeholder for venue image or map */}
                <div className="aspect-video overflow-hidden rounded-md bg-muted">
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">Venue image would be displayed here</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
