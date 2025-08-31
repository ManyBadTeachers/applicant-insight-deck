import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

const CreateApplicant = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fullName, setFullName] = useState("");
  const [expertise, setExpertise] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nationality, setNationality] = useState("");
  const [message, setMessage] = useState("");

  const status = "Submitted Form"; // default, unchangeable
  const submissionDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const handleCreateApplicant = async () => {
    const payload = {
      FullName: fullName,
      FirstName: firstName,
      LastName: lastName,
      Expertise: expertise,
      Email: email,
      Phone: phone,
      Nationality: nationality,
      CV: "📄 CV Placeholder",
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/create_applicant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(`Error: ${data.error || "Failed to create applicant"}`);
      } else {
        setMessage(data.message);
        // reset form fields
        setFirstName("");
        setLastName("");
        setFullName("");
        setExpertise("");
        setEmail("");
        setPhone("");
        setNationality("");
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Create Applicant
          </h1>
          <p className="text-lg text-gray-700">
            This page allows you to create applicants for testing purposes. All
            necessary applicant details are included, status is defaulted to
            "Submitted Form", and the submission date is automatically set to
            today.
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-6 border-card-border bg-gray-50">
          <div className="flex items-center mb-4">
            <Users className="w-6 h-6 text-primary mr-2" />
            <h2 className="text-2xl font-semibold text-card-foreground">
              New Applicant Details
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expertise
              </label>
              <input
                type="text"
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                placeholder="Enter expertise"
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nationality
              </label>
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                placeholder="Enter nationality"
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CV
              </label>
              <input
                type="text"
                value="📄 CV Placeholder"
                disabled
                className="w-full border rounded-md p-2 bg-gray-200 text-gray-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Submission Date
              </label>
              <input
                type="text"
                value={submissionDate}
                disabled
                className="w-full border rounded-md p-2 bg-gray-200 text-gray-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <input
                type="text"
                value={status}
                disabled
                className="w-full border rounded-md p-2 bg-gray-200 text-gray-600 cursor-not-allowed"
              />
            </div>

            <div className="flex justify-end">
              <Button
                size="sm"
                variant="default"
                onClick={handleCreateApplicant}
              >
                Create Applicant
              </Button>
            </div>

            {message && (
              <p className="text-green-600 font-medium mt-2">{message}</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreateApplicant;