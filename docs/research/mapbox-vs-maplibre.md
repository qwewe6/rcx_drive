# Research: Mapbox vs. MapLibre — Cost & Capability Trade-off

Status: **Research / recommendation doc — resolves decision #2 in `docs/DECISIONLOG.md`.**

Author: Stephen, 2026-09-08. Written for [issue #45](https://github.com/qwewe6/rcx_drive/issues/45), assigned on the 2026-09-07 sprint planning call (`docs/meetings/20260907_sprint_planning.md`).

## 1. Why this doc exists

`docs/plans/initial-scaffolding.md` §6 framed this as "Mapbox (better tooling,
paid) vs. MapLibre (open-source, more setup)" and left it open pending research
on cost and capability. This doc does that research and gives a recommendation.

## 2. The "no API key" claim, unpacked

MapLibre GL JS is the rendering engine only — a fork of Mapbox GL JS from
before Mapbox's Dec 2020 license change. It's free, open-source, and genuinely
requires no key or per-user metering **as a renderer**, no matter how many
users the app has.

But a renderer doesn't ship with map data. It still needs a **tile source**
(the actual road/terrain/imagery data it draws), and that's where the real
cost comparison lives:

| Approach | Cost at scale | Trade-off |
|---|---|---|
| Hosted vector-tile provider (MapTiler, Stadia Maps) | MapTiler: free tier → $295/mo unlimited. Stadia Maps: free → $20 → $80 → $250/mo tiers; cheaper than MapTiler at moderate volume | Someone else's infra/ops; usage-tiered, not per-MAU |
| Self-hosted (Protomaps PMTiles served from Cloudflare R2, or your own tegola/Martin server off a Postgres+PostGIS extract) | "A few dollars, often zero" per month even at real volume — R2 has free egress | You own uptime, data updates, and the pipeline |
| Esri World Imagery (satellite) | **2,000,000 tile requests/month free** | Imagery/satellite only, not vector road styling |

So "MapLibre is free" is conditionally true: free if self-hosted or landed on
a provider's free/low tier, not free in an absolute sense. It's more accurate
to say **MapLibre decouples map cost from a per-user meter**, and lands
meaningfully cheaper than Mapbox at RCxDrive's likely scale.

## 3. Mapbox's actual numbers (verified against current pricing, Aug 2026)

- **Mobile Maps SDK**: billed per **Monthly Active User**, not per map load or
  per pan/zoom. 25,000 MAU/month free, then ~$4 per 1,000 MAU after, with
  volume discounts at higher tiers.
- **Web map loads**: 50,000/month free, then ~$5/1,000 stepping down toward
  ~$3/1,000 past 200K/month.
- **Geocoding**: ~$0.75 per 1,000 requests.
- **Satellite imagery**: global coverage to z16 (1–2m resolution), better
  regionally — billed against the same map-load/MAU meter as everything else,
  not a separate charge.

Napkin math: 50,000 MAU/month ≈ $100/mo. 100,000 MAU/month ≈ ~$300/mo. This is
a **per-MAU** meter, not a per-request one — a power user opening the map 50
times a day costs the same as one who opens it once, as long as both are
"active" that month. That matters for framing "when does this get expensive":
it tracks user-base growth, not usage intensity, and for a pre-revenue niche
hobby app it would take real, sustained growth to become a meaningful bill —
by which point the subscription tier (Milestone 9) is the intended way to
cover it.

## 4. What Mapbox is actually selling (the Uber/Airbnb question)

Not the renderer — MapLibre is that renderer. What the Mapbox price premium
buys:

- **Global satellite/aerial imagery with licensing already cleared.**
  Genuinely expensive and tedious to source/license yourself at global scale —
  the strongest reason a "just self-host everything" stance isn't free for
  imagery specifically (Esri's free tier, §2, is the practical workaround at
  our scale).
- **A maintained, consistent SDK** across web/iOS/Android/React Native, plus
  Mapbox Studio for style design — paying to not build/maintain that surface
  yourself.
- **Adjacent bundled products**: turn-by-turn Navigation SDK, tuned
  Search/geocoding autocomplete, real-time traffic, isochrones, Static Images
  API.
- **One vendor, one bill, one SLA** — the actual Uber/Airbnb-scale argument:
  their engineering time is worth more than the marginal dollar difference,
  and procurement/legal would rather sign one enterprise contract than own a
  tile-serving stack.

Critically, **Uber and Airbnb need turn-by-turn navigation and address-level
geocoding-as-you-type** — that's most of what they're paying for. RCxDrive
doesn't have that need: nobody needs driving directions to a crawling spot
they've already driven to. What we need is a good basemap (ideally
satellite/terrain, since crawling happens off-road) plus our own custom
heatmap/line/feature layers, which we build ourselves regardless of provider.

## 5. Recommendation

**Go with MapLibre GL JS**, for this stage, paired with:

- **Esri World Imagery** as the satellite/terrain basemap layer — the
  2M-tile-request free tier comfortably covers our expected scale for a long
  time, and off-road terrain visibility matters more here than street/road
  styling (unlike a typical Strava-style urban-running use case).
- A vector basemap for any remaining road/place-label context — start on a
  hosted provider's free tier (MapTiler or Stadia Maps) rather than
  self-hosting on day one; revisit self-hosting (Protomaps/PMTiles on R2) if
  that free tier gets tight before revenue does.

Reasoning:

- No navigation/turn-by-turn need — the single biggest thing Mapbox's price
  buys doesn't apply to this product.
- Off-road terrain visibility matters more than road styling for this
  audience, and Esri's imagery tier is a strong, essentially-free fit.
- Both engineers already have Postgres/PostGIS and Python fluency (decision
  #1/#6) — a self-hosted or Protomaps-based tile pipeline, if we ever need it,
  isn't a stretch skill-wise the way it would be for an all-JS team.
- Cost stays near-zero pre-revenue; switching to Mapbox later is a tile-source
  swap, not a rewrite, since MapLibre's API is Mapbox-GL-compatible by design.
- Honest trade-off: this shifts a small amount of real engineering time onto
  us for tile-pipeline choices/ops that Mapbox would otherwise absorb. Worth
  being clear that "free" here means "cheaper in dollars, costs some of our
  own time," not "free, full stop."

## 6. When to revisit

Worth re-opening this decision if/when:
- We want turn-by-turn navigation to a line/feature (not currently planned).
- We want Mapbox Studio-grade style design tooling and are willing to pay for
  the time saved.
- A hosted vector-tile provider's free/low tier stops covering us and
  self-hosting isn't worth the ops time at our team size.

## Sources

- [Mapbox pricing](https://www.mapbox.com/pricing)
- [Stadia Maps: Mapbox alternatives comparison](https://stadiamaps.com/switch-to-stadia/from-mapbox/)
- [Self-hosting OSM vector tiles with PMTiles](https://www.hititmedya.com/blog/self-host-openstreetmap-tiles-pmtiles)
- [Esri ArcGIS Location Platform basemaps](https://www.esri.com/en-us/arcgis/products/arcgis-location-platform/services/basemaps)
