'use client';

import { setCookie, getCookie } from "@/lib/cookies";

export default function MascotCookie ({newMascotPositionId}:{newMascotPositionId:number}) {
  const timer = getCookie("dragon_bazar_bonusTimer");
  if (timer) return;
  const value = newMascotPositionId.toString();
  setCookie("dragon_bazar_bonusTimer", "true", 12);
  setCookie("dragon_bazar_newMascotPositionId", value, 12);
  return null;
}