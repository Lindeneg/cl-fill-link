## Fill dynamic nextjs links

## Install

###### Note

This program is intended to be with [generate-next-links](https://github.com/Lindeneg/generate-next-links) but it can be used with any input that follows [nextjs](https://nextjs.org/docs/routing/dynamic-routes) dynamic route structure.

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
  CUSTOMERID_SETTINGS_VIEW = "/[customerId]/settings/[view]",
  ...
}

// throws an error
fillLinkSafe(AppLink.CUSTOMERID_SETTINGS_VIEW, {
    view: "templates"
  }
);

// does not throw an error, returns the first argument untouched
fillLink(AppLink.CUSTOMERID_SETTINGS_VIEW, {
    view: "templates"
  }
);
```

---

## Why

The `Link` component offered by nextjs natively supports the behavior this program accomplishes, as seen [here](https://nextjs.org/docs/api-reference/next/link#with-url-object). However, that is only useful within that `Link` component. Sometimes it's useful for a filled dynamic link to be constructed outside the `Link` component. This small and simple program is for exactly such a case.

---
