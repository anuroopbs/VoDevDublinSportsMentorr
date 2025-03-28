"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Check } from "lucide-react"

export default function FundPage() {
  const [amount, setAmount] = useState("25")
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // This would normally connect to Stripe
    setShowSuccess(true)

    // Reset after 3 seconds
    setTimeout(() => {
      setShowSuccess(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Support Our Mission</h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto text-center mb-12">
          Your contribution helps us introduce more people to sports and create a healthier, more connected community in
          Dublin and beyond.
        </p>

        <div className="max-w-md mx-auto">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Make a Donation
              </CardTitle>
              <CardDescription className="text-zinc-400">
                All donations go directly to supporting our programs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Donation Amount</Label>
                    <RadioGroup
                      defaultValue="25"
                      value={amount}
                      onValueChange={setAmount}
                      className="grid grid-cols-3 gap-4"
                    >
                      <div>
                        <RadioGroupItem value="10" id="amount-10" className="peer sr-only" />
                        <Label
                          htmlFor="amount-10"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-zinc-800 bg-zinc-950 p-4 hover:bg-zinc-800 hover:text-white peer-data-[state=checked]:border-white [&:has([data-state=checked])]:border-white"
                        >
                          <span className="text-sm font-normal">€10</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="25" id="amount-25" className="peer sr-only" />
                        <Label
                          htmlFor="amount-25"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-zinc-800 bg-zinc-950 p-4 hover:bg-zinc-800 hover:text-white peer-data-[state=checked]:border-white [&:has([data-state=checked])]:border-white"
                        >
                          <span className="text-sm font-normal">€25</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="50" id="amount-50" className="peer sr-only" />
                        <Label
                          htmlFor="amount-50"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-zinc-800 bg-zinc-950 p-4 hover:bg-zinc-800 hover:text-white peer-data-[state=checked]:border-white [&:has([data-state=checked])]:border-white"
                        >
                          <span className="text-sm font-normal">€50</span>
                        </Label>
                      </div>
                      <div className="col-span-3">
                        <RadioGroupItem value="custom" id="amount-custom" className="peer sr-only" />
                        <Label
                          htmlFor="amount-custom"
                          className="flex items-center justify-between rounded-md border-2 border-zinc-800 bg-zinc-950 p-4 hover:bg-zinc-800 hover:text-white peer-data-[state=checked]:border-white [&:has([data-state=checked])]:border-white"
                        >
                          <span className="text-sm font-normal">Custom Amount</span>
                          <Input
                            type="number"
                            placeholder="€"
                            className="w-24 bg-zinc-800 border-zinc-700"
                            onClick={() => setAmount("custom")}
                          />
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your name" className="bg-zinc-800 border-zinc-700" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="bg-zinc-800 border-zinc-700"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="card">Card Information</Label>
                    <Input id="card" placeholder="Card number" className="bg-zinc-800 border-zinc-700 mb-2" required />
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="MM/YY" className="bg-zinc-800 border-zinc-700" required />
                      <Input placeholder="CVC" className="bg-zinc-800 border-zinc-700" required />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full mt-6 bg-white text-black hover:bg-zinc-200">
                  Donate {amount !== "custom" ? `€${amount}` : ""}
                </Button>
              </form>
            </CardContent>
          </Card>

          {showSuccess && (
            <div className="mt-6 bg-zinc-900 border border-green-500 rounded-lg p-4 flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <p>Thank you for your donation! Your support means a lot to us.</p>
            </div>
          )}
        </div>

        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">How Your Donation Helps</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="bg-zinc-800 rounded-full p-1 mr-3 mt-1">
                <Check className="h-4 w-4" />
              </span>
              <p className="text-zinc-400">
                <strong className="text-white">Equipment and Facilities:</strong> Providing sports equipment and
                securing facilities for training sessions.
              </p>
            </li>
            <li className="flex items-start">
              <span className="bg-zinc-800 rounded-full p-1 mr-3 mt-1">
                <Check className="h-4 w-4" />
              </span>
              <p className="text-zinc-400">
                <strong className="text-white">Coaching Programs:</strong> Supporting our coaches and developing new
                training programs.
              </p>
            </li>
            <li className="flex items-start">
              <span className="bg-zinc-800 rounded-full p-1 mr-3 mt-1">
                <Check className="h-4 w-4" />
              </span>
              <p className="text-zinc-400">
                <strong className="text-white">Community Outreach:</strong> Expanding our reach to introduce more people
                to sports.
              </p>
            </li>
            <li className="flex items-start">
              <span className="bg-zinc-800 rounded-full p-1 mr-3 mt-1">
                <Check className="h-4 w-4" />
              </span>
              <p className="text-zinc-400">
                <strong className="text-white">Technology:</strong> Improving our platform to better connect players and
                coaches.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

