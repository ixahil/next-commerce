import { ProductByCollection, ProductWithAll } from "@/types";
import Link from "next/link";
import { GridTileImage } from "./grid-tile-image";

type Props = {
  collection: ProductByCollection | null;
};

export const GridCollection = ({ collection }: Props) => {
  if (
    !collection?.products[0] ||
    !collection?.products[1] ||
    !collection?.products[2]
  )
    return null;

  const [firstProduct, secondProduct, thirdProduct] = collection.products;

  return (
    <section className="mx-auto grid max-w-(--breakpoint-2xl) gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2 lg:max-h-[calc(100vh-200px)]">
      <GridItem size="full" item={firstProduct} priority={true} />
      <GridItem size="half" item={secondProduct} priority={true} />
      <GridItem size="half" item={thirdProduct} />
    </section>
  );
};

function GridItem({
  item,
  size,
  priority,
}: {
  item: ProductWithAll;
  size: "full" | "half";
  priority?: boolean;
}) {
  return (
    <div
      className={
        size === "full"
          ? "md:col-span-4 md:row-span-2"
          : "md:col-span-2 md:row-span-1"
      }
    >
      <Link
        className="relative block aspect-square h-full w-full"
        href={`/product/${item.slug}`}
        prefetch={true}
      >
        <GridTileImage
          src={item.images[0].url}
          fill
          sizes={
            size === "full"
              ? "(min-width: 768px) 66vw, 100vw"
              : "(min-width: 768px) 33vw, 100vw"
          }
          priority={priority}
          alt={item.title}
          label={{
            position: size === "full" ? "center" : "bottom",
            title: item.title as string,
            amount: item.variants[0].price,
            currencyCode: "USD",
          }}
        />
      </Link>
    </div>
  );
}
