import { CarouselCollection } from "@/components/collection/carousel-collection";
import { GridCollection } from "@/components/collection/grid-collection";
import { getProductsByCollection } from "@/lib/fetch";

export default async function Home() {
  const featuredCollectionGrid = await getProductsByCollection("tackle");
  const featuredCollectionCarousel = await getProductsByCollection("flags");

  return (
    <>
      <GridCollection collection={featuredCollectionGrid} />
      <CarouselCollection collection={featuredCollectionCarousel} />
    </>
  );
}
