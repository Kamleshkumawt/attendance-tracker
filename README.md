# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

# Attendance Tracker (Expo)

A cross-platform attendance and task tracker built with Expo and React Native. This repository contains an Expo Router-based app focused on simple attendance tracking, tasks, sticky notes, routines and local notifications.

## Quick links

- Project: Attendance Tracker
- Location: `app/` — primary source for screens and routing
- Components: `components/` — reusable UI pieces
- Notification helpers: `lib/` — notification scheduling utilities

## Features

- Record and update attendance
- Create, update, and manage tasks
- Sticky notes with create/edit views
- Routine scheduler and local notifications
- Simple built-in mini-games and utilities

## Tech stack

- Expo (managed) with the Expo Router
- React Native + TypeScript/JSX
- EAS Build for production/distribution

## Prerequisites

- Node.js (16+ recommended)
- npm or yarn
- Expo CLI / `npx expo` for local development
- For native builds: EAS CLI configured and credentials for Android/iOS

## Installation

1. Clone the repo and install dependencies

```bash
npm install
# or
yarn
```

2. Start the development server

```bash
npx expo start
```

This opens the Expo dev tools where you can run on Android emulator, iOS simulator, or Expo Go on device.

## Common development commands

- Start Metro + Router: `npx expo start`
- Reset starter files: `npm run reset-project`
- Build (example preview profile): `eas build --platform android --profile preview`

Notes about EAS: ensure `eas.json` is configured and you have logged into your Expo account (`npx eas login`). For first-time Android builds you may need to follow EAS prompts for keystore setup or provide credentials via `eas credentials`.

## Project structure (high-level)

- `app/` — App screens and routing
  - `_layout.tsx` — App layout and navigation container
  - `attendance.jsx`, `dashboard.jsx`, `stickyNotes.jsx`, `toDo.jsx`, etc. — main screens
- `components/` — Reusable components (`Header.jsx`, `DatePicker.jsx`, `NotificationTime.jsx`, etc.)
- `lib/` — Scheduling and notification helpers (`routineNotification.js`, `scheduleRoutineNotification.js`)
- `assets/` — Static assets like images
- `constants/` — Theme constants (`theme.ts`)
- `hooks/` — Custom hooks (`use-theme-color.ts`, etc.)

Refer to the `app/` directory to see all available screens and their file names.

## Screens and notable files

- `app/dashboard.jsx` — App home/dashboard
- `app/attendance.jsx` — Attendance list / management
- `app/updateAttendance.jsx` — Edit attendance entries
- `app/toDo.jsx` (in `(tabs)/`) — Task list / mini task screens
- `app/stickyNotes.jsx` & `addStickyNotes.jsx` — Sticky notes CRUD
- `app/(tabs)/miniGames.jsx` — Mini games view

## Notifications and background scheduling

Notification scheduling utilities live in `lib/`. The app uses local notifications to remind users about routines. If you modify notification code, test on a real device or an emulator with notifications enabled.

Quick test (JS runtime):

```js
// Example: call from a component to schedule a test notification
import { scheduleRoutineNotification } from '../lib/scheduleRoutineNotification';
scheduleRoutineNotification({ title: 'Test', body: 'This is a test notification' });
```

## Building a production or preview APK (EAS)

1. Install and configure `eas-cli`:

```bash
npx eas login
npm install -g eas-cli
```

2. Configure `eas.json` if you need a custom profile.

3. Run a build (Android preview example):

```bash
eas build --platform android --profile preview
```

If `eas build` fails (for example exit code 1), check the following:

- Are you logged in via `npx eas login`?
- Are Android credentials / keystore configured (EAS will prompt or you can provide them manually)?
- Review the build logs printed by EAS for specific failure reasons.

## Styling and theme

Theme constants are in `constants/theme.ts`. Components use `themed-text.tsx` and `themed-view.tsx` to adapt to color scheme hooks in `hooks/`.

## Contributing

If you want to contribute:

1. Fork the repo and create a feature branch.
2. Run the app and verify changes locally.
3. Open a pull request describing the change and motivation.

For big changes (state management refactor, native module additions, etc.), open an issue first so we can discuss scope.

## Troubleshooting

- Metro not loading: clear cache `npx expo start -c`.
- Native build failures with EAS: check credentials and logs, ensure correct `eas.json` profile.
- Notifications not showing on Android emulator: test on a physical device and ensure app has notification permissions.

## Where to look in the code

- UI components: `components/`
- Screens & routes: `app/`
- Notification helpers: `lib/`
- Theme & hooks: `constants/`, `hooks/`

## License & contact

This project does not include an explicit license file. Add a `LICENSE` if you want to set terms.

If you want changes to this documentation or specific deep dives into modules (e.g., expand docs for `lib/` notification flow), tell me which areas to expand.
Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
