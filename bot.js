import { Telegraf, Markup } from "telegraf";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const APP_URL = process.env.APP_URL;

if (!BOT_TOKEN) {
  throw new Error("Missing TELEGRAM_BOT_TOKEN");
}

if (!APP_URL) {
  throw new Error("Missing APP_URL");
}

const bot = new Telegraf(BOT_TOKEN);

const miniAppButton = Markup.inlineKeyboard([
  Markup.button.webApp("❄️ Open FrostLab", APP_URL),
]);

bot.start(async (ctx) => {
  await ctx.reply(
    `❄️ Welcome to FrostLab\n\nEnter the frozen TON sticker lab.\nCollect drops, connect your wallet, and explore the frost vault.`,
    miniAppButton
  );
});

bot.command("app", async (ctx) => {
  await ctx.reply("Launch FrostLab ❄️", miniAppButton);
});

bot.command("help", async (ctx) => {
  await ctx.reply(
    `❄️ FrostLab Commands\n\n/start - Start FrostLab\n/app - Open the Mini App\n/help - Show help`
  );
});

bot.on("message", async (ctx) => {
  await ctx.reply("❄️ FrostLab is inside the Mini App.", miniAppButton);
});

bot.launch();

console.log("❄️ FrostLab bot running with polling");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
