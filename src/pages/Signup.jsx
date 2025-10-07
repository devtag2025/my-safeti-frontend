import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const Signup = () => {
  const signup = useAuthStore((state) => state.signup);
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_TEST_KEY;

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm();
  const selectedState = watch("state", "");

  const handleStateChange = (value) => setValue("state", value, { shouldValidate: true, shouldDirty: true });
  const handleCaptchaChange = (token) => { setCaptchaToken(token); if (error && error.toLowerCase().includes("captcha")) setError(""); };
  const handleCaptchaExpired = () => setCaptchaToken(null);

  const onSubmit = async (data) => {
    if (!captchaToken) return setError("Please complete the captcha verification");

    setError(""); setMessage("");

    try {
      await signup({ ...data, captchaToken });
      const user = useAuthStore.getState().user;
      if (!user) {
        setError("Signup failed. No user returned.");
        recaptchaRef.current?.reset();
        setCaptchaToken(null);
        return;
      }
      setMessage("Account created successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err?.message || "Signup failed. Please try again.");
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-8">

      {/* Logo */}
      <div className="mb-6">
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

      {/* Signup Card */}
      <Card className="relative w-full max-w-md mx-auto bg-white/60 backdrop-blur-xl border border-[#6e0001]/20 shadow-lg shadow-[#6e0001]/10 rounded-2xl overflow-visible">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#6e0001] to-transparent" />

        <CardHeader className="space-y-1 px-8 pt-8">
          <CardTitle className="text-2xl font-extrabold text-center bg-gradient-to-r from-[#6e0001] via-[#8a0000] to-[#fb7185] bg-clip-text text-transparent tracking-tight">
            Create Your Account
          </CardTitle>
          <CardDescription className="text-center text-gray-700">
            Fill in your details to sign up for a new account
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pt-4 pb-6">
          {/* Success & Error Messages */}
          {message && (
            <Alert variant="success" className="mb-4 bg-emerald-100/60 border-emerald-400/40 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive" className="mb-4 bg-rose-100/60 border-rose-400/40 text-rose-700">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Full Name */}
            <div className="space-y-1">
              <Label htmlFor="fullName" className="text-sm text-gray-700">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                {...register("fullName", { required: "Full name is required" })}
                placeholder="Full name"
                className="h-9 bg-white/20 border border-[#6e0001]/30 placeholder:text-gray-400 text-gray-900 focus:ring-2 focus:ring-[#6e0001]/40 focus:border-[#6e0001] transition-all"
                disabled={isSubmitting}
              />
              {errors.fullName && <p className="text-xs text-rose-500">{errors.fullName.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email" className="text-sm text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { required: "Email is required", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" } })}
                placeholder="name@example.com"
                className="h-9 bg-white/20 border border-[#6e0001]/30 placeholder:text-gray-400 text-gray-900 focus:ring-2 focus:ring-[#6e0001]/40 focus:border-[#6e0001] transition-all"
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-xs text-rose-500">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <Label htmlFor="phone" className="text-sm text-gray-700">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                {...register("phone", { required: "Phone number is required" })}
                placeholder="0400 000 000"
                className="h-9 bg-white/20 border border-[#6e0001]/30 placeholder:text-gray-400 text-gray-900 focus:ring-2 focus:ring-[#6e0001]/40 focus:border-[#6e0001] transition-all"
                disabled={isSubmitting}
              />
              {errors.phone && <p className="text-xs text-rose-500">{errors.phone.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="password" className="text-sm text-gray-700">Password</Label>
              <PasswordInput
                id="password"
                {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                placeholder="••••••••"
                className="h-9 bg-white/20 border border-[#6e0001]/30 placeholder:text-gray-400 text-gray-900 focus:ring-2 focus:ring-[#6e0001]/40 focus:border-[#6e0001] transition-all"
                disabled={isSubmitting}
              />
              {errors.password && <p className="text-xs text-rose-500">{errors.password.message}</p>}
            </div>

            {/* State */}
            <div className="space-y-1">
              <Label htmlFor="state" className="text-sm text-gray-700">State</Label>
              <Select onValueChange={handleStateChange} value={selectedState} disabled={isSubmitting}>
                <SelectTrigger id="state" className="h-9 bg-white/20 border border-[#6e0001]/30 text-gray-900">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {["ACT","NSW","NT","QLD","SA","TAS","VIC","WA","HEAVY VEHICLE","OTHER"].map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" {...register("state", { required: "Please select a state" })} value={selectedState} />
              {errors.state && <p className="text-xs text-rose-500">{errors.state.message}</p>}
            </div>

            {/* reCAPTCHA */}
            <div className="flex justify-center pt-2">
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

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-9 rounded-xl bg-gradient-to-r from-[#6e0001] to-[#fb7185] hover:from-[#8a0000] hover:to-[#f472b6] text-white shadow-lg shadow-[#6e0001]/20 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Sign up"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center py-3 border-t border-[#6e0001]/20 rounded-b-2xl">
          <p className="text-xs text-gray-700">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-[#6e0001] hover:text-[#fb7185] transition-colors">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
