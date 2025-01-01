// pages/login.tsx

import { useState } from "react";
import { useRouter } from "next/router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@services/accounts";
import { useUser } from "@contexts/UserContext";
import { LoginSchema } from "pages/api/accounts/login/schema";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Typography from "@components/Typography";
import LoadingOverlay from "@components/LoadingOverlay";

type LoginForm = z.infer<typeof LoginSchema>;

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { setTokenData, getCurrentUser } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    setLoading(true);
    try {
      const result = await login(data.username, data.password);
      setTokenData(result.token);
      await getCurrentUser();
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="flex items-center justify-center min-h-screen" // Poker table green background
    >
      <LoadingOverlay isLoading={loading} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-slate-900 p-6 rounded-lg shadow-lg w-full max-w-sm border border-gray-800 flex flex-col gap-2"
      >
        <Typography variant="title" className="text-white	mb-4 text-center">
          Poker Shark
        </Typography>

        {error && (
          <Typography variant="body" className="text-red-500 mb-4">
            {error}
          </Typography>
        )}

        <div className="mb-4">
          <label className="block text-gray-50" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            {...register("username")}
            className={`mt-1 block w-full border ${
              errors.username ? "border-red-500" : "border-yellow-400"
            } rounded-md p-2 text-black-50`}
          />
          {errors.username && (
            <Typography variant="body" className="text-red-500 text-sm">
              {errors.username.message}
            </Typography>
          )}
        </div>

        <div className="mb-4 relative">
          <label className="block text-gray-50" htmlFor="password">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            {...register("password")}
            className={`mt-1 block w-full border ${
              errors.password ? "border-red-500" : "border-yellow-400"
            } rounded-md p-2 text-black-50`}
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
            <Typography variant="body" className="text-red-500 text-sm">
              {errors.password.message}
            </Typography>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-gray-50 rounded-md p-2 hover:bg-yellow-600 transition duration-200 flex items-center justify-center"
          disabled={loading}
        >
          Login
        </button>

        <div className="w-full mt-5 flex justify-end">
          {/* add a sinup link button */}
          <button
            className="text-blue-400 hover:text-blue-700 transition duration-200"
            onClick={() => router.push("/accounts/signup")}
          >
            Don&apos;t have an account? Sign up
          </button>
        </div>
      </form>
    </main>
  );
};

export default LoginPage;
