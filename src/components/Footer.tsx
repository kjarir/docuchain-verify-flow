
import { Link } from "react-router-dom";
import { Shield, Twitter, Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t mt-20">
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-blockchain flex items-center justify-center">
                <Shield className="text-white" size={16} />
              </div>
              <span className="font-bold text-lg">TrustIssues</span>
            </Link>
            <p className="text-sm text-gray-600">
              Blockchain-based document validation and generation for enterprise security and transparency.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-gray-800 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-800 transition-colors">
                <Github size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-800 transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/validate" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Validate Documents
                </Link>
              </li>
              <li>
                <Link to="/generate" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Generate Documents
                </Link>
              </li>
              <li>
                <Link to="/api" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  API Access
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/docs" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-10 pt-6 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} TrustIssues. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
