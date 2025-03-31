// Mock data for the TennisPro Portal application

// Tournament data
export interface Tournament {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  category: string;
  surface: string;
  prize: number;
  points: number;
  registrationDeadline: string;
  status: "upcoming" | "ongoing" | "completed" | "registration_open" | "registration_closed";
  description: string;
  venue: {
    name: string;
    address: string;
    facilities: string[];
  };
  drawSize: number;
  entryFee?: number;
  website?: string;
  logo?: string;
  bannerImage?: string;
  schedule?: TournamentSchedule[];
  participants?: Participant[];
}

export interface TournamentSchedule {
  date: string;
  events: {
    time: string;
    round: string;
    court?: string;
    players?: string[];
  }[];
}

export interface Participant {
  id: string;
  name: string;
  country: string;
  ranking: number;
  seed?: number;
}

// User tournament registration
export interface UserTournamentRegistration {
  tournamentId: string;
  registrationDate: string;
  status: "confirmed" | "pending" | "waitlisted";
  entryCategory?: string;
  drawPosition?: number;
  matchResults?: {
    round: string;
    opponent: string;
    score: string;
    result: "win" | "loss";
  }[];
}

// Mock tournaments data
export const tournaments: Tournament[] = [
  {
    id: "t1",
    name: "Australian Open",
    location: "Melbourne, Australia",
    startDate: "2026-01-18",
    endDate: "2026-01-31",
    category: "Grand Slam",
    surface: "Hard",
    prize: 75000000,
    points: 2000,
    registrationDeadline: "2025-12-15",
    status: "registration_open",
    description: "The Australian Open is the first of the four Grand Slam tennis tournaments held each year. The tournament features men's and women's singles; men's, women's, and mixed doubles; junior's championships; and wheelchair, legends, and exhibition events.",
    venue: {
      name: "Melbourne Park",
      address: "Olympic Blvd, Melbourne VIC 3001, Australia",
      facilities: ["Indoor courts", "Outdoor courts", "Player lounge", "Gym", "Medical facilities", "Restaurant"]
    },
    drawSize: 128,
    entryFee: 0,
    website: "https://ausopen.com",
    logo: "/tournaments/australian-open-logo.png",
    bannerImage: "https://images.unsplash.com/photo-1529926706528-db9e5010cd3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
    participants: [
      { id: "p1", name: "Novak Djokovic", country: "Serbia", ranking: 1, seed: 1 },
      { id: "p2", name: "Carlos Alcaraz", country: "Spain", ranking: 2, seed: 2 },
      { id: "p3", name: "Jannik Sinner", country: "Italy", ranking: 3, seed: 3 },
      { id: "p4", name: "Alexander Zverev", country: "Germany", ranking: 4, seed: 4 },
      { id: "p5", name: "Daniil Medvedev", country: "Russia", ranking: 5, seed: 5 }
    ],
    schedule: [
      {
        date: "2026-01-18",
        events: [
          { time: "11:00", round: "First Round", court: "Rod Laver Arena" },
          { time: "13:00", round: "First Round", court: "Margaret Court Arena" },
          { time: "15:00", round: "First Round", court: "John Cain Arena" }
        ]
      },
      {
        date: "2026-01-19",
        events: [
          { time: "11:00", round: "First Round", court: "Rod Laver Arena" },
          { time: "13:00", round: "First Round", court: "Margaret Court Arena" },
          { time: "15:00", round: "First Round", court: "John Cain Arena" }
        ]
      }
    ]
  },
  {
    id: "t2",
    name: "Roland Garros",
    location: "Paris, France",
    startDate: "2025-05-25",
    endDate: "2025-06-08",
    category: "Grand Slam",
    surface: "Clay",
    prize: 50000000,
    points: 2000,
    registrationDeadline: "2025-04-20",
    status: "registration_open",
    description: "The French Open, also known as Roland Garros, is a major tennis tournament held over two weeks at the Stade Roland Garros in Paris, France. It is the premier clay court tennis championship event in the world and the second of the four annual Grand Slam tournaments.",
    venue: {
      name: "Stade Roland Garros",
      address: "2 Avenue Gordon Bennett, 75016 Paris, France",
      facilities: ["Clay courts", "Player lounge", "Gym", "Medical facilities", "Restaurant"]
    },
    drawSize: 128,
    entryFee: 0,
    website: "https://www.rolandgarros.com",
    logo: "/tournaments/roland-garros-logo.png",
    bannerImage: "https://images.unsplash.com/photo-1622279488067-a1cd992c4fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
    participants: [
      { id: "p1", name: "Novak Djokovic", country: "Serbia", ranking: 1, seed: 1 },
      { id: "p2", name: "Carlos Alcaraz", country: "Spain", ranking: 2, seed: 2 },
      { id: "p3", name: "Jannik Sinner", country: "Italy", ranking: 3, seed: 3 },
      { id: "p4", name: "Alexander Zverev", country: "Germany", ranking: 4, seed: 4 },
      { id: "p5", name: "Daniil Medvedev", country: "Russia", ranking: 5, seed: 5 }
    ]
  },
  {
    id: "t3",
    name: "Wimbledon",
    location: "London, UK",
    startDate: "2025-06-30",
    endDate: "2025-07-13",
    category: "Grand Slam",
    surface: "Grass",
    prize: 60000000,
    points: 2000,
    registrationDeadline: "2025-05-25",
    status: "upcoming",
    description: "The Championships, Wimbledon, is the oldest tennis tournament in the world and is widely regarded as the most prestigious. It has been held at the All England Club in Wimbledon, London, since 1877.",
    venue: {
      name: "All England Lawn Tennis and Croquet Club",
      address: "Church Road, Wimbledon, London SW19 5AE, UK",
      facilities: ["Grass courts", "Player lounge", "Gym", "Medical facilities", "Restaurant"]
    },
    drawSize: 128,
    entryFee: 0,
    website: "https://www.wimbledon.com",
    logo: "/tournaments/wimbledon-logo.png",
    bannerImage: "https://images.unsplash.com/photo-1531315630201-bb15abeb1653?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80"
  },
  {
    id: "t4",
    name: "US Open",
    location: "New York, USA",
    startDate: "2025-08-25",
    endDate: "2025-09-07",
    category: "Grand Slam",
    surface: "Hard",
    prize: 65000000,
    points: 2000,
    registrationDeadline: "2025-07-20",
    status: "upcoming",
    description: "The US Open is a hardcourt tennis tournament which is the modern version of one of the oldest tennis championships in the world, the U.S. National Championship, for which men's singles and men's doubles were first played in 1881.",
    venue: {
      name: "USTA Billie Jean King National Tennis Center",
      address: "Flushing Meadow-Corona Park, Flushing, NY 11368, USA",
      facilities: ["Hard courts", "Player lounge", "Gym", "Medical facilities", "Restaurant"]
    },
    drawSize: 128,
    entryFee: 0,
    website: "https://www.usopen.org",
    logo: "/tournaments/us-open-logo.png",
    bannerImage: "https://images.unsplash.com/photo-1566933293069-b55c7f326dd4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80"
  },
  {
    id: "t5",
    name: "Miami Open",
    location: "Miami, USA",
    startDate: "2025-03-17",
    endDate: "2025-03-30",
    category: "ATP Masters 1000",
    surface: "Hard",
    prize: 8800000,
    points: 1000,
    registrationDeadline: "2025-02-15",
    status: "registration_open",
    description: "The Miami Open is a tennis tournament held annually at the Hard Rock Stadium in Miami Gardens, Florida. It is part of the ATP Tour Masters 1000 on the ATP Tour and a WTA 1000 event on the WTA Tour.",
    venue: {
      name: "Hard Rock Stadium",
      address: "347 Don Shula Dr, Miami Gardens, FL 33056, USA",
      facilities: ["Hard courts", "Player lounge", "Gym", "Medical facilities", "Restaurant"]
    },
    drawSize: 96,
    entryFee: 0,
    website: "https://www.miamiopen.com",
    logo: "/tournaments/miami-open-logo.png",
    bannerImage: "https://images.unsplash.com/photo-1595819857003-f33f0f52171d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80"
  },
  {
    id: "t6",
    name: "Indian Wells Masters",
    location: "Indian Wells, USA",
    startDate: "2025-03-03",
    endDate: "2025-03-16",
    category: "ATP Masters 1000",
    surface: "Hard",
    prize: 9000000,
    points: 1000,
    registrationDeadline: "2025-02-01",
    status: "completed",
    description: "The Indian Wells Masters, also known as the BNP Paribas Open, is an annual tennis tournament held in Indian Wells, California. It is the best-attended tennis tournament outside the four Grand Slam tournaments.",
    venue: {
      name: "Indian Wells Tennis Garden",
      address: "78200 Miles Ave, Indian Wells, CA 92210, USA",
      facilities: ["Hard courts", "Player lounge", "Gym", "Medical facilities", "Restaurant"]
    },
    drawSize: 96,
    entryFee: 0,
    website: "https://bnpparibasopen.com",
    logo: "/tournaments/indian-wells-logo.png",
    bannerImage: "https://images.unsplash.com/photo-1595819857003-f33f0f52171d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80"
  },
  {
    id: "t7",
    name: "Madrid Open",
    location: "Madrid, Spain",
    startDate: "2025-04-28",
    endDate: "2025-05-11",
    category: "ATP Masters 1000",
    surface: "Clay",
    prize: 7500000,
    points: 1000,
    registrationDeadline: "2025-03-25",
    status: "upcoming",
    description: "The Madrid Open, currently sponsored by Mutua, is a joint men's and women's professional tennis tournament, held in Madrid, Spain, during early May. The clay-court event is part of the ATP Tour Masters 1000 on the ATP Tour and a WTA 1000 event on the WTA Tour.",
    venue: {
      name: "Caja Mágica",
      address: "Camino de Perales, s/n, 28041 Madrid, Spain",
      facilities: ["Clay courts", "Player lounge", "Gym", "Medical facilities", "Restaurant"]
    },
    drawSize: 96,
    entryFee: 0,
    website: "https://www.madrid-open.com",
    logo: "/tournaments/madrid-open-logo.png",
    bannerImage: "https://images.unsplash.com/photo-1595819857003-f33f0f52171d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80"
  },
  {
    id: "t8",
    name: "Rome Masters",
    location: "Rome, Italy",
    startDate: "2025-05-12",
    endDate: "2025-05-19",
    category: "ATP Masters 1000",
    surface: "Clay",
    prize: 7000000,
    points: 1000,
    registrationDeadline: "2025-04-10",
    status: "upcoming",
    description: "The Italian Open, also known as the Rome Masters, is an annual tennis tournament held in Rome, Italy. It is one of the most prestigious clay court tournaments in the world after the French Open.",
    venue: {
      name: "Foro Italico",
      address: "Viale dei Gladiatori, 00135 Roma RM, Italy",
      facilities: ["Clay courts", "Player lounge", "Gym", "Medical facilities", "Restaurant"]
    },
    drawSize: 96,
    entryFee: 0,
    website: "https://www.internazionalibnlditalia.com",
    logo: "/tournaments/rome-masters-logo.png",
    bannerImage: "https://images.unsplash.com/photo-1595819857003-f33f0f52171d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80"
  }
];

