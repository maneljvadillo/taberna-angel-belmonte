import { Galeria } from "@/components/sections/galeria";
import { Hero } from "@/components/sections/hero";
import { LaCarta } from "@/components/sections/la-carta";
import { LaCasa } from "@/components/sections/la-casa";
import { Visitanos } from "@/components/sections/visitanos";

export default function Home() {
  return (
    <>
      <Hero />
      <LaCasa />
      <LaCarta />
      <Galeria />
      <Visitanos />
    </>
  );
}
