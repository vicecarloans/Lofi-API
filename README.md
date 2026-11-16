# Lofi API

REST API behind [Lofi](https://github.com/vicecarloans/Lofi-Web), a lofi music streaming app where users upload tracks, group them into albums, and vote on what they like.

Built with NestJS and TypeScript on MongoDB, with background upload processing on Redis queues.

## Features

- **Tracks and albums**: public and private listings, CRUD, and "popular" feeds.
- **Voting and ranking**: upvotes and downvotes, ranked with a Wilson score interval so a track with few votes doesn't outrank a well-established one.
- **Asynchronous uploads**: audio and image files are accepted by the API, queued with Bull on Redis, and pushed to Cloudinary by background workers. Clients poll an upload record for status.
- **Authentication**: OAuth 2.0 bearer tokens verified against an Okta issuer.
- **Favourites and notifications** per user.
- **API docs**: Swagger UI generated from the controllers.
- **Hardening**: Helmet headers, rate limiting (100 requests per 15 minutes per IP), request validation, and response caching.

## Stack

| Concern | Choice |
|---|---|
| Framework | NestJS 7, TypeScript |
| Database | MongoDB with Mongoose |
| Queue | Bull on Redis |
| Media storage | Cloudinary |
| Auth | Okta JWT verification with Passport bearer strategy |
| Docs | Swagger (OpenAPI) |
| Deployment | Google App Engine through GitHub Actions |

## Architecture

```
Client ──▶ NestJS API ──▶ MongoDB
               │
               ├──▶ Bull queue (Redis) ──▶ workers ──▶ Cloudinary
               │
               └──▶ Okta (token verification)
```

An upload request returns immediately with an upload ID. A queue consumer sends the file to Cloudinary, then writes the resulting URL back to the track or image and marks the upload complete.

## Getting started

### Prerequisites

- Node.js 12+ and Yarn
- A MongoDB instance
- A Redis instance
- A Cloudinary account
- An Okta authorization server (issuer and client ID)

### Run locally

```bash
yarn install
cp .env.example .env   # then fill in the values
yarn start:dev
```

The API runs on `http://localhost:5000` under the `/v1` prefix. Swagger UI is at `http://localhost:5000/api`.

### Environment variables

| Variable | Purpose |
|---|---|
| `ISSUER`, `CLIENT_ID` | Okta authorization server used to verify access tokens |
| `MONGO_URL` | MongoDB connection string |
| `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_URL` | Redis for the upload queues |
| `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_SECRET` | Cloudinary credentials |
| `PORT` | Port to listen on (defaults to 5000) |

## API overview

All routes are prefixed with `/v1`. Routes marked 🔒 need an `Authorization: Bearer <token>` header. See Swagger UI for request and response schemas.

| Resource | Routes |
|---|---|
| Tracks | `GET /track`, `GET /track/popular`, `GET /track/:id`, 🔒 `GET /track/private`, 🔒 `POST /track`, 🔒 `PATCH /track/:id`, 🔒 `PUT /track/vote/:id`, 🔒 `DELETE /track/:id` |
| Albums | `GET /album`, `GET /album/popular`, `GET /album/:id`, 🔒 `GET /album/private`, 🔒 `POST /album`, 🔒 `PATCH /album/:id`, 🔒 `PUT /album/vote/:id`, 🔒 `DELETE /album/:id` |
| Images | `GET /image/:id`, 🔒 `POST /image`, 🔒 `PATCH /image/:id`, 🔒 `DELETE /image/:id` |
| Uploads | 🔒 `GET /upload/:id` |
| Votes | 🔒 `GET /vote/:subjectId` |
| User | 🔒 `GET /user/me/favourites/tracks`, 🔒 `GET /user/me/favourites/albums`, 🔒 `GET /user/me/uploads`, 🔒 `GET /user/me/notifications`, 🔒 `PUT /user/me` |
| Notifications | 🔒 `GET /notifications/:id` |

## Project layout

```
src/
  album/ track/ image/     Feature modules: controller, service, schema, DTOs
  upload/                  Upload status records
  vote/ user/ notification/
  cloudinary/              Queue consumers and Multer storage
  auth/                    Okta token verification and bearer guard
  swagger/                 Response models for the API docs
  utils/wilsonScore.ts     Ranking function for popular feeds
```

## Scripts

| Command | Description |
|---|---|
| `yarn start:dev` | Run with file watching |
| `yarn build` | Compile to `dist/` |
| `yarn start:prod` | Run the compiled build |
| `yarn lint` | Lint and fix |
| `yarn test` / `yarn test:e2e` | Unit and end-to-end tests |

## Deployment

Pushes to `master` deploy to Google App Engine through the workflow in `.github/workflows/gappengine.yml`.

## Status

This project was built in 2020 and is not actively maintained. Dependencies reflect that period.
