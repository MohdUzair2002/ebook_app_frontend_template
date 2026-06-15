"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import axios from "@/api/axios";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Container } from "@/components/site/Container";
import { RootState } from "@/store";
import NextLink from "next/link";

const SECURITY_QUESTIONS = [
  "What is your mother's maiden name?",
  "What was the name of your first pet?",
  "What was the name of your primary school?",
  "What is your favorite book?",
  "What city were you born in?",
];

export default function SignupPage() {
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  if (isLoggedIn) {
    router.push("/");
  }

  const [Data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profilePic: "https://sectricity.com/wp-content/uploads/2023/05/Hacker-Cyber-Security-Internet-Sectricity.jpg",
    role: "user",
    question: "",
    answer: "",
    address: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!Data.name.trim()) newErrors.name = "Name is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!Data.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(Data.email)) newErrors.email = "Enter a valid email address";

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(.{8,})$/;
    if (!Data.password) newErrors.password = "Password is required";
    else if (!passwordRegex.test(Data.password))
      newErrors.password = "Min 8 chars, 1 number & 1 special character required";

    if (!Data.address.trim()) newErrors.address = "Address is required";
    if (!Data.question) newErrors.question = "Please select a security question";
    if (!Data.answer.trim()) newErrors.answer = "Answer is required";

    return newErrors;
  };

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/auth/register", Data);
      setData({ 
        name: "", 
        email: "", 
        password: "", 
        profilePic: "https://sectricity.com/wp-content/uploads/2023/05/Hacker-Cyber-Security-Internet-Sectricity.jpg", 
        role: "user", 
        question: "", 
        answer: "", 
        address: "" 
      });
      alert(response.data.message);
      router.push("/login");
    } catch (error: any) {
      console.error("Signup error:", error);
      alert(error.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const p = Data.password;
    if (!p) return null;
    if (p.length < 6) return { label: "Weak", color: "text-red-500" };
    if (p.length < 8 || !/[0-9]/.test(p) || !/[!@#$%^&*]/.test(p))
      return { label: "Medium", color: "text-yellow-500" };
    return { label: "Strong", color: "text-green-500" };
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <Container className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-xl bg-card rounded-2xl p-8 border border-outline-variant/40 shadow-[0_4px_30px_-10px_rgba(21,25,106,0.1)] my-6">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-primary">Create Account</h1>
            <p className="mt-2 text-sm text-muted-foreground">Join Darulishaat Ebooks today</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-foreground/80 mb-1.5">
                Select Role
              </label>
              <div className="flex gap-6 mt-2">
                {/* {["user", "publisher"].map((r) => ( */}//when publisher sign up needed
                {["user"].map((r) => (
                  <label key={r} className="flex items-center text-sm font-medium text-foreground/70 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value={r}
                      checked={Data.role === r}
                      onChange={change}
                      className="mr-2 h-4 w-4 accent-primary"
                    />
                    {r === "user" ? "Reader" : "Publisher"}
                  </label>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-foreground/80 mb-1.5">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={Data.name}
                onChange={change}
                placeholder="John Doe"
                className={`w-full rounded-xl border bg-surface-container-low px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-black ${
                  errors.name ? "border-red-500" : "border-outline-variant"
                }`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-foreground/80 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={Data.email}
                onChange={change}
                placeholder="john@example.com"
                className={`w-full rounded-xl border bg-surface-container-low px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-black ${
                  errors.email ? "border-red-500" : "border-outline-variant"
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-foreground/80 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={Data.password}
                  onChange={change}
                  placeholder="Min 8 chars, 1 number, 1 special char"
                  className={`w-full rounded-xl border bg-surface-container-low px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-black pr-16 ${
                    errors.password ? "border-red-500" : "border-outline-variant"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {strength && <p className={`text-xs mt-1.5 ${strength.color}`}>Password strength: {strength.label}</p>}
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-foreground/80 mb-1.5">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={Data.address}
                onChange={change}
                rows={2}
                placeholder="City, Country"
                className={`w-full rounded-xl border bg-surface-container-low px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-black ${
                  errors.address ? "border-red-500" : "border-outline-variant"
                }`}
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            {/* Security Question */}
            <div>
              <label htmlFor="question" className="block text-sm font-semibold text-foreground/80 mb-1.5">
                Security Question
              </label>
              <select
                id="question"
                name="question"
                value={Data.question}
                onChange={change}
                className={`w-full rounded-xl border bg-surface-container-low px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-black ${
                  errors.question ? "border-red-500" : "border-outline-variant"
                }`}
              >
                <option value="" className="text-gray-400">-- Select a question --</option>
                {SECURITY_QUESTIONS.map((q, i) => (
                  <option key={i} value={q} className="text-black">{q}</option>
                ))}
              </select>
              {errors.question && <p className="text-red-500 text-xs mt-1">{errors.question}</p>}
            </div>

            {/* Answer */}
            <div>
              <label htmlFor="answer" className="block text-sm font-semibold text-foreground/80 mb-1.5">
                Answer
              </label>
              <input
                id="answer"
                type="text"
                name="answer"
                value={Data.answer}
                onChange={change}
                placeholder="Your answer"
                className={`w-full rounded-xl border bg-surface-container-low px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-black ${
                  errors.answer ? "border-red-500" : "border-outline-variant"
                }`}
              />
              {errors.answer && <p className="text-red-500 text-xs mt-1">{errors.answer}</p>}
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-primary text-white font-semibold py-3 hover:bg-primary-container transition duration-300 disabled:opacity-75 flex items-center justify-center gap-2"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <NextLink href="/login" className="font-semibold text-primary hover:underline">
              Login
            </NextLink>
          </div>
        </div>
      </Container>

      <SiteFooter />
    </div>
  );
}
