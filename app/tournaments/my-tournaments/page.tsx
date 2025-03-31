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
import { Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";

import { Tournament } from "@/lib/mock-data";
import {
  initializeLocalStorage,
  getUserTournaments,
  getUserRegistrationForTournament,
  withdrawFromTournament,
  formatDate,
  formatCurrency,
  daysUntil,
} from "@/lib/tournament-api";

// Surface badge variants
const surfaceVariants: Record<string, { color: string, label: string }> = {
  "Hard": { color: "bg-blue-100 text-blue-800", label: "Hard" },
  "Clay": { color: "bg-orange-100 text-orange-800", label: "Clay" },
  "Grass": { color: "bg-green-100 text-green-800", label: "Grass" },
  "Carpet": { color: "bg-purple-100 text-purple-800", label: "Carpet" }
};

export default function MyTournamentsPage() {
  const router = useRouter();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [loading, setLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  useEffect(() => {
    initializeLocalStorage();
    loadTournaments();
  }, []);

  const loadTournaments = () => {
    const userTournaments = getUserTournaments();
    setTournaments(userTournaments);
    setLoading(false);
  };

  const handleWithdraw = async (tournamentId: string) => {
    setWithdrawingId(tournamentId);
    try {
      withdrawFromTournament(tournamentId);
      // Reload tournaments after withdrawal
      loadTournaments();
    } catch (error) {
      console.error("Error withdrawing from tournament:", error);
    } finally {
      setWithdrawingId(null);
    }
  };

  // Filter tournaments based on active tab
  const filteredTournaments = tournaments.filter(tournament => {
    const now = new Date();
    const startDate = new Date(tournament.startDate);
    const endDate = new Date(tournament.endDate);
    
    if (activeTab === "upcoming") {
      // Include tournaments with registration_open/upcoming status
      // or future start dates (but not completed status)
      return (tournament.status === "registration_open" || 
              tournament.status === "upcoming" ||
              (startDate > now && tournament.status !== "completed"));
    } else if (activeTab === "ongoing") {
      // Include tournaments with ongoing status
      return tournament.status === "ongoing";
    } else if (activeTab === "completed") {
      // Include tournaments with completed status only
      return tournament.status === "completed";
    }
    return true;
  });

  // Sort tournaments by start date
  filteredTournaments.sort((a, b) => {
    if (activeTab === "upcoming" || activeTab === "ongoing") {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    } else {
      return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
    }
  });

  if (loading) {
    return (
      <div className="container flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg font-medium">Loading your tournaments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Tournaments</h1>
            <p className="text-muted-foreground">
              Manage your tournament registrations and view your results
            </p>
          </div>
          <Button
            onClick={() => router.push("/tournaments")}
            className="flex items-center gap-2"
          >
            <Icons.calendar className="h-4 w-4" />
            <span>Browse Tournaments</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Tournament Cards */}
      {filteredTournaments.length > 0 ? (
        <div className="space-y-6">
          {filteredTournaments.map((tournament) => {
            const registration = getUserRegistrationForTournament(tournament.id);
            const surfaceConfig = surfaceVariants[tournament.surface];
            const daysToStart = daysUntil(tournament.startDate);
            
            return (
              <Card key={tournament.id} className="overflow-hidden">
                <div className="h-2 bg-primary" />
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold">{tournament.name}</h3>
                      <p className="text-muted-foreground">{tournament.location}</p>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Icons.calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icons.award className="h-4 w-4 text-muted-foreground" />
                        <span>Prize: {formatCurrency(tournament.prize)}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <Badge className={surfaceConfig.color}>
                          {surfaceConfig.label}
                        </Badge>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          {tournament.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-l-0 p-6 md:border-l md:border-t-0">
                    <h4 className="mb-3 font-medium">Registration Details</h4>
                    <div className="space-y-2 text-sm">
                      {registration && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge>{registration.status}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Registered on:</span>
                            <span>{formatDate(registration.registrationDate)}</span>
                          </div>
                          {registration.entryCategory && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Entry Category:</span>
                              <span>{registration.entryCategory}</span>
                            </div>
                          )}
                          {registration.drawPosition && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Draw Position:</span>
                              <span>{registration.drawPosition}</span>
                            </div>
                          )}
                        </>
                      )}
                      
                      {activeTab === "upcoming" && daysToStart > 0 && (
                        <div className="mt-4 rounded-md bg-blue-50 p-3 text-blue-800">
                          <div className="flex items-center gap-2">
                            <Icons.calendar className="h-4 w-4" />
                            <span>
                              {daysToStart} {daysToStart === 1 ? "day" : "days"} until tournament
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col border-t border-l-0 p-6 md:border-l md:border-t-0">
                    <div className="mb-4 flex-1">
                      {registration?.matchResults && registration.matchResults.length > 0 ? (
                        <div>
                          <h4 className="mb-2 font-medium">Match Results</h4>
                          <div className="space-y-2">
                            {registration.matchResults.map((match, index) => (
                              <div
                                key={index}
                                className="rounded-md border p-2 text-sm"
                              >
                                <div className="flex items-center justify-between">
                                  <span>{match.round}</span>
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
                                <p className="mt-1">vs. {match.opponent}</p>
                                <p className="text-muted-foreground">{match.score}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex h-full flex-col justify-center">
                          {activeTab === "upcoming" ? (
                            <div className="text-center text-muted-foreground">
                              <Icons.calendar className="mx-auto mb-2 h-8 w-8" />
                              <p>Draw and schedule will be available soon</p>
                            </div>
                          ) : activeTab === "ongoing" ? (
                            <div className="text-center text-muted-foreground">
                              <Icons.tennis className="mx-auto mb-2 h-8 w-8" />
                              <p>No matches played yet</p>
                            </div>
                          ) : (
                            <div className="text-center text-muted-foreground">
                              <Icons.award className="mx-auto mb-2 h-8 w-8" />
                              <p>No match results available</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => router.push(`/tournaments/${tournament.id}`)}
                      >
                        View Details
                      </Button>
                      
                      {activeTab === "upcoming" ? (
                        <Button
                          variant="outline"
                          className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleWithdraw(tournament.id)}
                          disabled={withdrawingId === tournament.id}
                        >
                          {withdrawingId === tournament.id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                          ) : (
                            "Withdraw"
                          )}
                        </Button>
                      ) : (
                        <Link
                          href={`/travel-booking?tournament=${tournament.id}`}
                          className="flex-1"
                        >
                          <Button className="w-full bg-gradient-to-r from-green-600 to-green-800">
                            Book Travel
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
          <Icons.calendar className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-medium">No tournaments found</h3>
          <p className="mb-6 text-muted-foreground">
            {activeTab === "upcoming"
              ? "You don't have any upcoming tournaments."
              : activeTab === "ongoing"
              ? "You don't have any ongoing tournaments."
              : "You don't have any completed tournaments."}
          </p>
          <Button onClick={() => router.push("/tournaments")}>
            Browse Tournaments
          </Button>
        </div>
      )}
    </div>
  );
}
