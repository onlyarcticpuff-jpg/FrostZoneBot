import { Telegraf, Markup } from "telegraf";
import fs from "fs";
import path from "path";

const BOT_TOKEN = getRequiredEnv("TELEGRAM_BOT_TOKEN");
const APP_URL = getRequiredUrl("APP_URL");
const CHANNEL_URL = process.env.CHANNEL_URL || "https://t.me/OpenCaseTG";
const CHANNEL_HANDLE = process.env.CHANNEL_HANDLE || "@OpenCaseTG";
const BRAND_NAME = process.env.BRAND_NAME || "OPENCASE";

const bot = new Telegraf(BOT_TOKEN);

const ASSET_DIR = path.resolve("public");
const BANNERS = {
  main: path.join(ASSET_DIR, "bannerM.png"),
  help: path.join(ASSET_DIR, "bannerH.png"),
};

const COMMANDS = [
  { command: "start", description: "Restart the bot" },
  { command: "app", description: `Launch ${BRAND_NAME}` },
  { command: "channel", description: "Open the news channel" },
  { command: "help", description: "Show help and commands" },
];

function getRequiredEnv(name) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing ${name}`);
  }

  return value;
}

function getRequiredUrl(name) {
  const value = getRequiredEnv(name);

  try {
    return new URL(value).toString();
  } catch {
    throw new Error(`${name} must be a valid absolute URL`);
  }
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function appKeyboard(extraRows = []) {
  return Markup.inlineKeyboard([
    [Markup.button.webApp("🎁 Open a Case", APP_URL)],
    [Markup.button.url("📣 Channel", CHANNEL_URL)],
    ...extraRows,
  ]);
}

async function sendWithBanner(ctx, bannerPath, caption, keyboard = appKeyboard()) {
  const messageOptions = { parse_mode: "HTML", ...keyboard };

  if (fs.existsSync(bannerPath)) {
    await ctx.replyWithPhoto(
      { source: fs.createReadStream(bannerPath) },
      { caption, ...messageOptions }
    );
    return;
  }

  await ctx.reply(caption, messageOptions);
}

function homeCaption(firstName) {
  const name = escapeHtml(firstName || "there");

  return [
    `Hey ${name} 👋`,
    "",
    `Welcome to <b>${escapeHtml(BRAND_NAME)}</b> — open cases, collect items, and chase the next big pull.`,
    "",
    "New cases drop regularly. Tap below to start.",
  ].join("\n");
}

function helpCaption() {
  return [
    "<b>What can I do?</b>",
    "",
    `🎁 Launch <b>${escapeHtml(BRAND_NAME)}</b> and open cases in the web app.`,
    `📣 Follow ${escapeHtml(CHANNEL_HANDLE)} for drops, updates, and announcements.`,
    "",
    "<b>Commands</b>",
    "/start — restart the bot",
    ` /app — launch ${escapeHtml(BRAND_NAME)}`.trim(),
    "/channel — open the news channel",
    "/help — show this menu",
  ].join("\n");
}

bot.telegram.setMyCommands(COMMANDS).catch((error) => {
  console.warn("Could not register Telegram commands:", error.message);
});

bot.start(async (ctx) => {
  await sendWithBanner(ctx, BANNERS.main, homeCaption(ctx.from?.first_name));
});

bot.command("app", async (ctx) => {
  await sendWithBanner(
    ctx,
    BANNERS.main,
    `<b>${escapeHtml(BRAND_NAME)}</b> is one tap away 👇`
  );
});

bot.command("help", async (ctx) => {
  await sendWithBanner(ctx, BANNERS.help, helpCaption());
});

bot.command("channel", async (ctx) => {
  await ctx.reply(
    `Follow ${escapeHtml(CHANNEL_HANDLE)} for new case announcements, drops, and updates.`,
    {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([[Markup.button.url("📣 Join the Channel", CHANNEL_URL)]]),
    }
  );
});

bot.on("message", async (ctx) => {
  await sendWithBanner(
    ctx,
    BANNERS.main,
    `Tap below to open <b>${escapeHtml(BRAND_NAME)}</b> 👇`
  );
});

bot.catch((error, ctx) => {
  const updateId = ctx?.update?.update_id ?? "unknown";
  console.error(`Bot error while handling update ${updateId}:`, error);
});

await bot.launch();
console.log(`${BRAND_NAME} bot running`);

function shutdown(signal) {
  console.log(`Received ${signal}; stopping bot...`);
  bot.stop(signal);
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));
