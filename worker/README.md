# Visitor Globe API (Cloudflare Worker + D1)

Backend for the homepage visitor globe. Records one **unique visitor per
30-minute slot** and returns aggregate stats as JSON:

```json
{ "total": 1284,
  "countries": { "CN": 620, "US": 240, "GB": 110 },
  "points": [ { "lat": 39.9, "lng": 116.4, "city": "Beijing", "n": 12 } ] }
```

Behavior:
- De-dup key is a salted SHA-256 hash of `(IP + 30-min slot)`. No raw IPs.
- City-level coordinates (rounded to ~11km) drive the glowing dots.
- Hong Kong / Macao / Taiwan are counted under China (`CN`); the dot still
  sits at the visitor's real location.
- Owner opt-out: a request with `?norecord=1` is read-only (not counted).

## Cheatsheet (运维速查)

Owner opt-out — open once per browser/device (stops counting your own visits):

```
https://childtang.github.io/?vgowner=1     # exempt this browser
https://childtang.github.io/?vgowner=0     # undo (count again)
```

Useful D1 queries (run from this `worker/` folder):

```bash
# Visitor distribution by country
npx wrangler d1 execute visitor_globe --remote --command "SELECT country,n FROM counts ORDER BY n DESC;"
# Visitor distribution by city
npx wrangler d1 execute visitor_globe --remote --command "SELECT city,n FROM points ORDER BY n DESC;"
# Reset ALL stats (clears counts, dedup and points)
npx wrangler d1 execute visitor_globe --remote --command "DELETE FROM counts; DELETE FROM daily_visitors; DELETE FROM points;"
```

The same-origin snapshot `assets/data/visitor-stats.json` is refreshed hourly
by `.github/workflows/update-visitor-stats.yml` (used as a fallback when the
Worker is unreachable, e.g. on some mainland-China networks).

## One-time deploy

Requires a free Cloudflare account.

```bash
cd worker

# 1. Install + log in
npm install -g wrangler
wrangler login

# 2. Create the D1 database, then paste the printed database_id into wrangler.toml
wrangler d1 create visitor_globe

# 3. Create the tables (run once, on the remote DB)
wrangler d1 execute visitor_globe --remote --file=schema.sql

# 4. Deploy the Worker
wrangler deploy
```

`wrangler deploy` prints the public URL, e.g.:

```
https://visitor-globe-api.<your-subdomain>.workers.dev
```

## Hook it up to the site

Edit `_includes/visitor-globe.html` and set the endpoint to that URL:

```html
<script>
  window.VISITOR_GLOBE_CONFIG = {
    endpoint: "https://visitor-globe-api.<your-subdomain>.workers.dev"
  };
</script>
```

The globe then shows real visitors instead of demo data.

## Notes
- Free tier (100k req/day) is far beyond a personal site's needs.
- Country comes from Cloudflare's `request.cf.country` (accurate at country
  level; VPN/proxy users are attributed to the proxy's country).
- `SALT` in `index.js` can be any random string; changing it just resets
  the per-day de-dup window.
- To lock the API to your site only, set `ALLOW_ORIGIN` in `index.js` to
  `https://childtang.github.io`.
- Optional cleanup of old de-dup rows (keeps DB tiny):
  `wrangler d1 execute visitor_globe --remote --command "DELETE FROM daily_visitors WHERE day < date('now','-30 day')"`
