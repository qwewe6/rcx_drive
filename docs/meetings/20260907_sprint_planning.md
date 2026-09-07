# Sprint Planning — 2026-09-07

**Meeting:** Sep 7, 2026 at 12:14 MDT
**Participants:** Max Becker, Steve Marshall
**Source:** auto-generated Gemini transcript summary, reformatted into Markdown
for the repo (content unchanged, structure/formatting only — see
[`docs/CHANGELOG.md`](../CHANGELOG.md) for the session that did this pass).

## Summary

Establishing development foundations and infrastructure via incremental
repository management and integrated AI coding workflows.

## Establishing development foundation

A fresh repository initiative was selected to avoid migrating corrupted legacy
code. Incremental development cycles prioritize core user models to verify code
quality at each step.

## Technology stack integration

Technical infrastructure incorporates Supabase for database management and
authorization. Hierarchical schemas link users to equipment and locations to
facilitate efficient data management.

## AI oversight strategy

Stringent human monitoring remains necessary until AI models consistently
follow project constraints. Future autonomy depends on achieving stable
performance standards across the codebase.

## Decisions

### Needs further discussion

- **Map provider selection** — postponed pending further research on cost and
  open-source capabilities. Tracked as `DECISIONLOG.md` decision #2.

### Aligned

- **Build order: User → Garage → Map** — build order is established to
  prioritize the user model, followed by the garage, then the map, to respect
  logical dependencies.
- **One issue per merge request policy** — the development workflow adheres to
  a one-issue-to-one-merge-request standard.
- **AI-generated integration plan for previous code** — the AI is tasked with
  analyzing the existing (external) codebase and producing a document
  detailing how to incorporate it into the current project. (Delivered as
  [`docs/plans/phase1-map-app-incorporation.md`](../plans/phase1-map-app-incorporation.md).)
- **Supabase Postgres selected for backend architecture** — Supabase-hosted
  Postgres will serve as the primary backend, while custom Python services are
  reserved for future geospatial data-crunching tasks.
- **Supabase for auth, Python kept as a separate component** — Supabase is
  selected for authorization purposes, and the Python environment will be
  maintained separately.

## Next steps

- [x] **Steve Marshall** — Research Mapbox vs. MapLibre: compare the
  differences and implementation requirements (asked Claude to weigh the
  trade-offs) to make an informed choice for the base map.
- [ ] **The group** — Align project milestones: review
  `docs/plans/phase1-map-app-incorporation.md` and integrate its contents into
  the current project milestones/issues.
- [x] **Steve Marshall** — Update project documentation: use this meeting's
  transcript to summarize key points, update the UX folder, refresh related
  tickets, capture decisions in the log, and refine user personas. *(this
  document + the accompanying doc/ticket updates are that work.)*
- [ ] **Max Becker** — Complete Milestone 1: update the decision log to confirm
  Supabase usage with separate Python tooling, complete Milestone 1, and submit
  a merge request for review by Steve and Stephen.

## Discussion details

- **Development order and architecture.** Max Becker and Steve Marshall
  discuss the initial organization of the application, agreeing that the
  foundation, scaffolding, and user account models should be built before
  implementing map features. They determine that creating user-linked garages
  and trucks is a logical dependency for these features.
- **Repository management policy.** The team decides to maintain a fresh
  repository, "RCX drive," rather than migrating old, potentially corrupted
  codebases. They agree to use a changelog, milestones, and issues to manage
  the current state of the application, ensuring that project history remains
  accessible and organized without needing to sift through thousands of files.
- **Incremental development strategy.** To prevent AI "hallucinations" and
  ensure code quality, the team agrees to adopt a "one issue, one merge
  request" workflow. They establish that they will build the application
  incrementally rather than attempting to generate the entire platform in a
  single pass, which allows them to verify each step of the development
  process.
- **Tooling and workspace setup.** The team works on optimizing their
  development environment, including using screen sharing to sync their views.
  They decide to utilize the Claude VS Code extension to integrate AI directly
  into their coding workflow and enable Markdown preview in VS Code to better
  read project documentation and tables.
- **Incorporating existing database work.** Max Becker and Steve Marshall
  discuss integrating previously created database code and location data into
  the new repository. Max Becker prompts the AI to review their existing work,
  which includes a GeoJSON file with approximately 80 location pins, and to
  draft a plan for incorporating this data into the current project structure.
- **"Building the track" analogy.** The participants use a metaphor for their
  development strategy, comparing the process to building a train track while
  the train is already moving. They emphasize that they must define specific,
  well-laid-out instructions for the AI for every section of the "track" to
  avoid building holes in the code that would cause future crashes.
- **Database schema design.** The team plans for a schema that includes
  hierarchies for users, rigs (trucks), locations, and features. Steve
  Marshall suggests using a junction table to link these entities —
  specifically tying lines to courses, users, and specific trucks — to ensure
  efficient data management without unnecessary duplication.
