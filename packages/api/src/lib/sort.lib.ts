/* eslint-disable @typescript-eslint/no-explicit-any */
export const compareByKey =
  <T extends Record<string | number, any>>(key: keyof T, direction: "asc" | "desc") =>
  (a: T, b: T): number => {
    const fieldA = a[key];
    const fieldB = b[key];

    let comparison = 0;
    if (fieldA > fieldB) {
      comparison = 1;
    } else if (fieldA < fieldB) {
      comparison = -1;
    }

    return direction === "asc" ? comparison : -comparison;
  };
