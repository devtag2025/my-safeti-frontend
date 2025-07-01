import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  ChevronDown,
  Home,
  User,
  FileText,
  Settings,
} from "lucide-react";
import useAuthStore from "../../store/authStore";
import UserIcon from "../../assets/svgs/UserIcon";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const [userName, setUserName] = useState("");

  useEffect(() => {
    setUserName(user.fullName);
  }, []);

  const homePath = user?.role ? `/${user.role}` : "/login";

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest(".user-dropdown")) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const navLinks = [
    ...(user?.role === "user"
      ? [
          { name: "Dashboard", path: "/dashboard", icon: <Home size={16} /> },
          {
            name: "Media Requests",
            path: "/media-requests",
            icon: <FileText size={16} />,
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

  return (
    <nav className="bg-white fixed w-full z-50">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        {/* <Link
          to={homePath}
          className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent flex items-center"
        >
          SafeStreet<span className="text-gray-800">.com.au</span>
        </Link> */}
        <Link to={homePath}>
          <img src="/images/bg.png" className="h-20" alt="" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="px-3 py-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200 flex items-center"
            >
              <span className="mr-1.5 text-indigo-500">{link.icon}</span>
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Section: User Dropdown or Login/Signup */}
        <div className="hidden md:flex items-center">
          {user ? (
            <div className="relative user-dropdown">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700">
                  <UserIcon size={20} className="text-indigo-600" />
                </div>
                <span className="font-medium text-gray-700 max-w-[120px] truncate capitalize">
                  {userName || "User"}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-gray-500 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden animate-in slide-in-from-top-5 fade-in-20">
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-sm text-gray-500">Signed in as</p>
                    <p className="font-medium text-gray-900 truncate capitalize">
                      {userName || "User"}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/user-profile"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={closeDropdown}
                    >
                      <User size={16} className="mr-2 text-gray-500" />
                      Profile
                    </Link>
                  </div>

                  <div className="py-1 border-t border-gray-100">
                    <button
                      onClick={() => {
                        logout();
                        closeDropdown();
                        navigate("/login");
                      }}
                      className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors group"
                    >
                      <LogOut
                        size={16}
                        className="mr-2 text-gray-500 group-hover:text-red-500"
                      />
                      <span className="group-hover:text-red-500">Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="px-3 py-1.5 text-gray-700 hover:text-indigo-600 rounded transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span className="sr-only">Open main menu</span>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-white border-t border-gray-100 overflow-hidden animate-in slide-in-from-top-5"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                onClick={() => setMenuOpen(false)}
              >
                <span className="mr-3 text-indigo-500">{link.icon}</span>
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 pb-3 border-t border-gray-200">
            {user ? (
              <div className="px-4 space-y-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <UserIcon size={24} className="text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {userName || "User"}
                    </div>
                    <div className="text-sm font-medium text-gray-500 capitalize">
                      {user.role}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <Link
                    to="/user-profile"
                    className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                    onClick={() => setMenuOpen(false)}
                  >
                    <User size={16} className="mr-3 text-gray-500" />
                    Profile
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                      navigate("/login");
                    }}
                    className="flex items-center w-full px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 hover:text-red-600 group"
                  >
                    <LogOut
                      size={16}
                      className="mr-3 text-gray-500 group-hover:text-red-500"
                    />
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-4 py-2 space-y-2">
                <Link
                  to="/login"
                  className="block w-full px-4 py-2 text-center text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="block w-full px-4 py-2 text-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
