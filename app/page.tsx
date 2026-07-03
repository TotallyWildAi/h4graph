import Comparison from "@/components/Comparison";
import Developers from "@/components/Developers";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Layers from "@/components/Layers";
import Nav from "@/components/Nav";
import Pricing from "@/components/Pricing";
import Trust from "@/components/Trust";
import Steps from "@/components/Steps";

export default function Home() {
  return (
    <>
      {/* backdrop */}
      <div
        className="pointer-events-none fixed -left-36 -top-52 z-0 h-[640px] w-[640px] rounded-full bg-indigo opacity-[0.16] blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed -right-44 top-56 z-0 h-[520px] w-[520px] rounded-full bg-cyan opacity-10 blur-[120px]"
        aria-hidden
      />
      <div className="grid-bg pointer-events-none fixed inset-0 z-0" aria-hidden />

      <div className="relative z-[2]">
        <Nav />
        <main>
          <Hero />
          <Layers />
          <Comparison />
          <Steps />
          <Developers />
          <Pricing />
          <Trust />
          <FinalCta />
        </main>
        <Footer />
      </div>
    </>
  );
}
