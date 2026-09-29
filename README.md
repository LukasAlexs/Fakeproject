# Trailmix API

A tiny task tracking API built with Node.js and the built-in HTTP server. It has no third-party dependencies. The project is intentionally seeded with several interacting defects for debugging practice; the API contract below describes intended behavior, not current behavior.

## Run

```sh
npm start
```

The server listens on port `3000` by default (`PORT` overrides it). Data is stored in `data/tasks.json` and is created on first run.

## API

All responses are JSON.

- `GET /health` — `{ "ok": true }`
- `GET /tasks` — list tasks; supports `?status=open|done` and `?q=text`
- `GET /tasks/:id` — fetch one task
- `POST /tasks` — create `{ "title": "...", "dueDate": "YYYY-MM-DD" }`
- `PATCH /tasks/:id` — update `title`, `done`, or `dueDate`
- `DELETE /tasks/:id` — remove a task

New tasks should receive a unique ID, start as open, and be persisted. Invalid JSON and invalid input should produce a clear 400 response; missing tasks should produce 404.

## Example

```sh
curl -s http://localhost:3000/tasks
curl -s -X POST http://localhost:3000/tasks \
  -H 'content-type: application/json' \
  -d '{"title":"Pack lunch","dueDate":"2026-10-01"}'
```

The test suite is also part of the debugging exercise: `npm test` currently exposes the seeded defects.
