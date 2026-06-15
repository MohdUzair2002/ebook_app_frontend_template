"use client";

import { useEffect, useState } from "react";
import axios from "@/api/axios";
import { useProfile } from "../layout";
import { Loader2 } from "lucide-react";

export default function Settings() {
  const { ProfileData, refreshProfile } = useProfile();
  const [address, setAddress] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (ProfileData) {
      setAddress(ProfileData.address || "");
    }
  }, [ProfileData]);

  const handleUpdate = async () => {
    if (!address.trim()) {
      alert("Address cannot be empty!");
      return;
    }

    setUpdating(true);
    const headers = {
      id: localStorage.getItem("id") || "",
      authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    };

    try {
      const res = await axios.put(
        "/auth/updateUserAddress",
        { address },
        { headers }
      );
      alert(res.data.message);
      // Refresh profile data globally to update other views
      await refreshProfile();
    } catch (error) {
      console.error("Error updating user address:", error);
      alert("Failed to update address.");
    } finally {
      setUpdating(false);
    }
  };

  if (!ProfileData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 gap-2">
        <Loader2 className="size-8 text-primary animate-spin" />
        <p className="text-sm font-semibold text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl flex flex-col h-full">
      <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-8">
        Settings
      </h2>

      <div className="space-y-6">
        {/* Read-only Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Name</label>
            <p className="mt-1.5 font-semibold text-foreground bg-surface-container-low/50 py-3 px-4 rounded-xl border border-outline-variant/20">
              {ProfileData.name}
            </p>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Email Address</label>
            <p className="mt-1.5 font-semibold text-foreground bg-surface-container-low/50 py-3 px-4 rounded-xl border border-outline-variant/20 truncate">
              {ProfileData.email}
            </p>
          </div>
        </div>

        {/* Editable Address Field */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Shipping / Billing Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={5}
            placeholder="Enter your street name, city, zip code and country..."
            className="mt-1.5 w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-4 font-semibold text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleUpdate}
            disabled={updating}
            className="bg-[#fed65b] text-[#574500] hover:bg-[#fed65b]/90 font-bold px-6 py-3 rounded-xl shadow-sm hover:shadow transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {updating && <Loader2 className="size-4 animate-spin" />}
            <span>Update Address</span>
          </button>
        </div>
      </div>
    </div>
  );
}