// Mock user tournament registrations
export const userTournamentRegistrations: UserTournamentRegistration[] = [
  {
    tournamentId: "t6",
    registrationDate: "2025-01-15",
    status: "confirmed",
    entryCategory: "Main Draw",
    drawPosition: 32,
    matchResults: [
      {
        round: "Round 1",
        opponent: "John Smith",
        score: "6-4, 7-6",
        result: "win"
      },
      {
        round: "Round 2",
        opponent: "Rafael Nadal",
        score: "3-6, 4-6",
        result: "loss"
      }
    ]
  },
  {
    tournamentId: "t5",
    registrationDate: "2025-02-10",
    status: "confirmed",
    entryCategory: "Main Draw",
    drawPosition: 45
  }
];

// Function to get tournament by ID
export function getTournamentById(id: string): Tournament | undefined {
  return tournaments.find(tournament => tournament.id === id);
}

// Function to get user's registered tournaments
export function getUserRegisteredTournaments(): Tournament[] {
  return userTournamentRegistrations.map(registration => {
    const tournament = getTournamentById(registration.tournamentId);
    return tournament!;
  }).filter(Boolean);
}

// Function to get user's registration for a tournament
export function getUserRegistrationForTournament(tournamentId: string): UserTournamentRegistration | undefined {
  return userTournamentRegistrations.find(registration => registration.tournamentId === tournamentId);
}

