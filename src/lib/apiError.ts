import { NextResponse } from "next/server";

export function apiError(message: string, status: number = 400) {
  return NextResponse.json(
    { message },
    { status }
  );
}