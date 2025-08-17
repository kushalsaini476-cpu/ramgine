import { Project } from "@shared/schema";

export class WebsiteGenerator {
  generateWebsiteHtml(project: Project): string {
    const { businessName, generatedContent, generatedImages, colorScheme } = project;
    
    const colors = this.getColorScheme(colorScheme || "warm");
    const content = generatedContent || {};
    const images = generatedImages || [];

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${content.metaTitle || `${businessName} - Professional Services`}</title>
    <meta name="description" content="${content.metaDescription || `Discover ${businessName} - providing exceptional services to our valued customers.`}">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        .gradient-bg { background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary}); }
        .text-primary { color: ${colors.primary}; }
        .bg-primary { background-color: ${colors.primary}; }
        .border-primary { border-color: ${colors.primary}; }
    </style>
</head>
<body class="bg-white text-gray-900">
    <!-- Header -->
    <header class="gradient-bg text-white">
        <nav class="container mx-auto px-6 py-4">
            <div class="flex justify-between items-center">
                <h1 class="text-2xl font-bold">${businessName}</h1>
                <div class="space-x-6">
                    <a href="#about" class="hover:text-opacity-80">About</a>
                    <a href="#services" class="hover:text-opacity-80">Services</a>
                    <a href="#contact" class="hover:text-opacity-80">Contact</a>
                </div>
            </div>
        </nav>
        
        <div class="container mx-auto px-6 py-16 text-center">
            <h2 class="text-4xl md:text-6xl font-bold mb-6">${content.headline || `Welcome to ${businessName}`}</h2>
            <p class="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                ${content.about?.substring(0, 150) || `Providing exceptional services tailored to your needs.`}...
            </p>
            <button class="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all">
                Get Started
            </button>
        </div>
    </header>

    <!-- About Section -->
    <section id="about" class="py-16 bg-gray-50">
        <div class="container mx-auto px-6">
            <div class="max-w-4xl mx-auto">
                <h3 class="text-3xl font-bold text-center mb-8">About ${businessName}</h3>
                <div class="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <p class="text-lg text-gray-600 leading-relaxed">
                            ${content.about || `${businessName} is dedicated to providing exceptional services that exceed our clients' expectations. With years of experience and a commitment to excellence, we deliver results that matter.`}
                        </p>
                    </div>
                    <div class="relative">
                        ${images[0] ? `<img src="${images[0]}" alt="${businessName}" class="rounded-lg shadow-lg w-full h-64 object-cover">` : 
                          `<div class="bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg h-64 flex items-center justify-center">
                             <span class="text-gray-500 text-lg">${businessName}</span>
                           </div>`}
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="py-16">
        <div class="container mx-auto px-6">
            <h3 class="text-3xl font-bold text-center mb-12">Our Services</h3>
            <div class="grid md:grid-cols-3 gap-8">
                ${project.services.slice(0, 3).map((service, index) => `
                    <div class="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
                        ${images[index + 1] ? `<img src="${images[index + 1]}" alt="${service}" class="w-full h-48 object-cover rounded-lg mb-4">` : 
                          `<div class="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center">
                             <span class="text-gray-400">${service}</span>
                           </div>`}
                        <h4 class="text-xl font-semibold mb-3 text-primary">${service}</h4>
                        <p class="text-gray-600">
                            ${content.services?.find(s => s.name === service)?.description || 
                              `Professional ${service.toLowerCase()} services tailored to your specific needs and requirements.`}
                        </p>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-16 bg-gray-50">
        <div class="container mx-auto px-6">
            <div class="max-w-2xl mx-auto text-center">
                <h3 class="text-3xl font-bold mb-8">Get In Touch</h3>
                <div class="bg-white p-8 rounded-lg shadow-lg">
                    <div class="space-y-4">
                        <p class="text-lg">
                            <strong class="text-primary">Email:</strong> ${project.contactEmail}
                        </p>
                        ${project.contactPhone ? `<p class="text-lg"><strong class="text-primary">Phone:</strong> ${project.contactPhone}</p>` : ''}
                        ${project.address ? `
                            <p class="text-lg">
                                <strong class="text-primary">Address:</strong> 
                                ${project.address}${project.city ? `, ${project.city}` : ''}${project.state ? `, ${project.state}` : ''}
                            </p>
                        ` : ''}
                    </div>
                    <button class="mt-6 bg-primary text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-all">
                        Contact Us Today
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="gradient-bg text-white py-8">
        <div class="container mx-auto px-6 text-center">
            <p>&copy; 2024 ${businessName}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;
  }

  private getColorScheme(scheme: string) {
    const schemes = {
      warm: {
        primary: '#ea580c',
        secondary: '#dc2626',
      },
      cool: {
        primary: '#0ea5e9',
        secondary: '#3b82f6',
      },
      earth: {
        primary: '#059669',
        secondary: '#16a34a',
      },
    };

    return schemes[scheme as keyof typeof schemes] || schemes.warm;
  }
}

export const websiteGenerator = new WebsiteGenerator();
