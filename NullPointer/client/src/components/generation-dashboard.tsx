import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Project } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WebsitePreview } from "./website-preview";
import { EditIcon, Image, Layout, TrendingUp, Check, Loader2, Pause, X, ArrowRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface GenerationDashboardProps {
  project: Project;
}

export function GenerationDashboard({ project }: GenerationDashboardProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [generationStep, setGenerationStep] = useState(0);

  const generateContentMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/projects/${project.id}/generate-content`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", project.id] });
      setGenerationStep(1);
    },
    onError: (error: any) => {
      toast({
        title: "Content generation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const generateImagesMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/projects/${project.id}/generate-images`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", project.id] });
      setGenerationStep(2);
    },
    onError: (error: any) => {
      toast({
        title: "Image generation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Auto-start generation process
  useEffect(() => {
    if (project.status === "pending") {
      generateContentMutation.mutate();
    } else if (project.status === "content_generated" && generationStep < 1) {
      setGenerationStep(1);
      generateImagesMutation.mutate();
    } else if (project.status === "images_generated" && generationStep < 2) {
      setGenerationStep(2);
    }
  }, [project.status]);

  const getStepIcon = (step: number, currentStep: number, isLoading: boolean) => {
    if (step < currentStep) {
      return <Check className="w-4 h-4 text-white" />;
    } else if (step === currentStep && isLoading) {
      return <Loader2 className="w-4 h-4 text-white animate-spin" />;
    } else if (step === currentStep) {
      return <Loader2 className="w-4 h-4 text-white animate-spin" />;
    } else {
      return <div className="w-2 h-2 bg-slate-400 rounded-full" />;
    }
  };

  const getStepStatus = (step: number, currentStep: number) => {
    if (step < currentStep) return "completed";
    if (step === currentStep) return "active";
    return "pending";
  };

  const calculateProgress = () => {
    if (project.status === "content_generated") return 50;
    if (project.status === "images_generated") return 75;
    if (project.status === "completed") return 100;
    return generationStep * 25;
  };

  const handleContinue = () => {
    setLocation(`/customization/${project.id}`);
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">AI is creating your website</h2>
          <p className="text-lg text-slate-600">
            Our AI is analyzing your business and generating professional content and visuals for {project.businessName}.
          </p>
        </div>

        {/* Generation Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-700">Generation Progress</span>
            <span className="text-sm text-slate-500">{calculateProgress()}% Complete</span>
          </div>
          <div className="bg-slate-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </div>

        {/* AI Generation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Content Generation Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <EditIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Content Generation</CardTitle>
                    <p className="text-sm text-slate-500">Headlines, descriptions, and copy</p>
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  getStepStatus(0, generationStep) === "completed" ? "bg-green-500" :
                  getStepStatus(0, generationStep) === "active" ? "bg-blue-500" : "bg-slate-200"
                }`}>
                  {getStepIcon(0, generationStep, generateContentMutation.isPending)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {project.generatedContent?.headline ? (
                  <>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-sm text-slate-600 mb-1">Generated headline:</p>
                      <p className="font-medium text-slate-900">"{project.generatedContent.headline}"</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-sm text-slate-600 mb-1">About section:</p>
                      <p className="text-sm text-slate-700">
                        {project.generatedContent.about?.substring(0, 100)}...
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-sm text-slate-600">
                      {generateContentMutation.isPending ? "Generating professional content..." : "Waiting to start..."}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Image Generation Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Image className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Image Generation</CardTitle>
                    <p className="text-sm text-slate-500">Custom visuals for your brand</p>
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  getStepStatus(1, generationStep) === "completed" ? "bg-green-500" :
                  getStepStatus(1, generationStep) === "active" ? "bg-blue-500" : "bg-slate-200"
                }`}>
                  {getStepIcon(1, generationStep, generateImagesMutation.isPending)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {project.generatedImages && project.generatedImages.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      {project.generatedImages.slice(0, 2).map((image, index) => (
                        <div key={index} className="aspect-square bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg overflow-hidden">
                          <img src={image} alt={`Generated ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-slate-600">
                      Generated {project.generatedImages.length} custom images
                    </p>
                  </>
                ) : (
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-sm text-slate-600">
                      {generateImagesMutation.isPending ? "Creating custom images..." : "Waiting for content completion..."}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Layout Generation Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <Layout className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Layout Creation</CardTitle>
                    <p className="text-sm text-slate-500">Responsive design structure</p>
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  getStepStatus(2, generationStep) === "completed" ? "bg-green-500" :
                  getStepStatus(2, generationStep) === "active" ? "bg-blue-500" : "bg-slate-200"
                }`}>
                  {getStepIcon(2, generationStep, false)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Sections planned:</span>
                    <span className="font-medium text-slate-900">{3 + project.services.length}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Hero, About, Services ({project.services.length}), Contact
                  </div>
                </div>
                <p className="text-sm text-slate-400">
                  {generationStep >= 2 ? "Layout structure ready" : "Waiting for content completion..."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* SEO Optimization Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>SEO Optimization</CardTitle>
                    <p className="text-sm text-slate-500">Search engine optimization</p>
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  project.generatedContent?.metaTitle ? "bg-green-500" : "bg-slate-200"
                }`}>
                  {project.generatedContent?.metaTitle ? <Check className="w-4 h-4 text-white" /> : 
                   <div className="w-2 h-2 bg-slate-400 rounded-full" />}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-sm text-slate-600 mb-1">Target keywords:</p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">{project.industry.toLowerCase()}</Badge>
                    <Badge variant="secondary" className="text-xs">{project.businessName.toLowerCase()}</Badge>
                    <Badge variant="secondary" className="text-xs">{project.city?.toLowerCase()}</Badge>
                  </div>
                </div>
                <p className="text-sm text-slate-400">
                  {project.generatedContent?.metaTitle ? "SEO tags generated" : "Preparing meta tags and descriptions..."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Preview Section */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Live Preview</CardTitle>
                <p className="text-slate-600">Your website is taking shape</p>
              </div>
              {project.status === "images_generated" && (
                <Button onClick={handleContinue} className="bg-blue-600 hover:bg-blue-700">
                  Continue to Customization
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <WebsitePreview project={project} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
