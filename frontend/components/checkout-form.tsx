"use client"

import { useState } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface CheckoutFormProps {
    amount: number
    onSuccess: (transactionId: string) => void
}

export function CheckoutForm({ amount, onSuccess }: CheckoutFormProps) {
    const stripe = useStripe()
    const elements = useElements()
    const [errorMessage, setErrorMessage] = useState<string>()
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        if (!stripe || !elements) {
            return
        }

        setLoading(true)

        const { error: submitError } = await elements.submit()
        if (submitError) {
            setErrorMessage(submitError.message)
            setLoading(false)
            return
        }

        // Creating the PaymentIntent on the server
        const res = await fetch("http://localhost:3000/payments/create-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount }),
            // TODO: Add Authorization header here once Auth is integrated fully
            // For now, we might need a mock token or bypass if AuthGuard is active. 
            // Assuming user is logged in and we attach token.
            // headers: { "Authorization": `Bearer ${token}` }
        })

        // Quick fix for Auth: If 401, show error.Ideally we use a context for Auth.
        if (res.status === 401) {
            setErrorMessage("Please login to complete payment")
            setLoading(false)
            return
        }

        const { clientSecret, transactionId } = await res.json()

        const { error } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: "http://localhost:3000/payment-success", // Placeholder
            },
            redirect: 'if_required'
        })

        if (error) {
            setErrorMessage(error.message)
        } else {
            // Payment successful
            toast.success("Payment successful!")
            onSuccess(transactionId)
        }

        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />
            {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
            <Button disabled={!stripe || loading} className="w-full mt-4">
                {loading ? "Processing..." : `Pay $${amount}`}
            </Button>
        </form>
    )
}
