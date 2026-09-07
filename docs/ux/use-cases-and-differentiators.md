# Use Cases & Strava Differentiators

Source: the 2026-09-07 sprint planning call (`docs/meetings/20260907_sprint_planning.md`),
which went deeper on several use cases than the original Strava teardown
(`docs/research/strava-teardown.md`) had space for. This doc exists to capture
those use-case narratives in one place and make explicit *where RCxDrive
deliberately diverges from Strava*, rather than leaving that only implicit in
the teardown's 1:1 feature translation. Cross-reference
[`docs/ux/user-personas.md`](user-personas.md) for who each use case serves.

Update this doc whenever a use case is discussed in enough detail to change how
a feature should be scoped, or a new Strava-vs-RCxDrive divergence is
identified. Log the update in `docs/CHANGELOG.md` per
[`docs/rules/changelog.md`](../rules/changelog.md).

## 1. "Segments" → Features & Lines

Strava's segment concept — a user-defined stretch of road/trail that becomes an
asynchronous leaderboard — translates to RC crawling as a **feature** (an
obstacle or terrain challenge at a location) and a **line** (a specific,
user-contributed way of tackling that feature). A user approaches a known
feature, crawls it, and the app matches their GPS trail to the feature to
produce a comparable score (see M6, issues #19–#20).

**Why this isn't a 1:1 copy:** Strava's segment matching only needs to snap a
GPS trail to a road. RCxDrive's feature matching also has to identify *which
line* through/over the feature was taken, since two lines on the same feature
can have very different difficulty — the matching engine and the score formula
both need to be line-aware, not just feature-aware. This is new context for
issue #19/#20 beyond what the original milestone breakdown assumed.

## 2. Telemetry + video "social policing"

Strava's leaderboards trust whatever the paired hardware reports — there's no
visual corroboration built into the core loop. The 2026-09-07 call concluded
that RCxDrive should pair **quantitative telemetry** (Racebox: speed,
incline/lean angle, motor temp, etc.) with **qualitative video/photo evidence**
attached to the same check-in, so the community can visually verify a claimed
crawler score rather than take the number on faith. The team is calling this
the **"social policing"** loop.

- This is the core differentiator from Strava's Gamification/Segment Loop: RC
  crawling scores are far easier to fake or misreport (bad GPS snap, a rig
  clipping a line, etc.) than a road-cycling KOM, so visual proof is load-
  bearing here in a way it isn't for Strava.
- The Phase I schema already has the right shape for this — a `checkin` tied
  to a `line`, with polymorphic `media` (photo/video) attachments (see
  `docs/plans/phase1-map-app-incorporation.md` §1–2) — but the *product*
  framing of check-in media as a verification mechanic, not just a decorative
  photo, is new from this call. See the new GitHub issue opened under Social
  Feed & Kudos (M7) for tracking this explicitly.
- Directly serves the **Comp Crawler** persona (trust in the score) and gives
  the **Community Leader** persona a built-in reason for followers to post
  video, not just claim a number.

## 3. Creator → subscriber replay loop ("YouTuber as funnel")

A concrete version of Strava's Discovery & Planning Loop, specific to RC
crawling's video-heavy community culture: a Community Leader posts a
line/video of them crawling a feature; a subscriber sees it, goes and attempts
the same feature/line with their own rig, and then compares their run
(telemetry + video) against the creator's. From the original notes: *"I'm
crawling a line I saw this YouTuber crawl last week. Wanted to see if my rig
could do it."*

- Strava's equivalent (a public segment on a popular route) is anonymous and
  aggregate — there's no single "creator" a follower is directly chasing.
  RCxDrive's version is parasocial and creator-specific, which is a stronger
  hook for the Community Leader persona's growth loop and a plausible
  affiliate/sponsorship surface (M10) distinct from generic brand challenges.
- Reinforces why check-in video (§2 above) matters beyond verification — it's
  also the content that drives this loop in the first place.

## 4. High-fidelity terrain mapping as a contribution/revenue channel

Strava's Global Heatmap is purely passive — it's an aggregate of users' GPS
trails, with no "supply side." The 2026-09-07 call discussed a distinct active
channel: Community Leaders or advanced users with drone/LiDAR/smartphone-
photogrammetry hardware surveying a venue or course and contributing a
high-fidelity 3D terrain map, which:

- Doubles as a promotional asset for the event/venue (Community Leader use
  case), and
- Is a candidate paid/monetizable data product in its own right (both for the
  surveyor and potentially as a paywalled consumption feature — see M9/M12 and
  `docs/DECISIONLOG.md` decisions #7–#8).

This is tracked under Milestone 12 (Terrain Mapping — Drone & Crowdsourced
Photogrammetry); this call reconfirmed the use case rather than changing its
scope. See the cross-cutting note in `docs/ux/user-personas.md`.

## 5. Vehicle metrics, not human biometrics

The single biggest reframe from Strava: Strava's competitive loop is about
**human physiological performance** (heart rate, power output, cadence) —
literally a measure of the athlete's body. RCxDrive's Crawler Score is about
**vehicle + driving performance** (speed, incline/lean angle, motor temp, line
precision) — a measure of the rig and how it's built/driven, not the driver's
body.

This changes what "improvement" means for the product:

- Strava's premium analytics upsell is built around training zones and
  physiological fatigue tracking. RCxDrive's equivalent upsell is around
  *mechanical* optimization — rig tuning, mod comparisons, per-build telemetry
  history — which is why the Garage (M3) and per-rig stats data model matters
  as much as the telemetry pipeline itself for the Comp Crawler persona.
- It also means RCxDrive doesn't need (and shouldn't build toward) any
  biometric data collection — telemetry is 100% vehicle-side.

## Summary: Strava vs. RCxDrive

| Dimension | Strava | RCxDrive |
|---|---|---|
| Competitive unit | Human athlete (segments/KOM) | Vehicle + line (feature/line + Crawler Score) |
| Core metric type | Physiological (HR, power, cadence) | Mechanical/vehicle (speed, incline/lean, motor temp) |
| Result verification | Device data only, trusted as-is | Telemetry **+** video/photo evidence ("social policing") |
| Map "supply side" | Passive aggregate heatmap only | Passive heatmap **+** active high-fidelity terrain surveys (drone/LiDAR) as a contribution/revenue channel |
| Creator/follower loop | Anonymous public segments | Creator-specific "replay the line I posted" loop, tied to video content |
