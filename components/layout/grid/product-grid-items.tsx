import { GridTileImage } from "@/components/collection/grid-tile-image";
import { ProductWithAll } from "@/types";
import Link from "next/link";
import Grid from ".";

export default function ProductGridItems({
  products,
}: {
  products: ProductWithAll[];
}) {
  return (
    <>
      {products.map((product) => (
        <Grid.Item key={product.slug} className="animate-fadeIn">
          <Link
            className="relative inline-block h-full w-full"
            href={`/product/${product.slug}`}
            prefetch={true}
          >
            <GridTileImage
              alt={product.title}
              label={{
                title: product.title,
                amount: product.basePrice,
                currencyCode: "USD",
              }}
              src={product.images[0].url}
              fill
              sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </Link>
        </Grid.Item>
      ))}
    </>
  );
}
