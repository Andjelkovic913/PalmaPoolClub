"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Check, X } from "lucide-react";
import { Button } from "@/components/Button";
import { decide, type DecisionState } from "./actions";

/**
 * Prihvati / Odbij, as two submit buttons in one form.
 *
 * Both post the same action with a different `answer`, so the decision is a
 * real POST rather than a link — see the note in actions.ts about mail clients
 * prefetching URLs.
 */
export function DecisionButtons({ token }: { token: string }) {
  const [state, formAction] = useActionState<DecisionState, FormData>(decide, {
    status: "idle",
  });

  if (state.status === "done") {
    return (
      <div
        role="status"
        className="mt-8 rounded-sm border border-accent/40 bg-accent/5 px-5 py-4"
      >
        <p className="font-display text-xl">
          {state.answer === "confirmed"
            ? "Rezervacija je potvrđena."
            : "Zahtev je odbijen."}
        </p>
        <p className="mt-2 text-sm text-text-muted">
          {state.emailed
            ? "Gost je obavešten e-mailom."
            : "Odluka je sačuvana, ali e-mail gostu nije poslat. Pozovite gosta ili proverite podešavanja e-maila."}
        </p>
      </div>
    );
  }

  if (state.status === "already") {
    return (
      <p className="mt-8 rounded-sm border border-border bg-surface px-5 py-4">
        Na ovaj zahtev je već odgovoreno.
      </p>
    );
  }

  if (state.status === "notfound") {
    return (
      <p className="mt-8 rounded-sm border border-border bg-surface px-5 py-4">
        Zahtev nije pronađen. Link je možda istekao ili je već obrađen.
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-8">
      <input type="hidden" name="token" value={token} />
      <div className="flex flex-wrap gap-3">
        <Submit value="confirmed" variant="primary">
          <Check size={16} aria-hidden />
          Prihvati
        </Submit>
        <Submit value="rejected" variant="secondary">
          <X size={16} aria-hidden />
          Odbij
        </Submit>
      </div>
      {state.status === "error" && (
        <p role="alert" className="mt-3 text-sm text-float-red">
          {state.message}
        </p>
      )}
    </form>
  );
}

function Submit({
  value,
  variant,
  children,
}: {
  value: "confirmed" | "rejected";
  variant: "primary" | "secondary";
  children: React.ReactNode;
}) {
  /* Disables BOTH buttons while either is in flight — otherwise a quick
     double-press could fire Prihvati and Odbij on the same booking. The
     transaction in decideBooking() would reject the second, but the owner
     should not see a race at all. */
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      name="answer"
      value={value}
      variant={variant}
      disabled={pending}
      className="disabled:cursor-wait disabled:hover:translate-y-0 disabled:hover:scale-100"
    >
      {children}
    </Button>
  );
}
