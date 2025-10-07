import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  LogOut,
  ChevronDown,
  Home,
  User,
  FileText,
  Settings,
  LayoutDashboard,
  Camera,
} from "lucide-react";
import useAuthStore from "../../store/authStore";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const CRIMSON = "#6e0001";
const CRIMSON_LIGHT = "#8a0000";
const TEXT_DARK = "#1f2937"; // slate-800

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const [userName, setUserName] = useState("");

  useEffect(() => {
    setUserName(user.fullName);
  }, [user.fullName]);

  const homePath = user?.role ? `/${user.role}` : "/login";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    ...(user?.role === "user"
      ? [
          {
            name: "Home",
            path: "/home",
            icon: <Home size={16} />,
          },
          {
            name: "Dashboard",
            path: "/dashboard",
            icon: <LayoutDashboard size={16} />,
          },
          {
            name: "Media Requests",
            path: "/media-requests",
            icon: <Camera size={16} />,
          },
        ]
      : []),

    ...(user?.role === "admin"
      ? [
          {
            name: "Media Review",
            path: "/media-review",
            icon: <FileText size={16} />,
          },
          { name: "Manage Ads", path: "/ads", icon: <Settings size={16} /> },
        ]
      : []),
  ];

  const getUserInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };

  return (
    <nav
      className="fixed w-full z-50"
      style={{
        background: "#ffffff",
        borderBottom: "1px solid rgba(110,0,1,0.06)",
        boxShadow: "0 4px 20px rgba(16,24,40,0.04)",
      }}
    >
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link to={homePath} className="transition-transform hover:scale-105 inline-flex items-center">
          <img
            src="/images/logo.png"
            className="h-12"
            alt="Logo"
            style={{ filter: "drop-shadow(0 6px 18px rgba(110,0,1,0.08))" }}
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md flex items-center text-sm transition-all duration-200 ${
                  isActive
                    ? "font-medium"
                    : "font-normal"
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? {
                      color: "#ffffff",
                      background: `linear-gradient(90deg, ${CRIMSON}, ${CRIMSON_LIGHT})`,
                      boxShadow: "0 6px 18px rgba(110,0,1,0.12)",
                    }
                  : { color: TEXT_DARK }
              }
            >
              <span className="mr-2" style={{ color: isActive => (isActive ? "#fff" : CRIMSON) }}>
                {link.icon}
              </span>
              <span>{link.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Desktop User Section */}
        <div className="hidden md:flex items-center">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 px-3 py-2 h-auto hover:bg-[#fff5f5] transition-all duration-200"
                  style={{ color: TEXT_DARK }}
                >
                  <Avatar className="w-8 h-8 bg-gradient-to-br" style={{ background: `linear-gradient(135deg, ${CRIMSON}, ${CRIMSON_LIGHT})` }}>
                    <AvatarFallback className="text-white text-sm font-bold bg-transparent">
                      {getUserInitials(userName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium max-w-[120px] truncate capitalize">{userName || "User"}</span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56" style={{ background: "#fff", border: "1px solid rgba(110,0,1,0.06)" }}>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none capitalize" style={{ color: TEXT_DARK }}>
                      {userName || "User"}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="capitalize text-xs" style={{ background: "rgba(110,0,1,0.06)", color: CRIMSON, border: "1px solid rgba(110,0,1,0.04)" }}>
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator style={{ borderColor: "rgba(110,0,1,0.06)" }} />
                <DropdownMenuItem asChild className="cursor-pointer" style={{ color: TEXT_DARK }}>
                  <Link to="/user-profile" className="flex items-center">
                    <User size={16} className="mr-2" style={{ color: CRIMSON }} />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator style={{ borderColor: "rgba(110,0,1,0.06)" }} />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer" style={{ color: CRIMSON }}>
                  <LogOut size={16} className="mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-3">
              <Button asChild variant="ghost" size="sm" className="text-[#374151] hover:text-[#6e0001]">
                <Link to="/login">Log in</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="text-white"
                style={{
                  background: `linear-gradient(90deg, ${CRIMSON}, ${CRIMSON_LIGHT})`,
                  boxShadow: "0 8px 24px rgba(110,0,1,0.12)",
                }}
              >
                <Link to="/signup">Sign up</Link>
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
                  <img src="/images/logo.png" className="h-12" alt="Logo" />
                </div>

                {/* Mobile Navigation Links */}
                <div className="flex-1 py-6">
                  <nav className="space-y-2 px-3">
                    {navLinks.map((link) => (
                      <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                          `block px-3 py-2 rounded-md text-sm transition-all duration-200 ${isActive ? "font-medium" : ""}`
                        }
                        style={({ isActive }) =>
                          isActive
                            ? { color: "#fff", background: `linear-gradient(90deg, ${CRIMSON}, ${CRIMSON_LIGHT})` }
                            : { color: TEXT_DARK }
                        }
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-3">
                          <span style={{ color: CRIMSON }}>{link.icon}</span>
                          <span>{link.name}</span>
                        </div>
                      </NavLink>
                    ))}
                  </nav>
                </div>

                {/* Mobile User Section */}
                <div className="border-t pt-6" style={{ borderColor: "rgba(110,0,1,0.06)" }}>
                  {user ? (
                    <div className="space-y-4 px-3">
                      {/* User Info */}
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10" style={{ background: `linear-gradient(135deg, ${CRIMSON}, ${CRIMSON_LIGHT})` }}>
                          <AvatarFallback className="text-white text-sm font-bold bg-transparent">
                            {getUserInitials(userName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-base font-medium text-[#111827] capitalize">{userName || "User"}</div>
                          <Badge variant="secondary" className="text-xs" style={{ background: "rgba(110,0,1,0.06)", color: CRIMSON }}>
                            {user.role}
                          </Badge>
                        </div>
                      </div>

                      {/* User Actions */}
                      <div className="space-y-2">
                        <Button asChild variant="ghost" className="w-full text-[#374151]" onClick={() => setIsMobileMenuOpen(false)}>
                          <Link to="/user-profile" className="flex items-center space-x-3">
                            <User size={16} />
                            <span>Profile</span>
                          </Link>
                        </Button>

                        <Button variant="ghost" className="w-full text-[#b91c1c]" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>
                          <LogOut size={16} className="mr-3" />
                          Sign out
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 px-3">
                      <Button asChild variant="outline" className="w-full border" onClick={() => setIsMobileMenuOpen(false)}>
                        <Link to="/login">Log in</Link>
                      </Button>
                      <Button
                        asChild
                        className="w-full text-white"
                        style={{ background: `linear-gradient(90deg, ${CRIMSON}, ${CRIMSON_LIGHT})` }}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Link to="/signup">Sign up</Link>
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

export default Navbar;
