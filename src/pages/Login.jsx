import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import useAuthStore from "../store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Login = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_TEST_KEY;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
    if (error && error.includes("captcha")) setError("");
  };
  const handleCaptchaExpired = () => setCaptchaToken(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) return setError("Email or Phone Number is required");
    if (!formData.password) return setError("Password is required");
    if (!captchaToken) return setError("Please complete the captcha verification");

    setIsSubmitting(true);
    try {
      await login({ ...formData, captchaToken });
      const user = useAuthStore.getState().user;
      if (user?.role === "admin" || user?.role === "super-admin") navigate("/admin");
      else if (user?.role === "client") {
        user.status === "inactive" ? setError("Your account is currently inactive.") : navigate("/client");
      } else {
        user.status === "inactive" ? setError("Your account is currently inactive.") : navigate("/user");
      }
    } catch (err) {
      setError(err.message || "Error signing in");
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12">

      {/* Logo Section */}
      <div className="mb-8">
        <div
          className="relative h-24 w-64 mx-auto cursor-pointer group"
          onClick={() => navigate("/home")}
        >
          <img
            src="/images/logo.png"
            alt="Company Logo"
            className="absolute inset-0 w-full h-auto transform scale-[1.45] transition-all duration-300 group-hover:scale-[1.5]"
            style={{ filter: "drop-shadow(0 8px 24px rgba(110,0,1,0.3))" }}
          />
        </div>
      </div>

      {/* Login Card */}
      <Card className="relative w-full max-w-md mx-auto bg-white/60 backdrop-blur-xl border border-[#6e0001]/20 shadow-lg shadow-[#6e0001]/10 rounded-2xl overflow-visible">
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#6e0001] to-transparent"></div>

        <CardHeader className="space-y-1 px-8 pt-8">
          <CardTitle className="text-2xl font-extrabold text-center bg-gradient-to-r from-[#6e0001] via-[#8a0000] to-[#fb7185] bg-clip-text text-transparent tracking-tight">
            Sign in
          </CardTitle>
          <CardDescription className="text-center text-gray-700">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pt-4 pb-6">
          {error && (
            <Alert variant="destructive" className="mb-4 bg-rose-100 border-rose-300 text-rose-700">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-gray-700">
                Email/Phone Number
              </Label>
              <Input
                id="email"
                name="email"
                type="text"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                className="bg-white/20 border border-[#6e0001]/30 placeholder:text-gray-400 text-gray-900 focus:ring-2 focus:ring-[#6e0001]/40 focus:border-[#6e0001] transition-all"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm text-gray-700">
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-[#6e0001] hover:text-[#fb7185] transition-colors text-sm"
                >
                  Forgot password?
                </Link>
              </div>
              <PasswordInput
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                className="bg-white/20 border border-[#6e0001]/30 placeholder:text-gray-400 text-gray-900 focus:ring-2 focus:ring-[#6e0001]/40 focus:border-[#6e0001] transition-all"
              />
            </div>

            {/* reCAPTCHA */}
            <div className="flex justify-center">
              <div className="p-2 rounded-md bg-[#6e0001]/5 border border-[#6e0001]/20">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={handleCaptchaChange}
                  onExpired={handleCaptchaExpired}
                  theme="light"
                />
              </div>
            </div>

            <div className="pt-1">
              <Button
                type="submit"
                className="w-full py-3 font-semibold rounded-xl bg-[#6e0001] hover:from-[#8a0000] hover:to-[#f472b6] text-white shadow-lg shadow-[#6e0001]/20 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center py-6 border-t border-[#6e0001]/20 rounded-b-2xl">
          <p className="text-sm text-gray-700">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-[#6e0001] hover:text-[#fb7185] transition-colors"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
