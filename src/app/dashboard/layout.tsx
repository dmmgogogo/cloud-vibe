import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NavBar } from "@/components/tui/nav-bar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <NavBar />
      <main className="flex-1 p-4 max-w-4xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
