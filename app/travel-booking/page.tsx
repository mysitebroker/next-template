"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { format } from "date-fns"

import { getTournamentById } from "@/lib/mock-data"
import { initializeLocalStorage } from "@/lib/tournament-api"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"

// Mock data for flights
const flightOptions = [
  {
    id: "f1",
    airline: "TennisPro Airways",
    origin: "New York (JFK)",
    destination: "London (LHR)",
    departureDate: "2025-04-15T08:30:00",
    returnDate: "2025-04-22T16:45:00",
    price: 1250,
    class: "Business",
    duration: "7h 15m",
    stops: 0,
    sportEquipmentIncluded: true,
  },
  {
    id: "f2",
    airline: "Grand Slam Airlines",
    origin: "New York (JFK)",
    destination: "London (LHR)",
    departureDate: "2025-04-15T11:45:00",
    returnDate: "2025-04-22T19:20:00",
    price: 950,
    class: "Economy",
    duration: "7h 30m",
    stops: 0,
    sportEquipmentIncluded: true,
  },
  {
    id: "f3",
    airline: "Ace International",
    origin: "New York (JFK)",
    destination: "London (LHR)",
    departureDate: "2025-04-15T16:15:00",
    returnDate: "2025-04-22T10:30:00",
    price: 2200,
    class: "First",
    duration: "7h 10m",
    stops: 0,
    sportEquipmentIncluded: true,
  },
]

// Mock data for hotels
const hotelOptions = [
  {
    id: "h1",
    name: "Grand Court Hotel",
    location: "London, UK",
    checkIn: "2025-04-15",
    checkOut: "2025-04-22",
    price: 1800,
    pricePerNight: 257,
    rating: 5,
    amenities: ["Spa", "Tennis Court", "Gym", "Pool", "Restaurant"],
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
    roomType: "Deluxe Suite",
    distanceToVenue: "1.2 miles to Wimbledon",
  },
  {
    id: "h2",
    name: "Ace Boutique Hotel",
    location: "London, UK",
    checkIn: "2025-04-15",
    checkOut: "2025-04-22",
    price: 1400,
    pricePerNight: 200,
    rating: 4,
    amenities: ["Gym", "Pool", "Restaurant", "Free Shuttle"],
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
    roomType: "Premium Room",
    distanceToVenue: "2.5 miles to Wimbledon",
  },
  {
    id: "h3",
    name: "Championship Suites",
    location: "London, UK",
    checkIn: "2025-04-15",
    checkOut: "2025-04-22",
    price: 2100,
    pricePerNight: 300,
    rating: 5,
    amenities: ["Spa", "Tennis Court", "Gym", "Pool", "Restaurant", "Concierge"],
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
    roomType: "Executive Suite",
    distanceToVenue: "0.8 miles to Wimbledon",
  },
]

// Mock data for rental cars
const carOptions = [
  {
    id: "c1",
    company: "TennisPro Rentals",
    model: "Mercedes-Benz E-Class",
    type: "Luxury Sedan",
    pickupLocation: "London Heathrow Airport",
    dropoffLocation: "London Heathrow Airport",
    pickupDate: "2025-04-15",
    dropoffDate: "2025-04-22",
    price: 700,
    pricePerDay: 100,
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
    features: ["Automatic", "GPS", "Bluetooth", "Leather Seats", "Unlimited Mileage"],
    largeItemCapacity: true,
  },
  {
    id: "c2",
    company: "Grand Slam Autos",
    model: "BMW X5",
    type: "Luxury SUV",
    pickupLocation: "London Heathrow Airport",
    dropoffLocation: "London Heathrow Airport",
    pickupDate: "2025-04-15",
    dropoffDate: "2025-04-22",
    price: 840,
    pricePerDay: 120,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
    features: ["Automatic", "GPS", "Bluetooth", "Leather Seats", "Unlimited Mileage", "Extra Cargo Space"],
    largeItemCapacity: true,
  },
  {
    id: "c3",
    company: "Ace Rentals",
    model: "Audi A4",
    type: "Premium Sedan",
    pickupLocation: "London Heathrow Airport",
    dropoffLocation: "London Heathrow Airport",
    pickupDate: "2025-04-15",
    dropoffDate: "2025-04-22",
    price: 630,
    pricePerDay: 90,
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80",
    features: ["Automatic", "GPS", "Bluetooth", "Leather Seats", "Unlimited Mileage"],
    largeItemCapacity: false,
  },
]

