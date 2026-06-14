-- Visitor Globe API — D1 schema

-- Aggregate visit counts per country (total = SUM(n))
CREATE TABLE IF NOT EXISTS counts (
  country TEXT PRIMARY KEY,
  n       INTEGER NOT NULL DEFAULT 0
);

-- Daily de-duplication: one row per (day, hashed IP).
-- Stores only a salted hash, never the raw IP.
CREATE TABLE IF NOT EXISTS daily_visitors (
  day    TEXT NOT NULL,
  iphash TEXT NOT NULL,
  PRIMARY KEY (day, iphash)
);

-- Approximate visitor locations for the globe's glowing dots.
-- Coordinates are rounded to ~city level (1 decimal, ~11km) for privacy;
-- one row per location cell with a running count.
CREATE TABLE IF NOT EXISTS points (
  cell TEXT PRIMARY KEY,   -- "lat,lng" rounded
  lat  REAL NOT NULL,
  lng  REAL NOT NULL,
  city TEXT,
  n    INTEGER NOT NULL DEFAULT 0
);
