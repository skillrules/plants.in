export const formatINR = (value: number) =>
  `₹${new Intl.NumberFormat("en-IN").format(Math.round(value))}`;
