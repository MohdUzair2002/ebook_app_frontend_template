"use client";

import { useEffect, useState } from "react";
import axios from "@/api/axios";
import Link from "next/link";
import { FaUserLarge, FaCheck } from "react-icons/fa6";
import { IoOpenOutline } from "react-icons/io5";
import { Loader2, AlertCircle } from "lucide-react";
import SeeUserData from "./SeeUserData";

export default function AllOrders() {
  const [OrderHistory, setOrderHistory] = useState<any[] | null>(null);
  const [userDiv, setuserDiv] = useState("hidden");
  const [userDivData, setuserDivData] = useState<any>(null);
  const [EditableDiv, setEditableDiv] = useState<number>(-1);
  const [Values, setValues] = useState({ status: "" });

  const getHeaders = () => ({
    id: localStorage.getItem("id") || "",
    authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  });

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/order/getAllOrders", {
        headers: getHeaders(),
      });
      setOrderHistory(res.data.data);
    } catch (error) {
      console.error("Error fetching all orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValues({ status: e.target.value });
  };

  const submitStatusChange = async (i: number) => {
    if (!OrderHistory) return;
    const order = OrderHistory[i];
    const orderId = order._id;
    const bookId = order.book._id;
    const userId = order.user._id;

    try {
      const response = await axios.put(
        `/order/updateStatus/${orderId}`,
        { status: Values.status, bookId, userId },
        { headers: getHeaders() }
      );
      alert(response.data.message);
      // Refresh order lists locally or via API fetch
      fetchOrders();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  if (!OrderHistory) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 gap-2">
        <Loader2 className="size-8 text-primary animate-spin" />
        <p className="text-sm font-semibold text-muted-foreground">Loading Orders...</p>
      </div>
    );
  }

  if (OrderHistory.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="size-16 text-muted-foreground mb-4" />
        <h3 className="text-2xl font-bold text-foreground">No Order History</h3>
        <p className="text-sm text-muted-foreground mt-2">
          There are currently no orders placed on the platform.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col h-full">
      <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6">
        All Orders History
      </h2>

      {/* Orders Table Container */}
      <div className="flex-1 overflow-x-auto border border-outline-variant/35 rounded-2xl bg-card shadow-sm">
        <table className="w-full min-w-[700px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-surface-container/60 border-b border-outline-variant/30 text-foreground font-semibold">
              <th className="py-4 px-4 text-center w-[60px]">Sr.</th>
              <th className="py-4 px-4 w-[200px]">Book Title</th>
              <th className="py-4 px-4 hidden md:table-cell">Description</th>
              <th className="py-4 px-4 w-[100px]">Price</th>
              <th className="py-4 px-4 w-[160px]">Status</th>
              <th className="py-4 px-4 text-center w-[80px]">User</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {OrderHistory.map((items, i) => (
              <tr 
                key={items._id || i}
                className="hover:bg-surface-container/20 transition-all duration-150 text-foreground/90 align-middle"
              >
                <td className="py-4 px-4 text-center font-medium text-muted-foreground">{i + 1}</td>
                <td className="py-4 px-4 font-semibold text-primary hover:underline">
                  <Link href={`/books/${items.book._id}`}>{items.book.title}</Link>
                </td>
                <td className="py-4 px-4 text-muted-foreground line-clamp-1 max-w-[280px] hidden md:table-cell pt-5">
                  {items.book.description ? items.book.description.slice(0, 70) : "No description"}...
                </td>
                <td className="py-4 px-4 font-semibold">${items.book.price}</td>
                <td className="py-4 px-4">
                  {EditableDiv !== i ? (
                    <button
                      onClick={() => {
                        setEditableDiv(i);
                        setValues({ status: items.status });
                      }}
                      className="cursor-pointer text-left block focus:outline-none"
                    >
                      {items.status === "Order placed" || items.status === "Pending" ? (
                        <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-semibold text-yellow-700 ring-1 ring-inset ring-yellow-600/20">
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
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <select
                        name="status"
                        value={Values.status}
                        onChange={handleStatusChange}
                        className="bg-surface-container-low border border-outline-variant/40 rounded-lg py-1 px-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      >
                        {["Pending", "Approved", "Canceled"].map((statusOption) => (
                          <option value={statusOption} key={statusOption}>
                            {statusOption}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          setEditableDiv(-1);
                          submitStatusChange(i);
                        }}
                        className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"
                        title="Save Changes"
                      >
                        <FaCheck className="size-3.5" />
                      </button>
                    </div>
                  )}
                </td>
                <td className="py-4 px-4 text-center">
                  <button
                    onClick={() => {
                      setuserDivData(items.user);
                      setuserDiv("fixed");
                    }}
                    className="p-2 rounded-xl text-primary hover:bg-primary hover:text-white transition-all cursor-pointer inline-flex items-center justify-center"
                    title="View Buyer Info"
                  >
                    <IoOpenOutline className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {userDivData && (
        <SeeUserData
          userDivData={userDivData}
          userDiv={userDiv}
          setuserDiv={setuserDiv}
        />
      )}
    </div>
  );
}