// Practice Court data
export interface PracticeCourt {
  id: string;
  name: string;
  tournamentId: string;
  surface: string;
  location: string;
  isIndoor: boolean;
  amenities: string[];
}

// Practice Court Booking data
export interface PracticeCourtBooking {
  id: string;
  tournamentId: string;
  courtId: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: string;
}

// Mock practice courts data
export const practiceCourts: PracticeCourt[] = [
  // Australian Open practice courts
  {
    id: "pc1",
    name: "Practice Court 1",
    tournamentId: "t1",
    surface: "Hard",
    location: "Melbourne Park East",
    isIndoor: false,
    amenities: ["Ball machine", "Water station", "Shaded bench"]
  },
  {
    id: "pc2",
    name: "Practice Court 2",
    tournamentId: "t1",
    surface: "Hard",
    location: "Melbourne Park East",
    isIndoor: false,
    amenities: ["Ball machine", "Water station", "Shaded bench"]
  },
  {
    id: "pc3",
    name: "Practice Court 3",
    tournamentId: "t1",
    surface: "Hard",
    location: "Melbourne Park East",
    isIndoor: true,
    amenities: ["Ball machine", "Water station", "Shaded bench", "Air conditioning"]
  },
  {
    id: "pc4",
    name: "Practice Court 4",
    tournamentId: "t1",
    surface: "Hard",
    location: "Melbourne Park West",
    isIndoor: false,
    amenities: ["Ball machine", "Water station", "Shaded bench"]
  },
  {
    id: "pc5",
    name: "Practice Court 5",
    tournamentId: "t1",
    surface: "Hard",
    location: "Melbourne Park West",
    isIndoor: false,
    amenities: ["Ball machine", "Water station", "Shaded bench"]
  },
  
  // Roland Garros practice courts
  {
    id: "pc6",
    name: "Practice Court A",
    tournamentId: "t2",
    surface: "Clay",
    location: "Roland Garros North",
    isIndoor: false,
    amenities: ["Ball machine", "Water station", "Shaded bench"]
  },
  {
    id: "pc7",
    name: "Practice Court B",
    tournamentId: "t2",
    surface: "Clay",
    location: "Roland Garros North",
    isIndoor: false,
    amenities: ["Ball machine", "Water station", "Shaded bench"]
  },
  {
    id: "pc8",
    name: "Practice Court C",
    tournamentId: "t2",
    surface: "Clay",
    location: "Roland Garros South",
    isIndoor: true,
    amenities: ["Ball machine", "Water station", "Shaded bench", "Air conditioning"]
  },
  {
    id: "pc9",
    name: "Practice Court D",
    tournamentId: "t2",
    surface: "Clay",
    location: "Roland Garros South",
    isIndoor: false,
    amenities: ["Ball machine", "Water station", "Shaded bench"]
  },
  
  // Wimbledon practice courts
  {
    id: "pc10",
    name: "Aorangi Practice Court 1",
    tournamentId: "t3",
    surface: "Grass",
    location: "Aorangi Park",
    isIndoor: false,
    amenities: ["Ball machine", "Water station", "Shaded bench"]
  },
  {
    id: "pc11",
    name: "Aorangi Practice Court 2",
    tournamentId: "t3",
    surface: "Grass",
    location: "Aorangi Park",
    isIndoor: false,
    amenities: ["Ball machine", "Water station", "Shaded bench"]
  },
  {
    id: "pc12",
    name: "Aorangi Practice Court 3",
    tournamentId: "t3",
    surface: "Grass",
    location: "Aorangi Park",
    isIndoor: false,
    amenities: ["Ball machine", "Water station", "Shaded bench"]
  },
  
  // US Open practice courts
  {
    id: "pc13",
    name: "Practice Court 1",
    tournamentId: "t4",
    surface: "Hard",
    location: "Flushing Meadows East",
    isIndoor: false,
    amenities: ["Ball machine", "Water station", "Shaded bench"]
  },
  {
    id: "pc14",
    name: "Practice Court 2",
    tournamentId: "t4",
    surface: "Hard",
    location: "Flushing Meadows East",
    isIndoor: false,
    amenities: ["Ball machine", "Water station", "Shaded bench"]
  },
  {
    id: "pc15",
    name: "Indoor Practice Court",
    tournamentId: "t4",
    surface: "Hard",
    location: "Flushing Meadows West",
    isIndoor: true,
    amenities: ["Ball machine", "Water station", "Shaded bench", "Air conditioning"]
  },
  
  // Miami Open practice courts
  {
    id: "pc16",
    name: "Practice Court 1",
    tournamentId: "t5",
    surface: "Hard",
    location: "Hard Rock Stadium East",
    isIndoor: false,
    amenities: ["Ball machine", "Water station", "Shaded bench"]
  },
  {
    id: "pc17",
    name: "Practice Court 2",
    tournamentId: "t5",
    surface: "Hard",
    location: "Hard Rock Stadium East",
    isIndoor: false,
    amenities: ["Ball machine", "Water station", "Shaded bench"]
  },
  {
    id: "pc18",
    name: "Practice Court 3",
    tournamentId: "t5",
    surface: "Hard",
    location: "Hard Rock Stadium West",
    isIndoor: false,
    amenities: ["Ball machine", "Water station", "Shaded bench"]
  },
  {
    id: "pc19",
    name: "Practice Court 4",
    tournamentId: "t5",
    surface: "Hard",
    location: "Hard Rock Stadium West",
    isIndoor: false,
    amenities: ["Ball machine", "Water station", "Shaded bench"]
  },
  
  // Indian Wells practice courts
  {
    id: "pc20",
    name: "Practice Court 1",
    tournamentId: "t6",
    surface: "Hard",
    location: "Indian Wells Tennis Garden North",
    isIndoor: false,
    amenities: ["Ball machine", "Water station", "Shaded bench"]
  },
  {
    id: "pc21",
    name: "Practice Court 2",
    tournamentId: "t6",
    surface: "Hard",
    location: "Indian Wells Tennis Garden North",
    isIndoor: false,
    amenities: ["Ball machine", "Water station", "Shaded bench"]
  },
  {
    id: "pc22",
    name: "Practice Court 3",
    tournamentId: "t6",
    surface: "Hard",
    location: "Indian Wells Tennis Garden South",
    isIndoor: false,
    amenities: ["Ball machine", "Water station", "Shaded bench"]
  },
  
  // Madrid Open practice courts
  {
    id: "pc23",
    name: "Practice Court 1",
    tournamentId: "t7",
    surface: "Clay",
    location: "Caja Mágica North",
    isIndoor: false,
    amenities: ["Ball machine", "Water station", "Shaded bench"]
  },
  {
    id: "pc24",
    name: "Practice Court 2",
    tournamentId: "t7",
    surface: "Clay",
    location: "Caja Mágica North",
    isIndoor: false,
    amenities: ["Ball machine", "Water station", "Shaded bench"]
  },
  {
    id: "pc25",
    name: "Indoor Practice Court",
    tournamentId: "t7",
    surface: "Clay",
    location: "Caja Mágica South",
    isIndoor: true,
    amenities: ["Ball machine", "Water station", "Shaded bench", "Air conditioning"]
  },
  
  // Rome Masters practice courts
  {
    id: "pc26",
    name: "Practice Court 1",
    tournamentId: "t8",
    surface: "Clay",
    location: "Foro Italico North",
    isIndoor: false,
    amenities: ["Ball machine", "Water station", "Shaded bench"]
  },
  {
    id: "pc27",
    name: "Practice Court 2",
    tournamentId: "t8",
    surface: "Clay",
    location: "Foro Italico North",
    isIndoor: false,
    amenities: ["Ball machine", "Water station", "Shaded bench"]
  },
  {
    id: "pc28",
    name: "Practice Court 3",
    tournamentId: "t8",
    surface: "Clay",
    location: "Foro Italico South",
    isIndoor: false,
    amenities: ["Ball machine", "Water station", "Shaded bench"]
  }
];

