// The single permanent main admin, identified by email.
export const SUPERADMIN_EMAIL = "admin@plasma.com";

// Is this user the superadmin? (checks email — the source of truth)
export const isSuperadmin = (user) =>
  !!user && user.email === SUPERADMIN_EMAIL;

// Is this user any kind of admin (admin or superadmin)?
export const isAdmin = (user) =>
  !!user && (user.role === "admin" || user.role === "superadmin");

// Is this EMAIL the superadmin's? (when you only have the email, not the user)
export const isSuperadminEmail = (email) => email === SUPERADMIN_EMAIL;

// Is this role an admin-level role?
export const isAdminRole = (role) => role === "admin" || role === "superadmin";