import { Collection } from "@prisma/client";
import Link from "next/link";

type Props = {
  menu: Collection[];
};

export default function DesktopMenu({ menu }: Props) {
  return (
    <ul className="hidden md:flex md:items-center gap-6 text-md">
      {menu.map((item: Collection) => (
        <li key={item.name}>
          <Link
            href={`/collections/${item.slug}`}
            prefetch
            className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
          >
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
