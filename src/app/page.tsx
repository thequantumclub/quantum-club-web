import Hero from "@/components/sections/Hero";
import FeaturedEvent from "@/components/sections/FeaturedEvent";
import PastEvents from "@/components/sections/PastEvents";
import StrangersUnplugged from "@/components/sections/StrangersUnplugged";
import Gallery from "@/components/sections/Gallery";
import About from "@/components/sections/About";
import Partnerships from "@/components/sections/Partnerships";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedEvent />
      <StrangersUnplugged />
      <PastEvents />
      <About />
      <Gallery />
      <Partnerships />
    </>
  );
}
