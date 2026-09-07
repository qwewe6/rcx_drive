# Phase I Map App — Product Spec

Source: Max's original `instructions.md` from the `rcxd_map_app` local prototype,
carried over verbatim (lightly reformatted) per
`docs/plans/phase1-map-app-incorporation.md`. This is the concrete Phase I spec
for the map/location/feature/line loop — read alongside
`docs/research/strava-teardown.md`.

---

## RCxD App - Phase I - A Killer RC Crawler Map

The basis of this app is a killer RC crawler map. Locations with locations in
them, with locations in them. I want to be able to go to the app, select a
location, see its features, select a feature and see the lines on that
feature. Locations and features are to be added by admin, but once a location
and feature are added, users can add in the lines they run (explained down
below).

For example, I open the app, it asks for my location, I let it use my
location. A map shows up as the home page. I see a nearby location. I click
on it. I see its address, a description, a picture of the feature itself. I
click on the lines tab, and I see there are two lines. I click on the first
line and see a picture of the line, along with the rig used, and the profile
of the person that did it. So I get my batteries charged, pack up the rig,
head to the location, find the feature, crawl that line, open the app, and
check in at that location to show I was there, I add a picture or video and
comment, "Cool line, thanks! ez with this rig."

This comment along with its corresponding image(s) and video(s) is then
public like a review, essentially, where the next person could see the same!

From notes...

"...would be nice to be able to use the app to plan some YouTube videos,
remember the app has to solve a problem right now I'm the only person I just
like something to plan the logistics of a crawling day trip. I need a dense
crawler map and all the functions a map affords. ...I currently have 81 spots
in google that are crawling related. Among those 81 spots there are bound to
be more than 1 spot so I've got between 81 and 81(3) or 81 and 243 spots
minimum. That's a solid basis to start filling in car stats. ...but really,
it all starts with a killer map, I've got the base materials for a start to
a killer map. just gotta map it.

so start with the map, put all the stuff you have saved in Google into the
map, the goal is to have a searchable map that if you click a listing it
brings up information on the spot, and we should fill it with as much
relevant information as we can.

I also would like to have the app facilitate me interacting with my
subscribers in a unique way - I like the idea of me making a video, then
having a subscriber in the area go try the feature in the video, and
compare."

One observation:
Almost everyone has google maps or apple maps. Which means, we need a script
that gets my list from google maps to the app! Ideally an "add location"
button, where you have the option to add in fields manually, or to paste in
a google maps share link.
