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
        
        if(new Date(startDate) >= new Date(endDate)) {
            return apiError("Start date must be before end date", 400);
        }

        const today = new Date();
        if(new Date(startDate)< today || new Date(endDate)<today) {
            return apiError("Booking dates cannot be in the past", 400);
        }

        const conflictingBookings = await prisma.booking.findMany({
            where: {
                carId: carId,
                OR: [
                    {
                        startDate: {
                            lte: new Date(endDate),
                        },
                        endDate: {
                            gte: new Date(startDate),
                        },
                    },
                ],
            },
        });

        if (conflictingBookings.length > 0) {
            return apiError("The selected dates are already booked", 400);
        }

        const booking = await prisma.booking.create({
            data: {
                carId,
                firstName,
                lastName,
                phone,
                email,
                startDate: new Date(body.startDate),
                endDate: new Date(body.endDate),
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