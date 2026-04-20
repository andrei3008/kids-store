import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import prisma from "@/lib/prisma";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <>
      <Header categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
