-- Minimal, safe migration: add OfferType + Property.offer

BEGIN;

-- 1) Create the OfferType enum if it doesn't exist
DO $$
BEGIN
  CREATE TYPE "OfferType" AS ENUM ('SALE', 'RENT');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2) Add offer column to Property (default SALE)
ALTER TABLE "Property"
  ADD COLUMN IF NOT EXISTS "offer" "OfferType" NOT NULL DEFAULT 'SALE';

COMMIT;
