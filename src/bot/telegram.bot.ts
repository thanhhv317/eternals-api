import Container from "typedi";
import { Telegraf } from "telegraf";
import { BOT_TOKEN } from "../config";
import { EternalService } from "../services/eternal.service";
import { EternalItems } from "@/constants/eternal-item.constants";

export class TelegramBot {
  private readonly bot: Telegraf
  private readonly service: EternalService
  constructor() {
    this.bot = new Telegraf(BOT_TOKEN)
    this.service = Container.get(EternalService)
  }

  start() {
    console.log("[Telegram bot] Launch")
    this.bot.launch()

    this.bot.command('rabbit', (ctx: any) => {
      this.harvertRabbit(ctx)
    })
  }

  private async harvertRabbit(ctx: any) {
    const result = await this.service.harvestResouce(EternalItems.meatRabbit, 5)
    if (result && result?.length) {
      this.bot.telegram.sendMessage(
        ctx.chat.id,
        `Harvert ${result.length} rabbits 🐇`,
      )
    } else {
      this.bot.telegram.sendMessage(
        ctx.chat.id,
        `Harvert rabbits failed 🐇`,
      )
    }
  }
}