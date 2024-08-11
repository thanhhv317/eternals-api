export const checkJSon = (value: any) => {
  try {
    JSON.parse(value)
  } catch (e) {
    return false
  }
  return true
}

export const parseSkipRecord = (limit: number, page: number) => {
  if (Number(page) < 1) return 0
  return (Number(page) - 1) * Math.abs(Number(limit))
}

export const lowerCase = (s: string) => {
  return s?.toLowerCase()
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
