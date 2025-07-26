"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
import { User } from "lucide-react";
import { useParticipant } from "@/contexts/ParticipantContext";

// Helper function for email validation
const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

interface RegistrationData {
    category: string;
    participant: {
        fullName: string;
        email: string;
        phoneNumber: string;
        tshirtSize: string;
    };
    includeTshirt: boolean;
    totalPrice: number;
}

interface RegistrationFormProps {
    onSubmit?: (data: RegistrationData) => void;
}

export default function RegistrationPageContent({ onSubmit }: RegistrationFormProps) {
    const router = useRouter();
    const { currentParticipant, updateCurrentParticipant } = useParticipant();
    const [formErrors, setFormErrors] = useState<
        Record<string, string | undefined>
    >({});
    const [includeTshirt, setIncludeTshirt] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [formState, setFormState] = useState({
        category: "",
        includeTshirt: true,
        participant: {
            fullName: "",
            email: "",
            phoneNumber: "",
            tshirtSize: "",
        }
    });
    
    // Force re-render when currentParticipant changes
    const formKey = currentParticipant?.id || 'new';

    // Race category prices
    const racePrices: Record<string, number> = {
        "5k-race": 300,
        "10k-race": 350,
        "half-marathon": 450,
        "full-marathon": 550,
    };

    const tshirtPrice = 50;

    // Populate form with current participant data
    useEffect(() => {
        if (currentParticipant) {
            setFormState({
                category: currentParticipant.category,
                includeTshirt: currentParticipant.includeTshirt,
                participant: {  
                    fullName: currentParticipant.participant.fullName,
                    email: currentParticipant.participant.email,
                    phoneNumber: currentParticipant.participant.phoneNumber,
                    tshirtSize: currentParticipant.participant.tshirtSize === "N/A" ? "" : currentParticipant.participant.tshirtSize,
                }
            });
            setSelectedCategory(currentParticipant.category);
            setIncludeTshirt(currentParticipant.includeTshirt);
        } else {
            // Reset form when no current participant
            setFormState({
                category: "",
                includeTshirt: true,
                participant: {
                    fullName: "",
                    email: "",
                    phoneNumber: "",
                    tshirtSize: "",
                }
            });
            setSelectedCategory("");
            setIncludeTshirt(true);
        }
    }, [currentParticipant]);

    // Calculate total price
    const calculateTotalPrice = (): number => {
        const racePrice = selectedCategory ? racePrices[selectedCategory] || 0 : 0;
        const tshirtCost = includeTshirt ? tshirtPrice : 0;
        return racePrice + tshirtCost;
    };

    const validateField = (
        name: string,
        value: string | undefined,
        includeTshirt: boolean
    ): string | undefined => {
        switch (name) {
            case "fullName":
                return !value || value.trim() === ""
                    ? "Full name is required."
                    : undefined;
            case "email":
                return !value || !isValidEmail(value)
                    ? "Invalid email address."
                    : undefined;
            case "phoneNumber":
                return !value || value.length < 7 || value.length > 10
                    ? "Phone number must be 7-10 digits."
                    : undefined;
            case "tshirtSize":
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
        setFormState(prev => ({ 
            ...prev, 
            participant: {
                ...prev.participant,
                [name]: value
            }
        }));
        setFormErrors((prev) => ({
            ...prev,
            [name]: validateField(name, value, includeTshirt),
        }));
    };

    const handleSelectChange = (value: string, name: string) => {
        if (name === "category") {
            setSelectedCategory(value);
            setFormState(prev => ({ ...prev, category: value }));
        } else if (name === "tshirtSize") {
            setFormState(prev => ({ 
                ...prev, 
                participant: {
                    ...prev.participant,
                    tshirtSize: value
                }
            }));
        }
        setFormErrors((prev) => ({
            ...prev,
            [name]: validateField(name, value, includeTshirt),
        }));
    };

    const handleClearForm = () => {
        setFormState({
            category: "",
            includeTshirt: true,
            participant: {
                fullName: "",
                email: "",
                phoneNumber: "",
                tshirtSize: "",
            }
        });
        setFormErrors({});
        setSelectedCategory("");
        setIncludeTshirt(true);
        toast("Form Cleared", {
            description: "The form has been reset.",
        });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const currentErrors: Record<string, string | undefined> = {};
        let isValid = true;

        // Validate participant fields
        const fields = ["fullName", "email", "phoneNumber", "tshirtSize"];
        fields.forEach((field) => {
            const error = validateField(
                field,
                formState.participant[field as keyof typeof formState.participant],
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
            selectedCategory,
            includeTshirt
        );
        if (categoryError) {
            currentErrors.category = categoryError;
            isValid = false;
        }

        setFormErrors(currentErrors);

        if (isValid) {
            // Create registration data object
            const registrationData: RegistrationData = {
                category: selectedCategory,
                participant: {
                    fullName: formState.participant.fullName,
                    email: formState.participant.email,
                    phoneNumber: formState.participant.phoneNumber,
                    tshirtSize: includeTshirt ? formState.participant.tshirtSize : "N/A",
                },
                includeTshirt: includeTshirt,
                totalPrice: calculateTotalPrice(),
            };

            // Update current participant in context
            updateCurrentParticipant(registrationData);

            // Call onSubmit function if provided, otherwise use default behavior
            if (onSubmit) {
                onSubmit(registrationData);
            } else {
                // Default behavior: store in localStorage and redirect
                localStorage.setItem(
                    "registrationData",
                    JSON.stringify(registrationData)
                );
            }
            
            toast.success("Registration Submitted", {
                description: "Your registration has been submitted successfully.",
            });
        } else {
            toast.error("Validation Failed", {
                description: "Please correct the errors in the form.",
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-3xl font-bold text-center">
                    {currentParticipant ? "Edit Participant" : "Participant Registration"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form
                    id="registration-form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
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
                                value={formState.category}
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
                                    checked={formState.includeTshirt}
                                    onCheckedChange={(checked: boolean) => {
                                        const newIncludeTshirt = !!checked;
                                        setIncludeTshirt(newIncludeTshirt);
                                        setFormState(prev => ({
                                            ...prev,
                                            includeTshirt: newIncludeTshirt
                                        }));
                                        if (!checked) {
                                            setFormErrors((prev) => {
                                                const newErrors = { ...prev };
                                                delete newErrors.tshirtSize;
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

                    {/* Participant Details */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <User className="w-4 h-4 mr-2" />
                                Your Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    placeholder="Ahmed mohamed"
                                    required
                                    value={formState.participant.fullName}
                                    onChange={handleInputChange}
                                />
                                {formErrors.fullName && (
                                    <p className="text-red-500 text-sm">
                                        {formErrors.fullName}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="ahmed@example.com"
                                    required
                                    value={formState.participant.email}
                                    onChange={handleInputChange}
                                />
                                {formErrors.email && (
                                    <p className="text-red-500 text-sm">{formErrors.email}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    placeholder="960-0000000"
                                    required
                                    value={formState.participant.phoneNumber}
                                    onChange={handleInputChange}
                                />
                                {formErrors.phoneNumber && (
                                    <p className="text-red-500 text-sm">
                                        {formErrors.phoneNumber}
                                    </p>
                                )}
                            </div>
                            {includeTshirt && (
                                <div className="space-y-2">
                                    <Label htmlFor="tshirtSize">T-shirt Size</Label>
                                    <Select
                                        name="tshirtSize"
                                        value={formState.participant.tshirtSize}
                                        onValueChange={(value) =>
                                            handleSelectChange(value, "tshirtSize")
                                        }
                                    >
                                        <SelectTrigger id="tshirtSize">
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
                                    {formErrors.tshirtSize && (
                                        <p className="text-red-500 text-sm">
                                            {formErrors.tshirtSize}
                                        </p>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Price Summary */}
                    {selectedCategory && (
                        <Card className="mb-6 bg-blue-50 border-blue-200">
                            <CardHeader>
                                <CardTitle className="text-lg text-blue-800">Price Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700">Race Entry Fee:</span>
                                        <span className="font-medium">MVR {racePrices[selectedCategory]}</span>
                                    </div>
                                    {includeTshirt && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-700">T-shirt:</span>
                                            <span className="font-medium">MVR {tshirtPrice}</span>
                                        </div>
                                    )}
                                    <div className="border-t pt-2 mt-2">
                                        <div className="flex justify-between items-center text-lg font-bold text-blue-800">
                                            <span>Total:</span>
                                            <span>MVR {calculateTotalPrice()}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

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

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClearForm}
                        >
                            Clear Form
                        </Button>
                        <Button type="submit">
                            {currentParticipant ? "Update Registration" : "Register"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}