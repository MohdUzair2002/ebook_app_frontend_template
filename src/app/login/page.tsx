"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import axios from "@/api/axios";
import { authActions } from "@/store/auth";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Container } from "@/components/site/Container";
import { RootState } from "@/store";

export default function LoginPage() {
  const [Data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  const getDeviceId = async () => {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId;
  };

  const change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Data.email === "" || Data.password === "") {
      alert("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const deviceId = await getDeviceId();
      const response = await axios.post("/auth/login", {
        email: Data.email,
        password: Data.password,
        deviceId,
      });

      setData({ email: "", password: "" });
      dispatch(authActions.login());
      dispatch(authActions.changeRole(response.data.role));

      localStorage.setItem("id", response.data._id);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      router.push("/profile");
    } catch (error: any) {
      console.error("Login error:", error);
      alert(error.response?.data?.error || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <Container className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md bg-card rounded-2xl p-8 border border-outline-variant/40 shadow-[0_4px_30px_-10px_rgba(21,25,106,0.1)]">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-primary">Welcome Back</h1>
            <p className="mt-2 text-sm text-muted-foreground">Log in to access your digital library</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-foreground/80 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                value={Data.email}
                onChange={change}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-black"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-foreground/80 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                required
                value={Data.password}
                onChange={change}
                placeholder="••••••••"
                className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-black"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary text-white font-semibold py-3 hover:bg-primary-container transition duration-300 disabled:opacity-75 flex items-center justify-center gap-2"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </Container>

      <SiteFooter />
    </div>
  );
}
