## Fill dynamic nextjs links

###### Note

This program is intended to be used with [generate-next-links](https://github.com/Lindeneg/generate-next-links) but it can be used with any input that follows nextjs [dynamic routes](https://nextjs.org/docs/routing/dynamic-routes).

It also offers a type-safe implementation.

## Install

`yarn add cl-fill-link`

---

## Usage

```ts
import { fillLink } from 'cl-fill-link';

enum AppLink {
  CUSTOMERID_SETTINGS_VIEW = '/[customerId]/settings/[view]',
  BLOG_OPTIONAL_CATCHALL_SLUG = '/blog/[[...slug]]',
}

// returns: '/some-id/settings/templates'
fillLink(AppLink.CUSTOMERID_SETTINGS_VIEW, {
  customerId: 'some-id',
  view: 'templates',
});

// returns: '/blog/category/music/jazz/miles-davis'
fillLink(AppLink.BLOG_OPTIONAL_CATCHALL_SLUG, {
  slug: ['category', 'music', 'jazz', 'miles-davis'],
});
```

## Type safety

If a key is missing, has an inappropriate type or does not exist, TypeScript will complain

```ts
// TypeScript Error:
// Property 'customerId' is missing in type '{ view: string; }'
// but required in type '{ customerId: PrimitiveTypeConstraint; }'
fillLink('/[customerId]/settings/[view]', {
  view: 'templates',
});

// TypeScript Error:
// Object literal may only specify known properties,
// but 'view2' does not exist in type
fillLink('/[customerId]/settings/[view]', {
  view2: 'templates',
  customerId: 1,
});

// TypeScript Error:
// Type 'string[]' is not assignable to
// type 'PrimitiveTypeConstraint'.
fillLink('/[customerId]/settings/[view]', {
  view: ['templates'],
  customerId: 1,
});
```

The expected type for catch-all routes is always an array of strings. For optional-catch-all routes, `[[...slug]]` an empty array is accepted, as optional catch all routes includes the index of the path, while catch all routes, `[...slug]` only accepts a non-empty array.

```ts
// OK
fillLink('/hello/[...there]', { there: ['something'] });

// TypeScript Error:
// Type 'string' is not assignable to type
// '[PrimitiveTypeConstraint, ...PrimitiveTypeConstraint[]]'
fillLink('/hello/[...there]', { there: 'something' });

// TypeScript Error:
// Source has 0 element(s) but target requires 1
fillLink('/hello/[...there]', { there: [] });

// OK
fillLink('/hello/[[...there]]', { there: [] });

// OK
fillLink('/hello/[[...there]]', { there: ['something'] });

// TypeScript Error:
// Type 'string' is not assignable to type 'PrimitiveTypeConstraint[]'
fillLink('/hello/[[...there]]', { there: 'something' });
```

## Query Params

Use the `$query` property to specify an object containing [query-parameters](https://en.wikipedia.org/wiki/Query_string). The `$` sign is prefixed to avoid collision with an actual `query` key in the link itself.

Note that properties of the `$query` object must have values of a `primitive` type.

```ts
enum AppLink {
  CATEGORYID_CONTENT_GENRE = '/[categoryId]/content/[genre]',
}

// returns: '/music/content/jazz?artist=miles-davis&tune=so-what&year=1959&autoplay=true'
fillLink(AppLink.CATEGORYID_CONTENT_GENRE, {
  categoryId: 'music',
  genre: 'jazz',
  $query: {
    artist: 'miles-davis',
    tune: 'so-what',
    year: 1959,
    autoplay: true,
  },
});
```

The parameters are each encoded into valid `URI` components and thus you can safely do stuff like this

```ts
enum AppLink {
  CATEGORYID_CONTENT_GENRE = '/[categoryId]/content/[genre]',
}

// returns: '/music/content/jazz?artist=miles%20davis&tune=so%20what%20%7C%20kind%20of%20blue&year=%5B1959%5D'
fillLink(AppLink.CATEGORYID_CONTENT_GENRE, {
  categoryId: 'music',
  genre: 'jazz',
  $query: {
    artist: 'miles davis',
    tune: 'so what | kind of blue',
    year: '[1959]',
  },
});
```

---

## Why

Nextjs natively supports the behavior this program accomplishes, as seen [here](https://nextjs.org/docs/api-reference/next/link#with-url-object). However, that is only useful within that `Link` component. Sometimes it's useful for a filled dynamic link to be constructed outside the `Link` component. This small and simple program is for exactly such a case.

---
