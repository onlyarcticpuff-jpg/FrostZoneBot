import { Telegraf, Markup } from "telegraf";
import fs from "fs";
import path from "path";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const APP_URL = process.env.APP_URL;

if (!BOT_TOKEN) throw new Error("Missing TELEGRAM_BOT_TOKEN");
if (!APP_URL) throw new Error("Missing APP_URL");

const bot = new Telegraf(BOT_TOKEN);

const BANNER_MAIN = path.resolve("public/bannerM.png");
const BANNER_HELP = path.resolve("public/bannerH.png");

const mainKeyboard = Markup.inlineKeyboard([
  [Markup.button.webApp("🎁 Open a Case", APP_URL)],
  [Markup.button.url("📣 Channel", "https://t.me/OpenCaseTG")],
]);

const helpKeyboard = Markup.inlineKeyboard([
  [Markup.button.webApp("🎁 Open a Case", APP_URL)],
  [Markup.button.url("📣 Channel", "https://t.me/OpenCaseTG")],
]);

async function sendWithBanner(ctx, bannerPath, caption, keyboard) {
  if (fs.existsSync(bannerPath)) {
    await ctx.replyWithPhoto(
      { source: fs.createReadStream(bannerPath) },
      { caption, parse_mode: "Markdown", ...keyboard }
    );
  } else {
    await ctx.reply(caption, { parse_mode: "Markdown", ...keyboard });
  }
}

bot.start(async (ctx) => {
  const name = ctx.from?.first_name || "there";
  await sendWithBanner(
    ctx,
    BANNER_MAIN,
    `Hey ${name} 👋\n\nWelcome to *OPENCASE* — open cases, collect items, and see what you get.\n\nNew cases drop regularly. Tap below to start.`,
    mainKeyboard
  );
});

bot.command("app", async (ctx) => {
  await sendWithBanner(
    ctx,
    BANNER_MAIN,
    `*OPENCASE* is one tap away 👇`,
    mainKeyboard
  );
});

bot.command("help", async (ctx) => {
  await sendWithBanner(
    ctx,
    BANNER_HELP,
    `*Here's what you can do:*\n\n/start — restart the bot\n/app — launch OPENCASE\n/channel — news & new cases\n/help — this menu`,
    helpKeyboard
  );
});

bot.command("channel", async (ctx) => {
  await ctx.reply(
    `Follow *@OpenCaseTG* for new case announcements, drops, and updates.`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.url("📣 Join the Channel", "https://t.me/OpenCaseTG")],
      ]),
    }
  );
});

bot.on("message", async (ctx) => {
  await sendWithBanner(
    ctx,
    BANNER_MAIN,
    `Tap below to open OPENCASE 👇`,
    mainKeyboard
  );
});

bot.launch();

console.log("OPENCASE bot running");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
