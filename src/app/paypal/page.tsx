'use client'

import PayPalButton from "@/components/PayPalButton"


export default function PaypalButtonComp() {

    function handleSuccess() {
        alert("success")
    }

    function handleError() {
        alert("error")
    }

    return (
        <div>
            <PayPalButton
              amount={20}
              onSuccess={handleSuccess}
              onError={handleError}
              className="mt-4"
            />
        </div>
    )
}