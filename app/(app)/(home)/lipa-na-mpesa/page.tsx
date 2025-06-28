"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import LipaNaMpesa from "../(user-dashboard)/_components/lipa-na-mpesa";

export default function PaystacPaymentPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState(1);
  const [userName, setUserName] = useState("");

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      {/* Dummy Lipa na Mpesa payment form */}
      <h1 className="text-2xl font-bold mb-4">Lipa na Mpesa Payment Form</h1>
      <form className="bg-white p-6 rounded shadow-md w-96">
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
        <Dialog>
          <DialogTrigger asChild>
            <Button>Pay with Lipa na Mpesa</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>You&apos;re about to complete a booking.</DialogTitle>
            <LipaNaMpesa
              amount={amount}
              phoneNumber={phoneNumber}
              userName={userName}
            />
          </DialogContent>
        </Dialog>
      </form>
    </div>
  );
}