- **VS Code and Claude integration.** Max Becker installs the Claude VS Code
  extension to maintain a consistent AI coding assistant within the
  development environment. They note that while the desktop app and the VS
  Code extension are separate sessions, the VS Code integration allows for
  more direct management of code and files.
- **Verification of generated plans.** After allowing the AI to process the
  existing database and location files, the team reviews the generated plan.
  They verify that the plan includes a working PostgreSQL 16 GIS schema,
  incorporating user-rig-location hierarchies and a location summary view,
  confirming that the output is aligned with their goals.
- **Technology stack decisions.** Steve Marshall and Max Becker discuss the
  use of Supabase for authentication and database management, agreeing it is
  a suitable "vanilla" solution. They also evaluate the trade-off between
  Mapbox and MapLibre, noting that while Mapbox is industry-standard, its API
  costs could be restrictive; MapLibre offers a free, open-source alternative
  that may be preferable for the initial rollout.
- **Concept of "segments" for RC crawling.** Max Becker and Steve Marshall
  translate the "segment" concept from Strava — typically used for running
  and cycling — to RC crawling. They define a segment in the context of
  crawling as a specific line or feature where a user can compare performance,
  noting that while Strava relies on human physical metrics like heart rate,
  their app will focus on vehicle performance and precision.
- **Telemetry and social engagement.** The team discusses the value of
  comparing runs using telemetry data from devices like Racebox alongside
  video evidence. They conclude that providing both quantitative telemetry
  data and qualitative video feedback will drive user engagement and allow
  for "social policing" of performance claims, where users can compare lines
  and prove their results.
- **High-fidelity terrain mapping.** Max Becker and Steve Marshall explore
  using high-fidelity terrain mapping, such as LiDAR or smartphone scanning,
  to create digital representations of features. They discuss allowing
  community leaders or users with advanced scanning technology to contribute
  new lines to the database, which could generate revenue or high-quality
  user-generated content.
- **Automated documentation updates.** The team agrees to use the transcript
  of this meeting to update the project's documentation, including user
  personas and the decision log. Steve Marshall highlights that using AI to
  summarize meeting discussions effectively replaces the need for manual
  note-taking.
- **Execution of Milestone One.** The team concludes the meeting by
  confirming they will proceed with executing the tasks outlined in Milestone
  One. They clarify that they will move forward with a Supabase-based
  PostgreSQL schema and keep Python-based tools separate for potential future
  geospatial data crunching.
- **Technical stack decisions (recap).** Max Becker and Steve Marshall agreed
  to utilize Supabase for authorization services and to maintain a separate
  Python environment for big-data processing. Steve Marshall advised that
  they update the project decision log to reflect this choice, which Max
  Becker approved. The next objective is for the team to complete Milestone 1.
- **Workflow terminology and process.** Max Becker and Steve Marshall
  clarified the use of terminology regarding code integration. While they
  discussed the term "pull request," Steve Marshall noted that GitLab
  specifically uses "merge request" to describe the process of merging code
  into the main branch. They confirmed their current workflow involves
  submitting a request, waiting for a review from the team, and then
  finalizing the action with a merge button, similar to an approval Max
  Becker provided the previous day at 11.
- **Meeting documentation management.** Following the conclusion of the
  meeting, Steve Marshall stated that they will receive an emailed transcript.
  They reached a consensus to store these meeting notes within the
  repository, potentially creating a new folder for this purpose. Steve
  Marshall plans to submit a pull request to incorporate these notes into the
  repository.
- **Project review standards.** Steve Marshall and Max Becker discussed the
  potential for future changes to the review process, specifically allowing
  documentation updates to go directly to the main branch without manual
  review. For the current stage of the project, they agreed to continue
  reviewing all contributions. Max Becker emphasized that establishing strict
  "initial conditions" is critical to ensuring the project develops
  correctly, noting that they must be careful to avoid having the series
  diverge.
- **Future AI capabilities and oversight.** Steve Marshall and Max Becker
  explored a potential future state where the AI, Claude, could autonomously
  handle bug tickets and push merge requests once the application is deployed
  and has a user base. Currently, they agreed to maintain strict oversight, as
  the AI sometimes fails to follow documented rules. Both participants
  affirmed their commitment to refining the rules and monitoring the AI to
  ensure it adheres to the established process.

## Original notes / ideation (carried over verbatim)

> RCxD App - Example real life interaction. "Hey bro, nice rig, what are you
> crawling over here? I'm crawling a line I saw this youtuber crawl last
> week. Wanted to see if my rig could do it. He just made this app RCxDrive
> that is basically Strava but for RC Crawlers. You should download it!"
>
> Down the line: hardware integration.
>
> Earlier in the line: visual data integration (take video and pics).
>
> "I need a dense crawler map and all the functions a map affords. ...I
> currently have 81 spots in Google that are crawling related, among those 81
> spots there are bound to be more than 1 spot so I've got between 81 and 81
> (×3), or 81 and 243 spots minimum. That's a solid basis to start filling in
> car stats. ...but really, it all starts with a killer map, I've got the
> base materials for a start to a killer map. Just gotta map it."
