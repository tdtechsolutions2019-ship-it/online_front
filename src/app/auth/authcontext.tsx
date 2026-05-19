/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

type User = {
  role_id: number;
  permissions?: any[];
};

type AuthContextType = {
  user: User | null;
  isSuperAdmin: boolean;
  hasPermission: (module: string, action: string) => boolean;
};
type PermissionAction = "view" | "add" | "edit" | "delete" | "import" | "export";
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const userData = useSelector((state: any) => state.login.user);
  useEffect(() => {
    const storedUser = userData ? JSON.stringify(userData) : localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isSuperAdmin = user?.role_id === 0;
  const centerowner = user?.role_id === 1

  const hasPermission = (
    module: string,
    actions: PermissionAction,
    mode: "any" | "all" = "any"
  ) => {
    if (isSuperAdmin) return true;

    const moduleAccess = user?.permissions?.[module];
    if (!moduleAccess) return false;

    const actionList = Array.isArray(actions) ? actions : [actions];

    return mode === "all"
      ? actionList.every((a) => moduleAccess[a])
      : actionList.some((a) => moduleAccess[a]);
  };

  return (
    <AuthContext.Provider value={{ user, isSuperAdmin, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;