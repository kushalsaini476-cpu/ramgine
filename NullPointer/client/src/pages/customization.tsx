import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Project } from "@shared/schema";
import { ProgressSidebar } from "../components/progress-sidebar";
import { WebsitePreview } from "../components/website-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Palette, Type, Layout, ArrowRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Customization() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [colorScheme, setColorScheme] = useState("warm");
  const [contentTone, setContentTone] = useState("professional");

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["/api/projects", id],
    enabled: !!id,
  });

  const updateProjectMutation = useMutation({
    mutationFn: async (updates: any) => {
      const response = await apiRequest("PATCH", `/api/projects/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id] });
      toast({
        title: "Settings updated",
        description: "Your customization preferences have been saved.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const generateWebsiteMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/projects/${id}/generate-website`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id] });
      setLocation(`/preview/${id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleApplyChanges = () => {
    updateProjectMutation.mutate({
      colorScheme,
      contentTone,
    });
  };

  const handlePreview = () => {
    generateWebsiteMutation.mutate();
  };

  if (isLoading || !project) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <ProgressSidebar project={project} currentStep={4} />
      
      <div className="flex-1 flex">
        {/* Customization Panel */}
        <div className="w-80 bg-white border-r border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Customize Your Website</h2>
          
          <div className="space-y-6">
            {/* Color Scheme */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-5 h-5" />
                  <span>Color Scheme</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="color-scheme">Choose your brand colors</Label>
                <Select value={colorScheme} onValueChange={setColorScheme}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warm">Warm Sunset</SelectItem>
                    <SelectItem value="cool">Cool Ocean</SelectItem>
                    <SelectItem value="earth">Earth Tones</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Content Tone */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Type className="w-5 h-5" />
                  <span>Content Tone</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="content-tone">How should your content sound?</Label>
                <Select value={contentTone} onValueChange={setContentTone}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly & Casual</SelectItem>
                    <SelectItem value="inspiring">Inspiring & Motivational</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Layout Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Layout className="w-5 h-5" />
                  <span>Layout Style</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Based on your industry, we've selected the optimal layout with {project.services.length} service sections.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 space-y-3">
            <Button 
              onClick={handleApplyChanges}
              disabled={updateProjectMutation.isPending}
              className="w-full"
              variant="outline"
            >
              {updateProjectMutation.isPending ? "Applying..." : "Apply Changes"}
            </Button>
            
            <Button 
              onClick={handlePreview}
              disabled={generateWebsiteMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {generateWebsiteMutation.isPending ? "Generating..." : "Generate & Preview"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg border border-slate-200 h-full">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Preview</h3>
              <p className="text-slate-600">See how your website will look</p>
            </div>
            <div className="p-6">
              <WebsitePreview project={project} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
