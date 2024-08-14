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

    this.bot.command('wood', (ctx: any) => {
      this.harvertWood(ctx)
    })

    this.bot.command('sheep', (ctx: any) => {
      this.harvertSheep(ctx)
    })

    this.bot.command('butterfly', (ctx: any) => {
      this.harvertButterflies(ctx)
    })

    this.bot.command('energy', (ctx: any) => {
      this.getCurrentEnergy(ctx)
    })
  }

  private async getCurrentEnergy(ctx: any) {
    const result = await this.service.getEnergy()
    return this.bot.telegram.sendMessage(
      ctx.chat.id,
      `Your energy is: ${result} ⚡️`
    )
  }

  private async harvertRabbit(ctx: any) {
    const result = await this.service.harvestResouce(EternalItems.meatRabbit, 5)
    if (result && result?.length) {
      this.bot.telegram.sendMessage(
        ctx.chat.id,
        `Harverted ${result.length} ${result.length > 1 ? 'rabbits': 'rabbit'} 🐇`,
      )
    } else {
      this.bot.telegram.sendMessage(
        ctx.chat.id,
        `Rabbit harvest failed ❌`,
      )
    }
  }

  private async harvertWood(ctx: any) {
    const result = await this.service.harvestResouce(EternalItems.woods, 10)
    if (result && result?.length) {
      this.bot.telegram.sendMessage(
        ctx.chat.id,
        `Harverted ${result.length} ${result.length > 1 ? 'woods': 'wood'} 🪵`,
      )
    } else {
      this.bot.telegram.sendMessage(
        ctx.chat.id,
        `Wood harvest failed ❌`,
      )
    }
  }

  private async harvertSheep(ctx: any) {
    const result = await this.service.harvestResouce(EternalItems.wool, 10)
    if (result && result?.length) {
      this.bot.telegram.sendMessage(
        ctx.chat.id,
        `Harverted ${result.length} ${result.length > 1 ? 'sheeps': 'sheep'} 🐏`,
      )
    } else {
      this.bot.telegram.sendMessage(
        ctx.chat.id,
        `Sheep harvest failed ❌`,
      )
    }
  }

  private async harvertButterflies(ctx: any) {
    const result = await this.service.harvestResouce(EternalItems.butterfly, 10)
    if (result && result?.length) {
      this.bot.telegram.sendMessage(
        ctx.chat.id,
        `Harverted ${result.length} ${result.length > 1 ? 'butterflies': 'butterfly'} 🦋`,
      )
    } else {
      this.bot.telegram.sendMessage(
        ctx.chat.id,
        `Butterfly harvest failed ❌`,
      )
    }
  }
}