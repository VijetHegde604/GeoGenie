# GeoGenie (Expo)

GeoGenie is a mobile app that identifies landmarks from a photo and shows context such as confidence/source, map, weather, and follow-up chat/history tools. The app is built with **Expo Router + React Native** and is intended to run in **Expo Go** for day-to-day development.

---

## What's in this repository

- `app/` — Expo Router screens and navigation structure.
- `components/` — shared UI components.
- `api/` — API client used for recognition and app data requests.
- `store/` — Zustand state for image upload + recognition flow.
- `assets/` — icons/images/fonts.

See detailed setup docs in [`docs/SETUP.md`](docs/SETUP.md) and troubleshooting in [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md).

---

## Tech stack

- Expo SDK 54
- Expo Router
- React Native + React 19
- React Native Paper
- Zustand
- Axios

---

## Prerequisites

- **Node.js 20 LTS** (recommended)
- **npm 10+**
- Expo Go installed on your physical device

---

## Quick start

```bash
npm install
npm run start
```

Then:
1. Scan the QR code from terminal/DevTools with Expo Go.
2. Allow camera/photo permissions when prompted.
3. Test with a monument/landmark image.

---

## Available scripts

- `npm run start` — start Metro for native app development.
- `npm run android` — run native Android project.
- `npm run ios` — run native iOS project.
- `npm run web` — run as web app.
- `npm run lint` — run Expo lint.
- `npm run typecheck` — run TypeScript type checks.
- `npm run doctor` — run Expo dependency diagnostics (`expo-doctor`).

---

## API configuration

The app currently reads its base URL from `api/clients.ts`.

If your backend is hosted elsewhere, update the `API_URL` constant in that file before launching the app.

---

## Expo Go compatibility notes

This repository has been cleaned up to avoid legacy CLI/runtime dependencies that commonly break modern Expo Go workflows. If Expo Go cannot connect, use the troubleshooting guide.

---

## Documentation

- Setup: [`docs/SETUP.md`](docs/SETUP.md)
- Troubleshooting: [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md)

## Troubleshooting

### Expo hangs at `Waiting for Watchman \`watch-project\``

This repo disables Watchman in two places:
- `metro.config.js` sets `watcher.useWatchman = false`.
- npm scripts export `EXPO_NO_WATCHMAN=1` before invoking Expo CLI.

Use the npm scripts (not raw `npx expo start`) so the environment variable is applied:

```bash
npm run start
```

If you still hit this in your environment, restart Expo after cleaning cache:

```bash
EXPO_NO_WATCHMAN=1 npx expo start --clear
```

