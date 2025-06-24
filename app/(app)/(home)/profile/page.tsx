import Footer from "@/components/footer";

export default function ProfilePage() {
  return (
    <div className="overflow-hidden">
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Profile Page</h1>
        <p className="text-gray-600">This is the profile page.</p>
      </div>
      <Footer />
    </div>
  );
}
