import { CarsPageClient } from "./CarsPageClient";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CarsPage() {
  const cars = await prisma.car.findMany({
    include: {
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <CarsPageClient cars={cars} />;
}
