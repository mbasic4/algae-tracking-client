export const transformToNumber = (value: string | null | undefined) => {
  if (value === "" || value === null || value === undefined) return null
  return parseInt(value)
}
