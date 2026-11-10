const secure = process.env.NODE_ENV === "production";
const sameSite = (process.env.COOKIE_SAME_SITE || (secure ? "none" : "strict")).toLowerCase();

if (!["strict", "lax", "none"].includes(sameSite) || (sameSite === "none" && !secure)) {
    throw new Error("COOKIE_SAME_SITE must be strict, lax, or none; none requires production HTTPS.");
}

const sharedOptions = { httpOnly: true, secure, sameSite, path: "/" };
module.exports = {
    authCookieOptions: { ...sharedOptions, maxAge: 3 * 24 * 60 * 60 * 1000 },
    clearAuthCookieOptions: sharedOptions,
};
