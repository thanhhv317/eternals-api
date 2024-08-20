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

export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

export const getDateSig = () => {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0') // Months are zero-based
  const dd = String(today.getDate()).padStart(2, '0')

  const formattedDate = `${yyyy}-${mm}-${dd}`
  return formattedDate
}
