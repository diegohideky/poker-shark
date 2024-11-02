// pages/login.tsx

import { useState } from "react";
import { useRouter } from "next/router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "../service";
import { useUser } from "@contexts/UserContext";
import { LoginSchema } from "pages/api/accounts/login/schema";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Import eye icons

type LoginForm = z.infer<typeof LoginSchema>;

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Loading state
  const [showPassword, setShowPassword] = useState(false); // Password visibility state

  const { setTokenData } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    setLoading(true); // Start loading state
    try {
      const result = await login(data.username, data.password);
      setTokenData(result.token);
      router.push("/"); // Redirect after successful login
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            {...register("username")}
            className={`mt-1 block w-full border ${
              errors.username ? "border-red-500" : "border-gray-300"
            } rounded-md p-2`}
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username.message}</p>
          )}
        </div>

        <div className="mb-4 relative">
          <label className="block text-gray-700" htmlFor="password">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            {...register("password")}
            className={`mt-1 block w-full border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } rounded-md p-2`}
          />
          <div
            className="absolute right-2 top-10 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <AiFillEyeInvisible size={24} />
            ) : (
              <AiFillEye size={24} />
            )}
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 transition duration-200 flex items-center justify-center"
          disabled={loading} // Disable button during loading
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          ) : null}
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
