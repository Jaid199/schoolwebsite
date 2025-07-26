"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { toast } from "sonner";
import { User, Users } from "lucide-react";
import Footer from "./footer";

// Helper function for email validation
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Helper component for participant fields
function ParticipantFields({
  prefix = "",
  title = "Participant Details",
  errors = {},
  onInputChange,
  onSelectChange,
  includeTshirt,
}: {
  prefix?: string;
  title?: string;
  errors?: Record<string, string | undefined>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (value: string, name: string) => void;
  includeTshirt: boolean;
}) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          {prefix === "main" ? (
            <User className="w-4 h-4 mr-2" />
          ) : (
            <Users className="w-4 h-4 mr-2" />
          )}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${prefix}fullName`}>Full Name</Label>
          <Input
            id={`${prefix}fullName`}
            name={`${prefix}fullName`}
            placeholder="Ahmed mohamed"
            required
            onChange={onInputChange}
          />
          {errors[`${prefix}fullName`] && (
            <p className="text-red-500 text-sm">
              {errors[`${prefix}fullName`]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${prefix}email`}>Email</Label>
          <Input
            id={`${prefix}email`}
            name={`${prefix}email`}
            type="email"
            placeholder="ahmed@example.com"
            required
            onChange={onInputChange}
          />
          {errors[`${prefix}email`] && (
            <p className="text-red-500 text-sm">{errors[`${prefix}email`]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${prefix}phoneNumber`}>Phone Number</Label>
          <Input
            id={`${prefix}phoneNumber`}
            name={`${prefix}phoneNumber`}
            type="tel"
            placeholder="960-0000000"
            required
            onChange={onInputChange}
          />
          {errors[`${prefix}phoneNumber`] && (
            <p className="text-red-500 text-sm">
              {errors[`${prefix}phoneNumber`]}
            </p>
          )}
        </div>
        {includeTshirt && (
          <div className="space-y-2">
            <Label htmlFor={`${prefix}tshirtSize`}>T-shirt Size</Label>
            <Select
              name={`${prefix}tshirtSize`}
              onValueChange={(value) =>
                onSelectChange(value, `${prefix}tshirtSize`)
              }
            >
              <SelectTrigger id={`${prefix}tshirtSize`}>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="XS">XS</SelectItem>
                <SelectItem value="S">S</SelectItem>
                <SelectItem value="M">M</SelectItem>
                <SelectItem value="L">L</SelectItem>
                <SelectItem value="XL">XL</SelectItem>
                <SelectItem value="XXL">XXL</SelectItem>
              </SelectContent>
            </Select>
            {errors[`${prefix}tshirtSize`] && (
              <p className="text-red-500 text-sm">
                {errors[`${prefix}tshirtSize`]}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function RegistrationPageContent() {
  const router = useRouter();
  const [addFriend, setAddFriend] = useState(false);
  const [formErrors, setFormErrors] = useState<
    Record<string, string | undefined>
  >({});
  const [includeTshirt, setIncludeTshirt] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const validateField = (
    name: string,
    value: string | undefined,
    includeTshirt: boolean
  ): string | undefined => {
    switch (name) {
      case "mainfullName":
      case "friendfullName":
        return !value || value.trim() === ""
          ? "Full name is required."
          : undefined;
      case "mainemail":
      case "friendemail":
        return !value || !isValidEmail(value)
          ? "Invalid email address."
          : undefined;
      case "mainphoneNumber":
      case "friendphoneNumber":
        return !value || value.length < 7 || value.length > 10
          ? "Phone number must be 7-10 digits."
          : undefined;
      case "maintshirtSize":
      case "friendtshirtSize":
        if (includeTshirt && (!value || value === "")) {
          return "Please select a T-shirt size.";
        }
        return undefined;
      case "category":
        return !value || value === ""
          ? "Please select a race category."
          : undefined;
      default:
        return undefined;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value, includeTshirt),
    }));
  };

  const handleSelectChange = (value: string, name: string) => {
    if (name === "category") {
      setSelectedCategory(value);
    }
    setFormErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value, includeTshirt),
    }));
  };

  const handleClearForm = () => {
    const formElement = document.getElementById(
      "registration-form"
    ) as HTMLFormElement;
    if (formElement) {
      formElement.reset();
      setAddFriend(false);
      setFormErrors({});
      setSelectedCategory("");
    }
    toast("Form Cleared", {
      description: "The form has been reset.",
    });
  };

  const handleProceedToPayment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const currentErrors: Record<string, string | undefined> = {};
    let isValid = true;

    // Validate main participant fields
    const mainFields = [
      "mainfullName",
      "mainemail",
      "mainphoneNumber",
      "maintshirtSize",
    ];
    mainFields.forEach((field) => {
      const error = validateField(
        field,
        formData.get(field)?.toString(),
        includeTshirt
      );
      if (error) {
        currentErrors[field] = error;
        isValid = false;
      }
    });

    // Validate category
    const categoryError = validateField(
      "category",
      formData.get("category")?.toString(),
      includeTshirt
    );
    if (categoryError) {
      currentErrors.category = categoryError;
      isValid = false;
    }

    // Validate friend fields if "Add a Friend" is checked
    if (addFriend) {
      const friendFields = [
        "friendfullName",
        "friendemail",
        "friendphoneNumber",
        "friendtshirtSize",
      ];
      friendFields.forEach((field) => {
        const error = validateField(
          field,
          formData.get(field)?.toString(),
          includeTshirt
        );
        if (error) {
          currentErrors[field] = error;
          isValid = false;
        }
      });
    }

    setFormErrors(currentErrors);

    if (isValid) {
      // Store registration data in localStorage
      const registrationData = {
        category: formData.get("category"),
        mainParticipant: {
          fullName: formData.get("mainfullName"),
          email: formData.get("mainemail"),
          phoneNumber: formData.get("mainphoneNumber"),
          tshirtSize: includeTshirt ? formData.get("maintshirtSize") : "N/A",
        },
        addFriend: addFriend,
        friendParticipant: addFriend
          ? {
              fullName: formData.get("friendfullName"),
              email: formData.get("friendemail"),
              phoneNumber: formData.get("friendphoneNumber"),
              tshirtSize: includeTshirt
                ? formData.get("friendtshirtSize")
                : "N/A",
            }
          : undefined,
        includeTshirt: includeTshirt,
      };

      localStorage.setItem(
        "registrationData",
        JSON.stringify(registrationData)
      );

      toast.success("Details Validated", {
        description: "Redirecting to payment...",
      });

      // Redirect to payment page
      router.push("/payment");
    } else {
      toast.error("Validation Failed", {
        description: "Please correct the errors in the form.",
      });
    }
  };

  return (
    <>
      <div className="container mx-auto py-12 px-4 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Participant Registration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              id="registration-form"
              onSubmit={handleProceedToPayment}
              className="space-y-6"
            >
              {/* Main Participant Details */}
              <ParticipantFields
                title="Your Details"
                prefix="main"
                errors={formErrors}
                onInputChange={handleInputChange}
                onSelectChange={handleSelectChange}
                includeTshirt={includeTshirt}
              />

              {/* Category Selection */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Race Category</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Label htmlFor="category">Select Race Category</Label>
                  <Select
                    name="category"
                    required
                    onValueChange={(value) =>
                      handleSelectChange(value, "category")
                    }
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Choose your race category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5k-race">
                        5K Race - Entry Fee: MVR 300 (Prize: MVR 3,000 for top
                        3)
                      </SelectItem>
                      <SelectItem value="10k-race">
                        10K Race - Entry Fee: MVR 350 (Prize: MVR 5,000 for top
                        3)
                      </SelectItem>
                      <SelectItem value="half-marathon">
                        Half Marathon - Entry Fee: MVR 450 (Prize: MVR 7,500 for
                        top 3)
                      </SelectItem>
                      <SelectItem value="full-marathon">
                        Full Marathon - Entry Fee: MVR 550 (Prize: MVR 10,000
                        for top 3)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.category && (
                    <p className="text-red-500 text-sm">
                      {formErrors.category}
                    </p>
                  )}
                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox
                      id="includeTshirt"
                      checked={includeTshirt}
                      onCheckedChange={(checked: boolean) => {
                        setIncludeTshirt(!!checked);
                        if (!checked) {
                          setFormErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.maintshirtSize;
                            delete newErrors.friendtshirtSize;
                            return newErrors;
                          });
                        }
                      }}
                    />
                    <Label htmlFor="includeTshirt">
                      Include T-shirt (+MVR 50)
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* T-shirt Size Chart */}
              <div className="flex justify-end">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" type="button">
                      View T-shirt Size Chart
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>T-shirt Size Chart</DialogTitle>
                      <DialogDescription>
                        Refer to this chart to find your perfect T-shirt size.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Image
                        src="/placeholder.svg?height=400&width=600&text=T-shirt+Size+Chart"
                        alt="T-shirt Size Chart"
                        width={600}
                        height={400}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Add a Friend Option */}
              <div className="flex items-center space-x-2 mt-6">
                <Checkbox
                  id="addFriend"
                  name="addFriend"
                  checked={addFriend}
                  onCheckedChange={(checked: boolean) => {
                    setAddFriend(!!checked);
                    if (!checked) {
                      setFormErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.friendfullName;
                        delete newErrors.friendemail;
                        delete newErrors.friendphoneNumber;
                        delete newErrors.friendtshirtSize;
                        delete newErrors.friendParticipant;
                        return newErrors;
                      });
                    }
                  }}
                />
                <Label htmlFor="addFriend">Add a Friend</Label>
              </div>

              {addFriend && (
                <ParticipantFields
                  title="Friend's Details"
                  prefix="friend"
                  errors={formErrors}
                  onInputChange={handleInputChange}
                  onSelectChange={handleSelectChange}
                  includeTshirt={includeTshirt}
                />
              )}

              {formErrors.friendParticipant && (
                <p className="text-red-500 text-sm">
                  {formErrors.friendParticipant}
                </p>
              )}

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearForm}
                >
                  Clear Form
                </Button>
                <Button type="submit">Proceed to Payment</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Footer section */}
      <Footer />
    </>
  );
}
