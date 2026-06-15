"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Favourite from "@/components/profile/Favourite";
import AllOrders from "@/components/profile/AllOrders";

export default function ProfilePageIndex() {
  const role = useSelector((state: RootState) => state.auth.role);

  if (role === "admin") {
    return <AllOrders />;
  }

  return <Favourite />;
}
