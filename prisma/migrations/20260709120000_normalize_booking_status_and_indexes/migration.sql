-- Normalize booking status defaults with the lowercase values used by the app.
ALTER TABLE "Booking" ALTER COLUMN "status" SET DEFAULT 'pending';

UPDATE "Booking"
SET "status" = 'pending'
WHERE "status" = 'Pending';

CREATE INDEX "Booking_carId_status_startDate_endDate_idx"
ON "Booking"("carId", "status", "startDate", "endDate");
