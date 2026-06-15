"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "@/api/axios";
import { RootState } from "@/store";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Container } from "@/components/site/Container";
import Sidebar from "@/components/profile/Sidebar";
import MobileBar from "@/components/profile/MobileBar";
import { Loader2 } from "lucide-react";

// Create context to share profile data with sub-routes
interface ProfileContextProps {
  ProfileData: any;
  setProfileData: React.Dispatch<React.SetStateAction<any>>;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextProps | undefined>(undefined);

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider (in profile layout)");
  }
  return context;
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const [ProfileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    const userId = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      router.push("/login");
      return;
    }

    const headers = {
      id: userId,
      authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.get("/auth/getUserData", { headers });
      setProfileData(response.data);
    } catch (error) {
      console.error("Error fetching user data in layout:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Wait for auth state to initialize from localStorage
    const checkAuth = setTimeout(() => {
      if (isLoggedIn === false) {
        router.push("/login");
      } else {
        fetchProfile();
      }
    }, 100);

    return () => clearTimeout(checkAuth);
  }, [isLoggedIn]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader />
        <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Loader2 className="size-10 text-primary animate-spin" />
          <p className="text-sm font-semibold text-muted-foreground">Loading Profile...</p>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <ProfileContext.Provider value={{ ProfileData, setProfileData, refreshProfile: fetchProfile }}>
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader />
        
        <Container className="py-8 flex-1 flex flex-col">
          <div className="flex-1 flex flex-col lg:flex-row gap-6 items-stretch">
            {/* Sidebar (Desktop) */}
            <aside className="w-full lg:w-1/4 xl:w-1/5 shrink-0 flex flex-col">
              <Sidebar ProfileData={ProfileData} />
            </aside>

            {/* Mobile Bar */}
            <MobileBar />

            {/* Sub-pages Content Area */}
            <main className="flex-1 bg-card border border-outline-variant/30 rounded-2xl p-6 shadow-sm min-h-[50vh] flex flex-col">
              {children}
            </main>
          </div>
        </Container>

        <SiteFooter />
      </div>
    </ProfileContext.Provider>
  );
}
