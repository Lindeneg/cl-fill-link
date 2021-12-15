type Obj = Record<string, unknown>;

type ReplacerValue<T extends string, K extends unknown> = K extends string
  ? T extends `${infer U}[...${K}]`
    ? [string, ...string[]]
    : T extends `${infer P}[[...${K}]]`
    ? string[]
    : string
  : never;

type Replacer<T extends string, U extends Obj> = {
  [K in keyof U]: ReplacerValue<T, K>;
};

export function fillLinkSafe<T extends string, K extends Obj>(
  link: T,
  replacer: Replacer<T, K>
) {
  return link
    .split("/")
    .map((e) => {
      const matches = /\[{1,2}\.{0,3}(\w+)\]{1,2}/.exec(e);
      if (matches && matches.length > 1) {
        const key = matches[1];
        const val = replacer[key];
        if (typeof val !== "undefined") {
          return Array.isArray(val) ? val.join("/") : val;
        } else {
          throw new Error(
            `Warning: key '${key}' is missing from replacer object in link '${link}'`
          );
        }
      }
      return e;
    })
    .join("/");
}

export function fillLink<T extends string, K extends Obj>(
  link: T,
  replacer: Replacer<T, K>
) {
  try {
    return fillLinkSafe(link, replacer);
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.log(err);
    }
    return link;
  }
}
