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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "@/components/icons";

import { Tournament, tournaments } from "@/lib/mock-data";
import { 
  initializeLocalStorage, 
  isRegisteredForTournament, 
  formatDate, 
  formatCurrency 
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

// Category badge variants
const categoryVariants: Record<string, { color: string }> = {
  "Grand Slam": { color: "bg-yellow-100 text-yellow-800" },
  "ATP Masters 1000": { color: "bg-purple-100 text-purple-800" },
  "ATP 500": { color: "bg-blue-100 text-blue-800" },
  "ATP 250": { color: "bg-green-100 text-green-800" },
  "WTA 1000": { color: "bg-pink-100 text-pink-800" },
  "WTA 500": { color: "bg-indigo-100 text-indigo-800" },
  "WTA 250": { color: "bg-teal-100 text-teal-800" }
};

export default function TournamentsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSurface, setFilterSurface] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>(tournaments);
  const [activeTab, setActiveTab] = useState("all");

  // Initialize local storage on component mount
  useEffect(() => {
    initializeLocalStorage();
  }, []);

  // Filter and sort tournaments
  useEffect(() => {
    let filtered = [...tournaments];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        tournament =>
          tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tournament.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply surface filter
    if (filterSurface) {
      filtered = filtered.filter(tournament => tournament.surface === filterSurface);
    }

    // Apply category filter
    if (filterCategory) {
      filtered = filtered.filter(tournament => tournament.category === filterCategory);
    }

    // Apply status filter
    if (filterStatus) {
      filtered = filtered.filter(tournament => tournament.status === filterStatus);
    }

    // Apply tab filter
    if (activeTab === "upcoming") {
      filtered = filtered.filter(
        tournament => 
          tournament.status === "upcoming" || 
          tournament.status === "registration_open"
      );
    } else if (activeTab === "ongoing") {
      filtered = filtered.filter(tournament => tournament.status === "ongoing");
    } else if (activeTab === "completed") {
      filtered = filtered.filter(tournament => tournament.status === "completed");
    }

    // Sort tournaments
    if (sortBy === "date") {
      filtered.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    } else if (sortBy === "prize") {
      filtered.sort((a, b) => b.prize - a.prize);
    } else if (sortBy === "points") {
      filtered.sort((a, b) => b.points - a.points);
    }

    setFilteredTournaments(filtered);
  }, [searchTerm, filterSurface, filterCategory, filterStatus, sortBy, activeTab]);

  // Get unique surfaces for filter
  const surfaces = Array.from(new Set(tournaments.map(t => t.surface)));
  
  // Get unique categories for filter
  const categories = Array.from(new Set(tournaments.map(t => t.category)));

  return (
    <div className="container py-10">
      {/* Page Header with Gradient Background */}
      <div className="relative mb-8 rounded-lg bg-gradient-to-r from-blue-600 to-green-600 p-8 text-white">
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
          {/* Background pattern/illustration */}
          <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAwIDEwMG0tOTAgMGE5MCA5MCAwIDEgMCAxODAgMCA5MCA5MCAwIDEgMC0xODAgMHoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTEwMCAxMDBtLTUwIDBhNTAgNTAgMCAxIDAgMTAwIDAgNTAgNTAgMCAxIDAtMTAwIDB6IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xMDAgMTAwbS0yNSAwYTI1IDI1IDAgMSAwIDUwIDAgMjUgMjUgMCAxIDAtNTAgMHoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+PC9zdmc+')] bg-repeat" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight">Tournament Management</h1>
          <p className="max-w-2xl text-white/90">
            Browse, register, and manage your tennis tournaments. View upcoming events, track your performance, and plan your competition schedule.
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <Input
              placeholder="Search tournaments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex flex-1 gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="prize">Sort by Prize Money</SelectItem>
                <SelectItem value="points">Sort by Points</SelectItem>
              </SelectContent>
            </Select>

            <Link href="/tournaments/my-tournaments">
              <Button variant="outline" className="whitespace-nowrap">
                My Tournaments
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={filterSurface} onValueChange={setFilterSurface}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Surface" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_surfaces">All Surfaces</SelectItem>
              {surfaces.map((surface) => (
                <SelectItem key={surface} value={surface}>
                  {surface}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_categories">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_statuses">All Statuses</SelectItem>
              <SelectItem value="registration_open">Registration Open</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Tournaments</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Tournament Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTournaments.map((tournament) => {
          const isRegistered = isRegisteredForTournament(tournament.id);
          const statusConfig = statusVariants[tournament.status];
          const surfaceConfig = surfaceVariants[tournament.surface];
          const categoryConfig = categoryVariants[tournament.category];

          return (
            <Card key={tournament.id} className="flex flex-col overflow-hidden">
              <div className="h-2 bg-primary" />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{tournament.name}</CardTitle>
                  <Badge variant={statusConfig.variant}>
                    {statusConfig.label}
                  </Badge>
                </div>
                <CardDescription>{tournament.location}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={surfaceConfig.color}>
                      {surfaceConfig.label}
                    </Badge>
                    <Badge className={categoryConfig.color}>
                      {tournament.category}
                    </Badge>
                    {isRegistered && (
                      <Badge variant="default" className="bg-green-600">
                        Registered
                      </Badge>
                    )}
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
                      <span>Prize Money: {formatCurrency(tournament.prize)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icons.stats className="h-4 w-4 text-muted-foreground" />
                      <span>Points: {tournament.points}</span>
                    </div>
                    {tournament.status === "registration_open" && (
                      <div className="flex items-center gap-2">
                        <Icons.clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Registration Deadline: {formatDate(tournament.registrationDeadline)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push(`/tournaments/${tournament.id}`)}
                >
                  View Details
                </Button>
                {tournament.status === "registration_open" && !isRegistered && (
                  <Button
                    className="flex-1"
                    onClick={() => router.push(`/tournaments/${tournament.id}/register`)}
                  >
                    Register
                  </Button>
                )}
                {isRegistered && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push(`/tournaments/my-tournaments`)}
                  >
                    Manage
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredTournaments.length === 0 && (
        <div className="mt-10 flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
          <Icons.calendar className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-medium">No tournaments found</h3>
          <p className="mb-6 text-muted-foreground">
            Try adjusting your filters or search terms to find tournaments.
          </p>
          <Button onClick={() => {
            setSearchTerm("");
            setFilterSurface("");
            setFilterCategory("");
            setFilterStatus("");
            setActiveTab("all");
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
