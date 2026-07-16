import { prisma } from "@/lib/prisma";

export type CreateCarInput = {
  brand: string;
  model: string;
  year: number;
  priceAMD: number;
  fuel?: string | null;
  gearbox: string;
  body: string;
  color: string;
  engine?: string | null;
  horsePower?: number | null;
  quantity: number;
  description?: string | null;
  seats: number;
  images?: Array<{ url: string }>;
};

export async function createCar(data: CreateCarInput) {
  const { images, seats, ...carData } = data;

  return prisma.car.create({
    data: {
      ...carData,
      seats,
      ...(images && images.length > 0
        ? {
            images: {
              create: images.map((image) => ({ url: image.url })),
            },
          }
        : {}),
    },
  });
}
