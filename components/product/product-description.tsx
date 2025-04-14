"use client";
import { ProductWithAll } from "@/types";
import { ProductVariant } from "@prisma/client";
import { useState } from "react";
import { AddToCart } from "../cart/add-to-cart";
import Price from "../ui/price";
import Prose from "../ui/prose";
import VariantSelector from "./variant-selector";

export function ProductDescription({ product }: { product: ProductWithAll }) {
  const [selectedVariant, setselectedVariant] = useState<ProductVariant | null>(
    null
  );

  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
        <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
          <Price amount={product.basePrice} currencyCode={"USD"} />
        </div>
      </div>
      <VariantSelector
        options={product.options}
        variants={product.variants}
        setSelected={setselectedVariant}
      />
      {product.description ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/[60%]"
          html={product.description}
        />
      ) : null}

      <AddToCart variant={selectedVariant} product={product} />
    </>
  );
}
