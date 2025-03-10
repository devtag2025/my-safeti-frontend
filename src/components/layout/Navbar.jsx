import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown, LogOut } from "lucide-react";
import useAuthStore from "../../store/authStore";
import UserIcon from "../../assets/svgs/UserIcon";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [userName, setUserName] = useState("");

  useEffect(() => {
    const login_user = JSON.parse(localStorage.getItem("user"));

    if (login_user && login_user.email) {
      const nameFromEmail = login_user.email.split("@")[0];
      setUserName(nameFromEmail);
    }
  }, []);

  const homePath = user?.role ? `/${user.role}` : "/login";

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const navLinks = [
    ...(user?.role === "user"
      ? [
          { name: "Dashboard", path: "/dashboard" },
          { name: "Media Requests", path: "/media-requests" },
        ]
      : []),

    ...(user?.role === "admin"
      ? [
          { name: "Media Review", path: "/media-review" },
          { name: "Manage Ads", path: "/ads" },
        ]
      : []),
  ];

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        {/* <Link to={homePath} className="text-xl font-bold text-gray-800">
          SafeStreet
        </Link> */}
        <Link to={homePath} className="text-2xl font-bold text-indigo-600">
          SafeStreet<span className="text-gray-800">.com.au</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:!flex space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-gray-700 hover:text-blue-500 transition"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Section: User Dropdown or Login/Signup */}
        <div className="hidden md:!flex items-center space-x-6">
          {user ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2"
              >
                <UserIcon size={24} className="text-gray-700 cursor-pointer" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md overflow-hidden">
                  <h1 className="ml-4 font-medium capitalize">
                    Hi, {userName || "User"}
                  </h1>
                  <button
                    onClick={logout}
                    className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    <LogOut size={16} className="mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link to="/login" className="text-gray-700 hover:text-blue-500">
                Login
              </Link>
              <span className="text-gray-500">|</span>
              <Link to="/signup" className="text-gray-700 hover:text-blue-500">
                Signup
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700" onClick={toggleMenu}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md py-4 px-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="block py-2 text-gray-700 hover:text-blue-500"
            >
              {link.name}
            </Link>
          ))}
          {user ? (
            <div>
              <h1 className="font-bold capitalize">Hi, {userName || "User"}</h1>
              <button
                onClick={logout}
                className="mt-3 w-full text-left text-red-600 hover:text-red-800 flex items-center"
              >
                <LogOut size={16} className="mr-2" /> Logout
              </button>
            </div>
          ) : (
            <div className="mt-3 flex flex-col space-y-2">
              <Link to="/login" className="text-gray-700 hover:text-blue-500">
                Login
              </Link>
              <Link
                to="/signup"
                className="text-gray-700 hover:text-blue-500 border border-blue-500 rounded-md px-3 py-1 text-center"
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
