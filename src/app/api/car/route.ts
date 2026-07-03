import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { apiError } from "@/lib/apiError";

export async function GET(){
    try{
        const cars = await prisma.car.findMany()
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
                year: body.year,
                priceAMD: body.priceAMD,
                fuel: body.fuel,
                transmission: body.transmission,
                body: body.body,
                color: body.color,
                engine: body.engine,
                horsePower: body.horsePower,
                quantity: body.quantity,
                description: body.description,
                seats: body.seats
            }
        })
        return NextResponse.json({message: "POST request received", data: car})
    }catch(error){
        console.error(error)
        return apiError("Something went wrong", 500)
    }
}