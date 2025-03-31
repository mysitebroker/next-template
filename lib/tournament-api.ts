"use client";

import { 
  Tournament, 
  UserTournamentRegistration, 
  getTournamentById, 
  userTournamentRegistrations 
} from "@/lib/mock-data";

// Local storage keys
const USER_REGISTRATIONS_KEY = "user-tournament-registrations";

// Initialize local storage with mock data (only in client-side)
export function initializeLocalStorage() {
  if (typeof window !== "undefined") {
    // Only initialize if not already set
    if (!localStorage.getItem(USER_REGISTRATIONS_KEY)) {
      localStorage.setItem(USER_REGISTRATIONS_KEY, JSON.stringify(userTournamentRegistrations));
    }
  }
}

// Get user registrations from local storage
export function getUserRegistrations(): UserTournamentRegistration[] {
  if (typeof window !== "undefined") {
    const registrations = localStorage.getItem(USER_REGISTRATIONS_KEY);
    return registrations ? JSON.parse(registrations) : [];
  }
  return [];
}

// Get user's registered tournaments
export function getUserTournaments(): Tournament[] {
  const registrations = getUserRegistrations();
  return registrations
    .map(registration => {
      const tournament = getTournamentById(registration.tournamentId);
      return tournament;
    })
    .filter(Boolean) as Tournament[];
}

// Check if user is registered for a tournament
export function isRegisteredForTournament(tournamentId: string): boolean {
  const registrations = getUserRegistrations();
  return registrations.some(registration => registration.tournamentId === tournamentId);
}

// Get user's registration for a specific tournament
export function getUserRegistrationForTournament(tournamentId: string): UserTournamentRegistration | undefined {
  const registrations = getUserRegistrations();
  return registrations.find(registration => registration.tournamentId === tournamentId);
}

// Register for a tournament
export function registerForTournament(
  tournamentId: string,
  entryCategory: string = "Main Draw"
): UserTournamentRegistration {
  if (isRegisteredForTournament(tournamentId)) {
    throw new Error("Already registered for this tournament");
  }

  const tournament = getTournamentById(tournamentId);
  if (!tournament) {
    throw new Error("Tournament not found");
  }

  // Create new registration
  const newRegistration: UserTournamentRegistration = {
    tournamentId,
    registrationDate: new Date().toISOString(),
    status: "confirmed",
    entryCategory,
    drawPosition: Math.floor(Math.random() * tournament.drawSize) + 1
  };

  // Update local storage
  const registrations = getUserRegistrations();
  registrations.push(newRegistration);
  localStorage.setItem(USER_REGISTRATIONS_KEY, JSON.stringify(registrations));

  return newRegistration;
}

// Withdraw from a tournament
export function withdrawFromTournament(tournamentId: string): boolean {
  if (!isRegisteredForTournament(tournamentId)) {
    throw new Error("Not registered for this tournament");
  }

  // Update local storage
  const registrations = getUserRegistrations();
  const updatedRegistrations = registrations.filter(
    registration => registration.tournamentId !== tournamentId
  );
  localStorage.setItem(USER_REGISTRATIONS_KEY, JSON.stringify(updatedRegistrations));

  return true;
}

// Get upcoming tournaments for the user
export function getUpcomingUserTournaments(): Tournament[] {
  const userTournaments = getUserTournaments();
  const now = new Date();
  
  return userTournaments
    .filter(tournament => new Date(tournament.startDate) > now)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
}

// Get next upcoming tournament for the user
export function getNextUpcomingTournament(): Tournament | undefined {
  const upcomingTournaments = getUpcomingUserTournaments();
  return upcomingTournaments.length > 0 ? upcomingTournaments[0] : undefined;
}

// Format date for display
export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Format currency for display
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

// Calculate days until a date
export function daysUntil(dateString: string): number {
  const now = new Date();
  const targetDate = new Date(dateString);
  const diffTime = targetDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
