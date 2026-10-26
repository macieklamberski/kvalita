declare let priceData: number | undefined
declare let isReady: boolean
declare let count: number
declare const findPrice: () => number
priceData ??= findPrice() // flag
isReady ||= true // flag
count += 1
if (!priceData) {
  priceData = findPrice()
}
