# AI Agent 171

Autonomous AI workspace — React + Vite foundation, designed for Website and Android (Capacitor).

## Current milestone: M1 UI foundation

Included:
- Responsive dashboard shell
- Overview, AI Chat, Agent Tasks, Research, Files, Automations, Memory, Tools, Activity, Settings screens
- Dark black / gold visual system
- Mobile navigation layout
- Demo-only interactions and sample data

Not implemented yet:
- Google OAuth authentication
- AI API or local-model connection
- Agent execution / tool calling
- Database persistence
- File uploads, scheduling, notifications
- Production Android project and APK

The UI intentionally does not claim these backend features work.

## Run locally

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Production web build:

```bash
npm run build
npm run preview
```

## Android wrapper

After installing dependencies:

```bash
npx cap add android
npm run build
npx cap sync android
npx cap open android
```

The generated `android/` directory is ignored by Git in this starter. Commit it later if the Android native project should be maintained in this repository.

## GitHub Pages

For deployment, configure Vite `base` to the repository path if using a project Pages URL, then add a Pages workflow. Do not deploy secrets or API keys to Pages.

## Security architecture planned for later milestones

- Google OAuth through Supabase Auth
- Cloudflare Worker as the only public backend API
- Supabase Row Level Security on all user-owned records
- Provider credentials stored only as backend secrets
- Explicit approval gates for external writes, purchases, messages, and destructive actions
- Tool allowlist, per-task limits, audit log, and cancellation
