import dotenv from 'dotenv'
dotenv.config()

export const SECRET_TOKEN = `Bearer ${process.env.SECRET_TOKEN}`
export const SECOND_SECRET_TOKEN = `Bearer ${process.env.SECOND_SECRET_TOKEN}`
export const THIRD_SECRET_TOKEN = `Bearer ${process.env.THIRD_SECRET_TOKEN}`
export const { PORT, BOT_TOKEN, TELE_CHAT_ID } = process.env
