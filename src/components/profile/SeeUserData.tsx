"use client";

import { RxCross1 } from "react-icons/rx";

interface SeeUserDataProps {
  userDivData: {
    name: string;
    email: string;
    address: string;
  };
  userDiv: string;
  setuserDiv: (value: string) => void;
}

export default function SeeUserData({ userDivData, userDiv, setuserDiv }: SeeUserDataProps) {
  if (userDiv === "hidden") return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={() => setuserDiv("hidden")}
        className="fixed inset-0 z-40 bg-[#121c2a]/40 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card w-full max-w-md rounded-2xl border border-outline-variant/30 shadow-[0_20px_50px_-12px_rgba(21,25,106,0.25)] overflow-hidden transform transition-all p-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
            <h3 className="text-lg font-bold text-foreground">User Profile Details</h3>
            <button 
              onClick={() => setuserDiv("hidden")}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-surface-container hover:text-foreground transition-all cursor-pointer"
            >
              <RxCross1 className="size-4" />
            </button>
          </div>

          {/* Body */}
          <div className="mt-5 space-y-4">
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Full Name</span>
              <p className="mt-1 font-medium text-foreground bg-surface-container-low/50 py-2.5 px-4 rounded-xl border border-outline-variant/20">
                {userDivData.name || "N/A"}
              </p>
            </div>
            
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email Address</span>
              <p className="mt-1 font-medium text-foreground bg-surface-container-low/50 py-2.5 px-4 rounded-xl border border-outline-variant/20 break-all">
                {userDivData.email || "N/A"}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Shipping/Billing Address</span>
              <div className="mt-1 font-medium text-foreground bg-surface-container-low/50 py-2.5 px-4 rounded-xl border border-outline-variant/20 min-h-[80px] whitespace-pre-wrap leading-relaxed">
                {userDivData.address || "No address provided yet."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
