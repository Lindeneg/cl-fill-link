type PrimitiveTypeConstraint = boolean | string | number | Date;

type Obj = Record<string, PrimitiveTypeConstraint>;
type Query = { $query?: Obj };

type ReplacerValue<T extends string, K extends unknown> = K extends string
  ? T extends `${infer U}[...${K}]`
    ? [PrimitiveTypeConstraint, ...PrimitiveTypeConstraint[]]
    : T extends `${infer P}[[...${K}]]`
    ? PrimitiveTypeConstraint[]
    : T extends `${infer M}[${K}]${infer N}`
    ? PrimitiveTypeConstraint
    : never
  : never;

type Replacer<T extends string, U extends Obj> = {
  [K in keyof U]: ReplacerValue<T, K>;
} & Query;

function getString(target: unknown): string {
  try {
    return String(target);
  } catch (_) {
    return '';
  }
}

function appendQuery<T extends Query>(l: string, query?: T): string {
  const keys = Object.keys(query || []);
  let q = '';
  if (query && keys.length > 0) {
    q += '?';
    const keys = Object.keys(query);
    const length = keys.length - 1;
    keys.forEach((key, idx) => {
      const val = getString(query[<keyof T>key]);
      q += key + '=' + val;
      if (idx < length) {
        q += '&';
      }
    });
  }
  return l + q;
}

export function fillLinkSafe<T extends string, K extends Obj>(
  link: T,
  replacer: Replacer<T, K>
): string {
  return appendQuery(
    link
      .split('/')
      .map((e) => {
        const matches = /\[{1,2}\.{0,3}(\w+)\]{1,2}/.exec(e);
        if (matches && matches.length > 1) {
          const key = matches[1];
          const val = getString(replacer[key]);
          if (typeof val !== 'undefined') {
            return Array.isArray(val) ? val.join('/') : val;
          } else {
            throw new Error(
              "Error: key '" +
                key +
                "' is missing from replacer object in link '" +
                link +
                "'"
            );
          }
        }
        return e;
      })
      .join('/'),
    replacer?.$query || {}
  );
}

export function fillLink<T extends string, K extends Obj>(
  link: T,
  replacer: Replacer<T, K>
): string | null {
  try {
    return fillLinkSafe(link, replacer);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.log(err);
    }
    return null;
  }
}
