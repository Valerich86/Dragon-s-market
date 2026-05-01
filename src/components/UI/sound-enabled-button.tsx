'use client';

import { useState } from "react";
import useSound from "use-sound";
import CustomButton from "./custom-button";

export default function SoundEnableButton() {
  const [play] = useSound('/sound/notification.mp3');
  const [soundEnabled, setSoundEnabled] = useState(false);

  const enableSoundNotifications = () => {
    setSoundEnabled(true);
    // Тестовый звук для подтверждения активации
    play();
  };

  return (
    <div className="z-50 w-40 text-xs">
      {!soundEnabled && (
        <CustomButton text="Включить звук уведомлений" onClick={enableSoundNotifications}/>
      )}
    </div>
  );
}