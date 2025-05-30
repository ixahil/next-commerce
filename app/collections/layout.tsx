import Collections from "@/components/layout/collection";
import FilterList from "@/components/layout/collection/filter";
import { sorting } from "@/lib/constants";
import React, { ReactNode, Suspense } from "react";

type Props = {
  children: ReactNode;
};

const CollectionLayout = (props: Props) => {
  return (
    <div className="mx-auto flex max-w-(--breakpoint-2xl) flex-col gap-8 px-4 pb-4 text-black md:flex-row dark:text-white">
      <div className="order-first w-full flex-none md:max-w-[125px]">
        <Collections />
      </div>
      <div className="order-last min-h-screen w-full md:order-none">
        <Suspense fallback={null}>{props.children}</Suspense>
      </div>
      <div className="order-none flex-none md:order-last md:w-[125px]">
        <FilterList list={sorting} title="Sort by" />
      </div>
    </div>
  );
};

export default CollectionLayout;
