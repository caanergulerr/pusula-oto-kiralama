"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { CheckoutForm } from "./checkout-form"
import { toast } from "sonner"

// Initialize Stripe outside to avoid recreation
const stripePromise = loadStripe("pk_test_51MockKeyForDevelopmentOnly"); // Replace with env var in real app

interface BookingModalProps {
    car: any
}

export function BookingModal({ car }: BookingModalProps) {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [endDate, setEndDate] = useState<Date | undefined>(new Date())
    const [step, setStep] = useState(1) // 1: Details, 2: Payment
    const [loading, setLoading] = useState(false)

    const calculateTotal = () => {
        if (!date || !endDate) return 0;
        const diffTime = Math.abs(endDate.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        return diffDays * car.dailyPrice;
    }

    const handleBookingSuccess = async (transactionId: string) => {
        // Create actual booking
        try {
            const res = await fetch("http://localhost:3000/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // headers: { "Authorization": `Bearer ${token}` }
                body: JSON.stringify({
                    carId: car.id,
                    startDate: date,
                    endDate: endDate,
                    transactionId
                })
            })

            if (res.ok) {
                toast.success("Booking confirmed!")
                setStep(1) // Close or reset?
                // Close dialog logic here usually via open state
            } else {
                toast.error("Booking failed on server")
            }
        } catch (err) {
            console.error(err)
            toast.error("Network error")
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="lg" className="flex-1 text-lg h-14">Book This Car</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Rent {car.brand} {car.model}</DialogTitle>
                </DialogHeader>

                {step === 1 && (
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col space-y-2">
                                <Label>Pick-up Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="flex flex-col space-y-2">
                                <Label>Drop-off Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div className="rounded-lg bg-muted p-4">
                            <div className="flex justify-between font-semibold">
                                <span>Total Price:</span>
                                <span className="text-primary text-xl">${calculateTotal()}</span>
                            </div>
                        </div>

                        <Button onClick={() => setStep(2)} className="w-full">Proceed to Payment</Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="py-4">
                        <p className="mb-4 text-sm text-muted-foreground">Complete your payment securely with Stripe.</p>
                        {/** In a real app, you'd create PaymentIntent here to get clientSecret 
                      Wait, the Elements provider needs clientSecret or mode usually. 
                      Ideally we fetch clientSecret BEFORE showing Elements.
                      Let's wrap Elements with a loader. 
                  **/}
                        <Elements stripe={stripePromise} options={{
                            mode: 'payment',
                            amount: Math.round(calculateTotal() * 100),
                            currency: 'usd'
                        }}>
                            <CheckoutForm amount={calculateTotal()} onSuccess={handleBookingSuccess} />
                        </Elements>

                        <Button variant="ghost" onClick={() => setStep(1)} className="mt-2 w-full">Back</Button>
                    </div>
                )}

            </DialogContent>
        </Dialog>
    )
}
