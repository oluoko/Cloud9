"use client";

// import PaystackPop from "@paystack/inline-js";
import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function PaystackPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState(1);
  const [userName, setUserName] = useState("");

  let access_code;

  const initatePayment = async (e: FormEvent) => {
    try {
      const initiateRes = await fetch("/api/paystack/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          phoneNumber,
          userName,
          email: "johndoe@gmail.com",
        }),
      });

      const initateData = initiateRes.json();
    } catch {}
  };
  //   const popup = new PaystackPop();
  // popup.resumeTransaction(access_code);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <form className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="font-bold text-2xl my-2">
          Pay with Paystack - Lipa Na Mpesa
        </h2>
        <div className="mb-4">
          <Label>Phone Number</Label>
          <Input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            placeholder="Enter your phone number"
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Label>User Name</Label>
          <Input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
        <div className="mb-4">
          <Label>Amount to Pay</Label>
          <Input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
        <Button onClick={initatePayment}>Pay with Lipa na Mpesa</Button>
      </form>
    </div>
  );
}
