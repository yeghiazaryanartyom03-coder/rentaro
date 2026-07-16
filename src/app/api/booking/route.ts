import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { apiError } from "@/lib/apiError";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { carId, firstName, lastName, phone, email, startDate, endDate, pickupLocation, returnLocation } = body;

        if (!carId || !firstName || !lastName || !phone || !email || !startDate || !endDate) {
            return apiError("Missing required fields", 400);
        }

        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);

        if (!Number.isFinite(parsedStartDate.getTime()) || !Number.isFinite(parsedEndDate.getTime())) {
            return apiError("Invalid booking dates", 400);
        }

        if(parsedStartDate >= parsedEndDate) {
            return apiError("Start date must be before end date", 400);
        }

        const today = new Date();
        if(parsedStartDate < today || parsedEndDate < today) {
            return apiError("Booking dates cannot be in the past", 400);
        }

        const car = await prisma.car.findUnique({
            where: { id: carId },
            select: { quantity: true },
        });

        if (!car) {
            return apiError("Car not found", 404);
        }

        if (car.quantity <= 0) {
            return apiError("Car is not available", 400);
        }

        const conflictingBookingsCount = await prisma.booking.count({
            where: {
                carId,
                status: {
                    not: "cancelled",
                },
                startDate: {
                    lt: parsedEndDate,
                },
                endDate: {
                    gt: parsedStartDate,
                },
            },
        });

        if (conflictingBookingsCount >= car.quantity) {
            return apiError("The selected dates are already booked", 400);
        }

        const booking = await prisma.booking.create({
            data: {
                carId,
                firstName,
                lastName,
                phone,
                email,
                startDate: parsedStartDate,
                endDate: parsedEndDate,
                pickupLocation,
                returnLocation,
                status: "pending",
            },
        });
        return NextResponse.json({ message: "POST request received", data: booking });
    } catch (error) {
        console.error(error);
        return apiError("Something went wrong", 500);
    }
}
