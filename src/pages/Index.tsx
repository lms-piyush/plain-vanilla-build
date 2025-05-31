
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Star, Users, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-slate-900">
            Project
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
              About
            </a>
            <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
              Features
            </a>
            <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
              Contact
            </a>
            <Button variant="outline">Get Started</Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Simple & Clean
            <span className="text-blue-600"> Design</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            A minimalist approach to building beautiful web applications. 
            Start with simplicity and grow from there.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Fast</h3>
            <p className="text-slate-600">
              Built with modern technologies for optimal performance and speed.
            </p>
          </Card>

          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Star className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Quality</h3>
            <p className="text-slate-600">
              Clean code and thoughtful design principles for maintainable projects.
            </p>
          </Card>

          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Scalable</h3>
            <p className="text-slate-600">
              Designed to grow with your needs, from prototype to production.
            </p>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-24">
          <Card className="p-12 bg-white/50 backdrop-blur-sm border-0 shadow-xl">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Ready to start building?
            </h2>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who choose simplicity and elegance 
              for their next project.
            </p>
            <Button size="lg" className="bg-slate-900 hover:bg-slate-800">
              Start Your Project
            </Button>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 mt-24 border-t border-slate-200">
        <div className="text-center text-slate-600">
          <p>&copy; 2024 Project. Built with care and attention to detail.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
