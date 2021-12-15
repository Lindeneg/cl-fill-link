import { fillLink, fillLinkSafe } from "../src/index";
import { AppLink } from "./shared";

type T = [string, string[], string];

const optRootArgs: T = [
  AppLink.OPTIONAL_CATCHALL_SLUG,
  ["category"],
  "/category",
];
const optRootEmptyArgs: T = [AppLink.OPTIONAL_CATCHALL_SLUG, [""], "/"];
const optNestedArgs: T = [
  AppLink.USER_OPTIONAL_CATCHALL_SLUG,
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
      fn(AppLink.OPTIONAL_CATCHALL_SLUG, {
        slug: ["category", "music", "jazz", "miles-davis"],
      })
    ).toEqual("/category/music/jazz/miles-davis");
  });
  test.each([
    ["safe", fillLinkSafe],
    ["unsafe", fillLink],
  ])("%s: empty optional catchall slug array is accepted", (_, fn) => {
    expect(
      fn(AppLink.OPTIONAL_CATCHALL_SLUG, {
        slug: [],
      })
    ).toEqual("/");
  });
});
