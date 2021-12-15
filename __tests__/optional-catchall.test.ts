import { fillLink, fillLinkSafe } from "../src/index";

type T = [string, string[], string];

const optRootArgs: T = ["/[[...slug]]", ["category"], "/category"];
const optRootEmptyArgs: T = ["/[[...slug]]", [""], "/"];
const optNestedArgs: T = [
  "/user/[[...slug]]",
  ["settings", "visual", "themes"],
  "/user/settings/visual/themes",
];

describe("Optional Catchall Test Suite", () => {
  test.each([
    ["safe", "root", fillLinkSafe, ...optRootArgs],
    ["unsafe", "root", fillLink, ...optRootArgs],
    ["safe", "root", fillLinkSafe, ...optRootEmptyArgs],
    ["unsafe", "root", fillLink, ...optRootEmptyArgs],
    ["safe", "nested", fillLinkSafe, ...optNestedArgs],
    ["unsafe", "nested", fillLink, ...optNestedArgs],
  ])(
    "%s - %s: can fill single optional catchall slug",
    (_, __, fn, link, args, expected) => {
      expect(
        fn<string, {}>(link, {
          slug: args,
        })
      ).toEqual(expected);
    }
  );
  test.each([
    ["safe", fillLinkSafe],
    ["unsafe", fillLink],
  ])("%s: can fill multiple optional catchall slugs", (_, fn) => {
    expect(
      fn("/[[...slug]]", {
        slug: ["category", "music", "jazz", "miles-davis"],
      })
    ).toEqual("/category/music/jazz/miles-davis");
  });
  test.each([
    ["safe", fillLinkSafe],
    ["unsafe", fillLink],
  ])("%s: empty optional catchall slug array is accepted", (_, fn) => {
    expect(
      fn("/[[...slug]]", {
        slug: [],
      })
    ).toEqual("/");
  });
});
