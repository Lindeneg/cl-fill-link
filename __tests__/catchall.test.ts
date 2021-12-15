import { fillLink, fillLinkSafe } from "../src/index";
import { AppLink } from "./shared";

describe("Catchall Test Suite", () => {
  test.each([
    ["safe", fillLinkSafe],
    ["unsafe", fillLink],
  ])("%s: can fill single catchall slug", (_, fn) => {
    expect(
      fn(AppLink.POSTS_CATCHALL_SLUG, {
        slug: ["category"],
      })
    ).toEqual("/posts/category");
  });
  test.each([
    ["safe", fillLinkSafe],
    ["unsafe", fillLink],
  ])("%s: can fill multiple catchall slugs", (_, fn) => {
    expect(
      fn(AppLink.POSTS_CATCHALL_SLUG, {
        slug: ["category", "music", "jazz", "miles-davis"],
      })
    ).toEqual("/posts/category/music/jazz/miles-davis");
  });
});
