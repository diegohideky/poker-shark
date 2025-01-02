import { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { showErrorToast } from "@libs/utils";
import { signup } from "@services/accounts";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  passwordConfirmation: z.string().min(6, "Confirm Password is required"),
});

const passwordRules = [
  { regex: /.{8,}/, message: "At least 8 characters" },
  { regex: /[a-z]/, message: "At least one lowercase letter" },
  { regex: /[A-Z]/, message: "At least one uppercase letter" },
  { regex: /[0-9]/, message: "At least one number" },
  { regex: /[^a-zA-Z0-9]/, message: "At least one special character" },
];

const SignupPage: React.FC = () => {
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState<boolean>(false);

  const validateRules = (input: string) =>
    passwordRules.map((rule) => ({
      ...rule,
      isValid: rule.regex.test(input),
    }));

  const passwordValidation = validateRules(password);

  const handleSignup = async () => {
    try {
      const validatedData = signupSchema.parse({
        name,
        username,
        email,
        password,
        passwordConfirmation,
      });

      if (validatedData.password !== validatedData.passwordConfirmation) {
        toast.error("Passwords do not match");
        return;
      }

      await signup(
        validatedData.name,
        validatedData.username,
        validatedData.email,
        validatedData.password,
        validatedData.passwordConfirmation
      );

      router.push("/accounts/login");
    } catch (error) {
      console.log(error);
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => showErrorToast(err.message));
      } else {
        showErrorToast((error as any).response.data.message);
      }
    }
  };

  return (
    <main className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm"
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="absolute right-3 top-11 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            />
            <ul className="mt-2 text-sm">
              {passwordValidation.map((rule, idx) => (
                <li
                  key={idx}
                  className={`${
                    rule.isValid ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {rule.message}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type={showPasswordConfirmation ? "text" : "password"}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm"
            />
            <FontAwesomeIcon
              icon={showPasswordConfirmation ? faEyeSlash : faEye}
              className="absolute right-3 top-11 text-gray-500 cursor-pointer"
              onClick={() =>
                setShowPasswordConfirmation(!showPasswordConfirmation)
              }
            />
          </div>

          <div className="mt-6">
            <button
              onClick={handleSignup}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignupPage;
