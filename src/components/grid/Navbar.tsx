"use client";

import { useSession } from "@/hooks/useSession";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSignUpModal } from "@/hooks/useSignUpModal";
import Image from "next/image";

export const Navbar = () => {
  const pathname = usePathname();

  const getNavItemClass = (path: string) => {
    const baseClass =
      "material-symbols-outlined rounded-xl p-2 transition-colors hover:bg-black ";
    const isActive = pathname.startsWith(path);
    return `${baseClass} ${isActive ? "text-spotify" : "text-black hover:text-white"}`;
  };

  const { isAuthenticated } = useSession();
  const { showSignUpModalIfNeeded } = useSignUpModal();

  return (
    <nav className="flex h-full flex-col justify-between p-4">
      <div className="flex flex-col items-center gap-2">
        <Link href="/">
          <Image src="/32x32.png" alt="Mushare logo" width={32} height={32} />
        </Link>
        <span className="my-2 h-px w-full bg-background" />
        <Link href="/grid" className="flex items-center gap-2">
          <span className={getNavItemClass("/grid")}>apps</span>
        </Link>
        <Link href="/chart" className="flex items-center gap-2">
          <span className={getNavItemClass("/chart")}>view_list</span>
        </Link>
        <Link href="/trending" className="flex items-center gap-2">
          <span className={getNavItemClass("/trending")}>trending_up</span>
        </Link>
        {isAuthenticated && (
          <Link href="/profile" className="flex items-center gap-2">
            <span className={getNavItemClass("/profile")}>person</span>
          </Link>
        )}
      </div>
      {isAuthenticated ? (
        <Link href="/api/auth/signout" className="flex items-center gap-2">
          <span className="material-symbols-outlined rounded-xl p-2 text-black transition-colors hover:bg-black hover:text-white">
            logout
          </span>
        </Link>
      ) : (
        <button
          onClick={() => showSignUpModalIfNeeded()}
          className="flex items-center gap-2"
        >
          <span className="material-symbols-outlined rounded-xl p-2 text-black transition-colors hover:bg-black hover:text-white">
            login
          </span>
        </button>
      )}
    </nav>
  );
};