// Mock practice court bookings
export const practiceCourtsBookings: PracticeCourtBooking[] = [
  {
    id: "pcb1",
    tournamentId: "t5",
    courtId: "pc16",
    userId: "user1",
    date: "2025-03-18",
    startTime: "09:00",
    endTime: "11:00",
    status: "confirmed",
    createdAt: "2025-03-01T10:30:00Z"
  },
  {
    id: "pcb2",
    tournamentId: "t5",
    courtId: "pc17",
    userId: "user1",
    date: "2025-03-20",
    startTime: "14:00",
    endTime: "16:00",
    status: "confirmed",
    createdAt: "2025-03-01T10:35:00Z"
  },
  {
    id: "pcb3",
    tournamentId: "t5",
    courtId: "pc18",
    userId: "user1",
    date: "2025-03-22",
    startTime: "10:00",
    endTime: "12:00",
    status: "confirmed",
    createdAt: "2025-03-01T10:40:00Z"
  }
];

// Function to get practice courts by tournament ID
export function getPracticeCourtsByTournamentId(tournamentId: string): PracticeCourt[] {
  return practiceCourts.filter(court => court.tournamentId === tournamentId);
}

// Function to get practice court by ID
export function getPracticeCourtById(courtId: string): PracticeCourt | undefined {
  return practiceCourts.find(court => court.id === courtId);
}

