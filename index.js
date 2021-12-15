"use strict";
exports.__esModule = true;
exports.fillLink = exports.fillLinkSafe = exports.links = void 0;
var links;
(function (links) {
    links["N404"] = "/404";
    links["N500"] = "/500";
    links["ADMIN"] = "/admin";
    links["ADMIN_ADMINISTRATE"] = "/admin/administrate";
    links["ADMIN_USER"] = "/admin/user";
    links["ADMIN_USER_OPTIONS_DASHBOARD"] = "/admin/user/options/dashboard";
    links["CUSTOMER_ID_CONTENT_SLUG"] = "/customer/[id]/content/[slug]";
    links["CONTENT"] = "/content";
    links["CONTENT_ARTICLEID"] = "/content/[articleId]";
    links["POSTS_CATCHALL_SLUG"] = "/posts/[...slug]";
    links["USER_OPTIONAL_CATCHALL_SLUG"] = "/user/[[...slug]]";
})(links = exports.links || (exports.links = {}));
var fillLinkSafe = function (link, replacer) {
    return link
        .split("/")
        .map(function (e) {
        var matches = /\[{1,2}\.{0,3}(\w+)\]{1,2}/.exec(e);
        if (matches && matches.length > 1) {
            var key = matches[1];
            var val = replacer[key];
            if (typeof val !== "undefined") {
                return Array.isArray(val) ? val.join("/") : val;
            }
            else {
                throw new Error("Warning: key '".concat(key, "' is missing from replacer object in link '").concat(link, "'"));
            }
        }
        return e;
    })
        .join("/");
};
exports.fillLinkSafe = fillLinkSafe;
var fillLink = function (link, replacer) {
    try {
        return (0, exports.fillLinkSafe)(link, replacer);
    }
    catch (err) {
        process.env.NODE_ENV !== "production" &&
            err.message &&
            console.log(err.message);
        return link;
    }
};
exports.fillLink = fillLink;
console.log(links.CUSTOMER_ID_CONTENT_SLUG);
console.log((0, exports.fillLink)(links.CUSTOMER_ID_CONTENT_SLUG, {
    slug: "davis"
}));
console.log();
console.log(links.USER_OPTIONAL_CATCHALL_SLUG);
console.log((0, exports.fillLink)(links.USER_OPTIONAL_CATCHALL_SLUG, {
    slug: ["hello", "there", "man"]
}));
