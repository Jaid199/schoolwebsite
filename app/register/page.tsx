import RegistrationForm from "@/components/registration-form";
import Footer from "@/components/footer"; // Import the Footer component

export default function RegisterPage() {
  return (
    <>
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <RegistrationForm />
      </main>
      <Footer /> {/* Add the Footer component here */}
    </>
  );
}
