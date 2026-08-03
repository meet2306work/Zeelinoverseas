import { useState, useEffect } from 'react';

export const CURRENCIES = [
  { code: 'USD', symbol: '$', rate: 1.00, label: 'USD ($)' },
  { code: 'EUR', symbol: '€', rate: 0.92, label: 'EUR (€)' },
  { code: 'INR', symbol: '₹', rate: 83.50, label: 'INR (₹)' },
  { code: 'GBP', symbol: '£', rate: 0.79, label: 'GBP (£)' },
];

export const getSelectedCurrency = () => {
  const code = localStorage.getItem('selected_currency') || 'USD';
  return CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
};

export const setSelectedCurrency = (code) => {
  localStorage.setItem('selected_currency', code);
  window.dispatchEvent(new Event('currencyChange'));
};

export const formatPrice = (amountUsd) => {
  const currency = getSelectedCurrency();
  const converted = (amountUsd || 0) * currency.rate;
  return `${currency.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatPriceNoDecimals = (amountUsd) => {
  const currency = getSelectedCurrency();
  const converted = Math.round((amountUsd || 0) * currency.rate);
  return `${currency.symbol}${converted.toLocaleString()}`;
};

export function useCurrency() {
  const [currency, setCurrency] = useState(getSelectedCurrency());

  useEffect(() => {
    const handleCurrencyChange = () => {
      setCurrency(getSelectedCurrency());
    };
    window.addEventListener('currencyChange', handleCurrencyChange);
    return () => window.removeEventListener('currencyChange', handleCurrencyChange);
  }, []);

  return currency;
}
