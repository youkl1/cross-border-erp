import { defineStore } from 'pinia'

interface ExchangeRate {
  id: string
  fromCurrency: string
  toCurrency: string
  rate: number
  effectiveDate: string
  updatedAt: string
}

export const useExchangeStore = defineStore('exchange', {
  state: () => ({
    exchangeRates: [] as ExchangeRate[],
    baseCurrency: 'USD',
    selectedCurrency: 'CNY'
  }),
  getters: {
    getExchangeRate: (state) => (from: string, to: string) => {
      const rate = state.exchangeRates.find(
        r => r.fromCurrency === from && r.toCurrency === to
      )
      return rate?.rate || 1
    },
    convertedAmount: (state) => (amount: number, from: string, to: string) => {
      if (from === to) return amount
      const rate = state.exchangeRates.find(
        r => r.fromCurrency === from && r.toCurrency === to
      )?.rate || 1
      return amount * rate
    }
  },
  actions: {
    setExchangeRates(rates: ExchangeRate[]) {
      this.exchangeRates = rates
    },
    setBaseCurrency(currency: string) {
      this.baseCurrency = currency
    },
    setSelectedCurrency(currency: string) {
      this.selectedCurrency = currency
    },
    addExchangeRate(rate: ExchangeRate) {
      this.exchangeRates.push(rate)
    },
    updateExchangeRate(id: string, rate: Partial<ExchangeRate>) {
      const index = this.exchangeRates.findIndex(r => r.id === id)
      if (index > -1) {
        this.exchangeRates[index] = { ...this.exchangeRates[index], ...rate }
      }
    }
  }
})