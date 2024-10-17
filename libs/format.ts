export const formatMoney = (number) => {
  const money = number.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });

  return money;
};
