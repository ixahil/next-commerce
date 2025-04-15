import { CarouselCollection } from "@/components/collection/carousel-collection";
import { GridCollection } from "@/components/collection/grid-collection";
import { getProductsByCollection } from "@/lib/fetch";

export default async function Home() {
  const featuredCollectionGrid = await getProductsByCollection("compounds-sealants");
  const featuredCollectionCarousel = await getProductsByCollection("fishing");

  return (
    <>
      <GridCollection collection={featuredCollectionGrid} />
      <CarouselCollection collection={featuredCollectionCarousel} />
    </>
  );
}
