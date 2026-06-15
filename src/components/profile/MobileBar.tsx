"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { FaHeart, FaGear, FaPlus, FaBookOpen } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";

export default function MobileBar() {
  const role = useSelector((state: RootState) => state.auth.role);
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const getTabClass = (path: string) => {
    return `flex-1 py-3 flex flex-col items-center justify-center gap-1 font-semibold text-xs transition-all duration-200 border-b-2 ${
      isActive(path)
        ? "border-primary text-primary bg-primary/5 font-bold"
        : "border-transparent text-muted-foreground hover:text-primary hover:bg-surface-container/30"
    }`;
  };

  return (
    <div className="w-full bg-card border border-outline-variant/30 rounded-2xl flex overflow-hidden shadow-sm lg:hidden my-2">
      {role !== "admin" ? (
        <>
          <Link href="/profile" className={getTabClass("/profile")}>
            <FaHeart className="size-4" />
            <span>Favourites</span>
          </Link>
          <Link href="/profile/orderHistory" className={getTabClass("/profile/orderHistory")}>
            <FaHistory className="size-4" />
            <span>Orders</span>
          </Link>
          <Link href="/profile/settings" className={getTabClass("/profile/settings")}>
            <FaGear className="size-4" />
            <span>Settings</span>
          </Link>
        </>
      ) : (
        <>
          <Link href="/profile" className={getTabClass("/profile")}>
            <FaBookOpen className="size-4" />
            <span>All Orders</span>
          </Link>
          <Link href="/profile/add-book" className={getTabClass("/profile/add-book")}>
            <FaPlus className="size-4" />
            <span>Add Book</span>
          </Link>
          <Link href="/profile/pending-books" className={getTabClass("/profile/pending-books")}>
            <FaHistory className="size-4" />
            <span>Pending</span>
          </Link>
        </>
      )}
    </div>
  );
}
