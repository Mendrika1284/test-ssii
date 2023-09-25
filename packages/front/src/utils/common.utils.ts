export function onlyNumber(value: string): boolean {
  const re = new RegExp(/^\d+$/);
  return re.test(value);
}

export const countDecimals = function (value: number): number {
  let numberDecimals = 0;
  if (!value) {
    return 0;
  }
  const amount = value.toString().replace(",", ".");
  if (amount.includes(".")) {
    numberDecimals = amount.split(".")[1].length;
  }

  return numberDecimals;
};

export const formatDate = (date: string | undefined): string => {
  if (!date || date === "") {
    return "";
  } else {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  }
};

export const numberWithSpaces = (number: string | number) =>
  number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
