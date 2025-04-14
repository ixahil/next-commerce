import { ProductByCollection } from "@/types";
import Link from "next/link";
import { GridTileImage } from "./grid-tile-image";

export async function CarouselCollection({
  collection,
}: {
  collection: ProductByCollection | null;
}) {
  // Collections that start with `hidden-*` are hidden from the search page.

  if (!collection?.products?.length) return null;

  // Purposefully duplicating products to make the carousel loop and not run out of products on wide screens.
  //   const carouselProducts = [...products, ...products, ...products];

  const carouselProducts = collection.products;

  return (
    <div className="w-full overflow-x-auto pb-6 pt-1">
      <ul className="flex animate-carousel gap-4">
        {carouselProducts.map((product, i) => (
          <li
            key={`${product.slug}${i}`}
            className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3"
          >
            <Link
              href={`/product/${product.slug}`}
              className="relative h-full w-full"
            >
              <GridTileImage
                alt={product.title}
                label={{
                  title: product.title,
                  amount: product.variants[0].price,
                  currencyCode: "USD",
                }}
                src={product.images[0].url}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
