# MSZ data platform product requirements

**Status:** planned. The existing student-site UI requirements remain in [web/PRD.md](../web/PRD.md).

## Goal and users

Help prospective master's and PhD applicants find programmes, assess documented admission requirements, identify funding, and discover relevant faculty. Editors verify records and resolve ambiguity; administrators configure sources, jobs, and staff. The system must show provenance and freshness so users can check the authoritative page before applying.

## MVP outcomes

| Outcome | Acceptance measure |
| --- | --- |
| Discover programmes | Search published programmes by degree, subject, institution and country; each result has an official or clearly labelled discovery URL and verification status. |
| Understand admission | Programme/intake detail shows IELTS, GRE, GPA, documents and conditional rules when verified; absent facts say `unknown`. |
| Find funding | Funding opportunities are separate records with provider, coverage, deadline, eligibility, official URL and links to eligible programmes where verified. |
| Find faculty | Faculty member shows current institution/department, public institutional contact when available, research topics and official profile URL. Recruiting status appears only with current evidence. |
| Control quality | Editors can compare staged changes with published records, inspect source evidence, approve/reject/correct, and see revision history. |
| Operate globally | Dashboard reports discovered versus verified records, field completeness, freshness and source health by country and institution. |

No single platform is assumed complete. Global coverage is an expanding target, measured with denominators from onboarded/known source catalogues rather than inferred from search result counts. Suggested initial quality gates: 100% of published requirement/funding claims have official evidence; manual sample precision of at least 95% for titles, deadlines and faculty affiliation; zero silent overwrite from failed refreshes. Review these targets after the first pilot.

## Workflow and permissions

`discovered → staged → needs_review → published` or `rejected`; published items may become `stale` or `archived`. A collector cannot publish directly. An editor reviews evidence, corrects fields, and records a review decision. An administrator has the same content rights and can manage source permissions, job schedules, staff and settings. Every mutation records actor, timestamp and before/after revision. Public APIs expose published records only.

## Required admin features

Overview; institution, programme, requirement claim, funding opportunity and faculty member lists/details; source registry; job monitor; review queue; audit history; staff management for administrators. Lists support search, filters, pagination and bulk review only where every selected item has evidence. Forms show validation and conflict feedback. See [DESIGN.md](DESIGN.md).

## Boundaries

MVP does not promise every institution or every subject worldwide, admissions advice, guaranteed scholarship eligibility, automatic professor outreach, private emails, inferred open positions, rankings, or an AI-generated match score. Studyportals is a candidate discovery source subject to access review; official institution/funder pages establish published requirements and terms. Student account, payments, applications and email CRM are covered by the existing site roadmap and are not part of this data-platform MVP.
