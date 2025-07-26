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

interface RegistrationData {
  category: string;
  mainParticipant: {
    fullName: string;
    email: string;
    phoneNumber: string;
    tshirtSize: string;
  };
  addFriend: boolean;
  friendParticipant?: {
    fullName: string;
    email: string;
    phoneNumber: string;
    tshirtSize: string;
  };
  includeTshirt: boolean;
}

export default function PaymentPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [registrationData, setRegistrationData] =
    useState<RegistrationData | null>(null);
  const [submissionMessage, setSubmissionMessage] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");

  useEffect(() => {
    // Get registration data from localStorage
    const storedData = localStorage.getItem("registrationData");
    if (storedData) {
      setRegistrationData(JSON.parse(storedData));
    } else {
      // Redirect back to registration if no data found
      toast.error("No registration data found", {
        description: "Please complete registration first.",
      });
      router.push("/registration");
    }
  }, [router]);

  // Calculate total cost
  const calculateTotal = () => {
    if (!registrationData) return 0;

    let total = 0;
    const categoryFee =
      raceCategories[registrationData.category as keyof typeof raceCategories]
        ?.fee || 0;

    total += categoryFee;
    if (registrationData.addFriend) {
      total += categoryFee;
    }
    if (registrationData.includeTshirt) {
      total += 50; // T-shirt cost
      if (registrationData.addFriend) {
        total += 50;
      }
    }
    return total;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (file.type === "image/png" || file.type === "image/jpeg") {
        setSelectedFile(file);
        toast.success("File selected", {
          description: `${file.name} has been selected for upload.`,
        });
      } else {
        toast.error("Invalid file type", {
          description: "Please select a PNG or JPEG file.",
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
        description: "Your card payment has been processed successfully.",
      });

      // Clear registration data from localStorage
      localStorage.removeItem("registrationData");
    });
  };

  const handleBankingPayment = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!selectedFile) {
      toast.error("Payment slip required", {
        description: "Please upload your payment slip to proceed.",
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

      // Clear registration data from localStorage
      localStorage.removeItem("registrationData");
    });
  };

  if (!registrationData) {
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
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium">
                  {registrationData.mainParticipant.fullName}
                </p>
                <p className="text-sm text-gray-600">
                  {registrationData.mainParticipant.email}
                </p>
                <p className="text-sm text-gray-600">
                  {registrationData.mainParticipant.phoneNumber}
                </p>
              </div>

              {registrationData.addFriend &&
                registrationData.friendParticipant && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium">
                      {registrationData.friendParticipant.fullName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {registrationData.friendParticipant.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      {registrationData.friendParticipant.phoneNumber}
                    </p>
                  </div>
                )}
            </div>

            <Separator />

            {/* Cost Breakdown */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Cost Breakdown</h4>
              <div className="flex justify-between">
                <span>Race Category:</span>
                <span className="font-medium">
                  {
                    raceCategories[
                      registrationData.category as keyof typeof raceCategories
                    ]?.name
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span>Entry Fee:</span>
                <span>
                  MVR{" "}
                  {
                    raceCategories[
                      registrationData.category as keyof typeof raceCategories
                    ]?.fee
                  }
                </span>
              </div>
              {registrationData.addFriend && (
                <div className="flex justify-between">
                  <span>Friend Entry Fee:</span>
                  <span>
                    MVR{" "}
                    {
                      raceCategories[
                        registrationData.category as keyof typeof raceCategories
                      ]?.fee
                    }
                  </span>
                </div>
              )}
              {registrationData.includeTshirt && (
                <>
                  <div className="flex justify-between">
                    <span>T-shirt:</span>
                    <span>MVR 50</span>
                  </div>
                  {registrationData.addFriend && (
                    <div className="flex justify-between">
                      <span>Friend T-shirt:</span>
                      <span>MVR 50</span>
                    </div>
                  )}
                </>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>MVR {calculateTotal()}</span>
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
                  {registrationData.mainParticipant.fullName
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
                {
                  raceCategories[
                    registrationData.category as keyof typeof raceCategories
                  ]?.prize
                }{" "}
                for top 3 male & female finishers
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
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white relative overflow-hidden">
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
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        name="cardName"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="expiryMonth">Month</Label>
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
                        <Label htmlFor="expiryYear">Year</Label>
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
                        <Label htmlFor="cvv">CVV</Label>
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
                    {isPending ? "Processing Payment..." : "Pay Now"}
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
                              required
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
                      : "Submit Payment Slip"}
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
