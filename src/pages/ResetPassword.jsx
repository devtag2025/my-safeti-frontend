import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
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
  Shield,
  Loader2,
  CheckCircle,
  ArrowLeft,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import API from "../api/axiosConfig";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const [error, setError] = useState("");
  const { token } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsValidToken(false);
        return;
      }
      try {
        const response = await API.post("/auth/verify-reset-token", { token });
        if (!response.data.success) setIsValidToken(false);
      } catch {
        setIsValidToken(false);
      }
    };
    verifyToken();
  }, [token]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError("");
      const response = await API.post("/auth/reset-password", {
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      if (response.data.success) {
        setIsSuccess(true);
        toast.success(response.data.message || "Password reset successfully!");
      } else {
        setError(response.data.message || "Failed to reset password.");
        toast.error(response.data.message || "Failed to reset password.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to reset password.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------- Invalid Token -------------------
  if (!isValidToken) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="mb-8">
          <img
            src="/images/logo.png"
            alt="Company Logo"
            onClick={() => navigate("/home")}
            className="h-20 w-auto mx-auto cursor-pointer"
          />
        </div>

        {/* Invalid Token Card */}
        <Card className="w-full max-w-md bg-white shadow-xl rounded-2xl border border-gray-100">
          <CardHeader className="text-center space-y-3">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mx-auto">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-[#6e0001]">
              Invalid Reset Link
            </CardTitle>
            <CardDescription className="text-gray-600">
              Your reset link is invalid or has expired
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Please request a new password reset link.
              </AlertDescription>
            </Alert>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <Link to="/forgot-password" className="w-full">
              <Button className="w-full bg-[#6e0001] hover:bg-[#8a0000] text-white rounded-xl">
                Request New Reset Link
              </Button>
            </Link>
            <Link to="/login" className="w-full">
              <Button
                variant="outline"
                className="w-full border-[#6e0001] text-[#6e0001] hover:bg-[#6e0001]/10 rounded-xl"
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

  // ------------------- Success -------------------
  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="mb-8">
          <img
            src="/images/logo.png"
            alt="Company Logo"
            onClick={() => navigate("/home")}
            className="h-20 w-auto mx-auto cursor-pointer"
          />
        </div>

        {/* Success Card */}
        <Card className="w-full max-w-md bg-white shadow-xl rounded-2xl border border-gray-100">
          <CardHeader className="text-center space-y-3">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-[#6e0001]">
              Password Reset Successfully!
            </CardTitle>
            <CardDescription className="text-gray-600">
              You can now log in with your new password.
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex justify-center">
            <Button
              className="w-full bg-[#6e0001] hover:bg-[#8a0000] text-white rounded-xl"
              onClick={() => navigate("/login")}
            >
              Continue to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // ------------------- Default Form -------------------
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Logo */}
      <div className="mb-8">
        <img
          src="/images/logo.png"
          alt="Company Logo"
          onClick={() => navigate("/home")}
          className="h-20 w-auto mx-auto cursor-pointer"
        />
      </div>

      {/* Reset Password Card */}
      <Card className="w-full max-w-md bg-white shadow-xl rounded-2xl border border-gray-100">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold text-[#6e0001]">
            Reset Password
          </CardTitle>
          <CardDescription className="text-gray-600">
            Enter your new password below
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <PasswordInput
                id="password"
                {...register("password", {
                  required: "New password is required",
                })}
                placeholder="Enter your new password"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <PasswordInput
                id="confirmPassword"
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                placeholder="Confirm your new password"
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#6e0001] hover:bg-[#8a0000] text-white rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Reset Password
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

export default ResetPassword;
