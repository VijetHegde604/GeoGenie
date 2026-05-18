# GeoGenie Troubleshooting

## Expo Go opens but app does not connect

1. Make sure Metro is running:
   ```bash
   npm run start
   ```
2. Ensure device + development machine are on the same network.
3. In Expo CLI, switch connection mode (LAN/Tunnel).

## Request failures after image upload

- Verify backend URL in `api/clients.ts`.
- Confirm backend is reachable from your phone (not just from your laptop).
- Check backend supports `multipart/form-data` image uploads.

## Camera/gallery permission problems

- Re-open app and accept permission prompts.
- If previously denied, reset permissions from phone settings.

## Dependency mismatch warnings

Run:

```bash
npm run doctor
```

If `expo-doctor` cannot run, confirm internet access to npm registry or run in a network that allows package metadata downloads.

## Clearing local state/cache

```bash
npx expo start -c
```

This clears Metro cache and resolves many stale bundle issues.
