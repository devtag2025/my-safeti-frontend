import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import BackgroundImage from "../../public/images/bg.png";

// Import shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm();

  // For the Select components to work with react-hook-form
  const selectedRole = watch("role", "");
  const selectedState = watch("state", "");

  const handleRoleChange = (value) => {
    setValue("role", value);
  };

  const handleStateChange = (value) => {
    setValue("state", value);
  };

  const onSubmit = async (data) => {
    try {
      await signup(data);

      // Retrieve user from Zustand store after signup
      const user = useAuthStore.getState().user;

      if (!user) {
        setError("Signup failed. No user returned.");
        return;
      }
      navigate("/login");
    } catch (err) {
      console.error("Signup Error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="fixed inset-0"
        style={{
          backgroundImage: `url(${BackgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Signup Card */}
      <Card className="w-[70vh] md:w-full max-w-md mx-auto relative z-10 bg-white/90 backdrop-blur-sm shadow-xl max-h-[95vh] overflow-y-auto">
        <CardHeader className="space-y-1 py-4">
          <CardTitle className="text-xl font-bold text-center">
            Create Your Account
          </CardTitle>
          <CardDescription className="text-center text-sm">
            Fill in your details to sign up for a new account
          </CardDescription>
        </CardHeader>

        <CardContent className="py-4">
          {/* Success Message */}
          {message && (
            <Alert
              variant="success"
              className="mb-4 bg-green-50 border-green-200 py-2"
            >
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-600 text-sm">
                Success
              </AlertTitle>
              <AlertDescription className="text-green-600 text-sm">
                {message}
              </AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {error && (
            <Alert variant="destructive" className="mb-4 py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-sm">Error</AlertTitle>
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Full Name */}
            <div className="space-y-1">
              <Label htmlFor="fullName" className="text-sm">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                {...register("fullName", {
                  required: "Full name is required",
                })}
                placeholder="Full name"
                className="h-9"
              />
              {errors.firstName && (
                <p className="text-xs text-red-600">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email" className="text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                placeholder="name@example.com"
                className="h-9"
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <Label htmlFor="phone" className="text-sm">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                {...register("phone", {
                  required: "Phone number is required",
                })}
                placeholder="0400 000 000"
                className="h-9"
              />
              {errors.phone && (
                <p className="text-xs text-red-600">{errors.phone.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="password" className="text-sm">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                })}
                placeholder="••••••••"
                className="h-9"
              />
              {errors.password && (
                <p className="text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
            {/* Two columns for state and password */}
            <div className="grid grid-cols-2 gap-3">
              {/* State Selection */}
              <div className="space-y-1">
                <Label htmlFor="state" className="text-sm">
                  State
                </Label>
                <Select onValueChange={handleStateChange} value={selectedState}>
                  <SelectTrigger id="state" className="h-9">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACT">ACT</SelectItem>
                    <SelectItem value="NSW">NSW</SelectItem>
                    <SelectItem value="NT">NT</SelectItem>
                    <SelectItem value="QLD">QLD</SelectItem>
                    <SelectItem value="SA">SA</SelectItem>
                    <SelectItem value="TAS">TAS</SelectItem>
                    <SelectItem value="VIC">VIC</SelectItem>
                    <SelectItem value="WA">WA</SelectItem>
                    <SelectItem value="HEAVY VEHICLE">HEAVY VEHICLE</SelectItem>
                    <SelectItem value="OTHER">OTHER</SelectItem>
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  {...register("state", { required: "Please select a state" })}
                  value={selectedState}
                />
                {errors.state && (
                  <p className="text-xs text-red-600">{errors.state.message}</p>
                )}
              </div>
              {/* Role Selection */}
              <div className="space-y-1">
                <Label htmlFor="role" className="text-sm">
                  Select Role
                </Label>
                <Select onValueChange={handleRoleChange} value={selectedRole}>
                  <SelectTrigger id="role" className="h-9">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  {...register("role", { required: "Please select a role" })}
                  value={selectedRole}
                />
                {errors.role && (
                  <p className="text-xs text-red-600">{errors.role.message}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-9"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Sign up"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center py-3">
          <p className="text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
