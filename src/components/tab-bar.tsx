"use client";

import { usePathname } from "next/navigation";
import { HomeIcon as SolidHomeIcon, UserIcon as SolidUserIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import {
  HomeIcon as OutlineHomeIcon,
  UserIcon as OutlineUserIcon,
  MagnifyingGlassIcon as OutlineMagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import TabButton from "./tab-button";

export default function TabBar({ username }: { username: string }) {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 w-full mx-auto max-w-screen-sm grid grid-cols-3 px-5 py-3 border-t border-neutral-200 bg-stone-200 *:text-stone-700">
      <TabButton
        title="검색"
        pathname="/search"
        isActive={pathname === "/search"}
        defaultIcon={<OutlineMagnifyingGlassIcon className="size-7 text-stone-500" />}
        activeIcon={<MagnifyingGlassIcon className="size-7" />}
      />
      <TabButton
        title="홈"
        pathname="/"
        isActive={pathname === "/"}
        defaultIcon={<OutlineHomeIcon className="size-7 text-stone-500" />}
        activeIcon={<SolidHomeIcon className="size-7" />}
      />
      <TabButton
        title="나의 정보"
        pathname={`/users/${username}`}
        isActive={pathname.includes("users")}
        defaultIcon={<OutlineUserIcon className="size-7 text-stone-500" />}
        activeIcon={<SolidUserIcon className="size-7" />}
      />
    </div>
  );
}