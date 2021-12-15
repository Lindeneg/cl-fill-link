export enum AppLink {
  ADMIN_USER_ID = "/admin/user/[id]",
  ADMIN_USER_ID_DASHBOARD_VIEW = "/admin/user/[id]/dashboard/[view]",
  OPTIONAL_CATCHALL_SLUG = "/[[...slug]]",
  POSTS_CATCHALL_SLUG = "/posts/[...slug]",
  USER_OPTIONAL_CATCHALL_SLUG = "/user/[[...slug]]",
}
