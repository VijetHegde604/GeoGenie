# GeoGenie Setup Guide

## 1) Install dependencies

```bash
npm install
```

## 2) Configure backend endpoint

GeoGenie uses `api/clients.ts` for the backend base URL:

```ts
const API_URL = "http://homeserverpi:9000";
```

Change this to your reachable API host (local network host, tunnel, or cloud URL).

## 3) Start development server

```bash
npm run start
```

## 4) Open in Expo Go

- Press `s` for Expo Go QR mode if needed.
- Scan the QR code from Expo Go.
- Grant camera and media permissions.

## 5) Validate project health

```bash
npm run lint
npm run typecheck
npm run doctor
```

> `npm run doctor` requires internet access because it uses `npx expo-doctor`.

## Notes

- For physical devices, keep phone and dev machine on the same network when using LAN mode.
- If your network blocks mDNS/LAN discovery, switch to tunnel mode from Expo DevTools.
