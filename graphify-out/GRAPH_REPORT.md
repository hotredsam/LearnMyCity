# Graph Report - .  (2026-06-07)

## Corpus Check
- Corpus is ~1,574 words - fits in a single context window. You may not need a graph.

## Summary
- 14 nodes · 14 edges · 3 communities (2 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Question & Map Logic|Question & Map Logic]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_Question Block Class|Question Block Class]]

## God Nodes (most connected - your core abstractions)
1. `updateCoordinates()` - 3 edges
2. `QuestionBlock` - 2 edges
3. `getCoordinates()` - 2 edges
4. `makeQuestions()` - 2 edges
5. `questions` - 1 edges
6. `dotenv` - 1 edges
7. `http-server` - 1 edges
8. `openai` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (3 total, 1 thin omitted)

### Community 0 - "Question & Map Logic"
Cohesion: 0.47
Nodes (4): getCoordinates(), makeQuestions(), questions, updateCoordinates()

### Community 1 - "Package Dependencies"
Cohesion: 0.40
Nodes (4): dependencies, dotenv, http-server, openai

## Knowledge Gaps
- **4 isolated node(s):** `questions`, `dotenv`, `http-server`, `openai`
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `questions`, `dotenv`, `http-server` to the rest of the system?**
  _4 weakly-connected nodes found - possible documentation gaps or missing edges._