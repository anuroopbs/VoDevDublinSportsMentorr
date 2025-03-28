"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { UserSearch, MapPin, Star, MessageSquare } from "lucide-react"

// Sample player data
const players = [
  {
    id: 1,
    name: "John Smith",
    location: "Dublin City Centre",
    distance: 2.3,
    skill: 4.5,
    experience: "Advanced",
    availability: ["Weekday Evenings", "Weekend Mornings"],
    bio: "Competitive player with 10+ years of experience. Looking for challenging matches to improve my game.",
  },
  {
    id: 2,
    name: "Emily Davis",
    location: "Rathmines",
    distance: 3.8,
    skill: 3.2,
    experience: "Intermediate",
    availability: ["Weekend Afternoons", "Weekend Evenings"],
    bio: "Playing for 3 years and looking to improve my technique. Enjoy friendly matches with players of similar level.",
  },
  {
    id: 3,
    name: "Michael Johnson",
    location: "Blackrock",
    distance: 5.1,
    skill: 4.8,
    experience: "Professional",
    availability: ["Weekday Mornings", "Weekday Afternoons"],
    bio: "Former national team player offering coaching and practice matches. Can adapt to any skill level.",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    location: "Dun Laoghaire",
    distance: 7.4,
    skill: 2.8,
    experience: "Beginner",
    availability: ["Weekday Evenings", "Weekend Afternoons"],
    bio: "New to squash and looking for patient partners to practice with. Eager to learn and improve!",
  },
  {
    id: 5,
    name: "David Brown",
    location: "Sandyford",
    distance: 8.2,
    skill: 3.9,
    experience: "Intermediate",
    availability: ["Weekend Mornings", "Weekend Afternoons"],
    bio: "Casual player for 5 years. Enjoy competitive but friendly matches. Available most weekends.",
  },
  {
    id: 6,
    name: "Jessica Taylor",
    location: "Clontarf",
    distance: 4.5,
    skill: 4.2,
    experience: "Advanced",
    availability: ["Weekday Evenings", "Weekend Evenings"],
    bio: "Competitive player looking for regular matches. Prefer advanced players who can push my limits.",
  },
]

export default function FindPlayerPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [maxDistance, setMaxDistance] = useState(10)
  const [skillLevel, setSkillLevel] = useState<string[]>([])
  const [availability, setAvailability] = useState<string[]>([])
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false)

  // Filter players based on search criteria
  const filteredPlayers = players.filter((player) => {
    // Filter by search term
    if (
      searchTerm &&
      !player.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !player.location.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    // Filter by distance
    if (player.distance > maxDistance) {
      return false
    }

    // Filter by skill level
    if (skillLevel.length > 0 && !skillLevel.includes(player.experience)) {
      return false
    }

    // Filter by availability
    if (availability.length > 0 && !player.availability.some((a) => availability.includes(a))) {
      return false
    }

    return true
  })

  const toggleSkillLevel = (level: string) => {
    setSkillLevel((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]))
  }

  const toggleAvailability = (time: string) => {
    setAvailability((prev) => (prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]))
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center mb-8">
          <UserSearch className="h-8 w-8 mr-3" />
          <h1 className="text-3xl md:text-4xl font-bold">Find Players</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <div className="lg:w-80 shrink-0">
            <Card className="bg-zinc-900 border-zinc-800 sticky top-4">
              <CardHeader>
                <CardTitle>Search Filters</CardTitle>
                <CardDescription className="text-zinc-400">Find the perfect playing partner</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="search">Search by name or location</Label>
                  <Input
                    id="search"
                    placeholder="e.g. John or Dublin City"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Maximum Distance</Label>
                    <span className="text-zinc-400">{maxDistance} km</span>
                  </div>
                  <Slider
                    defaultValue={[10]}
                    max={20}
                    step={1}
                    value={[maxDistance]}
                    onValueChange={(value) => setMaxDistance(value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Skill Level</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Beginner", "Intermediate", "Advanced", "Professional"].map((level) => (
                      <Button
                        key={level}
                        variant={skillLevel.includes(level) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleSkillLevel(level)}
                        className={skillLevel.includes(level) ? "bg-white text-black hover:bg-zinc-200" : ""}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Availability</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      "Weekday Mornings",
                      "Weekday Afternoons",
                      "Weekday Evenings",
                      "Weekend Mornings",
                      "Weekend Afternoons",
                      "Weekend Evenings",
                    ].map((time) => (
                      <Button
                        key={time}
                        variant={availability.includes(time) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleAvailability(time)}
                        className={availability.includes(time) ? "bg-white text-black hover:bg-zinc-200" : ""}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="available-now" checked={showOnlyAvailable} onCheckedChange={setShowOnlyAvailable} />
                  <Label htmlFor="available-now">Show only available now</Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearchTerm("")
                    setMaxDistance(10)
                    setSkillLevel([])
                    setAvailability([])
                    setShowOnlyAvailable(false)
                  }}
                >
                  Reset Filters
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Player Results */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-4">{filteredPlayers.length} Players Found</h2>

            <div className="space-y-6">
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map((player) => (
                  <Card key={player.id} className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                      <div className="flex justify-between">
                        <div>
                          <CardTitle>{player.name}</CardTitle>
                          <CardDescription className="flex items-center text-zinc-400">
                            <MapPin className="h-4 w-4 mr-1" />
                            {player.location} ({player.distance} km away)
                          </CardDescription>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span>{player.skill.toFixed(1)}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="text-sm font-medium mb-1">Experience Level</div>
                        <div className="flex items-center">
                          <span className="bg-zinc-800 text-zinc-200 px-2 py-1 rounded text-xs">
                            {player.experience}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-sm font-medium mb-1">Availability</div>
                        <div className="flex flex-wrap gap-2">
                          {player.availability.map((time) => (
                            <span key={time} className="bg-zinc-800 text-zinc-200 px-2 py-1 rounded text-xs">
                              {time}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-zinc-400 text-sm">{player.bio}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">View Profile</Button>
                      <Button className="bg-white text-black hover:bg-zinc-200">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
                  <UserSearch className="h-12 w-12 mx-auto mb-4 text-zinc-700" />
                  <h3 className="text-xl font-bold mb-2">No Players Found</h3>
                  <p className="text-zinc-400 max-w-md mx-auto">
                    Try adjusting your filters or search criteria to find more players.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

