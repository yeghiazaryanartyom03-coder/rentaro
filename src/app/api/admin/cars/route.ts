import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { apiError } from "@/lib/apiError";
import { isAdminRequest } from "@/lib/adminAuth";
import { createCar } from "@/lib/carService";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const UPLOAD_DIR = path.join(process.cwd(), "public", "cars");

function getFileExtension(fileName: string) {
  const extension = path.extname(fileName).toLowerCase();
  return extension || ".bin";
}

function buildSafeFileName(fileName: string) {
  const extension = getFileExtension(fileName);
  const baseName = path.basename(fileName, extension).replace(/[^a-zA-Z0-9_-]/g, "-");
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).slice(2, 8);
  return `${baseName || "image"}-${timestamp}-${randomSuffix}${extension}`;
}

export async function POST(request: Request) {
  try {
    if (!(await isAdminRequest())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const brand = formData.get("brand")?.toString() ?? "";
    const model = formData.get("model")?.toString() ?? "";
    const year = Number(formData.get("year"));
    const priceAMD = Number(formData.get("priceAMD"));
    const fuel = formData.get("fuel")?.toString() ?? null;
    const gearbox = formData.get("gearbox")?.toString() ?? "";
    const body = formData.get("body")?.toString() ?? "";
    const color = formData.get("color")?.toString() ?? "";
    const engine = formData.get("engine")?.toString() ?? null;
    const horsePower = formData.get("horsePower") ? Number(formData.get("horsePower")) : null;
    const quantity = Number(formData.get("quantity"));
    const description = formData.get("description")?.toString() ?? null;
    const seats = Number(formData.get("seats") ?? 0);
    const files = formData.getAll("images").filter((value): value is File => value instanceof File);

    if (!brand || !model || !color || !Number.isFinite(year) || !Number.isFinite(priceAMD) || !Number.isFinite(quantity)) {
      return apiError("Заполните обязательные поля автомобиля", 400);
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

    const uploadedImagePaths: Array<{ url: string }> = [];

    for (const file of files) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return apiError("Поддерживаются только изображения JPEG, PNG и WEBP", 400);
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        return apiError("Размер файла не должен превышать 5 МБ", 400);
      }

      const safeFileName = buildSafeFileName(file.name);
      const destinationPath = path.join(UPLOAD_DIR, safeFileName);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      await writeFile(destinationPath, buffer);
      uploadedImagePaths.push({ url: `/cars/${safeFileName}` });
    }

    const car = await createCar({
      brand,
      model,
      year,
      priceAMD,
      fuel,
      gearbox,
      body,
      color,
      engine,
      horsePower,
      quantity,
      description,
      seats,
      images: uploadedImagePaths,
    });

    return NextResponse.json(car);
  } catch (error) {
    console.error("Ошибка создания автомобиля:", error);
    return apiError("Не удалось создать автомобиль", 500);
  }
}
