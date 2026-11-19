import MD5 from "crypto-js/md5";

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortValue);
  }

  if (value && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((result, key) => {
        result[key] = sortValue((value as Record<string, unknown>)[key]);
        return result;
      }, {});
  }

  return value;
}

export function createCacheKey(input: unknown) {
  const normalized = typeof input === "string" ? input : JSON.stringify(sortValue(input));
  return MD5(normalized).toString();
}
