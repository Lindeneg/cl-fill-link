type PrimitiveTypeConstraint = boolean | string | number;
type Obj<T> = Record<string, T>;
type QueryConstraint = Obj<PrimitiveTypeConstraint>;
type ObjConstraint = Obj<unknown>;
type Query = { $query?: QueryConstraint };

export type InferObject<
  T extends string,
  C extends ObjConstraint = {}
> = T extends `${infer K}[[...${infer U}]]${infer O}`
  ? InferObject<`${K}${O}`, { [I in U]: PrimitiveTypeConstraint[] } & C>
  : T extends `${infer K}[...${infer U}]${infer O}`
  ? InferObject<
      `${K}${O}`,
      { [I in U]: [PrimitiveTypeConstraint, ...PrimitiveTypeConstraint[]] } & C
    >
  : T extends `${infer K}[${infer U}]${infer O}`
  ? InferObject<`${K}${O}`, { [I in U]: PrimitiveTypeConstraint } & C>
  : C;

export type Replacer<T extends string> = InferObject<T> & Query;

function getString(target: unknown): string {
  try {
    return String(target);
  } catch (_) {
    return '';
  }
}

function appendQuery<T extends Query>(l: string, query?: T): string {
  const keys = Object.keys(query || {});
  let q = '';
  if (query && keys.length > 0) {
    q += '?';
    const length = keys.length - 1;
    keys.forEach((key, idx) => {
      const val = encodeURIComponent(getString(query[<keyof T>key]));
      q += key + '=' + val;
      if (idx < length) {
        q += '&';
      }
    });
  }
  return l + q;
}

export function fillLink<T extends string>(
  link: T,
  replacer: Replacer<T>
): string {
  return appendQuery(
    link
      .split('/')
      .map((e) => {
        const matches = /\[{1,2}\.{0,3}(\w+)\]{1,2}/.exec(e);
        if (matches && matches.length > 1) {
          const key = matches[1];
          const val = replacer[<keyof Replacer<T>>key];
          if (typeof val !== 'undefined') {
            return Array.isArray(val) ? val.join('/') : getString(val);
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
    replacer?.$query
  );
}

export function fillLinkSafe<T extends string>(
  link: T,
  replacer: Replacer<T>
): string | null {
  try {
    return fillLink(link, replacer);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.log(err);
    }
  }
  return null;
}
