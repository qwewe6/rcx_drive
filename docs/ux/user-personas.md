# User Personas

Source: the three user tiers identified in the Strava teardown/translation
(`docs/research/strava-teardown.md`). This doc exists to keep feature prioritization
tied back to *who* actually needs a given feature, rather than building in milestone
order by default. When scoping a new issue, check which persona(s) it serves and
whether it's addressing a gap below.

Update this table whenever a new persona is identified, a persona's needs shift, or
a feature milestone materially changes what it delivers. Log the update in
`docs/CHANGELOG.md` per [`docs/rules/changelog.md`](../rules/changelog.md).

| Persona | Who they are | Core needs / motivations | Features that meet the need (milestone) | Gaps / open questions |
|---|---|---|---|---|
| **Casual RC Hobbyist** | Has a job/family, limited free time, more than one rig, hobbies "when he can." Consumes RC content on social media. Wants low-friction fun, not competition. | Easy logging of a session without much setup; a simple record of "what I did with which rig"; social/inspiration content; doesn't want to feel gatekept by power users. | Session logging (M4 Racebox/Telemetry), Garage rig list + per-rig stats (M3), Feed/Kudos (M7), discovering nearby lines via heatmap (M5). | Racebox pairing (M4) assumes hardware ownership — is there a no-hardware/phone-GPS-only logging path for this persona, or is telemetry hardware a hard requirement to use the app at all? Worth an explicit decision (see `DECISIONLOG.md`). |
| **Comp Crawler** | Long-time dedicated enthusiast, heavy monetary investment in rigs, deep upgrade/technique knowledge, motivated by outperforming peers, wants telemetry-driven mechanical optimization. | Precise telemetry (speed, incline/lean angle, motor temp), Crawler Score and leaderboards per feature/line, ability to see how their rig/build stacks up, route/line discovery for new challenges to attempt. | Live telemetry capture + Racebox pairing (M4), Feature/Segment Matching & Crawler Score (M6), Leaderboards + beat-your-score notifications (M8), Route/line creation & discovery (M5), per-rig stats & mods history (M3). | Crawler Score formula (issue #20) is unscoped — this persona's trust in the app hinges on that formula being seen as fair/meaningful. Advanced telemetry analytics are also the primary subscription paywall candidate (M9) — this persona is the target buyer; gating too aggressively could push them away, gating too little kills the funnel. |
| **Community Leader** | Established in the RC community (online and/or in-person), has a following, hosts events, drives upgrade/new-rig market movement, often has sponsorships. | Tools to host/organize challenges and events, showcase authority (reviews, sponsorships), drive followers to specific lines/routes ("crawl the line I posted"), affiliate/monetization hooks tied to their influence. | Sponsored challenge system (M10), affiliate links for parts/mods (M3 hook + M10 general system), route/line creation for others to follow (M5), social feed visibility (M7). | No explicit "creator/organizer" role or profile distinction yet in the Accounts & Auth data model (M2) — worth deciding whether Community Leaders need a distinct account type/verification badge, or whether this is purely emergent from follower counts. |

## Cross-cutting note: the drone/photogrammetry terrain-mapping idea (new, 2026-09-06)

The proposed drone-photogrammetry → 3D terrain-map course-builder feature (see
`docs/research/python-backend-react-native-stack.md` and GitHub Milestone
"Terrain Mapping — Drone & Crowdsourced Photogrammetry") mainly serves the **Comp
Crawler** and **Community Leader** personas:

- **Community Leaders / event hosts** are the most likely to justify a drone
  survey of a large course/venue and want an authoritative 3D map to promote an
  event or route.
- **Comp Crawlers** are the most likely candidates for the smartphone-LiDAR /
  personal-photogrammetry version over smaller areas, and the most likely to pay
  for it (proposed as a paywalled power-user feature under M9).
- The **Casual Hobbyist** mostly consumes the resulting 3D maps (view-only) rather
  than creating them — worth confirming that consumption path isn't accidentally
  gated behind the same paywall as creation.

This is a candidate for a fourth persona ("Course Builder / Event Organizer") if
the feature grows a distinct workflow rather than being an extension of Community
Leader — flagging here rather than deciding unilaterally.
