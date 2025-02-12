import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../store/authStore";

const Signup = () => {
   const { signup } = useAuthStore();
   const navigate = useNavigate();
   const [error, setError] = useState("");

   const {
     register,
     handleSubmit,
     formState: { errors, isSubmitting },
   } = useForm();

   const onSubmit = async (data) => {
     try {
       await signup(data);
       navigate("/dashboard"); // Redirect after signup
     } catch (err) {
       setError(
         err.response?.data?.message || "Signup failed. Please try again."
       );
     }
   };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* <img
          alt="SafeStreet Logo"
          src="/assets/logo.svg" // Replace with your actual logo
          className="mx-auto h-12"
        /> */}
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
          Create Your Account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md p-6">
        {error && <p className="mb-4 text-center text-red-600">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              {...register("name", { required: "Full name is required" })}
              type="text"
              autoComplete="name"
              className="mt-2 block w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              autoComplete="email"
              className="mt-2 block w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
              type="password"
              autoComplete="new-password"
              className="mt-2 block w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? "Creating account..." : "Sign up"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 hover:text-indigo-500 font-semibold"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
