import { Button } from "@/components/ui/button";

interface PayWithCardProps {
  User: {
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    clerkUserId: string;
    firstName: string | null;
    lastName: string | null;
    profileImage: string | null;
    phoneNumber: string | null;
  };
}

export default function PayWithCard({
  amount,
  user,
}: {
  amount: number;
  user: PayWithCardProps["User"];
}) {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">
        <span className="text-2xl font-black">{user?.firstName}</span>,
        you&apos;re about to complete a booking.
      </h1>
      <p className=" my-3 text-lg text-gray-500">
        Please confirm your payment of{" "}
        <span className="text-black font-bold">Ksh {amount}</span> via card, to
        complete your booking.
      </p>

      <Button>Complete Payment</Button>
    </div>
  );
}
