import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProjectSchema, type InsertProject } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface BusinessFormProps {
  selectedIndustry: string;
}

const commonServices: Record<string, string[]> = {
  "Health & Wellness": ["Yoga Classes", "Personal Training", "Nutrition Consulting", "Massage Therapy", "Wellness Coaching"],
  "Retail & E-commerce": ["Online Store", "Product Catalog", "Custom Orders", "Shipping Services", "Returns & Exchanges"],
  "Professional Services": ["Consulting", "Strategic Planning", "Project Management", "Business Analysis", "Training"],
  "Food & Beverage": ["Dine-in Service", "Takeout Orders", "Catering", "Private Events", "Delivery"],
  "Creative & Arts": ["Photography", "Graphic Design", "Web Design", "Branding", "Art Classes"],
  "Education & Training": ["Online Courses", "Tutoring", "Workshops", "Certification Programs", "Educational Resources"],
  "Construction & Trade": ["Home Renovation", "Plumbing Services", "Electrical Work", "Landscaping", "Maintenance"],
  "Technology": ["Software Development", "IT Support", "System Integration", "Cloud Services", "Cybersecurity"],
};

export function BusinessForm({ selectedIndustry }: BusinessFormProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [customService, setCustomService] = useState("");
  
  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      businessName: "",
      industry: selectedIndustry,
      services: [],
      contactEmail: "",
      contactPhone: "",
      address: "",
      city: "",
      state: "",
      description: "",
      targetAudience: "",
      colorScheme: "warm",
      contentTone: "professional",
    },
  });

  const services = form.watch("services");
  const suggestedServices = commonServices[selectedIndustry] || [];

  const createProjectMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      const response = await apiRequest("POST", "/api/projects", data);
      return response.json();
    },
    onSuccess: (project) => {
      toast({
        title: "Project created!",
        description: "Starting AI generation process...",
      });
      setLocation(`/generation/${project.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Creation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProject) => {
    createProjectMutation.mutate(data);
  };

  const addService = (service: string) => {
    const currentServices = form.getValues("services");
    if (!currentServices.includes(service)) {
      form.setValue("services", [...currentServices, service]);
    }
  };

  const removeService = (service: string) => {
    const currentServices = form.getValues("services");
    form.setValue("services", currentServices.filter(s => s !== service));
  };

  const addCustomService = () => {
    if (customService.trim()) {
      addService(customService.trim());
      setCustomService("");
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{selectedIndustry} Business Details</CardTitle>
        <CardDescription>
          Tell us about your business so we can create personalized content and design
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Business Name */}
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your business name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Services */}
            <FormField
              control={form.control}
              name="services"
              render={() => (
                <FormItem>
                  <FormLabel>Services Offered *</FormLabel>
                  <div className="space-y-3">
                    {/* Current Services */}
                    {services.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {services.map((service) => (
                          <Badge key={service} variant="default" className="px-3 py-1">
                            {service}
                            <button
                              type="button"
                              onClick={() => removeService(service)}
                              className="ml-2 hover:text-red-200"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Suggested Services */}
                    <div>
                      <p className="text-sm text-slate-600 mb-2">Common services for {selectedIndustry}:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedServices.map((service) => (
                          <Button
                            key={service}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addService(service)}
                            disabled={services.includes(service)}
                            className="text-xs"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            {service}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Service Input */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add custom service"
                        value={customService}
                        onChange={(e) => setCustomService(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCustomService())}
                      />
                      <Button type="button" onClick={addCustomService} variant="outline">
                        Add
                      </Button>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="contact@business.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="(555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main Street" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="San Francisco" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="CA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Business Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your business, what makes it unique, and your main goals..."
                      rows={4}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Target Audience */}
            <FormField
              control={form.control}
              name="targetAudience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Audience</FormLabel>
                  <FormControl>
                    <Input placeholder="Who are your ideal customers?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preferences */}
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="colorScheme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Colors</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="warm">Warm (Orange/Red)</SelectItem>
                        <SelectItem value="cool">Cool (Blue/Purple)</SelectItem>
                        <SelectItem value="earth">Earth (Green/Brown)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contentTone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Tone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="inspiring">Inspiring</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={createProjectMutation.isPending}
            >
              {createProjectMutation.isPending ? "Creating Project..." : "Create My Website"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
