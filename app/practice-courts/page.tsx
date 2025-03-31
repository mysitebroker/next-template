"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, addDays, parseISO, isBefore, isAfter, isSameDay } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Tournament,
  PracticeCourt,
  PracticeCourtBooking,
  getTournamentById,
  getPracticeCourtById,
  getPracticeCourtsByTournamentId,
} from "@/lib/mock-data";

import {
  initializePracticeCourtStorage,
  getTournamentsWithPracticeCourts,
  getDatePracticeCourtBookings,
  getUserPracticeCourtBookings,
  getAvailableTimeSlots,
  createPracticeCourtBooking,
  cancelPracticeCourtBooking,
  formatCourtDate,
  formatCourtTime,
} from "@/lib/practice-court-api";

// Surface badge variants
const surfaceVariants: Record<string, { color: string, label: string }> = {
  "Hard": { color: "bg-blue-100 text-blue-800", label: "Hard" },
  "Clay": { color: "bg-orange-100 text-orange-800", label: "Clay" },
  "Grass": { color: "bg-green-100 text-green-800", label: "Grass" },
  "Carpet": { color: "bg-purple-100 text-purple-800", label: "Carpet" }
};

export default function PracticeCourtsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [courts, setCourts] = useState<PracticeCourt[]>([]);
  const [bookings, setBookings] = useState<PracticeCourtBooking[]>([]);
  const [userBookings, setUserBookings] = useState<PracticeCourtBooking[]>([]);
  const [selectedCourt, setSelectedCourt] = useState<PracticeCourt | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ startTime: string, endTime: string } | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<{ startTime: string, endTime: string }[]>([]);
  const [activeTab, setActiveTab] = useState("book");
  const [filterSurface, setFilterSurface] = useState<string | null>(null);
  const [filterIndoor, setFilterIndoor] = useState<boolean | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Initialize data on component mount
  useEffect(() => {
    initializePracticeCourtStorage();
    loadTournaments();
  }, []);

  // Load tournaments with practice courts
  const loadTournaments = () => {
    try {
      const availableTournaments = getTournamentsWithPracticeCourts();
      setTournaments(availableTournaments);
      
      // If there are tournaments, select the first one by default
      if (availableTournaments.length > 0) {
        handleTournamentChange(availableTournaments[0].id);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error loading tournaments:", error);
      setLoading(false);
    }
  };

  // Handle tournament selection change
  const handleTournamentChange = (tournamentId: string) => {
    const tournament = getTournamentById(tournamentId);
    if (tournament) {
      setSelectedTournament(tournament);
      
      // Set default date to tournament start date if it's in the future, otherwise today
      const startDate = new Date(tournament.startDate);
      const today = new Date();
      const defaultDate = isBefore(today, startDate) ? startDate : today;
      setSelectedDate(defaultDate);
      
      // Load courts for this tournament
      const tournamentCourts = getPracticeCourtsByTournamentId(tournamentId);
      setCourts(tournamentCourts);
      
      // Reset selections
      setSelectedCourt(null);
      setSelectedTimeSlot(null);
      setFilterSurface(null);
      setFilterIndoor(null);
      
      // Load user bookings for this tournament
      loadUserBookings();
    }
  };

  // Handle date selection change
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setSelectedCourt(null);
      setSelectedTimeSlot(null);
    }
  };

  // Handle court selection
  const handleCourtSelect = (court: PracticeCourt) => {
    setSelectedCourt(court);
    setSelectedTimeSlot(null);
    
    // Load available time slots for this court on the selected date
    if (selectedDate) {
      const dateString = format(selectedDate, "yyyy-MM-dd");
      const slots = getAvailableTimeSlots(court.id, dateString);
      setAvailableTimeSlots(slots);
    }
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (slot: { startTime: string, endTime: string }) => {
    setSelectedTimeSlot(slot);
  };

  // Load user bookings
  const loadUserBookings = () => {
    const userBookings = getUserPracticeCourtBookings();
    setUserBookings(userBookings);
  };

  // Handle booking creation
  const handleCreateBooking = () => {
    if (!selectedTournament || !selectedDate || !selectedCourt || !selectedTimeSlot) {
      setBookingError("Please select all required fields");
      return;
    }
    
    try {
      const dateString = format(selectedDate, "yyyy-MM-dd");
      createPracticeCourtBooking(
        selectedTournament.id,
        selectedCourt.id,
        dateString,
        selectedTimeSlot.startTime,
        selectedTimeSlot.endTime
      );
      
      // Show success message
      setBookingSuccess(true);
      setBookingError(null);
      
      // Reset selections
      setSelectedCourt(null);
      setSelectedTimeSlot(null);
      
      // Reload user bookings
      loadUserBookings();
      
      // Switch to My Bookings tab
      setActiveTab("bookings");
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setBookingSuccess(false);
      }, 3000);
    } catch (error) {
      if (error instanceof Error) {
        setBookingError(error.message);
      } else {
        setBookingError("An error occurred while creating the booking");
      }
      setBookingSuccess(false);
    }
  };

  // Handle booking cancellation
  const handleCancelBooking = (bookingId: string) => {
    try {
      cancelPracticeCourtBooking(bookingId);
      
      // Reload user bookings
      loadUserBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  // Filter courts based on selected filters
  const filteredCourts = courts.filter(court => {
    if (filterSurface && court.surface !== filterSurface) {
      return false;
    }
    if (filterIndoor !== null && court.isIndoor !== filterIndoor) {
      return false;
    }
    return true;
  });

  // Get court bookings for the selected date
  useEffect(() => {
    if (selectedTournament && selectedDate) {
      const dateString = format(selectedDate, "yyyy-MM-dd");
      const dateBookings = getDatePracticeCourtBookings(selectedTournament.id, dateString);
      setBookings(dateBookings);
    }
  }, [selectedTournament, selectedDate]);

  // Disable dates outside tournament period
  const isDateDisabled = (date: Date) => {
    if (!selectedTournament) return true;
    
    const tournamentStart = parseISO(selectedTournament.startDate);
    const tournamentEnd = parseISO(selectedTournament.endDate);
    
    // Disable dates before tournament start or after tournament end
    return isBefore(date, tournamentStart) || isAfter(date, tournamentEnd);
  };

  // Get booking for a specific court and time slot
  const getBookingForTimeSlot = (courtId: string, startTime: string, endTime: string) => {
    if (!selectedDate) return null;
    
    const dateString = format(selectedDate, "yyyy-MM-dd");
    return bookings.find(booking => 
      booking.courtId === courtId && 
      booking.date === dateString &&
      booking.startTime === startTime &&
      booking.endTime === endTime &&
      booking.status !== "cancelled"
    );
  };

  // Check if a time slot is booked by the current user
  const isUserBooking = (courtId: string, startTime: string, endTime: string) => {
    if (!selectedDate) return false;
    
    const dateString = format(selectedDate, "yyyy-MM-dd");
    return userBookings.some(booking => 
      booking.courtId === courtId && 
      booking.date === dateString &&
      booking.startTime === startTime &&
      booking.endTime === endTime &&
      booking.status !== "cancelled"
    );
  };

  // Get court name by ID
  const getCourtName = (courtId: string) => {
    const court = getPracticeCourtById(courtId);
    return court ? court.name : "Unknown Court";
  };

  // Get tournament name by ID
  const getTournamentName = (tournamentId: string) => {
    const tournament = getTournamentById(tournamentId);
    return tournament ? tournament.name : "Unknown Tournament";
  };

  if (loading) {
    return (
      <div className="container flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg font-medium">Loading practice courts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      {/* Page Header with Gradient Background */}
      <div className="relative mb-8 overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAwIDEwMG0tOTAgMGE5MCA5MCAwIDEgMCAxODAgMCA5MCA5MCAwIDEgMC0xODAgMHoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTEwMCAxMDBtLTUwIDBhNTAgNTAgMCAxIDAgMTAwIDAgNTAgNTAgMCAxIDAtMTAwIDB6IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xMDAgMTAwbS0yNSAwYTI1IDI1IDAgMSAwIDUwIDAgMjUgMjUgMCAxIDAtNTAgMHoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+PC9zdmc+')] bg-repeat" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight">Practice Court Booking</h1>
          <p className="max-w-2xl text-white/90">
            Book practice courts for your upcoming tournaments. Select a tournament, date, and court to reserve your practice time.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Tournament and Date Selection */}
        <div className="space-y-6 lg:col-span-1">
          {/* Tournament Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.calendar className="h-5 w-5 text-primary" />
                Tournament Selection
              </CardTitle>
              <CardDescription>
                Select a tournament to book practice courts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tournaments.length > 0 ? (
                <Select
                  value={selectedTournament?.id}
                  onValueChange={handleTournamentChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tournament" />
                  </SelectTrigger>
                  <SelectContent>
                    {tournaments.map((tournament) => (
                      <SelectItem key={tournament.id} value={tournament.id}>
                        {tournament.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="rounded-md bg-muted p-4 text-center text-muted-foreground">
                  No tournaments with practice courts available in the next 3 weeks
                </div>
              )}

              {selectedTournament && (
                <div className="mt-4 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={surfaceVariants[selectedTournament.surface].color}>
                      {surfaceVariants[selectedTournament.surface].label}
                    </Badge>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {selectedTournament.category}
                    </Badge>
                  </div>
                  <div className="text-sm">
                    <div className="flex items-center gap-2">
                      <Icons.location className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedTournament.location}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Icons.calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {format(new Date(selectedTournament.startDate), "MMM d, yyyy")} - {format(new Date(selectedTournament.endDate), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Date Selection */}
          {selectedTournament && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.calendar className="h-5 w-5 text-primary" />
                  Date Selection
                </CardTitle>
                <CardDescription>
                  Select a date during the tournament period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateChange}
                  disabled={isDateDisabled}
                  className="rounded-md border"
                  defaultMonth={selectedDate}
                />
                {selectedDate && (
                  <div className="mt-4 rounded-md bg-blue-50 p-3 text-blue-800">
                    <div className="flex items-center gap-2">
                      <Icons.calendar className="h-4 w-4" />
                      <span>
                        Selected date: {format(selectedDate, "EEEE, MMMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* My Bookings (Mobile View) */}
          <div className="lg:hidden">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.court className="h-5 w-5 text-primary" />
                  My Practice Court Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userBookings.length > 0 ? (
                  <div className="space-y-3">
                    {userBookings
                      .filter(booking => booking.status !== "cancelled")
                      .sort((a, b) => {
                        const dateA = new Date(`${a.date}T${a.startTime}`);
                        const dateB = new Date(`${b.date}T${b.startTime}`);
                        return dateA.getTime() - dateB.getTime();
                      })
                      .slice(0, 3)
                      .map((booking) => (
                        <div
                          key={booking.id}
                          className="rounded-md border p-3 shadow-sm"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{getCourtName(booking.courtId)}</h4>
                            <Badge>
                              {booking.status}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm">{getTournamentName(booking.tournamentId)}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {formatCourtDate(booking.date)} • {formatCourtTime(booking.startTime)} - {formatCourtTime(booking.endTime)}
                          </p>
                        </div>
                      ))}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setActiveTab("bookings")}
                    >
                      View All Bookings
                    </Button>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Icons.calendar className="mx-auto mb-2 h-8 w-8" />
                    <p>You don&apos;t have any practice court bookings</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Court Selection and Booking */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="book" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="book">Book a Court</TabsTrigger>
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            </TabsList>
            
            {/* Book a Court Tab */}
            <TabsContent value="book" className="space-y-6">
              {/* Success/Error Messages */}
              {bookingSuccess && (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  <Icons.tennis className="h-4 w-4" />
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>
                    Your practice court has been booked successfully.
                  </AlertDescription>
                </Alert>
              )}
              
              {bookingError && (
                <Alert className="bg-red-50 text-red-800 border-red-200">
                  <Icons.info className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {bookingError}
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Court Filters */}
              {selectedTournament && selectedDate && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icons.court className="h-5 w-5 text-primary" />
                      Court Filters
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4">
                      <div className="w-full sm:w-auto">
                        <Select
                          value={filterSurface || "all_surfaces"}
                          onValueChange={(value) => setFilterSurface(value === "all_surfaces" ? null : value)}
                        >
                          <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Surface Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all_surfaces">All Surfaces</SelectItem>
                            {Array.from(new Set(courts.map(court => court.surface))).map(surface => (
                              <SelectItem key={surface} value={surface}>
                                {surface}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="w-full sm:w-auto">
                        <Select
                          value={filterIndoor !== null ? filterIndoor.toString() : "all_courts"}
                          onValueChange={(value) => {
                            if (value === "all_courts") {
                              setFilterIndoor(null);
                            } else {
                              setFilterIndoor(value === "true");
                            }
                          }}
                        >
                          <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Indoor/Outdoor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all_courts">All Courts</SelectItem>
                            <SelectItem value="true">Indoor Only</SelectItem>
                            <SelectItem value="false">Outdoor Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Court Selection */}
              {selectedTournament && selectedDate && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icons.court className="h-5 w-5 text-primary" />
                      Available Courts
                    </CardTitle>
                    <CardDescription>
                      Select a court to view available time slots
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {filteredCourts.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {filteredCourts.map((court) => (
                          <div
                            key={court.id}
                            className={`cursor-pointer rounded-md border p-4 transition-colors hover:bg-muted/50 ${
                              selectedCourt?.id === court.id ? "border-primary bg-primary/5" : ""
                            }`}
                            onClick={() => handleCourtSelect(court)}
                          >
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{court.name}</h3>
                              <Badge className={surfaceVariants[court.surface].color}>
                                {court.surface}
                              </Badge>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{court.location}</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <Badge variant="outline">
                                {court.isIndoor ? "Indoor" : "Outdoor"}
                              </Badge>
                              {court.amenities.slice(0, 2).map((amenity, index) => (
                                <Badge key={index} variant="outline">
                                  {amenity}
                                </Badge>
                              ))}
                              {court.amenities.length > 2 && (
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Badge variant="outline" className="cursor-pointer">
                                      +{court.amenities.length - 2} more
                                    </Badge>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-[200px] p-0">
                                    <div className="p-2">
                                      <h4 className="mb-2 font-medium">All Amenities</h4>
                                      <div className="space-y-1">
                                        {court.amenities.map((amenity, index) => (
                                          <div key={index} className="text-sm">
                                            • {amenity}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-md bg-muted p-4 text-center text-muted-foreground">
                        No courts available with the selected filters
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {/* Time Slot Selection */}
              {selectedCourt && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icons.clock className="h-5 w-5 text-primary" />
                      Available Time Slots
                    </CardTitle>
                    <CardDescription>
                      Select a time slot to book {selectedCourt.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                      {/* Generate time slots from 8 AM to 8 PM */}
                      {Array.from({ length: 12 }, (_, i) => {
                        const hour = i + 8;
                        const startTime = `${hour.toString().padStart(2, '0')}:00`;
                        const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
                        
                        const isBooked = getBookingForTimeSlot(selectedCourt.id, startTime, endTime);
                        const isUserSlot = isUserBooking(selectedCourt.id, startTime, endTime);
                        
                        return (
                          <div
                            key={startTime}
                            className={`cursor-pointer rounded-md border p-3 text-center transition-colors ${
                              isBooked
                                ? isUserSlot
                                  ? "border-green-300 bg-green-50"
                                  : "border-red-300 bg-red-50 opacity-60"
                                : selectedTimeSlot?.startTime === startTime
                                ? "border-primary bg-primary/5"
                                : "hover:bg-muted/50"
                            }`}
                            onClick={() => {
                              if (!isBooked) {
                                handleTimeSlotSelect({ startTime, endTime });
                              }
                            }}
                          >
                            <div className="font-medium">
                              {formatCourtTime(startTime)} - {formatCourtTime(endTime)}
                            </div>
                            {isBooked ? (
                              isUserSlot ? (
                                <Badge className="mt-1 bg-green-600">Your Booking</Badge>
                              ) : (
                                <Badge variant="outline" className="mt-1 border-red-300 text-red-600">
                                  Booked
                                </Badge>
                              )
                            ) : (
                              <Badge variant="outline" className="mt-1">
                                Available
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Booking Summary */}
              {selectedCourt && selectedTimeSlot && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icons.tennis className="h-5 w-5 text-primary" />
                      Booking Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-md bg-muted p-4">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <p className="text-sm text-muted-foreground">Tournament</p>
                            <p className="font-medium">{selectedTournament?.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Date</p>
                            <p className="font-medium">
                              {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Court</p>
                            <p className="font-medium">{selectedCourt.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Time</p>
                            <p className="font-medium">
                              {formatCourtTime(selectedTimeSlot.startTime)} - {formatCourtTime(selectedTimeSlot.endTime)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Surface</p>
                            <p className="font-medium">{selectedCourt.surface}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Location</p>
                            <p className="font-medium">{selectedCourt.location}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-800"
                      onClick={handleCreateBooking}
                    >
                      Confirm Booking
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>
            
            {/* My Bookings Tab */}
            <TabsContent value="bookings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icons.court className="h-5 w-5 text-primary" />
                    My Practice Court Bookings
                  </CardTitle>
                  <CardDescription>
                    Manage your practice court bookings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userBookings.length > 0 ? (
                    <div className="space-y-4">
                      {userBookings
                        .filter(booking => booking.status !== "cancelled")
                        .sort((a, b) => {
                          const dateA = new Date(`${a.date}T${a.startTime}`);
                          const dateB = new Date(`${b.date}T${b.startTime}`);
                          return dateA.getTime() - dateB.getTime();
                        })
                        .map((booking) => {
                          const court = getPracticeCourtById(booking.courtId);
                          const tournament = getTournamentById(booking.tournamentId);
                          
                          return (
                            <div
                              key={booking.id}
                              className="rounded-md border p-4 shadow-sm"
                            >
                              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-medium">{court ? court.name : "Unknown Court"}</h3>
                                    <Badge>
                                      {booking.status}
                                    </Badge>
                                  </div>
                                  <p className="mt-1 text-sm">{tournament ? tournament.name : "Unknown Tournament"}</p>
                                  <p className="mt-1 text-sm text-muted-foreground">
                                    {formatCourtDate(booking.date)} • {formatCourtTime(booking.startTime)} - {formatCourtTime(booking.endTime)}
                                  </p>
                                  {court && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      <Badge className={surfaceVariants[court.surface].color}>
                                        {court.surface}
                                      </Badge>
                                      <Badge variant="outline">
                                        {court.isIndoor ? "Indoor" : "Outdoor"}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      if (tournament) {
                                        router.push(`/tournaments/${tournament.id}`);
                                      }
                                    }}
                                  >
                                    Tournament Details
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                    onClick={() => handleCancelBooking(booking.id)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
                      <Icons.calendar className="mb-4 h-12 w-12 text-muted-foreground" />
                      <h3 className="mb-2 text-lg font-medium">No bookings found</h3>
                      <p className="mb-6 text-muted-foreground">
                        You don&apos;t have any practice court bookings yet.
                      </p>
                      <Button onClick={() => setActiveTab("book")}>
                        Book a Practice Court
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
