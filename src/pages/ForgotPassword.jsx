import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ArrowLeft,
  Mail,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import API from "../api/axiosConfig";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError("");
      setEmail(data.email);

      const response = await API.post("/auth/forgot-password", {
        email: data.email,
      });

      if (response.data.success) {
        setIsSuccess(true);
        toast.success(response.data.message || "Reset link sent!");
      } else {
        setError(response.data.message || "Could not send reset link");
        toast.error(response.data.message || "Could not send reset link");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Could not send reset link";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Forgot password error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Success Screen
  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-8">
        {/* Logo Section */}
        <div className="mb-8">
          <div className="relative h-24 w-64 mx-auto overflow-hidden cursor-pointer" onClick={() => navigate("/home")}>
            <img
              src="/images/logo.png"
              alt="Company Logo"
              className="absolute inset-0 w-full h-auto"
              style={{
                transform: "scale(1.45)",
                filter: "drop-shadow(0 6px 20px rgba(110,0,1,0.3))",
              }}
            />
          </div>
        </div>

        <Card className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-md shadow-xl rounded-2xl border border-[#6e0001]/20">
          <CardHeader className="space-y-1 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mx-auto mb-4 shadow-md">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-[#6e0001]">
              Reset Link Sent
            </CardTitle>
            <CardDescription className="text-gray-600">
              Please check your email for the password reset link.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Alert className="bg-emerald-50 border-emerald-200">
              <Mail className="h-4 w-4 text-emerald-600" />
              <AlertDescription className="text-emerald-700">
                We've sent a password reset link to <strong>{email}</strong>
              </AlertDescription>
            </Alert>
          </CardContent>

          <CardFooter className="flex justify-center">
            <Link to="/login" className="w-full">
              <Button
                variant="outline"
                className="w-full border-[#6e0001] text-[#6e0001] hover:bg-[#6e0001] hover:text-white rounded-xl"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // ✅ Forgot Password Form
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-8">
      {/* Logo Section */}
      <div className="mb-8">
        <div className="relative h-24 w-64 mx-auto overflow-hidden cursor-pointer" onClick={() => navigate("/home")}>
          <img
            src="/images/logo.png"
            alt="Company Logo"
            className="absolute inset-0 w-full h-auto"
            style={{
              transform: "scale(1.45)",
              filter: "drop-shadow(0 6px 20px rgba(110,0,1,0.3))",
            }}
          />
        </div>
      </div>

      <Card className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-md shadow-xl rounded-2xl border border-[#6e0001]/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-[#6e0001]">
            Forgot Password?
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Enter your email address to get a reset link
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4 bg-rose-50 border-rose-200 text-rose-700">
              <AlertCircle className="h-4 w-4 text-rose-600" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Enter a valid email address",
                  },
                })}
                placeholder="name@example.com"
                disabled={isLoading}
                className="h-10 border-gray-300 focus:border-[#6e0001] focus:ring-[#6e0001] rounded-xl"
              />
              {errors.email && (
                <p className="text-sm text-rose-600">{errors.email.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-10 rounded-xl bg-gradient-to-r from-[#6e0001] to-[#8a0000] text-white hover:opacity-90 shadow-md transition"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Reset Link
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-medium text-[#6e0001] hover:underline"
            >
              Back to Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
