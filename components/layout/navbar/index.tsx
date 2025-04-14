import CartModal from "@/components/cart";
import LogoSquare from "@/components/ui/logo-square";
import { SearchBar, SearchSkeleton } from "@/components/ui/search";
import { SITECONFIG } from "@/config/site-config";
import { getMenu } from "@/lib/fetch";
import Link from "next/link";
import { Suspense } from "react";
import DesktopMenu from "./desktop-menu";
import MobileMenu from "./mobile-menu";

export default async function Navbar() {
  const menu = await getMenu();
  return (
    <nav className="p-4 lg:px-6 space-y-8">
      <div className="relative flex items-center justify-between ">
        <div className="block md:hidden flex-none">
          <Suspense fallback={null}>
            <MobileMenu menu={menu} />
          </Suspense>
        </div>

        <div className="flex w-full items-center">
          <div className="flex w-full md:w-1/3">
            <Link
              href={"/"}
              className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
              prefetch
            >
              <LogoSquare />
              <div className="ml-2 flex-none text-sm font-medium uppercase md:hidden lg:block">
                {SITECONFIG.siteName}
              </div>
            </Link>
          </div>
          <div className="hidden justify-center md:flex md:w-1/3">
            <Suspense fallback={<SearchSkeleton />}>
              <SearchBar />
            </Suspense>
          </div>

          <div className="flex justify-end md:w-1/3">
            <CartModal />
          </div>
        </div>
      </div>
      <div className="hidden md:flex items-center justify-center">
        {menu.length ? <DesktopMenu menu={menu} /> : null}
      </div>
    </nav>
  );
}
