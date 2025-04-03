
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Shield, Key, LayoutDashboard } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="w-full py-4 px-6 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-blockchain flex items-center justify-center">
            <Shield className="text-white" size={20} />
          </div>
          <span className="font-bold text-xl">DocuChain</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/validate" className="text-sm font-medium hover:text-primary transition-colors">
            Validate
          </Link>
          <Link to="/generate" className="text-sm font-medium hover:text-primary transition-colors">
            Generate
          </Link>
          <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
            Dashboard
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button size="sm" className="bg-gradient-blockchain hover:opacity-90" asChild>
            <Link to="/register">Register</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
