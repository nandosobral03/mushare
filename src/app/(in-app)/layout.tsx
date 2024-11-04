import { Navbar } from "@/components/grid/Navbar";

export default function InAppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <section className="flex h-screen w-screen bg-white">
      <Navbar />
      <main className="grow overflow-auto rounded-bl-[2.25rem] rounded-tl-[2.25rem] bg-black p-4 shadow-lg">
        {children}
      </main>
    </section>
  );
}
