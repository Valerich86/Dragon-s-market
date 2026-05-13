"use client";

import ReCAPTCHA from "react-google-recaptcha";

interface CaptchaProps {
  onChange: (value: string | null) => void;
}

export default function Captcha({ onChange }: CaptchaProps) {
  return (
    <div className="w-full mt-4 flex justify-center">
      <ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
        onChange={onChange}
        size="compact"
        theme="dark"
        badge="bottomleft"
        type="image"
      />
    </div>
  );
}
