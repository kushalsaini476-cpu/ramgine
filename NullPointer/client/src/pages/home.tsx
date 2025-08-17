import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Layout, Smartphone, Search, Clock, Palette } from "lucide-react";
import logoImage from "@assets/ChatGPT Image Aug 14, 2025, 01_36_21 PM_1755158797373.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
              <img src={logoImage} alt="Ramgine Logo" className="w-10 h-10 rounded-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Ramgine</h1>
              <p className="text-sm text-slate-500">AI Website Builder | मिनटों में बनाएं</p>
            </div>
          </div>
          <Button variant="outline">Sign In</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
          Create Professional Websites
          <span className="text-blue-600"> मिनटों में</span>
        </h2>
        <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
          हमारा AI-powered website builder आपकी business की जानकारी से complete, responsive websites बनाता है। 
          कोई coding नहीं, कोई design skills की जरूरत नहीं।
        </p>
        <Link href="/onboarding">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
            Start Building Now
            <Zap className="w-5 h-5 ml-2" />
          </Button>
        </Link>
        <p className="text-sm text-slate-500 mt-4">शुरू करना बिल्कुल फ्री • कोई credit card नहीं चाहिए</p>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <h3 className="text-3xl font-bold text-center text-slate-900 mb-12">
          ऑनलाइन सफलता के लिए सब कुछ
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>AI-Powered Content</CardTitle>
              <CardDescription>
                आपके business के लिए professional copy, headlines, और descriptions बनाएं
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Layout className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Smart Layouts</CardTitle>
              <CardDescription>
                Automatically generated responsive designs that look great on any device
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Mobile-First</CardTitle>
              <CardDescription>
                Every website is optimized for mobile devices and fast loading speeds
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle>SEO Optimized</CardTitle>
              <CardDescription>
                Built-in SEO best practices to help your website rank higher in search results
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Generate your complete website in under 2 minutes with our advanced AI
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Palette className="w-6 h-6 text-indigo-600" />
              </div>
              <CardTitle>Custom Visuals</CardTitle>
              <CardDescription>
                AI-generated images and graphics that perfectly match your brand and industry
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">अपनी Website बनाने के लिए तैयार हैं?</h3>
          <p className="text-xl mb-8 opacity-90">
            हजारों businesses से जुड़ें जिन्होंने मिनटों में अपनी professional online presence बनाई है
          </p>
          <Link href="/onboarding">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 text-center text-slate-500">
        <p>&copy; 2024 Ramgine. All rights reserved.</p>
      </footer>
    </div>
  );
}
