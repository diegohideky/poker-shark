export const formatMoney = (number: number): string => {
  const money = number.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });

  return money;
};

export const formatScore = (value: number): string => {
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  const formatted = (absValue / 100).toFixed(2).replace(".", ",");
  return isNegative ? `-${formatted}` : formatted;
};