// Function to get practice court bookings by user ID
export function getPracticeCourtBookingsByUserId(userId: string): PracticeCourtBooking[] {
  return practiceCourtsBookings.filter(booking => booking.userId === userId);
}

// Function to get practice court bookings by tournament ID
export function getPracticeCourtBookingsByTournamentId(tournamentId: string): PracticeCourtBooking[] {
  return practiceCourtsBookings.filter(booking => booking.tournamentId === tournamentId);
}

// Function to get practice court bookings by court ID
export function getPracticeCourtBookingsByCourtId(courtId: string): PracticeCourtBooking[] {
  return practiceCourtsBookings.filter(booking => booking.courtId === courtId);
}

// Function to get practice court bookings by date
export function getPracticeCourtBookingsByDate(tournamentId: string, date: string): PracticeCourtBooking[] {
  return practiceCourtsBookings.filter(booking => booking.tournamentId === tournamentId && booking.date === date);
}

// Function to check if a court is available at a specific time
export function isCourtAvailable(courtId: string, date: string, startTime: string, endTime: string): boolean {
  return !practiceCourtsBookings.some(booking => 
    booking.courtId === courtId && 
    booking.date === date && 
    booking.status !== "cancelled" &&
    ((startTime >= booking.startTime && startTime < booking.endTime) || 
     (endTime > booking.startTime && endTime <= booking.endTime) ||
     (startTime <= booking.startTime && endTime >= booking.endTime))
  );
}

// Function to check if user is registered for a tournament
export function isUserRegisteredForTournament(tournamentId: string): boolean {
  return userTournamentRegistrations.some(registration => registration.tournamentId === tournamentId);
}
