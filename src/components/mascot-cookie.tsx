'use client';

import Cookies from 'js-cookie';

export default function MascotCookie ({newMascotPositionId}:{newMascotPositionId:number}) {
  const timer = Cookies.get("dragon_bazar_bonusTimer");
  if (timer) return;
  const value = newMascotPositionId.toString();
  Cookies.set("dragon_bazar_bonusTimer", "true", { expires: 0.5 });
  Cookies.set("dragon_bazar_newMascotPositionId", value, { expires: 7 });
  return null;
}