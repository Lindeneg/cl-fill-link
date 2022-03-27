type PrimitiveTypeConstraint = boolean | string | number;
type Obj<T> = Record<string, T>;
type QueryConstraint = Obj<PrimitiveTypeConstraint>;
type ObjConstraint = Obj<unknown>;
type Query = { $query?: QueryConstraint };

const k = '/[admin]/user/[id]/[...ids]/[[...slugs]]';

type InferObject<
  T extends string,
  C extends ObjConstraint
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

type Replacer<T extends string, K extends ObjConstraint> = InferObject<T, K> &
  Query;

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

export function fillLinkSafe<T extends string, K extends ObjConstraint>(
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
          const val = replacer[key];
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

export function fillLink<T extends string, K extends ObjConstraint>(
  link: T,
  replacer: Replacer<T, K>
): string | null {
  try {
    return fillLinkSafe(link, replacer);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.log(err);
    }
  }
  return null;
}
