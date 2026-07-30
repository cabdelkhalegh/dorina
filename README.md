# Dorina Salman — Authority Portal

A single-page execution portal for the consolidated mental health management / workplace wellbeing authority package. Static, no build step, no backend.

## Deploy to GitHub Pages
Copy the contents of this folder to the repository root (or to `/docs` and point Pages at it). Nothing else is required.

    index.html            the portal
    support.js            runtime
    portal/portal-data.js roadmap, decisions, calendar, workflow, workshop data
    portal/docs-data.js   all 15 documents, converted from markdown
    markdown/             the source-of-truth markdown
    *.html                redirects from the old per-document pages

## Deep links
    index.html#/map                     the twelve-month map
    index.html#/library                 all documents
    index.html#/doc/<slug>              one document
    index.html#/decisions               the decisions hub
    index.html#/pipeline                the approval workflow
    index.html#/calendar                the twelve-month content calendar
    index.html#/workshop                facilitator mode
    index.html#/guardrails              the non-clinical boundary
    index.html#/progress                progress, KPIs, export / import

Every old page URL (`readme.html`, `premium-prompt-library.html`, …) redirects to its document in the portal, so existing links keep working.

## Updating a document
Edit the file in `markdown/`, then regenerate `portal/docs-data.js`. The portal reads only that file.

## Storage
Ticks, answers and content items are stored in the browser (`localStorage`, key `dorina-portal-v1`) on the device that made them. Nothing is transmitted. Progress &rarr; Export writes a JSON file that can be imported on another device.

## Boundary
Educational, non-clinical material only: workplace wellbeing, mental health literacy, stress literacy, burnout prevention, boundaries, routines, emotional organization and help-seeking. Not therapy, diagnosis, treatment, crisis support, or medical, legal or HR advice.
