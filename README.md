## Fill dynamic nextjs links

###### Note

This program is intended to be used with [generate-next-links](https://github.com/Lindeneg/generate-next-links) but it can be used with any input that follows nextjs [dynamic routes](https://nextjs.org/docs/routing/dynamic-routes).

## Install

`yarn add cl-fill-link`

---

## Usage

```ts
enum AppLink {
  ...
  CUSTOMERID_SETTINGS_VIEW = "/[customerId]/settings/[view]",
  BLOG_OPTIONAL_CATCHALL_SLUG = "/blog/[[...slug]]",
  ...
}

// returns: '/some-id/settings/templates'
fillLink(AppLink.CUSTOMERID_SETTINGS_VIEW, {
    customerId: "some-id",
    view: "templates"
  }
)

// returns: '/blog/category/music/jazz/miles-davis'
fillLink(AppLink.BLOG_OPTIONAL_CATCHALL_SLUG, {
    slug: ["category", "music", "jazz", "miles-davis"]
  }
);
```

However, if a key is missing, an error is not thrown by default. If this behavior is desired, use `fillLinkSafe`.

```ts
enum AppLink {
  ...
  CUSTOMERID_SETTINGS_VIEW = '/[customerId]/settings/[view]',
  ...
}

// throws an error
fillLinkSafe(AppLink.CUSTOMERID_SETTINGS_VIEW, {
  view: 'templates',
});

// does not throw an error, returns null
fillLink(AppLink.CUSTOMERID_SETTINGS_VIEW, {
  view: 'templates',
});
```

## Query Params

Use the `$query` property to specify [query-parameters](https://en.wikipedia.org/wiki/Query_string)

```ts
enum AppLink {
  ...
  CATEGORYID_CONTENT_GENRE = '/[categoryId]/content/[genre]',
  ...
}

// returns: '/music/content/jazz?artist=miles-davis&tune=so-what&year=1959&autoplay=true'
fillLink(AppLink.CUSTOMERID_SETTINGS_VIEW, {
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

---

## Type safety

There's a bit of type-safety as well. If an unknown key is specified in the replacer object, TS will throw an error:

```ts
// OK
fillLink('/hello/[there]', { there: 'something' });

// Error on `hello` key:
// Type 'string' is not assignable to type 'never'
fillLink('/hello/[there]', { there: 'something', hello: 'something-else ' });
```

Also on catch-all routes, the type expected is always an array of strings. For optional-catch-all routes, `[[...slug]]` an empty array is accepted, as optional catch all routes includes the index of the path, while catch all routes, `[...slug]` only accepts a non-empty array.

```ts
// OK
fillLink('/hello/[...there]', { there: ['something'] });

// Error on `there` key:
// Type 'string' is not assignable to type '[string, ...string[]]'
fillLink('/hello/[...there]', { there: 'something' });

// Error on `there` key:
// Source has 0 element(s) but target requires 1
fillLink('/hello/[...there]', { there: [] });

// OK
fillLink('/hello/[[...there]]', { there: [] });

// OK
fillLink('/hello/[[...there]]', { there: ['something'] });

// Error on `there` key:
// Type 'string' is not assignable to type 'string[]'
fillLink('/hello/[[...there]]', { there: 'something' });
```

---

## Why

Nextjs natively supports the behavior this program accomplishes, as seen [here](https://nextjs.org/docs/api-reference/next/link#with-url-object). However, that is only useful within that `Link` component. Sometimes it's useful for a filled dynamic link to be constructed outside the `Link` component. This small and simple program is for exactly such a case.

---
