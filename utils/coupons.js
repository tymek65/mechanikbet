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
