"use client";

import { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";

import { Tournament, getTournamentById } from "@/lib/mock-data";
import {
  initializeLocalStorage,
  isRegisteredForTournament,
  registerForTournament,
  formatDate,
  formatCurrency,
  daysUntil,
} from "@/lib/tournament-api";

// Mock player data (would come from user profile in a real app)
const playerData = {
  name: "Alex Thompson",
  email: "alex.thompson@example.com",
  phone: "+1 (555) 123-4567",
  country: "United States",
  ranking: 87,
  dateOfBirth: "1995-06-15",
};

export default function TournamentRegistrationPage({
  params,
}: {
  params: { tournamentId: string };
}) {
  const router = useRouter();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(1);
  const [formData, setFormData] = useState({
    entryCategory: "Main Draw",
    accommodationNeeded: false,
    specialRequests: "",
    termsAccepted: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    initializeLocalStorage();
    const tournamentData = getTournamentById(params.tournamentId);

    if (tournamentData) {
      setTournament(tournamentData);
      setIsRegistered(isRegisteredForTournament(params.tournamentId));
    }

    setLoading(false);
  }, [params.tournamentId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean | "indeterminate") => {
    setFormData((prev) => ({ ...prev, [name]: checked === true }));
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.entryCategory) {
      errors.entryCategory = "Please select an entry category";
    }

    if (!formData.termsAccepted) {
      errors.termsAccepted = "You must accept the terms and conditions";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Register for the tournament
      registerForTournament(params.tournamentId, formData.entryCategory);
      setRegistrationSuccess(true);
      setRegistrationStep(3); // Move to confirmation step
    } catch (error) {
      console.error("Registration failed:", error);
      setFormErrors({
        submit: "Registration failed. Please try again.",
      });
    }
  };

  const handleNextStep = () => {
    if (registrationStep === 1) {
      setRegistrationStep(2);
    }
  };

  const handlePreviousStep = () => {
    if (registrationStep === 2) {
      setRegistrationStep(1);
    }
  };

  if (loading) {
    return (
      <div className="container flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg font-medium">Loading registration form...</p>
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

  if (isRegistered) {
    return (
      <div className="container py-10">
        <div className="flex flex-col items-center justify-center rounded-lg border border-green-200 bg-green-50 p-10 text-center">
          <Icons.tennis className="mb-4 h-12 w-12 text-green-600" />
          <h3 className="mb-2 text-lg font-medium text-green-800">
            You&apos;re already registered for this tournament
          </h3>
          <p className="mb-6 text-green-700">
            You have already registered for {tournament.name}. You can view your
            registration details in My Tournaments.
          </p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => router.push(`/tournaments/${tournament.id}`)}
            >
              Tournament Details
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => router.push("/tournaments/my-tournaments")}
            >
              My Tournaments
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (tournament.status !== "registration_open") {
    return (
      <div className="container py-10">
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
          <Icons.calendar className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-medium">Registration not available</h3>
          <p className="mb-6 text-muted-foreground">
            Registration for this tournament is currently not open.
          </p>
          <Button onClick={() => router.push(`/tournaments/${tournament.id}`)}>
            View Tournament Details
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      {/* Back button */}
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/tournaments/${tournament.id}`)}
          className="flex items-center gap-1"
        >
          <Icons.calendar className="h-4 w-4" />
          <span>Back to Tournament Details</span>
        </Button>
      </div>

      {/* Registration Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Register for {tournament.name}
        </h1>
        <p className="text-muted-foreground">
          Complete the registration form to secure your spot in the tournament.
        </p>
      </div>

      {/* Registration Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                registrationStep >= 1
                  ? "bg-primary text-primary-foreground"
                  : "border border-muted-foreground bg-background text-muted-foreground"
              }`}
            >
              1
            </div>
            <span
              className={
                registrationStep >= 1 ? "font-medium" : "text-muted-foreground"
              }
            >
              Player Information
            </span>
          </div>
          <div className="h-px flex-1 bg-muted mx-4" />
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                registrationStep >= 2
                  ? "bg-primary text-primary-foreground"
                  : "border border-muted-foreground bg-background text-muted-foreground"
              }`}
            >
              2
            </div>
            <span
              className={
                registrationStep >= 2 ? "font-medium" : "text-muted-foreground"
              }
            >
              Tournament Options
            </span>
          </div>
          <div className="h-px flex-1 bg-muted mx-4" />
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                registrationStep >= 3
                  ? "bg-primary text-primary-foreground"
                  : "border border-muted-foreground bg-background text-muted-foreground"
              }`}
            >
              3
            </div>
            <span
              className={
                registrationStep >= 3 ? "font-medium" : "text-muted-foreground"
              }
            >
              Confirmation
            </span>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit}>
        {/* Step 1: Player Information */}
        {registrationStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Player Information</CardTitle>
              <CardDescription>
                Review your player information for the tournament registration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={playerData.name}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={playerData.email}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={playerData.phone}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={playerData.country}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ranking">Current Ranking</Label>
                  <Input
                    id="ranking"
                    value={playerData.ranking.toString()}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    value={format(new Date(playerData.dateOfBirth), "PPP")}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="rounded-md bg-muted p-4">
                <div className="flex items-center gap-2">
                  <Icons.info className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    To update your player information, please visit your profile
                    settings before completing the registration.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/tournaments/${tournament.id}`)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleNextStep}>
                Next Step
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 2: Tournament Options */}
        {registrationStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Tournament Options</CardTitle>
              <CardDescription>
                Select your preferences for the tournament.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="entryCategory">Entry Category</Label>
                <Select
                  value={formData.entryCategory}
                  onValueChange={(value) =>
                    handleSelectChange("entryCategory", value)
                  }
                >
                  <SelectTrigger id="entryCategory">
                    <SelectValue placeholder="Select entry category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Main Draw">Main Draw</SelectItem>
                    <SelectItem value="Qualifying">Qualifying</SelectItem>
                    <SelectItem value="Wild Card">Wild Card</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.entryCategory && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.entryCategory}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="accommodationNeeded"
                    checked={formData.accommodationNeeded}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        "accommodationNeeded",
                        checked
                      )
                    }
                  />
                  <Label htmlFor="accommodationNeeded" className="text-sm">
                    I need assistance with accommodation
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialRequests">Special Requests</Label>
                <Textarea
                  id="specialRequests"
                  name="specialRequests"
                  placeholder="Any special requests or requirements..."
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  className="min-h-[100px]"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Tournament Information</h3>
                <div className="rounded-md bg-muted p-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Tournament Name
                      </p>
                      <p className="font-medium">{tournament.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Dates</p>
                      <p className="font-medium">
                        {formatDate(tournament.startDate)} -{" "}
                        {formatDate(tournament.endDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{tournament.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Surface</p>
                      <p className="font-medium">{tournament.surface}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Registration Deadline
                      </p>
                      <p className="font-medium">
                        {formatDate(tournament.registrationDeadline)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Entry Fee</p>
                      <p className="font-medium">
                        {tournament.entryFee
                          ? formatCurrency(tournament.entryFee)
                          : "No entry fee"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="termsAccepted"
                    checked={formData.termsAccepted}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("termsAccepted", checked)
                    }
                  />
                  <Label htmlFor="termsAccepted" className="text-sm">
                    I accept the tournament rules and conditions
                  </Label>
                </div>
                {formErrors.termsAccepted && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.termsAccepted}
                  </p>
                )}
              </div>

              {formErrors.submit && (
                <div className="rounded-md bg-red-50 p-3 text-red-500">
                  {formErrors.submit}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={handlePreviousStep}>
                Previous Step
              </Button>
              <Button type="submit">Register</Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 3: Confirmation */}
        {registrationStep === 3 && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle className="text-green-800">
                    Registration Confirmed!
                  </CardTitle>
                  <CardDescription className="text-green-700">
                    You have successfully registered for {tournament.name}.
                  </CardDescription>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <Icons.tennis className="h-6 w-6" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-md bg-white p-6">
                <h3 className="mb-4 text-lg font-medium">
                  Registration Details
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tournament Name
                    </p>
                    <p className="font-medium">{tournament.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dates</p>
                    <p className="font-medium">
                      {formatDate(tournament.startDate)} -{" "}
                      {formatDate(tournament.endDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{tournament.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Entry Category
                    </p>
                    <p className="font-medium">{formData.entryCategory}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Registration Date
                    </p>
                    <p className="font-medium">
                      {formatDate(new Date().toISOString())}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className="bg-green-600">Confirmed</Badge>
                  </div>
                </div>
              </div>

              <div className="rounded-md bg-blue-50 p-4 text-blue-800">
                <div className="flex items-start gap-2">
                  <Icons.info className="mt-0.5 h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Next Steps</p>
                    <ul className="mt-1 list-inside list-disc space-y-1 text-sm">
                      <li>
                        Check your email for a confirmation of your registration
                      </li>
                      <li>
                        Book your travel and accommodation for the tournament
                      </li>
                      <li>
                        Visit the tournament page regularly for updates and
                        schedule information
                      </li>
                      <li>
                        Contact the tournament organizers if you have any
                        questions
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push("/tournaments/my-tournaments")}
              >
                My Tournaments
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-green-600 to-green-800"
                onClick={() =>
                  router.push(`/travel-booking?tournament=${tournament.id}`)
                }
              >
                Book Travel
              </Button>
            </CardFooter>
          </Card>
        )}
      </form>
    </div>
  );
}
