import { fillLink, fillLinkSafe } from "../src/index";
import { AppLink } from "./shared";

describe("Standard Test Suite", () => {
  test("safe: can fill single key", () => {
    expect(fillLinkSafe(AppLink.ADMIN_USER_ID, { id: "1" })).toEqual(
      "/admin/user/1"
    );
  });
  test("safe: can fill nested keys", () => {
    expect(
      fillLinkSafe(AppLink.ADMIN_USER_ID_DASHBOARD_VIEW, {
        id: "1",
        view: "analytics",
      })
    ).toEqual("/admin/user/1/dashboard/analytics");
  });
  test("safe: throws error on missing nested keys", () => {
    expect(() =>
      fillLinkSafe(AppLink.ADMIN_USER_ID_DASHBOARD_VIEW, {
        view: "analytics",
      })
    ).toThrow(
      "Error: key 'id' is missing from replacer object in link '/admin/user/[id]/dashboard/[view]'"
    );
  });
  test("safe: throws error on missing single key", () => {
    expect(() => fillLinkSafe(AppLink.ADMIN_USER_ID, {})).toThrow(
      "Error: key 'id' is missing from replacer object in link '/admin/user/[id]'"
    );
  });
  test("unsafe: can fill single key", () => {
    expect(fillLink(AppLink.ADMIN_USER_ID, { id: "1", })).toEqual(
      "/admin/user/1"
    );
  });
  test("unsafe: can fill nested keys", () => {
    expect(
      fillLink(AppLink.ADMIN_USER_ID_DASHBOARD_VIEW, {
        id: "1",
        view: "analytics",
      })
    ).toEqual("/admin/user/1/dashboard/analytics");
  });
  test("unsafe: does not throw error on missing single key", () => {
    expect(fillLink(AppLink.ADMIN_USER_ID, {})).toEqual("/admin/user/[id]");
  });
  test("unsafe: does not throw error on missing nested keys", () => {
    expect(
      fillLink(AppLink.ADMIN_USER_ID_DASHBOARD_VIEW, { view: "analytics" })
    ).toEqual("/admin/user/[id]/dashboard/[view]");
  });
  test("all: defined but empty value is accepted", () => {
    expect(fillLink(AppLink.ADMIN_USER_ID, { id: "" })).toEqual("/admin/user/");
  });
});
