export const formatMoney = (number: number): string => {
  const money = number.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });

  return money;
};
