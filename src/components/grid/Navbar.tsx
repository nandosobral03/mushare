"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const pathname = usePathname();

  const getNavItemClass = (path: string) => {
    const baseClass =
      "material-symbols-outlined rounded-xl p-2 transition-colors hover:bg-black ";
    const isActive = pathname === path;
    return `${baseClass} ${isActive ? "text-spotify" : "text-black hover:text-white"}`;
  };

  return (
    <nav className="flex h-full flex-col justify-between p-4">
      <div className="flex flex-col gap-2">
        <Link href="/grid" className="flex items-center gap-2">
          <span className={getNavItemClass("/grid")}>apps</span>
        </Link>
        <Link href="/chart" className="flex items-center gap-2">
          <span className={getNavItemClass("/chart")}>view_list</span>
        </Link>
        <Link href="/trending" className="flex items-center gap-2">
          <span className={getNavItemClass("/trending")}>trending_up</span>
        </Link>
        <Link href="/profile" className="flex items-center gap-2">
          <span className={getNavItemClass("/profile")}>person</span>
        </Link>
      </div>
      <Link href="/api/auth/signout" className="flex items-center gap-2">
        <span className="material-symbols-outlined rounded-xl p-2 text-black transition-colors hover:bg-black hover:text-white">
          logout
        </span>
      </Link>
    </nav>
  );
};
