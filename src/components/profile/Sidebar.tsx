"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaArrowRightFromBracket, FaHeart, FaGear, FaPlus, FaClock, FaBookOpen } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "@/store/auth";
import { RootState } from "@/store";
import axios from "@/api/axios";

interface SidebarProps {
  ProfileData: {
    name: string;
    email: string;
    profilePic?: string;
    role?: string;
  };
}

export default function Sidebar({ ProfileData }: SidebarProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const role = useSelector((state: RootState) => state.auth.role);

  const handleLogout = async () => {
    try {
      await axios.get("/auth/logout", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } catch (error) {
      console.error("Logout API request error:", error);
    }
    dispatch(authActions.logout());
    dispatch(authActions.changeRole("user"));
    localStorage.clear();
    router.push("/");
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  // Nav Item Class generator
  const getNavItemClass = (path: string) => {
    return `w-full py-2.5 px-4 rounded-xl flex items-center gap-3 font-semibold transition-all duration-200 text-sm ${
      isActive(path)
        ? "bg-primary text-primary-foreground shadow-sm"
        : "text-foreground/80 hover:bg-surface-container hover:text-primary"
    }`;
  };

  return (
    <div className="h-full flex flex-col justify-between p-5 bg-card border border-outline-variant/30 rounded-2xl shadow-sm">
      {/* Profile Info */}
      <div className="flex flex-col items-center w-full">
        <div className="relative size-20 rounded-full bg-surface-container flex items-center justify-center overflow-hidden border border-outline-variant/40">
          {ProfileData.profilePic ? (
            <img
              src={ProfileData.profilePic}
              alt="profile"
              className="size-full object-cover"
              onError={(e) => {
                // Fallback if image fails to load
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          ) : (
            <span className="text-2xl font-bold text-primary">
              {ProfileData.name ? ProfileData.name.charAt(0).toUpperCase() : "U"}
            </span>
          )}
        </div>
        
        <h3 className="mt-3 text-lg font-bold text-foreground line-clamp-1 text-center w-full">
          {ProfileData.name}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-1 text-center w-full mb-4">
          {ProfileData.email}
        </p>
        
        <div className="w-full h-px bg-outline-variant/30 mb-5"></div>

        {/* Navigation links for Readers */}
        {role !== "admin" && (
          <nav className="w-full flex flex-col gap-2">
            <Link href="/profile" className={getNavItemClass("/profile")}>
              <FaHeart className="size-4 shrink-0" />
              <span>Favourites</span>
            </Link>
            {role === "user" && (
              <Link href="/profile/orderHistory" className={getNavItemClass("/profile/orderHistory")}>
                <FaHistory className="size-4 shrink-0" />
                <span>Order History</span>
              </Link>
            )}
            <Link href="/profile/settings" className={getNavItemClass("/profile/settings")}>
              <FaGear className="size-4 shrink-0" />
              <span>Settings</span>
            </Link>
          </nav>
        )}

        {/* Navigation links for Admin */}
        {role === "admin" && (
          <nav className="w-full flex flex-col gap-2">
            <Link href="/profile" className={getNavItemClass("/profile")}>
              <FaBookOpen className="size-4 shrink-0" />
              <span>All Orders</span>
            </Link>
            <Link href="/profile/add-book" className={getNavItemClass("/profile/add-book")}>
              <FaPlus className="size-4 shrink-0" />
              <span>Add Book</span>
            </Link>
            <Link href="/profile/pending-books" className={getNavItemClass("/profile/pending-books")}>
              <FaClock className="size-4 shrink-0" />
              <span>Pending Books</span>
            </Link>
          </nav>
        )}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full mt-8 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm transition-all duration-200 cursor-pointer"
      >
        <span>Log Out</span>
        <FaArrowRightFromBracket className="size-4 shrink-0" />
      </button>
    </div>
  );
}
