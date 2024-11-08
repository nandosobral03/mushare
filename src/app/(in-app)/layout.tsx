import { Navbar } from "@/components/grid/Navbar";
import { SignUpModal } from "@/components/modals/SignUpModal";

export default function InAppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <section className="flex h-screen w-screen bg-gray-50">
      <Navbar />
      <main className="grow overflow-auto rounded-bl-[2.25rem] rounded-tl-[2.25rem] bg-black p-4 shadow-lg">
        {children}
      </main>
      <SignUpModal />
    </section>
  );
}
