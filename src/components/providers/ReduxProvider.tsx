"use client";

import { Provider, useDispatch } from "react-redux";
import store from "@/store";
import { useEffect, useState } from "react";
import { authActions } from "@/store/auth";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("id");
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (id && token && role) {
        dispatch(authActions.login());
        dispatch(authActions.changeRole(role));
      }
    }
    setInitialized(true);
  }, [dispatch]);

  // Render children immediately to avoid blocking SSR entirely,
  // but auth check will hydrate as soon as layout mounts.
  return <>{children}</>;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}
