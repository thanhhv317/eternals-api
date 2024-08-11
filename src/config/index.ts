import dotenv from 'dotenv'
dotenv.config()

export const SECRET_TOKEN = `Bearer ${process.env.SECRET_TOKEN}`
export const { PORT } = process.env
