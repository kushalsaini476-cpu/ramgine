import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import { ProgressSidebar } from "../components/progress-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Download, Share2, ArrowLeft, Globe } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Preview() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["/api/projects", id],
    enabled: !!id,
  });

  const publishMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/projects/${id}/publish`);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id] });
      toast({
        title: "Website published!",
        description: `Your website is now live at ${data.publishedUrl}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Publishing failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePublish = () => {
    publishMutation.mutate();
  };

  const handleDownload = () => {
    if (project?.websiteHtml) {
      const blob = new Blob([project.websiteHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.businessName.toLowerCase().replace(/\s+/g, '-')}-website.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
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
      <ProgressSidebar project={project} currentStep={5} />
      
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Button variant="ghost" onClick={() => setLocation(`/customization/${id}`)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Customization
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant={project.status === "published" ? "default" : "secondary"}>
                {project.status === "published" ? "Published" : "Draft"}
              </Badge>
              <Button variant="outline" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download HTML
              </Button>
              <Button 
                onClick={handlePublish}
                disabled={publishMutation.isPending || project.status === "published"}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {publishMutation.isPending ? "Publishing..." : 
                 project.status === "published" ? "Published" : "Publish Website"}
                <Globe className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Website Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-slate-900">100%</div>
                <p className="text-sm text-slate-600">Mobile Responsive</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-slate-900">95+</div>
                <p className="text-sm text-slate-600">PageSpeed Score</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-slate-900">SEO</div>
                <p className="text-sm text-slate-600">Optimized</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-slate-900">{project.services.length}</div>
                <p className="text-sm text-slate-600">Service Sections</p>
              </CardContent>
            </Card>
          </div>

          {/* Website Preview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Website Preview</span>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Full Screen
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project.websiteHtml ? (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <iframe
                    srcDoc={project.websiteHtml}
                    className="w-full h-96 border-0"
                    title="Website Preview"
                  />
                </div>
              ) : (
                <div className="bg-slate-100 rounded-lg h-96 flex items-center justify-center">
                  <p className="text-slate-500">Website not generated yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Publishing Options */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-900">Instant Hosting</h4>
                    <p className="text-sm text-slate-600">Publish directly to our fast, secure hosting platform</p>
                  </div>
                  <Button 
                    onClick={handlePublish}
                    disabled={publishMutation.isPending || project.status === "published"}
                    variant={project.status === "published" ? "outline" : "default"}
                  >
                    {project.status === "published" ? "Published" : "Publish Now"}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-900">Download HTML</h4>
                    <p className="text-sm text-slate-600">Get the HTML file to host anywhere you want</p>
                  </div>
                  <Button variant="outline" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
