import { Project } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Check, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import logoImage from "@assets/ChatGPT Image Aug 14, 2025, 01_36_21 PM_1755158797373.png";

interface ProgressSidebarProps {
  project: Project;
  currentStep: number;
}

const steps = [
  { id: 1, name: "Industry Selection", description: "Choose your business type" },
  { id: 2, name: "Business Details", description: "Company information" },
  { id: 3, name: "AI Generation", description: "Creating your website" },
  { id: 4, name: "Customization", description: "Fine-tune your site" },
  { id: 5, name: "Publish", description: "Go live instantly" },
];

export function ProgressSidebar({ project, currentStep }: ProgressSidebarProps) {
  const [, setLocation] = useLocation();

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return "completed";
    if (stepId === currentStep) return "active";
    return "pending";
  };

  const getGenerationProgress = () => {
    if (project.status === "pending") return 0;
    if (project.status === "generating" || project.status === "content_generated") return 50;
    if (project.status === "images_generated") return 75;
    if (project.status === "completed") return 100;
    return 0;
  };

  const handleBack = () => {
    if (currentStep > 3) {
      setLocation("/onboarding");
    }
  };

  return (
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
      {/* Logo and Brand */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center">
            <img src={logoImage} alt="Ramgine Logo" className="w-10 h-10 rounded-xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Ramgine</h1>
            <p className="text-sm text-slate-500">मिनटों में बनाएं</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="p-6 flex-1">
        <div className="space-y-4">
          {steps.map((step) => {
            const status = getStepStatus(step.id);
            return (
              <div 
                key={step.id}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                  status === "completed" ? "bg-green-100 text-green-800" :
                  status === "active" ? "bg-blue-100 text-blue-800" :
                  "bg-slate-100 text-slate-400"
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  status === "completed" ? "bg-green-500 text-white" :
                  status === "active" ? "bg-blue-500 text-white" :
                  "bg-slate-200 text-slate-400"
                }`}>
                  {status === "completed" ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <div>
                  <p className="font-medium">{step.name}</p>
                  <p className="text-sm opacity-75">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Generation Status */}
        {currentStep === 3 && (
          <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <p className="font-medium text-slate-900">AI Generation in Progress</p>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>{project.status === "pending" ? "⏳" : "✅"} Analyzing business type</span>
                </div>
                <div className="flex justify-between">
                  <span>{project.generatedContent ? "✅" : "🔄"} Generating content</span>
                  {project.generatedContent && <span className="text-green-600 font-medium">Done</span>}
                </div>
                <div className="flex justify-between">
                  <span>{project.generatedImages ? "✅" : "🔄"} Creating images</span>
                  {project.generatedImages && <span className="text-green-600 font-medium">Done</span>}
                </div>
                <div className="flex justify-between">
                  <span>{project.status === "completed" ? "✅" : "⏳"} Building layout</span>
                </div>
              </div>
              <div className="mt-3 bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getGenerationProgress()}%` }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Business Info Summary */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <h3 className="font-medium text-slate-900 mb-2">Your Business</h3>
            <div className="text-sm text-slate-600 space-y-1">
              <p className="font-medium text-slate-800">{project.businessName}</p>
              <p>{project.industry}</p>
              {project.city && project.state && (
                <p>{project.city}, {project.state}</p>
              )}
              <p className="text-xs text-slate-400 mt-2">{project.contactEmail}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {project.services.slice(0, 3).map((service) => (
                  <Badge key={service} variant="secondary" className="text-xs">
                    {service}
                  </Badge>
                ))}
                {project.services.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{project.services.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-slate-200">
        {currentStep > 3 && (
          <Button variant="outline" className="w-full mb-3" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Details
          </Button>
        )}
        <div className="text-center text-xs text-slate-400">
          <p>Estimated completion: {currentStep === 3 ? "45 seconds" : "2 minutes"}</p>
        </div>
      </div>
    </div>
  );
}