// Mock data for current bookings
const currentBookings: CurrentBooking[] = [
  {
    id: "b1",
    type: "flight",
    details: {
      airline: "TennisPro Airways",
      origin: "Miami (MIA)",
      destination: "Paris (CDG)",
      departureDate: "2025-05-20T10:15:00",
      returnDate: "2025-06-10T14:30:00",
      class: "Business",
    },
    price: 2200,
    status: "Confirmed",
  },
  {
    id: "b2",
    type: "hotel",
    details: {
      name: "Roland Garros Suites",
      location: "Paris, France",
      checkIn: "2025-05-20",
      checkOut: "2025-06-10",
      roomType: "Premium Suite",
    },
    price: 6300,
    status: "Confirmed",
  },
]

// Type definitions for bookings
type FlightBooking = {
  id: string;
  airline: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  price: number;
  class: string;
  duration: string;
  stops: number;
  sportEquipmentIncluded: boolean;
}

type HotelBooking = {
  id: string;
  name: string;
  location: string;
  checkIn: string;
  checkOut: string;
  price: number;
  pricePerNight: number;
  rating: number;
  amenities: string[];
  image: string;
  roomType: string;
  distanceToVenue: string;
}

type CarBooking = {
  id: string;
  company: string;
  model: string;
  type: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  dropoffDate: string;
  price: number;
  pricePerDay: number;
  image: string;
  features: string[];
  largeItemCapacity: boolean;
}

type Booking = FlightBooking | HotelBooking | CarBooking;

// Types for current booking details
type FlightBookingDetails = {
  airline: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  class: string;
}

type HotelBookingDetails = {
  name: string;
  location: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
}

type CarBookingDetails = {
  model: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  dropoffDate: string;
}

type CurrentBooking = {
  id: string;
  type: "flight";
  details: FlightBookingDetails;
  price: number;
  status: string;
} | {
  id: string;
  type: "hotel";
  details: HotelBookingDetails;
  price: number;
  status: string;
} | {
  id: string;
  type: "car";
  details: CarBookingDetails;
  price: number;
  status: string;
}

