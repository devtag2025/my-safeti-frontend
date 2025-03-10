import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const Signup = () => {
  const signup = useAuthStore((state) => state.signup);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const registered_user = await signup(data);

      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "client") {
        setMessage(
          "Your account has been created! Please wait for admin approval."
        );
      } else {
        navigate("/user");
      }
    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
          Create Your Account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md bg-white p-6">
        {/* ✅ Show Success Message if client is waiting for approval */}
        {message && (
          <p className="mb-4 text-center text-green-600">{message}</p>
        )}

        {/* ❌ Show Error Message if there's an error */}
        {error && <p className="mb-4 text-center text-red-600">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name */}
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

          {/* Email */}
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

          {/* Password */}
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

          {/* Role Selection Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Role
            </label>
            <select
              {...register("role", { required: "Please select a role" })}
              className="mt-2 block w-full rounded-md border border-gray-300 p-2 bg-white text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="client">Client</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
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
