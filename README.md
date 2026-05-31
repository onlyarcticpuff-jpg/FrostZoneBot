# FrostZoneBot

A small Telegram bot for launching the OPENCASE Telegram Web App and routing players to the project channel.

## Features

- `/start` welcome flow with a branded banner.
- `/app` shortcut that opens the Telegram Web App.
- `/channel` shortcut for news and drop announcements.
- `/help` command menu with the available actions.
- Optional environment-driven branding and channel configuration.

## Requirements

- Node.js 18 or newer.
- A Telegram bot token from [@BotFather](https://t.me/BotFather).
- A deployed Telegram Web App URL served over HTTPS.

## Setup

Install dependencies:

```bash
npm install
```

Create the required environment variables:

```bash
export TELEGRAM_BOT_TOKEN="123456:your-bot-token"
export APP_URL="https://your-web-app.example.com"
```

Optional configuration:

```bash
export BRAND_NAME="OPENCASE"
export CHANNEL_HANDLE="@OpenCaseTG"
export CHANNEL_URL="https://t.me/OpenCaseTG"
```

Start the bot:

```bash
npm start
```

## Development checks

Validate the JavaScript syntax without starting the bot:

```bash
npm run check
```

## Assets

The bot looks for these banner files in `public/`:

- `bannerM.png` for the main welcome/app prompts.
- `bannerH.png` for the help menu.

If a banner is missing, the bot falls back to a text-only message.
