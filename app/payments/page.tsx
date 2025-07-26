"use client";

import type React from "react";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  ArrowLeft,
  Building2,
  Upload,
  FileImage,
} from "lucide-react";
import { toast } from "sonner";

// Race categories with pricing
const raceCategories = {
  "5k-race": { name: "5K Race", fee: 300, prize: "MVR 3,000" },
  "10k-race": { name: "10K Race", fee: 350, prize: "MVR 5,000" },
  "half-marathon": { name: "Half Marathon", fee: 450, prize: "MVR 7,500" },
  "full-marathon": { name: "Full Marathon", fee: 550, prize: "MVR 10,000" },
};

interface Participant {
  fullName: string;
  email: string;
  phoneNumber: string;
  tshirtSize: string;
}

interface RegistrationData {
  id: string;
  category: string;
  participant: Participant;
  includeTshirt: boolean;
  totalPrice: number;
}

export default function PaymentPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [participants, setParticipants] = useState<RegistrationData[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [submissionMessage, setSubmissionMessage] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");

  useEffect(() => {
    // Get participants data from localStorage
    const storedParticipants = localStorage.getItem('checkoutParticipants');
    if (storedParticipants) {
      const parsedParticipants = JSON.parse(storedParticipants);
      setParticipants(parsedParticipants);
      
      // Calculate total amount
      const total = parsedParticipants.reduce((sum: number, participant: RegistrationData) => {
        return sum + participant.totalPrice;
      }, 0);
      setTotalAmount(total);
    } else {
      // No participants data, redirect back to register page
      toast.error("No Registration Data Found", {
        description: "Please complete your registration first before proceeding to payment.",
        style: {
          background: '#fef2f2',
          color: '#991b1b',
          border: '1px solid #fecaca',
        },
      });
      router.push('/register');
    }
  }, [router]);

  const getCategoryDisplayName = (category: string) => {
    const categoryMap: Record<string, string> = {
      "5k-race": "5K Race",
      "10k-race": "10K Race",
      "half-marathon": "Half Marathon",
      "full-marathon": "Full Marathon"
    };
    return categoryMap[category] || category;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (file.type === "image/png" || file.type === "image/jpeg") {
        setSelectedFile(file);
        toast.success("File Selected Successfully", {
          description: `${file.name} has been selected and is ready for upload.`,
        });
      } else {
        toast.error("Invalid File Type", {
          description: "Please select a PNG or JPEG image file only.",
          style: {
            background: '#fef2f2',
            color: '#991b1b',
            border: '1px solid #fecaca',
          },
        });
        event.target.value = "";
      }
    }
  };

  const handleCardPayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSubmissionMessage({
        success: true,
        message: "Card payment successful! Registration completed.",
      });

      toast.success("Payment Successful!", {
        description: "Your registration has been confirmed. You will receive a confirmation email shortly.",
      });

      // Clear participants data from localStorage
      localStorage.removeItem("checkoutParticipants");
      
      // Redirect to home page after successful payment
      setTimeout(() => {
        router.push('/');
      }, 2000);
    });
  };

  const handleBankingPayment = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!selectedFile) {
      toast.error("Payment Slip Required", {
        description: "Please upload your payment slip before submitting.",
        style: {
          background: '#fef2f2',
          color: '#991b1b',
          border: '1px solid #fecaca',
        },
      });
      return;
    }

    startTransition(async () => {
      // Simulate file upload and processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmissionMessage({
        success: true,
        message:
          "Payment slip uploaded successfully! Your registration is under review.",
      });

      toast.success("Payment Slip Uploaded!", {
        description:
          "We will verify your payment and confirm your registration within 24 hours.",
      });

      // Clear participants data from localStorage
      localStorage.removeItem("checkoutParticipants");
      
      // Redirect to home page after successful payment
      setTimeout(() => {
        router.push('/');
      }, 2000);
    });
  };

  if (participants.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-6xl">
        <div className="text-center">
          <p>Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/register")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Registration
        </Button>
        <h1 className="text-3xl font-bold">Complete Your Payment</h1>
        <p className="text-gray-600 mt-2">
          Review your registration details and complete payment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Bill Details */}
        <Card>
          <CardHeader>
            <CardTitle>Registration Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Participant Details */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Participant Details</h4>
              {participants.map((registration) => (
                <div key={registration.id} className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium">
                    {registration.participant.fullName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {registration.participant.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    {registration.participant.phoneNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    Category: {getCategoryDisplayName(registration.category)}
                  </p>
                  <p className="text-sm text-gray-600">
                    T-shirt: {registration.includeTshirt ? `Yes (${registration.participant.tshirtSize})` : 'No'}
                  </p>
                </div>
              ))}
            </div>

            <Separator />

            {/* Cost Breakdown */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Cost Breakdown</h4>
              {participants.map((registration) => (
                <div key={registration.id} className="space-y-2">
                  <div className="flex justify-between">
                    <span>{registration.participant.fullName}:</span>
                    <span className="font-medium">
                      {getCategoryDisplayName(registration.category)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Entry Fee:</span>
                    <span>
                      MVR {raceCategories[registration.category as keyof typeof raceCategories]?.fee}
                    </span>
                  </div>
                  {registration.includeTshirt && (
                    <div className="flex justify-between">
                      <span>T-shirt:</span>
                      <span>MVR 50</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium">
                    <span>Subtotal:</span>
                    <span>MVR {registration.totalPrice}</span>
                  </div>
                  <Separator />
                </div>
              ))}
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>MVR {totalAmount}</span>
              </div>
            </div>

            {/* Banking Details for Internet Banking */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">
                Bank Transfer Details
              </h4>
              <div className="text-sm text-green-700 space-y-1">
                <p>
                  <strong>Bank:</strong> Maldivian Heritage Bank
                </p>
                <p>
                  <strong>Account Name:</strong> Race Event Organization
                </p>
                <p>
                  <strong>Account Number:</strong> 1234567890
                </p>
                <p>
                  <strong>Reference:</strong> RACE-
                  {participants[0]?.participant.fullName
                    .replace(/\s+/g, "")
                    .toUpperCase()}
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">
                Prize Information
              </h4>
              <p className="text-sm text-blue-700">
                Various prizes for top 3 male & female finishers in each category
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Right Side - Payment Options */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Payment Method Selection */}
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={paymentMethod === "card" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("card")}
                  className="flex items-center justify-center"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Debit/Credit Card
                </Button>
                <Button
                  variant={paymentMethod === "banking" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("banking")}
                  className="flex items-center justify-center"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Internet Banking
                </Button>
              </div>
            </div>

            {/* Credit/Debit Card Payment */}
            {paymentMethod === "card" && (
              <div className="space-y-6">
                <form onSubmit={handleCardPayment} className="space-y-6">
                  {/* Credit Card Visual */}
                  <div className="aspect-video max-h-[180px] mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white relative overflow-hidden">
                    <div className="absolute top-4 right-4 w-8 h-6 bg-yellow-400 rounded"></div>
                    <div className="mt-8">
                      <div className="text-lg tracking-widest">
                        •••• •••• •••• ••••
                      </div>
                      <div className="mt-4 flex justify-between">
                        <div>
                          <div className="text-xs opacity-75">VALID THRU</div>
                          <div className="text-sm">MM/YY</div>
                        </div>
                        <div>
                          <div className="text-xs opacity-75">CVV</div>
                          <div className="text-sm">•••</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber" className="mb-2">Card Number</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="cardName" className="mb-2">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        name="cardName"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="expiryMonth" className="mb-2">Month</Label>
                        <Select name="expiryMonth" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem
                                key={i + 1}
                                value={String(i + 1).padStart(2, "0")}
                              >
                                {String(i + 1).padStart(2, "0")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="expiryYear" className="mb-2">Year</Label>
                        <Select name="expiryYear" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => (
                              <SelectItem
                                key={i}
                                value={String(new Date().getFullYear() + i)}
                              >
                                {new Date().getFullYear() + i}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="mb-2">CVV</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          placeholder="123"
                          maxLength={3}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isPending}
                  >
                    {isPending ? "Processing Payment..." : `Pay Now - MVR ${totalAmount}`}
                  </Button>
                </form>
              </div>
            )}

            {/* Internet Banking Payment */}
            {paymentMethod === "banking" && (
              <div className="space-y-6">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <Building2 className="w-12 h-12 mx-auto text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Internet Banking Payment
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Transfer the amount to our bank account and upload the
                    payment slip below
                  </p>
                </div>

                <form onSubmit={handleBankingPayment} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="paymentSlip">Upload Payment Slip</Label>
                      <div className="mt-2">
                        <div className="flex items-center justify-center w-full">
                          <label
                            htmlFor="paymentSlip"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              {selectedFile ? (
                                <>
                                  <FileImage className="w-8 h-8 mb-2 text-green-500" />
                                  <p className="text-sm text-green-600 font-medium">
                                    {selectedFile.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    File selected successfully
                                  </p>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                  <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">
                                      Click to upload
                                    </span>{" "}
                                    payment slip
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    PNG or JPEG (MAX. 5MB)
                                  </p>
                                </>
                              )}
                            </div>
                            <Input
                              id="paymentSlip"
                              name="paymentSlip"
                              type="file"
                              accept=".png,.jpeg,.jpg"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-medium text-yellow-800 mb-2">
                        Important Instructions:
                      </h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>
                          • Make sure to include the reference number in your
                          transfer
                        </li>
                        <li>• Upload a clear image of your payment slip</li>
                        <li>
                          • Your registration will be confirmed within 24 hours
                          after verification
                        </li>
                        <li>• Keep your payment slip for your records</li>
                      </ul>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isPending}
                  >
                    {isPending
                      ? "Uploading Payment Slip..."
                      : `Submit Payment Slip - MVR ${totalAmount}`}
                  </Button>
                </form>
              </div>
            )}

            {submissionMessage && (
              <div
                className={`mt-4 p-3 rounded-md text-center ${
                  submissionMessage.success
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {submissionMessage.message}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 