"use client";

import { useState, useContext } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { font_bold } from "@/lib/fonts";
import { PiSpinnerGapThin } from "react-icons/pi";
import { CartContext } from "@/context/cart-context";
import Notification from "./notification";

interface Props {
  product_id: number;
  price: number;
  customer_id: number;
  startQuantity: number;
  remains: number;
  order_minimum: number;
  setRefresh?: (value: boolean) => void;
  refresh?: boolean;
  isInCart?: boolean;
}


export default function ToCartButton({
  product_id,
  customer_id,
  price,
  startQuantity,
  order_minimum,
  remains,
  setRefresh,
  refresh,
  isInCart = false,
}: Props) {
  const [quantity, setQuantity] = useState(startQuantity);
  const [isLoading, setIsLoading] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const { refreshCart, setRefreshCart } = useContext(CartContext)!;
  const router = useRouter();
  
  const buttonStyle =
    `bg-accent p-1 rounded-lg text-secondary 
    hover:shadow-[0px_0px_20px_-5px_#E23324] 
    transition duration-400 w-full cursor-pointer 
    outline-none active:scale-98 text-center`;
    
  const handleAddToCart = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();

    if (customer_id === 0 || !customer_id) {
      const timer = setTimeout(() => {
        setMessageVisible(false);
      }, 5000);
      setMessageVisible(true);
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
          k: order_minimum
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
      {quantity === 0 && !isLoading && isInCart && (
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
                handleUpdateQuantity(e, -order_minimum)
              }
            >
              <FaMinus size={15.5} />
            </button>
          </div>
          <div className="w-1/3 flex justify-center items-center bg-primary h-full text-secondary">
            <p className={font_bold.className}>{order_minimum !== 1 ? quantity.toFixed(1) : quantity}</p>
          </div>
          <div className="w-1/3">
            <button
              className={`${buttonStyle} flex justify-center`}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                handleUpdateQuantity(e, order_minimum)
              }
              disabled={remains<=quantity}
            >
              <FaPlus size={15.5} className={remains<=quantity ? "rotate-45 text-gray-600" : "rotate-0"}/>
            </button>
          </div>
        </div>
      )}
      <Notification
        text={
          "Вы пока не можете использовать корзину, сначала войдите в приложение"
        }
        mood="evil"
        show={messageVisible}
      />
    </>
  );
}
