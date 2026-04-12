"use client";

import { AiTwotoneDelete } from "react-icons/ai";
import { useState, useContext } from "react";
import { CartContext } from "@/context/cart-context";
import { PiSpinnerGapThin } from "react-icons/pi";

interface Props {
  userId: number;
  refresh: boolean;
  setRefresh: (value:boolean)=>void;
}

export default function ClearCart({ userId, refresh, setRefresh }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { refreshCart, setRefreshCart } = useContext(CartContext)!;

  const handleClear = async () => {
    setIsLoading(true);
    try {
      await fetch(`/api/cart/${userId}`, { method: "DELETE" });
      setRefresh(!refresh);
      setRefreshCart(!refreshCart);
    } catch (error) {
      console.error("Ошибка: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className="link text-accent absolute right-0 -top-18"
      onClick={handleClear}
      disabled={isLoading}
    >
      {isLoading && (
        <PiSpinnerGapThin className="text-center animate-spin" size={30} />
      )}
      {!isLoading && <AiTwotoneDelete size={30} />}
    </button>
  );
}
