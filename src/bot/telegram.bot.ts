import Container from "typedi";
import { Telegraf } from "telegraf";
import { BOT_TOKEN, TELE_CHAT_ID } from "../config";
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
    try {
      let accountNumber = 2
      if (ctx.chat.id === parseInt(TELE_CHAT_ID)) {
        accountNumber = 1
      }
      const result = await this.service.getEnergy(accountNumber)
      return this.bot.telegram.sendMessage(
        ctx.chat.id,
        `Your energy is: ${result} ⚡️`
      )
    } catch (error) {
      return  this.bot.telegram.sendMessage(
        ctx.chat.id,
        `Tạch tạch tạch`
      )
    }
  }

  private async harvertRabbit(ctx: any) {
    let accountNumber = 2
    if (ctx.chat.id === parseInt(TELE_CHAT_ID)) {
      accountNumber = 1
    }
    const result = await this.service.harvestResouce(EternalItems.meatRabbit, 5, accountNumber)
    if (result && result?.length) {
      this.bot.telegram.sendMessage(
        ctx.chat.id,
        `Harvested ${result.length} ${result.length > 1 ? 'rabbits': 'rabbit'} 🐇`,
      )
    } else {
      this.bot.telegram.sendMessage(
        ctx.chat.id,
        `Rabbit harvest failed ❌`,
      )
    }
  }

  private async harvertWood(ctx: any) {
    let accountNumber = 2
    if (ctx.chat.id === parseInt(TELE_CHAT_ID)) {
      accountNumber = 1
    }
    const result = await this.service.harvestResouce(EternalItems.woods, 10, accountNumber)
    if (result && result?.length) {
      this.bot.telegram.sendMessage(
        ctx.chat.id,
        `Harvested ${result.length} ${result.length > 1 ? 'woods': 'wood'} 🪵`,
      )
    } else {
      this.bot.telegram.sendMessage(
        ctx.chat.id,
        `Wood harvest failed ❌`,
      )
    }
  }

  private async harvertSheep(ctx: any) {
    let accountNumber = 2
    if (ctx.chat.id === parseInt(TELE_CHAT_ID)) {
      accountNumber = 1
    }
    const result = await this.service.harvestResouce(EternalItems.wool, 10, accountNumber)
    if (result && result?.length) {
      this.bot.telegram.sendMessage(
        ctx.chat.id,
        `Harvested ${result.length} ${result.length > 1 ? 'sheeps': 'sheep'} 🐏`,
      )
    } else {
      this.bot.telegram.sendMessage(
        ctx.chat.id,
        `Sheep harvest failed ❌`,
      )
    }
  }

  private async harvertButterflies(ctx: any) {
    let accountNumber = 2
    if (ctx.chat.id === parseInt(TELE_CHAT_ID)) {
      accountNumber = 1
    }
    const result = await this.service.harvestResouce(EternalItems.butterfly, 10, accountNumber)
    if (result && result?.length) {
      this.bot.telegram.sendMessage(
        ctx.chat.id,
        `Harvested ${result.length} ${result.length > 1 ? 'butterflies': 'butterfly'} 🦋`,
      )
    } else {
      this.bot.telegram.sendMessage(
        ctx.chat.id,
        `Butterfly harvest failed ❌`,
      )
    }
  }
}