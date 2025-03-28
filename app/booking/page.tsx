"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, isToday, isBefore, startOfDay } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { AuthDialog } from "@/components/auth/auth-dialog"

// Generate time slots from 6am to 10pm
const generateTimeSlots = () => {
  const slots = []
  for (let hour = 6; hour <= 22; hour++) {
    const hourFormatted = hour % 12 === 0 ? 12 : hour % 12
    const period = hour < 12 ? "AM" : "PM"
    slots.push(`${hourFormatted}:00 ${period}`)
    if (hour !== 22) {
      slots.push(`${hourFormatted}:30 ${period}`)
    }
  }
  return slots
}

const timeSlots = generateTimeSlots()

// Available sports
const sports = [
  {
    id: "squash",
    name: "Squash Coaching",
    description: "One-on-one coaching with our professional squash coaches",
    available: true,
  },
  {
    id: "tennis",
    name: "Tennis Coaching (Coming Soon)",
    description: "Learn tennis techniques and strategies with our experienced coaches",
    available: false,
  },
  {
    id: "padel",
    name: "Padel Coaching (Coming Soon)",
    description: "Learn the exciting sport of padel with our certified coaches",
    available: false,
  },
  {
    id: "badminton",
    name: "Badminton Coaching (Coming Soon)",
    description: "Improve your badminton skills with personalized coaching",
    available: false,
  },
  {
    id: "table-tennis",
    name: "Table Tennis Coaching (Coming Soon)",
    description: "Develop your table tennis skills with expert guidance",
    available: false,
  },
]

export default function BookingPage() {
  const { user, loading } = useAuth()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [timeSlot, setTimeSlot] = useState<string | undefined>()
  const [selectedSport, setSelectedSport] = useState<string | undefined>("squash")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    notes: "",
  })

  // Prefill form with user data if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.displayName || "",
        email: user.email || "",
      }))
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // If user is not logged in, show auth dialog
    if (!user && !loading) {
      setShowAuthDialog(true)
      return
    }

    // In a real app, this would send the data to the server
    setShowConfirmation(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setShowConfirmation(false)
    }, 3000)
  }

  // Function to disable past dates
  const disabledDays = (date: Date) => {
    return isBefore(date, startOfDay(new Date()))
  }

  const selectedSportDetails = sports.find((sport) => sport.id === selectedSport)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Book a Coaching Session</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="md:col-span-2">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle>Booking Form</CardTitle>
              <CardDescription>
                Fill out the form below to book a coaching session with one of our professional coaches.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sport-select">Select Sport *</Label>
                    <Select value={selectedSport} onValueChange={setSelectedSport}>
                      <SelectTrigger id="sport-select" className="w-full">
                        <SelectValue placeholder="Select a sport" />
                      </SelectTrigger>
                      <SelectContent>
                        {sports.map((sport) => (
                          <SelectItem key={sport.id} value={sport.id} disabled={!sport.available}>
                            {sport.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedSportDetails && (
                      <p className="text-sm text-gray-500 mt-2">{selectedSportDetails.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="date">Select Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Select a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            disabled={disabledDays}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time-slot">Select Time *</Label>
                      <Select value={timeSlot} onValueChange={setTimeSlot}>
                        <SelectTrigger id="time-slot" className="w-full">
                          <SelectValue placeholder="Select a time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                {slot}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience Level</Label>
                      <Select
                        name="experience"
                        value={formData.experience}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, experience: value }))}
                      >
                        <SelectTrigger id="experience">
                          <SelectValue placeholder="Select your experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="first-time">Trying it for the first time</SelectItem>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any specific areas you'd like to focus on or additional information for the coach"
                      className="min-h-[100px]"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800" id="submit-btn">
                  Book Session
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-white border-gray-200 sticky top-4">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Selected Sport</p>
                <p className="font-medium">{selectedSportDetails?.name || "Not selected"}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="font-medium">{date ? format(date, "PPP") : "Not selected"}</p>
                {date && isToday(date) && <p className="text-xs text-green-600">Today</p>}
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Time</p>
                <p className="font-medium">{timeSlot || "Not selected"}</p>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <p className="text-sm font-medium text-gray-500 mb-2">What to bring:</p>
                <ul className="text-sm space-y-1">
                  <li>• Appropriate sports attire</li>
                  <li>• Water bottle</li>
                  <li>• Towel</li>
                  {selectedSport === "squash" && (
                    <>
                      <li>• Squash racket (if you have one)</li>
                      <li>• Non-marking court shoes</li>
                    </>
                  )}
                  {selectedSport === "tennis" && (
                    <>
                      <li>• Tennis racket (if you have one)</li>
                      <li>• Tennis shoes</li>
                    </>
                  )}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-200 flex flex-col items-start pt-4">
              <p className="text-sm text-gray-500 mb-2">Need to reschedule or cancel?</p>
              <p className="text-sm text-gray-500">
                Contact us at least 24 hours before your session at{" "}
                <span className="font-medium">bookings@dublinsportsmentor.com</span>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" id="confirmationModal">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-green-600">Booking Confirmed!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center">
                Your booking request has been sent successfully. We'll contact you shortly to confirm your appointment.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => setShowConfirmation(false)}>Close</Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Auth Dialog */}
      <AuthDialog isOpen={showAuthDialog} onClose={() => setShowAuthDialog(false)} defaultTab="login" />
    </div>
  )
}

