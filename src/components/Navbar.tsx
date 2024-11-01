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
    <nav className="flex flex-col gap-2 p-4">
      <Link href="/grid" className="flex items-center gap-2">
        <span className={getNavItemClass("/grid")}>apps</span>
      </Link>
      <Link href="/settings" className="flex items-center gap-2">
        <span className={getNavItemClass("/settings")}>view_list</span>
      </Link>
      <Link href="/users" className="flex items-center gap-2">
        <span className={getNavItemClass("/users")}>person</span>
      </Link>
    </nav>
  );
};
