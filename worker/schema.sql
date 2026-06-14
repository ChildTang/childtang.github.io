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
