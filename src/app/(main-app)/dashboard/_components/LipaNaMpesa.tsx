interface LipaNaMpesaProps {
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

export default function LipaNaMpesa({
  amount,
  user,
}: {
  amount: number;
  user: LipaNaMpesaProps["User"];
}) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">
        <span className="text-3xl font-black">{user?.firstName}</span>, your are
        about to book a flight
      </h1>
    </div>
  );
}
