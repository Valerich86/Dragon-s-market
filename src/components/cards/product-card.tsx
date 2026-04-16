"use client";

import { useRef, useState, useEffect } from "react";
import { useInView, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Cookies from "js-cookie";
import type { Category, Product } from "@/lib/types";
import ToCartButton from "../UI/to-cart-button";
import { font_bold } from "@/lib/fonts";
import MascotBonusAnimation from "../animation/mascot-bonus";
import { getRandomWeightedBonus } from "@/lib/random-bonus";
import { useCatalog } from "@/context/catalog-context";

interface Props {
  item: Product;
  cloudPath: string;
  index: number;
  userId: number;
}

export default function ProductCard({ item, cloudPath, index, userId }: Props) {
  const href = `/product/${item.id}?productName=${item.name}`;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const router = useRouter();
  const [src, setSrc] = useState(`${cloudPath}/products/${item.id}.png`);
  const [mascotHere, setMascotHere] = useState(false);
  const [showBonus, setShowBonus] = useState(false);
  const [swing, setSwing] = useState(true);
  const randomBonus = getRandomWeightedBonus();
  const { showMascot, mascotPositionId } = useCatalog();

  useEffect(() => {
    if (showMascot && mascotPositionId === item.id) {
      setMascotHere(true);
    }
  }, [showMascot, mascotPositionId]);

  const onMascotCaught = async () => {
    setMascotHere(false);
    setShowBonus(true);
    try {
      await fetch(`/api/change-bonus/${userId}?bonus=${randomBonus}`, {
        method: "PUT",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`w-[46%] lg:w-50 aspect-2/3 text-primary bg-secondary origin-top
         hover:bg-linear-to-r from-secondary to-gray-200 transition-colors 
         duration-500 cursor-pointer rounded-xl relative ${mascotHere && swing ? "animate-swing z-10" : ""}`}
      // onClick={() => router.push(href)}
    >
      <div
        className={`w-full h-full flex flex-col items-center rounded-xl  
          shadow-[0px_0px_30px_5px_rgba(59,130,246,0.12)] border border-gray-200 relative`}
      >
        <div className="h-1/2 w-full p-2">
          <Image
            src={src}
            alt=""
            width={200}
            height={200}
            loading="lazy"
            className="h-full w-full object-contain rounded-2xl animate-shining"
            onError={() => setSrc("/images/stickers/please_buy.webp")}
          />
        </div>
        <div className="h-1/2 w-full flex flex-col lg:gap-2 justify-between p-1 lg:p-2 border-t-2 border-gray-300 rounded-b-xl text-xs">
          <h3 className="text-primary line-clamp-3 lg:text-sm lg:min-h-15">
            {item.name}
          </h3>
          <p className="text-gray-600 hidden lg:block">
            {item.weight}
            {item.unit}
          </p>
          <div className="w-full flex flex-col lg:flex-row gap-1">
            <div className="flex justify-between items-baseline w-full">
              <p className="text-gray-600 lg:hidden">
                {item.weight}
                {item.unit}
              </p>
              <p
                className={`${font_bold.className} ${item.price.toString().length > 6 ? "tracking-tighter" : ""} text-lg`}
              >
                {item.price}₽
              </p>
            </div>
            {item.category_id !== 4 && (
              <ToCartButton
                product_id={item.id}
                category_id={item.category_id}
                startQuantity={item.quantity}
                customer_id={userId}
                price={item.price}
                isInCard
              />
            )}
          </div>
        </div>
      </div>

      {mascotHere && (
        <MascotBonusAnimation
          onComplete={onMascotCaught}
          index={index}
          stopSwing={() => setSwing(false)}
          // randomBonus={randomBonus}
        />
      )}

      {showBonus && (
        <motion.div
          initial={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          animate={{ opacity: 0, y: "-200%", x: "30%", scale: 4 }}
          transition={{ duration: 5 }}
          className={`
            ${font_bold} text-accent text-shadow-lg text-shadow-amber-50 
            text-6xl absolute left-1/2 -translate-y-[50%] top-0 w-full
          `}
        >
          +{randomBonus}
        </motion.div>
      )}
    </motion.div>
  );
}
