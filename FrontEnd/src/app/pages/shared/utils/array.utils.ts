export function arrayToObject<T>(array: T[], selector: (obj: T) => any) {
  let obj = {};

  array.forEach((item) => {
    obj[selector(item)] = item;
  });

  return obj;
}
