"use client";

import { useEffect, useState, useContext } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { font_bold } from "@/lib/fonts";
import { PiSpinnerGapThin } from "react-icons/pi";
import { CartContext } from "@/context/cart-context";
import Link from "next/link";
import Smiler from "./smiler";

interface Props {
  product_id: number;
  price: number;
  customer_id: number;
  startQuantity: number;
  setRefresh?: (value: boolean) => void;
  refresh?: boolean;
  isInCard?: boolean;
}

const buttonStyle =
  "bg-accent p-1 rounded-lg text-secondary hover:shadow-[0px_0px_20px_-5px_#E23324] transition duration-400 w-full cursor-pointer outline-none active:scale-98 text-center";

export default function ToCartButton({
  product_id,
  customer_id,
  price,
  startQuantity,
  setRefresh,
  refresh,
  isInCard = false,
}: Props) {
  const [quantity, setQuantity] = useState(startQuantity);
  const [isLoading, setIsLoading] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const { refreshCart, setRefreshCart } = useContext(CartContext)!;

  const handleAddToCart = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    if (customer_id === 0 || !customer_id) {
      setMessageVisible(true);
      const timer = setTimeout(() => {
        setMessageVisible(false);
      }, 5000);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customer_id,
          product_id: product_id,
          price: price,
        }),
      });
      const { quantity } = await response.json();
      setQuantity(quantity);
      setRefreshCart(!refreshCart);
      if (setRefresh) setRefresh(!refresh);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (
    event: React.MouseEvent<HTMLButtonElement>,
    k: number,
  ) => {
    event.stopPropagation();
    setIsLoading(true);
    try {
      const response = await fetch(`/api/cart`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customer_id,
          product_id: product_id,
          price: price,
          k: k,
        }),
      });
      const { quantity } = await response.json();
      setQuantity(quantity);
      setRefreshCart(!refreshCart);
      if (setRefresh) setRefresh(!refresh);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="w-full flex items-center justify-center text-accent">
          <PiSpinnerGapThin className="text-center animate-spin" size={23.5} />
        </div>
      )}
      {quantity === 0 && !isLoading && isInCard && (
        <button onClick={handleAddToCart} className={buttonStyle}>
          В корзину
        </button>
      )}
      {quantity > 0 && !isLoading && (
        <div
          className={`flex justify-between hover:shadow-[0px_0px_20px_-5px_#E23324] items-center
           w-full bg-accent border border-accent rounded-lg text-secondary`}
        >
          <div className="w-1/3">
            <button
              className={`${buttonStyle} flex justify-center`}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                handleUpdateQuantity(e, -1)
              }
            >
              <FaMinus size={15.5} />
            </button>
          </div>
          <div className="w-1/3 flex justify-center items-center bg-primary h-full text-secondary">
            <p className={font_bold.className}>{quantity}</p>
          </div>
          <div className="w-1/3">
            <button
              className={`${buttonStyle} flex justify-center`}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                handleUpdateQuantity(e, 1)
              }
            >
              <FaPlus size={15.5} />
            </button>
          </div>
        </div>
      )}
      {messageVisible && (
        <div className="w-screen h-screen flex animate-message justify-center items-center fixed inset-0 text-2xl text-primary z-10">
          <div className="w-4/5 flex items-center justify-center">
            <div className="bg-secondary rounded-md p-2">
              <p>Вы пока не можете использовать корзину, </p>
              <p>сначала авторизуйтесь</p>
            </div>
            <Smiler />
          </div>
        </div>
      )}
    </>
  );
}
