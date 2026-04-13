import Script from "next/script";
import HomePage from "./site-shell";

export default function Page() {
  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
        strategy="afterInteractive"
      />
      <HomePage />
    </>
  );
}
