import { Project } from "@shared/schema";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface WebsitePreviewProps {
  project: Project;
}

export function WebsitePreview({ project }: WebsitePreviewProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("mobile");

  const getPreviewContent = () => {
    const content = project.generatedContent;
    const images = project.generatedImages || [];
    
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden" 
           style={{ 
             width: viewMode === "desktop" ? "100%" : viewMode === "tablet" ? "768px" : "375px",
             maxWidth: "100%",
             margin: "0 auto"
           }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-lg font-bold">{project.businessName}</h1>
            <div className="w-6 h-6 bg-white bg-opacity-20 rounded"></div>
          </div>
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-2">
              {content?.headline || `Welcome to ${project.businessName}`}
            </h2>
            <p className="text-sm opacity-90">
              {content?.about?.substring(0, 50) || "Professional services tailored to your needs"}...
            </p>
            <button className="bg-white text-orange-600 px-6 py-2 rounded-full text-sm font-medium mt-4">
              Get Started
            </button>
          </div>
        </div>
        
        {/* Content Sections */}
        <div className="p-4 space-y-4">
          {/* About Section */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">About Us</h3>
            <p className="text-sm text-slate-600">
              {content?.about?.substring(0, 120) || 
               `${project.businessName} is dedicated to providing exceptional ${project.industry.toLowerCase()} services...`}
            </p>
          </div>
          
          {/* Services Grid */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Our Services</h3>
            <div className="grid grid-cols-2 gap-2">
              {project.services.slice(0, 4).map((service, index) => (
                <div key={service} className="bg-gradient-to-br from-orange-100 to-pink-100 p-3 rounded-lg">
                  {images[index] && (
                    <img src={images[index]} alt={service} className="w-full h-20 object-cover rounded mb-2" />
                  )}
                  <h4 className="font-medium text-sm">{service}</h4>
                  <p className="text-xs text-slate-600 mt-1">Professional service</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Contact */}
          <div className="bg-slate-50 p-3 rounded-lg">
            <h3 className="font-semibold text-slate-900 mb-2">Contact Us</h3>
            <p className="text-sm text-slate-600">{project.contactEmail}</p>
            {project.contactPhone && (
              <p className="text-sm text-slate-600">{project.contactPhone}</p>
            )}
            {project.address && (
              <p className="text-sm text-slate-600">
                {project.address}{project.city ? `, ${project.city}` : ''}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Preview Controls */}
      <div className="flex items-center justify-center space-x-2 mb-6">
        <Button 
          variant={viewMode === "desktop" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("desktop")}
        >
          <Monitor className="w-4 h-4" />
        </Button>
        <Button 
          variant={viewMode === "tablet" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("tablet")}
        >
          <Tablet className="w-4 h-4" />
        </Button>
        <Button 
          variant={viewMode === "mobile" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("mobile")}
        >
          <Smartphone className="w-4 h-4" />
        </Button>
      </div>

      {/* Preview Container */}
      <div className="bg-slate-100 rounded-lg p-6 overflow-auto">
        <div style={{ 
          transform: viewMode === "desktop" ? "scale(0.8)" : viewMode === "tablet" ? "scale(0.7)" : "scale(0.9)",
          transformOrigin: "top center",
          transition: "transform 0.3s ease"
        }}>
          {getPreviewContent()}
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-slate-500">
          {project.generatedContent ? "Preview updates automatically as generation completes" : "Preview will appear as content is generated"}
        </p>
      </div>
    </div>
  );
}