export default function TravelBookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("flights")
  const [searchResults, setSearchResults] = useState<Booking[]>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedBookings, setSelectedBookings] = useState<Booking[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)
  
  // Form states
  const [flightForm, setFlightForm] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    class: "",
    passengers: "1",
  })
  
  const [hotelForm, setHotelForm] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    roomType: "",
    guests: "1",
  })
  
  const [carForm, setCarForm] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    pickupDate: "",
    dropoffDate: "",
    carType: "",
  })

  // Check for tournament parameter in URL
  useEffect(() => {
    initializeLocalStorage()
    
    const tournamentId = searchParams.get('tournament')
    if (tournamentId) {
      const tournament = getTournamentById(tournamentId)
      if (tournament) {
        // Pre-fill flight form
        setFlightForm(prev => ({
          ...prev,
          destination: tournament.location.split(',')[0].trim(), // Use city part of location
          departureDate: new Date(tournament.startDate).toISOString().split('T')[0],
          returnDate: new Date(tournament.endDate).toISOString().split('T')[0],
        }))
        
        // Pre-fill hotel form
        setHotelForm(prev => ({
          ...prev,
          destination: tournament.location.split(',')[0].trim(),
          checkIn: new Date(tournament.startDate).toISOString().split('T')[0],
          checkOut: new Date(tournament.endDate).toISOString().split('T')[0],
        }))
        
        // Pre-fill car form
        setCarForm(prev => ({
          ...prev,
          pickupLocation: tournament.location.split(',')[0].trim(),
          dropoffLocation: tournament.location.split(',')[0].trim(),
          pickupDate: new Date(tournament.startDate).toISOString().split('T')[0],
          dropoffDate: new Date(tournament.endDate).toISOString().split('T')[0],
        }))
      }
    }
  }, [searchParams])

  // Handle search for flights
  const handleFlightSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchResults(flightOptions)
    setShowResults(true)
  }

  // Handle search for hotels
  const handleHotelSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchResults(hotelOptions)
    setShowResults(true)
  }

  // Handle search for cars
  const handleCarSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchResults(carOptions)
    setShowResults(true)
  }

  // Handle booking selection
  const handleBookNow = (item: Booking) => {
    setSelectedBookings([...selectedBookings, item])
    setShowResults(false)
    setShowConfirmation(true)
  }

  // Handle booking confirmation
  const handleConfirmBooking = () => {
    // In a real app, this would send the booking to the server
    // and update the user's monthly bill
    
    // Navigate to dashboard to see the updated bookings
    router.push("/dashboard")
  }

  // Reset search
  const handleNewSearch = () => {
    setShowResults(false)
    setShowConfirmation(false)
  }

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return ""
    
    try {
      const date = new Date(dateString)
      return format(date, "MMM d, yyyy")
    } catch (error) {
      return dateString
    }
  }

  // Format time for display
  const formatTime = (dateString: string | undefined) => {
    if (!dateString) return ""
    
    try {
      const date = new Date(dateString)
      return format(date, "h:mm a")
    } catch (error) {
      return ""
    }
  }

  // Render star rating
  const renderRating = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Icons.tennis
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "text-yellow-500" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    )
  }

  // Type guards
  const isFlight = (booking: Booking): booking is FlightBooking => 
    (booking as FlightBooking).airline !== undefined;
  
  const isHotel = (booking: Booking): booking is HotelBooking => 
    (booking as HotelBooking).name !== undefined;
  
  const isCar = (booking: Booking): booking is CarBooking => 
    (booking as CarBooking).model !== undefined;

  return (
    <div className="container py-10">
      {/* Page Header with Gradient Background */}
      <div className="relative mb-8 rounded-lg bg-gradient-to-r from-blue-600 to-green-600 p-8 text-white">
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
          {/* Background pattern/illustration */}
          <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAwIDEwMG0tOTAgMGE5MCA5MCAwIDEgMCAxODAgMCA5MCA5MCAwIDEgMC0xODAgMHoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTEwMCAxMDBtLTUwIDBhNTAgNTAgMCAxIDAgMTAwIDAgNTAgNTAgMCAxIDAtMTAwIDB6IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xMDAgMTAwbS0yNSAwYTI1IDI1IDAgMSAwIDUwIDAgMjUgMjUgMCAxIDAtNTAgMHoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+PC9zdmc+')] bg-repeat" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight">Travel Booking</h1>
          <p className="max-w-2xl text-white/90">
            Book flights, hotels, and rental cars for your tournaments and training.
            All bookings are added to your monthly bill for convenient payment.
          </p>
        </div>
      </div>

      {/* Main Booking Interface */}
      {!showResults && !showConfirmation && (
        <Tabs
          defaultValue="flights"
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="flights" className="flex items-center gap-2">
              <Icons.travel className="h-4 w-4" />
              <span>Flights</span>
            </TabsTrigger>
            <TabsTrigger value="hotels" className="flex items-center gap-2">
              <Icons.hotel className="h-4 w-4" />
              <span>Hotels</span>
            </TabsTrigger>
            <TabsTrigger value="cars" className="flex items-center gap-2">
              <Icons.travel className="h-4 w-4" />
              <span>Rental Cars</span>
            </TabsTrigger>
          </TabsList>

          {/* Flight Booking Form */}
          <TabsContent value="flights" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Book Your Flight</CardTitle>
                <CardDescription>
                  Find the best flights for your tournament travel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFlightSearch} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="origin">Origin</Label>
                      <Input
                        id="origin"
                        placeholder="City or Airport"
                        value={flightForm.origin}
                        onChange={(e) =>
                          setFlightForm({ ...flightForm, origin: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="destination">Destination</Label>
                      <Input
                        id="destination"
                        placeholder="City or Airport"
                        value={flightForm.destination}
                        onChange={(e) =>
                          setFlightForm({ ...flightForm, destination: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="departureDate">Departure Date</Label>
                      <Input
                        id="departureDate"
                        type="date"
                        value={flightForm.departureDate}
                        onChange={(e) =>
                          setFlightForm({ ...flightForm, departureDate: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="returnDate">Return Date</Label>
                      <Input
                        id="returnDate"
                        type="date"
                        value={flightForm.returnDate}
                        onChange={(e) =>
                          setFlightForm({ ...flightForm, returnDate: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="class">Class</Label>
                      <Select
                        value={flightForm.class}
                        onValueChange={(value) =>
                          setFlightForm({ ...flightForm, class: value })
                        }
                      >
                        <SelectTrigger id="class">
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Economy">Economy</SelectItem>
                          <SelectItem value="Premium Economy">Premium Economy</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                          <SelectItem value="First">First</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passengers">Passengers</Label>
                      <Select
                        value={flightForm.passengers}
                        onValueChange={(value) =>
                          setFlightForm({ ...flightForm, passengers: value })
                        }
                      >
                        <SelectTrigger id="passengers">
                          <SelectValue placeholder="Select number" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="sportEquipment"
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="sportEquipment" className="text-sm">
                      Include sports equipment (racquets, etc.)
                    </Label>
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-800"
                  onClick={handleFlightSearch}
                >
                  Search Flights
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Hotel Booking Form */}
          <TabsContent value="hotels" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Book Your Hotel</CardTitle>
                <CardDescription>
                  Find accommodations near your tournament venue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleHotelSearch} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hotelDestination">Destination</Label>
                    <Input
                      id="hotelDestination"
                      placeholder="City or Tournament Venue"
                      value={hotelForm.destination}
                      onChange={(e) =>
                        setHotelForm({ ...hotelForm, destination: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="checkIn">Check-in Date</Label>
                      <Input
                        id="checkIn"
                        type="date"
                        value={hotelForm.checkIn}
                        onChange={(e) =>
                          setHotelForm({ ...hotelForm, checkIn: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="checkOut">Check-out Date</Label>
                      <Input
                        id="checkOut"
                        type="date"
                        value={hotelForm.checkOut}
                        onChange={(e) =>
                          setHotelForm({ ...hotelForm, checkOut: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="roomType">Room Type</Label>
                      <Select
                        value={hotelForm.roomType}
                        onValueChange={(value) =>
                          setHotelForm({ ...hotelForm, roomType: value })
                        }
                      >
                        <SelectTrigger id="roomType">
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Standard">Standard Room</SelectItem>
                          <SelectItem value="Deluxe">Deluxe Room</SelectItem>
                          <SelectItem value="Suite">Suite</SelectItem>
                          <SelectItem value="Premium">Premium Suite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hotelGuests">Guests</Label>
                      <Select
                        value={hotelForm.guests}
                        onValueChange={(value) =>
                          setHotelForm({ ...hotelForm, guests: value })
                        }
                      >
                        <SelectTrigger id="hotelGuests">
                          <SelectValue placeholder="Select number" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="tennisCourt"
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="tennisCourt" className="text-sm">
                      Hotel must have tennis courts
                    </Label>
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-gradient-to-r from-green-600 to-green-800"
                  onClick={handleHotelSearch}
                >
                  Search Hotels
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Car Rental Form */}
          <TabsContent value="cars" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Rent a Car</CardTitle>
                <CardDescription>
                  Find the perfect vehicle for your tournament travel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCarSearch} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="pickupLocation">Pickup Location</Label>
                      <Input
                        id="pickupLocation"
                        placeholder="Airport or City"
                        value={carForm.pickupLocation}
                        onChange={(e) =>
                          setCarForm({ ...carForm, pickupLocation: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dropoffLocation">Drop-off Location</Label>
                      <Input
                        id="dropoffLocation"
                        placeholder="Airport or City"
                        value={carForm.dropoffLocation}
                        onChange={(e) =>
                          setCarForm({ ...carForm, dropoffLocation: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="pickupDate">Pickup Date</Label>
                      <Input
                        id="pickupDate"
                        type="date"
                        value={carForm.pickupDate}
                        onChange={(e) =>
                          setCarForm({ ...carForm, pickupDate: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dropoffDate">Drop-off Date</Label>
                      <Input
                        id="dropoffDate"
                        type="date"
                        value={carForm.dropoffDate}
                        onChange={(e) =>
                          setCarForm({ ...carForm, dropoffDate: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="carType">Car Type</Label>
                    <Select
                      value={carForm.carType}
                      onValueChange={(value) =>
                        setCarForm({ ...carForm, carType: value })
                      }
                    >
                      <SelectTrigger id="carType">
                        <SelectValue placeholder="Select car type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Economy">Economy</SelectItem>
                        <SelectItem value="Compact">Compact</SelectItem>
                        <SelectItem value="Midsize">Midsize</SelectItem>
                        <SelectItem value="SUV">SUV</SelectItem>
                        <SelectItem value="Luxury">Luxury</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="largeEquipment"
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="largeEquipment" className="text-sm">
                      Need space for tennis equipment
                    </Label>
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-800"
                  onClick={handleCarSearch}
                >
                  Search Cars
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Current Bookings Section */}
      {currentBookings.length > 0 && !showConfirmation && !showResults && (
        <div className="mb-8 mt-12">
          <h2 className="mb-4 text-2xl font-bold tracking-tight">Your Current Bookings</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {currentBookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <div className="h-2 bg-primary" />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {booking.type === "flight"
                        ? `Flight: ${booking.details.origin} to ${booking.details.destination}`
                        : booking.type === "hotel"
                        ? `Hotel: ${booking.details.name}`
                        : booking.type === "car"
                        ? `Car Rental: ${booking.details.model}`
                        : "Booking"}
                    </CardTitle>
                    <Badge>{booking.status}</Badge>
                  </div>
                  <CardDescription>
                    {booking.type === "flight"
                      ? `${formatDate(booking.details.departureDate)} - ${formatDate(
                          booking.details.returnDate
                        )}`
                      : booking.type === "hotel"
                      ? `${formatDate(booking.details.checkIn)} - ${formatDate(
                          booking.details.checkOut
                        )}`
                      : booking.type === "car"
                      ? `${formatDate(booking.details.pickupDate)} - ${formatDate(
                          booking.details.dropoffDate
                        )}`
                      : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    {booking.type === "flight" ? (
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Airline:</span>
                          <span className="font-medium text-foreground">
                            {booking.details.airline}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Class:</span>
                          <span className="font-medium text-foreground">
                            {booking.details.class}
                          </span>
                        </div>
                      </div>
                    ) : booking.type === "hotel" ? (
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Location:</span>
                          <span className="font-medium text-foreground">
                            {booking.details.location}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Room:</span>
                          <span className="font-medium text-foreground">
                            {booking.details.roomType}
                          </span>
                        </div>
                      </div>
                    ) : booking.type === "car" ? (
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Pickup:</span>
                          <span className="font-medium text-foreground">
                            {booking.details.pickupLocation}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Car:</span>
                          <span className="font-medium text-foreground">
                            {booking.details.model}
                          </span>
                        </div>
                      </div>
                    ) : null}
                    <div className="mt-2 flex justify-between border-t pt-2">
                      <span>Price:</span>
                      <span className="font-medium text-foreground">
                        ${booking.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {showResults && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
              {activeTab === "flights"
                ? "Available Flights"
                : activeTab === "hotels"
                ? "Available Hotels"
                : "Available Rental Cars"}
            </h2>
            <Button variant="outline" onClick={handleNewSearch}>
              New Search
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Flight Results */}
            {activeTab === "flights" &&
              searchResults.map((flight) => {
                if (!isFlight(flight)) return null;
                return (
                  <Card
                    key={flight.id}
                    className="overflow-hidden transition-all hover:shadow-md"
                  >
                    <div className="h-2 bg-blue-600" />
                    <div className="grid grid-cols-1 md:grid-cols-3">
                      <div className="p-6">
                        <div className="flex items-center gap-2">
                          <Icons.travel className="h-5 w-5 text-blue-600" />
                          <h3 className="font-semibold">{flight.airline}</h3>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-2xl font-bold">
                          <span>{flight.origin.split(" ")[0]}</span>
                          <div className="flex flex-1 items-center justify-center px-4">
                            <div className="h-px flex-1 bg-gray-300" />
                            <Icons.travel className="mx-2 h-4 w-4 rotate-90 text-muted-foreground" />
                            <div className="h-px flex-1 bg-gray-300" />
                          </div>
                          <span>{flight.destination.split(" ")[0]}</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                          <span>{flight.origin.match(/\(([^)]+)\)/)?.[1]}</span>
                          <span>{flight.duration}</span>
                          <span>{flight.destination.match(/\(([^)]+)\)/)?.[1]}</span>
                        </div>
                      </div>

                      <div className="border-t p-6 md:border-l md:border-t-0">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Departure:</span>
                            <span>
                              {formatDate(flight.departureDate)} at {formatTime(flight.departureDate)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Return:</span>
                            <span>
                              {formatDate(flight.returnDate)} at {formatTime(flight.returnDate)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Class:</span>
                            <span>{flight.class}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Stops:</span>
                            <span>{flight.stops === 0 ? "Nonstop" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Sports Equipment:</span>
                            <span>{flight.sportEquipmentIncluded ? "Included" : "Not included"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col border-t p-6 md:border-l md:border-t-0">
                        <div className="mb-4 text-center">
                          <div className="text-2xl font-bold text-primary">${flight.price}</div>
                          <div className="text-xs text-muted-foreground">per person</div>
                        </div>
                        <Button
                          className="mt-auto bg-gradient-to-r from-blue-600 to-blue-800"
                          onClick={() => handleBookNow(flight)}
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}

            {/* Hotel Results */}
            {activeTab === "hotels" &&
              searchResults.map((hotel) => {
                if (!isHotel(hotel)) return null;
                return (
                  <Card
                    key={hotel.id}
                    className="overflow-hidden transition-all hover:shadow-md"
                  >
                    <div className="h-2 bg-green-600" />
                    <div className="grid grid-cols-1 md:grid-cols-3">
                      <div className="relative h-48 md:h-auto">
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${hotel.image})` }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                          <div className="flex items-center gap-1">
                            {renderRating(hotel.rating)}
                          </div>
                          <div className="text-xs">{hotel.distanceToVenue}</div>
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="mb-1 font-semibold">{hotel.name}</h3>
                        <p className="mb-3 text-sm text-muted-foreground">{hotel.location}</p>
                        
                        <div className="mb-3 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Check-in:</span>
                            <span>{formatDate(hotel.checkIn)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Check-out:</span>
                            <span>{formatDate(hotel.checkOut)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Room Type:</span>
                            <span>{hotel.roomType}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {hotel.amenities.slice(0, 4).map((amenity, index) => (
                            <Badge key={index} variant="outline" className="bg-muted/50">
                              {amenity}
                            </Badge>
                          ))}
                          {hotel.amenities.length > 4 && (
                            <Badge variant="outline" className="bg-muted/50">
                              +{hotel.amenities.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col border-t p-6 md:border-l md:border-t-0">
                        <div className="mb-4 text-center">
                          <div className="text-2xl font-bold text-primary">${hotel.price}</div>
                          <div className="text-xs text-muted-foreground">
                            ${hotel.pricePerNight} per night
                          </div>
                        </div>
                        <Button
                          className="mt-auto bg-gradient-to-r from-green-600 to-green-800"
                          onClick={() => handleBookNow(hotel)}
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}

            {/* Car Rental Results */}
            {activeTab === "cars" &&
              searchResults.map((car) => {
                if (!isCar(car)) return null;
                return (
                  <Card
                    key={car.id}
                    className="overflow-hidden transition-all hover:shadow-md"
                  >
                    <div className="h-2 bg-purple-600" />
                    <div className="grid grid-cols-1 md:grid-cols-3">
                      <div className="relative h-48 md:h-auto">
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${car.image})` }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                          <div className="text-xs">
                            {car.largeItemCapacity ? "Fits tennis equipment" : ""}
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{car.model}</h3>
                          <Badge variant="outline" className="bg-muted/50">
                            {car.type}
                          </Badge>
                        </div>
                        <p className="mb-3 text-sm text-muted-foreground">{car.company}</p>
                        
                        <div className="mb-3 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Pickup:</span>
                            <span>{formatDate(car.pickupDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Location:</span>
                            <span>{car.pickupLocation}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Drop-off:</span>
                            <span>{formatDate(car.dropoffDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Location:</span>
                            <span>{car.dropoffLocation}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {car.features.slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="outline" className="bg-muted/50">
                              {feature}
                            </Badge>
                          ))}
                          {car.features.length > 3 && (
                            <Badge variant="outline" className="bg-muted/50">
                              +{car.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col border-t p-6 md:border-l md:border-t-0">
                        <div className="mb-4 text-center">
                          <div className="text-2xl font-bold text-primary">${car.price}</div>
                          <div className="text-xs text-muted-foreground">
                            ${car.pricePerDay} per day
                          </div>
                        </div>
                        <Button
                          className="mt-auto bg-gradient-to-r from-purple-600 to-purple-800"
                          onClick={() => handleBookNow(car)}
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
          </div>
        </div>
      )}

      {/* Booking Confirmation */}
      {showConfirmation && (
        <Card className="border-primary">
          <div className="h-2 w-full bg-gradient-to-r from-blue-600 to-green-600" />
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Booking Confirmation</CardTitle>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Icons.tennis className="h-5 w-5" />
              </div>
            </div>
            <CardDescription>
              Review your booking details before confirming
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {selectedBookings.map((booking, index) => (
                <div
                  key={index}
                  className="rounded-lg border bg-card p-4 shadow-sm"
                >
                  {/* Flight Booking */}
                  {isFlight(booking) && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icons.travel className="h-5 w-5 text-blue-600" />
                          <h3 className="font-semibold">Flight Booking</h3>
                        </div>
                        <Badge className="bg-blue-600">${booking.price}</Badge>
                      </div>
                      <div className="grid gap-2 text-sm">
                        <div className="grid grid-cols-2 gap-1">
                          <span className="text-muted-foreground">Airline:</span>
                          <span>{booking.airline}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <span className="text-muted-foreground">Route:</span>
                          <span>{booking.origin} to {booking.destination}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <span className="text-muted-foreground">Departure:</span>
                          <span>
                            {formatDate(booking.departureDate)} at {formatTime(booking.departureDate)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <span className="text-muted-foreground">Return:</span>
                          <span>
                            {formatDate(booking.returnDate)} at {formatTime(booking.returnDate)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <span className="text-muted-foreground">Class:</span>
                          <span>{booking.class}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <span className="text-muted-foreground">Duration:</span>
                          <span>{booking.duration}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <span className="text-muted-foreground">Sports Equipment:</span>
                          <span>{booking.sportEquipmentIncluded ? "Included" : "Not Included"}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Hotel Booking */}
                  {isHotel(booking) && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icons.hotel className="h-5 w-5 text-green-600" />
                          <h3 className="font-semibold">Hotel Booking</h3>
                        </div>
                        <Badge className="bg-green-600">${booking.price}</Badge>
                      </div>
                      <div className="grid gap-2 text-sm">
                        <div className="grid grid-cols-2 gap-1">
                          <span className="text-muted-foreground">Hotel:</span>
                          <span>{booking.name}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <span className="text-muted-foreground">Location:</span>
                          <span>{booking.location}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <span className="text-muted-foreground">Check-in:</span>
                          <span>{formatDate(booking.checkIn)}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <span className="text-muted-foreground">Check-out:</span>
                          <span>{formatDate(booking.checkOut)}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <span className="text-muted-foreground">Room Type:</span>
                          <span>{booking.roomType}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <span className="text-muted-foreground">Price per Night:</span>
                          <span>${booking.pricePerNight}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <span className="text-muted-foreground">Distance:</span>
                          <span>{booking.distanceToVenue}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Car Booking */}
                  {isCar(booking) && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icons.travel className="h-5 w-5 text-purple-600" />
                          <h3 className="font-semibold">Car Rental</h3>
                        </div>
                        <Badge className="bg-purple-600">${booking.price}</Badge>
                      </div>
                      <div className="grid gap-2 text-sm">
                        <div className="grid grid-cols-2 gap-1">
                          <span className="text-muted-foreground">Company:</span>
                          <span>{booking.company}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <span className="text-muted-foreground">Vehicle:</span>
                          <span>{booking.model} ({booking.type})</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <span className="text-muted-foreground">Pickup:</span>
                          <span>
                            {formatDate(booking.pickupDate)} at {booking.pickupLocation}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <span className="text-muted-foreground">Drop-off:</span>
                          <span>
                            {formatDate(booking.dropoffDate)} at {booking.dropoffLocation}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <span className="text-muted-foreground">Price per Day:</span>
                          <span>${booking.pricePerDay}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <span className="text-muted-foreground">Features:</span>
                          <span>{booking.features.slice(0, 3).join(", ")}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Billing Summary */}
              <div className="rounded-lg border bg-muted p-4">
                <h3 className="mb-2 font-semibold">Billing Summary</h3>
                <div className="space-y-1 text-sm">
                  {selectedBookings.map((booking, index) => (
                    <div key={index} className="flex justify-between">
                      <span>
                        {isFlight(booking)
                          ? "Flight Booking"
                          : isHotel(booking)
                          ? "Hotel Booking"
                          : "Car Rental"}
                      </span>
                      <span>${booking.price}</span>
                    </div>
                  ))}
                  <div className="border-t pt-1">
                    <div className="flex justify-between font-medium">
                      <span>Total (added to monthly bill):</span>
                      <span>
                        $
                        {selectedBookings
                          .reduce((sum, item) => sum + item.price, 0)
                          .toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between gap-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleNewSearch}
            >
              Back to Search
            </Button>
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 transition-all hover:from-blue-700 hover:to-green-700"
              onClick={handleConfirmBooking}
            >
              Confirm Booking
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
