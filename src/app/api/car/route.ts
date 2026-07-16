import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { apiError } from "@/lib/apiError";

export async function GET(){
    try{
        const cars = await prisma.car.findMany({
            include: {
                images: true,
            },
        })
        return NextResponse.json(cars)
    }catch(error){
        console.error(error)

        return apiError("Something went wrong", 500)
    }
}

export async function POST(req: Request){
    try{

        const body = await req.json()
        const car = await prisma.car.create({
            data: {
                brand: body.brand,
                model: body.model,
                year: Number(body.year),
                priceAMD: Number(body.priceAMD),
                fuel: body.fuel ?? null,
                gearbox: body.gearbox ?? body.transmission ?? "",
                body: body.body ?? "",
                color: body.color,
                engine: body.engine ?? null,
                horsePower: body.horsePower ? Number(body.horsePower) : null,
                quantity: Number(body.quantity),
                description: body.description ?? null,
                seats: Number(body.seats ?? 0),
            }
        })
        return NextResponse.json({message: "POST request received", data: car})
    }catch(error){
        console.error(error)
        return apiError("Something went wrong", 500)
    }
}
