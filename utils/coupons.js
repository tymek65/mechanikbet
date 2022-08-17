export const getCouponValues = (couponStatus, value, odds) => {
  switch (couponStatus) {
    case true:
      return { text: `Wygrany +${Math.round(value * odds * 100) / 100}`, color: 'green', variant: 'solid' };
    case false:
      return { text: `Przegrany -${value}`, color: 'red', variant: 'solid' };
    default:
      return { text: 'Kupon w grze', color: 'gray', variant: 'outline' };
  }
};
export const getEstimatedWin = (value, odds) => {
  return Math.round(value * odds * 100) / 100;
};
export const getPromptText = ({ type, option }, betTitle, betOptions) => {
  switch (type) {
    case 'finish':
      switch (option) {
        case 'cancel':
          return `Czy jesteś pewny, że chcesz anulować zakład "${betTitle}"`;
        default:
          return `Czy jesteś pewny, że chcesz zamknąć zakład "${betTitle}" z wygraną dla stawiających na "${betOptions[option - 1]}"?`;
      }
    default:
      return 'Czy na pewno chcesz zablokować możliwość stawiania nowych kuponów na ten zakład?';
  }
};
