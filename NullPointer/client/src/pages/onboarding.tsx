import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BusinessForm } from "../components/business-form";
import { ArrowLeft, Building, Heart, ShoppingBag, Wrench, Coffee, Camera, Briefcase, GraduationCap } from "lucide-react";

const industries = [
  { id: "health", name: "Health & Wellness", icon: Heart, description: "Fitness, yoga, medical, nutrition" },
  { id: "retail", name: "Retail & E-commerce", icon: ShoppingBag, description: "Online stores, boutiques, products" },
  { id: "services", name: "Professional Services", icon: Briefcase, description: "Consulting, legal, accounting" },
  { id: "food", name: "Food & Beverage", icon: Coffee, description: "Restaurants, cafes, catering" },
  { id: "creative", name: "Creative & Arts", icon: Camera, description: "Photography, design, galleries" },
  { id: "education", name: "Education & Training", icon: GraduationCap, description: "Schools, courses, tutoring" },
  { id: "construction", name: "Construction & Trade", icon: Building, description: "Contractors, plumbing, electrical" },
  { id: "technology", name: "Technology", icon: Wrench, description: "Software, IT services, tech support" },
];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState("industry");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");

  const handleIndustrySelect = (industryId: string) => {
    setSelectedIndustry(industryId);
    setStep("details");
  };

  const handleBack = () => {
    if (step === "details") {
      setStep("industry");
    } else {
      setLocation("/");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === "industry" ? "bg-blue-600 text-white" : "bg-green-600 text-white"
              }`}>
                {step === "industry" ? "1" : "✓"}
              </div>
              <div className="w-12 border-t-2 border-slate-200"></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === "details" ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-400"
              }`}>
                2
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={step} className="max-w-4xl mx-auto">
          <TabsContent value="industry">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-4">What type of business do you have?</h1>
              <p className="text-lg text-slate-600">Choose your industry to get started with tailored content</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {industries.map((industry) => (
                <Card 
                  key={industry.id}
                  className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                    selectedIndustry === industry.id ? "ring-2 ring-blue-600" : ""
                  }`}
                  onClick={() => handleIndustrySelect(industry.id)}
                >
                  <CardHeader className="text-center pb-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <industry.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">{industry.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <p className="text-sm text-slate-600">{industry.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-4">Tell us about your business</h1>
              <p className="text-lg text-slate-600">Provide some details so our AI can create personalized content</p>
            </div>

            <BusinessForm 
              selectedIndustry={industries.find(i => i.id === selectedIndustry)?.name || ""} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
