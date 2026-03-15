"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await getSupabaseClient().auth.signOut();
    router.push("/");
    router.refresh();
  }

  const navItems = [
    { href: "/dashboard", label: "dashboard" },
    { href: "/settings", label: "settings" },
  ];

  return (
    <header className="border-b border-white/20 px-4 py-2 font-mono text-sm flex items-center gap-4">
      <span className="text-white/40 mr-2">─ cloud-vibe ─</span>
      <nav className="flex items-center gap-1">
        {navItems.map((item, i) => (
          <span key={item.href} className="flex items-center gap-1">
            {i > 0 && <span className="text-white/20">|</span>}
            <Link
              href={item.href}
              className={cn(
                "hover:text-white transition-colors",
                pathname.startsWith(item.href)
                  ? "text-white"
                  : "text-white/50"
              )}
            >
              {pathname.startsWith(item.href) ? `> ${item.label}` : item.label}
            </Link>
          </span>
        ))}
        <span className="text-white/20">|</span>
        <button
          onClick={handleLogout}
          className="text-white/50 hover:text-red-400 transition-colors"
        >
          logout
        </button>
      </nav>
    </header>
  );
}
