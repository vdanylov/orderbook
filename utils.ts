export const formatToLocaleString = (value: number) => {
  return value?.toLocaleString(undefined, {
    minimumFractionDigits: 2,
  })
}
