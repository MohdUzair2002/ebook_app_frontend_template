"use client";

import { useEffect, useState } from "react";
import axios from "@/api/axios";
import Link from "next/link";
import { Loader2, AlertCircle } from "lucide-react";

export default function OrderHistory() {
  const [OrderHistoryData, setOrderHistoryData] = useState<any[] | null>(null);

  const getHeaders = () => ({
    id: localStorage.getItem("id") || "",
    authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("/order/getOrderHistory", {
          headers: getHeaders(),
        });
        setOrderHistoryData(res.data.data);
      } catch (error) {
        console.error("Error fetching order history:", error);
      }
    };
    fetchHistory();
  }, []);

  if (!OrderHistoryData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 gap-2">
        <Loader2 className="size-8 text-primary animate-spin" />
        <p className="text-sm font-semibold text-muted-foreground">Loading Order History...</p>
      </div>
    );
  }

  if (OrderHistoryData.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="size-16 text-muted-foreground mb-4" />
        <h3 className="text-2xl font-bold text-foreground">No Purchase History</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm">
          You haven't ordered any books yet. Start exploring our catalogue to make your first purchase!
        </p>
        <Link href="/books" className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-container transition">
          Browse Books
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col h-full">
      <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6">
        Your Order History
      </h2>

      {/* Orders Table Container */}
      <div className="flex-1 overflow-x-auto border border-outline-variant/35 rounded-2xl bg-card shadow-sm">
        <table className="w-full min-w-[600px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-surface-container/60 border-b border-outline-variant/30 text-foreground font-semibold">
              <th className="py-4 px-4 text-center w-[60px]">Sr.</th>
              <th className="py-4 px-4 w-[220px]">Book Title</th>
              <th className="py-4 px-4 hidden sm:table-cell">Description</th>
              <th className="py-4 px-4 w-[110px]">Price</th>
              <th className="py-4 px-4 w-[150px]">Status</th>
              <th className="py-4 px-4 text-center w-[80px]">Mode</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {OrderHistoryData.map((items, i) => (
              <tr 
                key={items._id || i}
                className="hover:bg-surface-container/20 transition-all duration-150 text-foreground/90 align-middle"
              >
                <td className="py-4 px-4 text-center font-medium text-muted-foreground">{i + 1}</td>
                <td className="py-4 px-4 font-semibold text-primary hover:underline">
                  {items.book ? (
                    <Link href={`/books/${items.book._id}`}>{items.book.title}</Link>
                  ) : (
                    <span className="text-muted-foreground font-normal">Deleted Book</span>
                  )}
                </td>
                <td className="py-4 px-4 text-muted-foreground line-clamp-1 max-w-[280px] hidden sm:table-cell pt-5">
                  {items.book && items.book.description ? items.book.description.slice(0, 60) : "N/A"}...
                </td>
                <td className="py-4 px-4 font-semibold">
                  {items.book ? `$${items.book.price}` : "N/A"}
                </td>
                <td className="py-4 px-4">
                  {items.status === "Order placed" || items.status === "Pending" ? (
                    <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-semibold text-yellow-700 ring-1 ring-inset ring-yellow-600/20 animate-pulse">
                      {items.status}
                    </span>
                  ) : items.status === "Canceled" ? (
                    <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-600/20">
                      {items.status}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
                      {items.status}
                    </span>
                  )}
                </td>
                <td className="py-4 px-4 text-center font-medium text-muted-foreground">
                  COD
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
