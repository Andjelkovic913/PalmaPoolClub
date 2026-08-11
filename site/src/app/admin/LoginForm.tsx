"use client";

import { useActionState } from "react";
import { Button } from "@/components/Button";
import { login, type AdminState } from "./actions";

export function LoginForm() {
  const [state, formAction] = useActionState<AdminState, FormData>(login, {
    status: "idle",
  });

  return (
    <form action={formAction} className="mt-8 max-w-sm">
      <label htmlFor="admin-password" className="eyebrow text-text-muted">
        Lozinka
      </label>
      <input
        id="admin-password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        autoFocus
        className="tabular mt-1.5 w-full rounded-sm border border-border bg-surface-raised px-4 py-3 focus-visible:border-accent"
      />
      <Button type="submit" className="mt-4 w-full">
        Prijavi se
      </Button>
      {state.status === "error" && (
        <p role="alert" className="mt-3 text-sm text-float-red">
          {state.message}
        </p>
      )}
    </form>
  );
}
