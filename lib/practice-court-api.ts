"use client";

import { 
  PracticeCourt, 
  PracticeCourtBooking, 
  practiceCourts,
  practiceCourtsBookings,
  getPracticeCourtById,
  getPracticeCourtsByTournamentId,
  getPracticeCourtBookingsByUserId,
  getPracticeCourtBookingsByTournamentId,
  getPracticeCourtBookingsByDate,
  isCourtAvailable,
  Tournament,
  getTournamentById
} from "@/lib/mock-data";

import { addDays, format, parseISO, isWithinInterval } from "date-fns";

// Local storage keys
const PRACTICE_COURT_BOOKINGS_KEY = "practice-court-bookings";

// Initialize local storage with mock data (only in client-side)
export function initializePracticeCourtStorage() {
  if (typeof window !== "undefined") {
    // Only initialize if not already set
    if (!localStorage.getItem(PRACTICE_COURT_BOOKINGS_KEY)) {
      localStorage.setItem(PRACTICE_COURT_BOOKINGS_KEY, JSON.stringify(practiceCourtsBookings));
    }
  }
}

// Get all practice court bookings from local storage
export function getAllPracticeCourtBookings(): PracticeCourtBooking[] {
  if (typeof window !== "undefined") {
    const bookings = localStorage.getItem(PRACTICE_COURT_BOOKINGS_KEY);
    return bookings ? JSON.parse(bookings) : [];
  }
  return [];
}

// Get practice court bookings for a specific user
export function getUserPracticeCourtBookings(userId: string = "user1"): PracticeCourtBooking[] {
  const bookings = getAllPracticeCourtBookings();
  return bookings.filter(booking => booking.userId === userId);
}

// Get practice court bookings for a specific tournament
export function getTournamentPracticeCourtBookings(tournamentId: string): PracticeCourtBooking[] {
  const bookings = getAllPracticeCourtBookings();
  return bookings.filter(booking => booking.tournamentId === tournamentId);
}

// Get practice court bookings for a specific date
export function getDatePracticeCourtBookings(tournamentId: string, date: string): PracticeCourtBooking[] {
  const bookings = getAllPracticeCourtBookings();
  return bookings.filter(booking => booking.tournamentId === tournamentId && booking.date === date);
}

// Get practice court bookings for a specific court
export function getCourtPracticeCourtBookings(courtId: string): PracticeCourtBooking[] {
  const bookings = getAllPracticeCourtBookings();
  return bookings.filter(booking => booking.courtId === courtId);
}

// Check if a court is available at a specific time
export function checkCourtAvailability(courtId: string, date: string, startTime: string, endTime: string): boolean {
  const bookings = getAllPracticeCourtBookings();
  return !bookings.some(booking => 
    booking.courtId === courtId && 
    booking.date === date && 
    booking.status !== "cancelled" &&
    ((startTime >= booking.startTime && startTime < booking.endTime) || 
     (endTime > booking.startTime && endTime <= booking.endTime) ||
     (startTime <= booking.startTime && endTime >= booking.endTime))
  );
}

// Create a new practice court booking
export function createPracticeCourtBooking(
  tournamentId: string,
  courtId: string,
  date: string,
  startTime: string,
  endTime: string,
  userId: string = "user1"
): PracticeCourtBooking {
  // Check if court is available
  if (!checkCourtAvailability(courtId, date, startTime, endTime)) {
    throw new Error("Court is not available at the selected time");
  }

  // Check if tournament exists
  const tournament = getTournamentById(tournamentId);
  if (!tournament) {
    throw new Error("Tournament not found");
  }

  // Check if court exists
  const court = getPracticeCourtById(courtId);
  if (!court) {
    throw new Error("Court not found");
  }

  // Create new booking
  const newBooking: PracticeCourtBooking = {
    id: `pcb${Date.now()}`,
    tournamentId,
    courtId,
    userId,
    date,
    startTime,
    endTime,
    status: "confirmed",
    createdAt: new Date().toISOString()
  };

  // Update local storage
  const bookings = getAllPracticeCourtBookings();
  bookings.push(newBooking);
  localStorage.setItem(PRACTICE_COURT_BOOKINGS_KEY, JSON.stringify(bookings));

  return newBooking;
}

// Cancel a practice court booking
export function cancelPracticeCourtBooking(bookingId: string): boolean {
  const bookings = getAllPracticeCourtBookings();
  const bookingIndex = bookings.findIndex(booking => booking.id === bookingId);
  
  if (bookingIndex === -1) {
    throw new Error("Booking not found");
  }

  // Update booking status
  bookings[bookingIndex].status = "cancelled";
  localStorage.setItem(PRACTICE_COURT_BOOKINGS_KEY, JSON.stringify(bookings));

  return true;
}

// Get upcoming practice court bookings for a user
export function getUpcomingUserPracticeCourtBookings(userId: string = "user1"): PracticeCourtBooking[] {
  const bookings = getUserPracticeCourtBookings(userId);
  const now = new Date();
  
  return bookings
    .filter(booking => {
      const bookingDate = new Date(`${booking.date}T${booking.endTime}`);
      return bookingDate > now && booking.status !== "cancelled";
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime}`);
      const dateB = new Date(`${b.date}T${b.startTime}`);
      return dateA.getTime() - dateB.getTime();
    });
}

// Get tournaments with available practice courts in the next 3 weeks
export function getTournamentsWithPracticeCourts(): Tournament[] {
  const now = new Date();
  const threeWeeksLater = addDays(now, 21);
  
  // Get unique tournament IDs from practice courts
  const uniqueTournamentIds = Array.from(new Set(practiceCourts.map(court => court.tournamentId)));
  
  // Get tournaments for those IDs
  return uniqueTournamentIds
    .map(id => getTournamentById(id))
    .filter((tournament): tournament is Tournament => {
      // Filter out undefined tournaments
      if (!tournament) return false;
      
      // For testing purposes, include all tournaments
      // In a real app, we would filter by date
      return true;
      
      // Check if tournament is within the next 3 weeks
      // Uncomment this for real date filtering
      /*
      const startDate = parseISO(tournament.startDate);
      const endDate = parseISO(tournament.endDate);
      
      return (
        // Tournament starts within the next 3 weeks
        (startDate >= now && startDate <= threeWeeksLater) ||
        // Tournament ends within the next 3 weeks
        (endDate >= now && endDate <= threeWeeksLater) ||
        // Tournament spans the entire 3-week period
        (startDate <= now && endDate >= threeWeeksLater)
      );
      */
    });
}

// Get available time slots for a court on a specific date
export function getAvailableTimeSlots(courtId: string, date: string): { startTime: string, endTime: string }[] {
  const bookings = getCourtPracticeCourtBookings(courtId)
    .filter(booking => booking.date === date && booking.status !== "cancelled")
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
  
  // Define available hours (8:00 AM to 8:00 PM)
  const availableHours = [];
  for (let hour = 8; hour < 20; hour++) {
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
    
    // Check if this time slot is available
    if (checkCourtAvailability(courtId, date, startTime, endTime)) {
      availableHours.push({ startTime, endTime });
    }
  }
  
  return availableHours;
}

// Format date for display
export function formatCourtDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Format time for display
export function formatCourtTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}
