type PermissionAction =
  | "view"
  | "add"
  | "edit"
  | "delete"
  | "import"
  | "export";

export const canAccess = (
  user: any,
  module: string,
  actions: PermissionAction | PermissionAction[],
  mode: "any" | "all" = "any"
) => {
  if (!user) return false;

  // Super Admin bypass
  if (user.role_id === 0) return true;

  const moduleAccess = user?.permissions?.[module];
  console.log("moduleAccess",moduleAccess)
  if (!moduleAccess) return false;

  const actionList = Array.isArray(actions) ? actions : [actions];
console.log("actionList",actionList)
  return mode === "all"
    ? actionList.every((a) => moduleAccess[a])
    : actionList.some((a) => moduleAccess[a]);
};