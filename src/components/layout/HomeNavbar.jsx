import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  Home,
  Map,
  Users,
  LogIn,
  UserPlus,
  LayoutDashboard,
  FileText,
} from "lucide-react";

const CRIMSON = "#6e0001";
const CRIMSON_LIGHT = "#8a0000";
const TEXT_DARK = "#111827";

const HomeNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/home", label: "Home", icon: Home },
    { path: "/incident-heatMap", label: "Incident HeatMap", icon: Map },
    { path: "/our-partners", label: "Our Partners", icon: Users },
    { path: "/terms", label: "Terms & Conditions", icon: FileText },
  ];

  const getUserInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300`}
      style={{
        background: "#ffffff",
        borderBottom: isScrolled ? "1px solid rgba(110,0,1,0.06)" : "1px solid transparent",
        boxShadow: isScrolled ? "0 6px 30px rgba(16,24,40,0.04)" : "none",
      }}
    >
      <div className="container mx-auto flex justify-between items-center px-4 py-4">
        {/* Logo */}
        <Link to="/" className="transition-transform hover:scale-105">
          <img src="/images/logo.png" className="h-8" alt="Logo" style={{ filter: "drop-shadow(0 6px 18px rgba(110,0,1,0.06))" }} />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          {navLinks.map((link) => {
            const IconComponent = link.icon;
            const active = isActive(link.path);
            return (
              <Button
                key={link.path}
                asChild
                variant="ghost"
                size="sm"
                className={`transition-all duration-200 ${active ? "font-medium" : "font-normal"}`}
                style={
                  active
                    ? { color: "#fff", background: `linear-gradient(90deg, ${CRIMSON}, ${CRIMSON_LIGHT})`, boxShadow: "0 6px 18px rgba(110,0,1,0.12)" }
                    : { color: TEXT_DARK }
                }
              >
                <Link to={link.path} className="flex items-center space-x-2">
                  <span style={active ? { color: "#fff" } : { color: CRIMSON }}>
                    <IconComponent size={16} />
                  </span>
                  <span className="text-sm">{link.label}</span>
                </Link>
              </Button>
            );
          })}
        </div>

        {/* Desktop User Section */}
        <div className="hidden md:flex items-center">
          {user?.role === "user" ? (
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8" style={{ background: `linear-gradient(135deg, ${CRIMSON}, ${CRIMSON_LIGHT})` }}>
                <AvatarFallback className="text-white text-sm font-bold bg-transparent">
                  {getUserInitials(user.fullName)}
                </AvatarFallback>
              </Avatar>
              <Button
                asChild
                size="sm"
                style={{
                  background: `linear-gradient(90deg, ${CRIMSON}, ${CRIMSON_LIGHT})`,
                  color: "#fff",
                  boxShadow: "0 8px 24px rgba(110,0,1,0.12)",
                }}
              >
                <Link to="/dashboard" className="flex items-center space-x-2">
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Button asChild variant="ghost" size="sm" className="text-[#374151] hover:text-[#6e0001]">
                <Link to="/login" className="flex items-center space-x-2">
                  <LogIn size={16} />
                  <span>Log in</span>
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                style={{
                  background: `linear-gradient(90deg, ${CRIMSON}, ${CRIMSON_LIGHT})`,
                  color: "#fff",
                  boxShadow: "0 8px 24px rgba(110,0,1,0.12)",
                }}
              >
                <Link to="/signup" className="flex items-center space-x-2">
                  <UserPlus size={16} />
                  <span>Sign up</span>
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2 text-[#374151] hover:text-[#6e0001]">
                <Menu size={20} />
                <span className="sr-only">Open main menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]" style={{ background: "#fff", borderLeft: "1px solid rgba(110,0,1,0.06)" }}>
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between pb-6 border-b" style={{ borderColor: "rgba(110,0,1,0.06)" }}>
                  <img src="/images/bg.png" className="h-12" alt="Logo" />
                </div>

                {/* Mobile Navigation Links */}
                <div className="flex-1 py-6 px-3">
                  <nav className="space-y-2">
                    {navLinks.map((link) => {
                      const IconComponent = link.icon;
                      const active = isActive(link.path);
                      return (
                        <Button
                          key={link.path}
                          asChild
                          variant="ghost"
                          className={`w-full justify-start transition-all duration-200 ${active ? "font-medium" : ""}`}
                          style={active ? { background: `linear-gradient(90deg, ${CRIMSON}, ${CRIMSON_LIGHT})`, color: "#fff" } : { color: TEXT_DARK }}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Link to={link.path} className="flex items-center space-x-3">
                            <span style={active ? { color: "#fff" } : { color: CRIMSON }}>
                              <IconComponent size={16} />
                            </span>
                            <span>{link.label}</span>
                          </Link>
                        </Button>
                      );
                    })}
                  </nav>
                </div>

                {/* Mobile User Section */}
                <div className="border-t pt-6" style={{ borderColor: "rgba(110,0,1,0.06)" }}>
                  {user?.role === "user" ? (
                    <div className="space-y-4 px-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10" style={{ background: `linear-gradient(135deg, ${CRIMSON}, ${CRIMSON_LIGHT})` }}>
                          <AvatarFallback className="text-white text-sm font-bold bg-transparent">
                            {getUserInitials(user.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-base font-medium text-[#111827] capitalize">{user.fullName || "User"}</div>
                          <Badge variant="secondary" className="text-xs" style={{ background: "rgba(110,0,1,0.06)", color: CRIMSON }}>
                            {user.role}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Button asChild className="w-full" style={{ background: `linear-gradient(90deg, ${CRIMSON}, ${CRIMSON_LIGHT})`, color: "#fff", boxShadow: "0 8px 24px rgba(110,0,1,0.12)" }} onClick={() => setIsMobileMenuOpen(false)}>
                          <Link to="/dashboard" className="flex items-center justify-center space-x-2">
                            <LayoutDashboard size={16} />
                            <span>Dashboard</span>
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 px-3">
                      <Button asChild variant="outline" className="w-full border" onClick={() => setIsMobileMenuOpen(false)}>
                        <Link to="/login" className="flex items-center justify-center space-x-2">
                          <LogIn size={16} />
                          <span>Log in</span>
                        </Link>
                      </Button>
                      <Button asChild className="w-full" style={{ background: `linear-gradient(90deg, ${CRIMSON}, ${CRIMSON_LIGHT})`, color: "#fff", boxShadow: "0 8px 24px rgba(110,0,1,0.12)" }} onClick={() => setIsMobileMenuOpen(false)}>
                        <Link to="/signup" className="flex items-center justify-center space-x-2">
                          <UserPlus size={16} />
                          <span>Sign up</span>
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;
