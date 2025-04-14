"use client";

import { cn } from "@/lib/utils";
import { ProductOption, ProductVariant } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const VariantSelector = ({
  options,
  variants,
  setSelected,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
  setSelected: (variant: ProductVariant) => void;
}) => {
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string;
  }>({});
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSelect = (optionalName: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    setSelectedOptions((prev) => ({ ...prev, [optionalName]: value }));
    params.set(optionalName, value);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Setting the default from search params
  useEffect(() => {
    if (options && options.length > 0) {
      const newSelected: Record<string, string> = {};

      options.forEach((opt) => {
        const value = searchParams.get(opt.name);
        if (value) {
          newSelected[opt.name] = value;
        }
      });

      setSelectedOptions(newSelected);
    }
  }, [options, searchParams]);

  // Setting the selectedVarint with id

  useEffect(() => {
    if (Object.keys(selectedOptions).length === options.length) {
      const matchedVariant = variants.find((variant) => {
        const variantOptions = [
          variant.option1,
          variant.option2,
          variant.option3,
        ].filter(Boolean); // remove nulls

        return Object.entries(selectedOptions).every(([, selectedValue]) =>
          variantOptions.includes(selectedValue)
        );
      });

      if (matchedVariant) {
        setSelected(matchedVariant);
      }
    }
  }, [options, selectedOptions, setSelected, variants]);

  return (
    <div>
      {options.map((option) => (
        <fieldset key={option.name} className="mb-8">
          <legend className="mb-4 text-sm uppercase tracking-wide">
            {option.name}
          </legend>
          <div className="flex flex-wrap gap-3">
            {option.values.map((value) => (
              <button
                onClick={() => handleSelect(option.name, value)}
                key={value}
                name={option.name}
                value={value}
                className={cn(
                  "flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900 ring-1 ring-transparent transition duration-300 ease-in-out hover:ring-blue-600",
                  selectedOptions[option.name] === value && "ring-blue-600"
                )}
              >
                {value}
              </button>
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  );
};

export default VariantSelector;
