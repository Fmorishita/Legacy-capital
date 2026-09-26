"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeSlash, CheckCircle } from "@phosphor-icons/react";
import { changePasswordAction, loginAction, registerAction } from "@/lib/cap/actions";
import { Alert } from "@/components/cap/Alert";

function PasswordInput({ name, label, autoComplete, hint, min = 8 }: { name: string; label: string; autoComplete: string; hint?: string; min?: number }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={name} className="cap-label">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={show ? "text" : "password"}
          required
          minLength={min}
          autoComplete={autoComplete}
          className="cap-input pr-12"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute inset-y-0 right-0 grid w-12 place-items-center text-muted hover:text-navy"
          aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {show ? <EyeSlash className="size-5" aria-hidden /> : <Eye className="size-5" aria-hidden />}
        </button>
      </div>
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function Submit({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button type="submit" disabled={pending} className="cap-btn cap-btn-primary w-full">
      {pending ? "Un momento…" : children}
    </button>
  );
}

export function LoginForm({ next, notice }: { next?: string; notice?: string }) {
  const [state, action, pending] = useActionState(loginAction, undefined);
  return (
    <form action={action} className="grid gap-5">
      {notice && <Alert tone="ok">{notice}</Alert>}
      {state && !state.ok && <Alert>{state.error}</Alert>}
      <input type="hidden" name="next" value={next ?? ""} />
      <div>
        <label htmlFor="correo" className="cap-label">
          Correo
        </label>
        <input id="correo" name="correo" type="email" required autoComplete="email" inputMode="email" className="cap-input" />
      </div>
      <PasswordInput name="password" label="Contraseña" autoComplete="current-password" min={1} />
      <Submit pending={pending}>Entrar</Submit>
      <p className="text-center text-sm text-muted">
        ¿Aún no tienes cuenta?{" "}
        <Link href="/capacitacion/registro" className="font-semibold text-navy underline-offset-4 hover:underline">
          Regístrate
        </Link>
      </p>
      <p className="text-center text-xs leading-relaxed text-muted">
        ¿Olvidaste tu contraseña? Pide al administrador que te genere una temporal.
      </p>
    </form>
  );
}

export function RegisterForm({ modo }: { modo: "codigo" | "aprobacion" | "ambos" }) {
  const [state, action, pending] = useActionState(registerAction, undefined);

  if (state?.ok && state.message === "pendiente") {
    return (
      <div className="cap-card p-6 text-center">
        <CheckCircle className="mx-auto size-10 text-ok" weight="duotone" aria-hidden />
        <p className="cap-title mt-3 text-2xl">Recibimos tu registro</p>
        <p className="mt-3 text-sm leading-relaxed text-ink">
          Tu cuenta queda pendiente de aprobación. En cuanto el administrador la active podrás entrar con tu correo y
          contraseña.
        </p>
        <Link href="/capacitacion/entrar" className="cap-btn cap-btn-ghost mt-6">
          Ir a entrar
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-5">
      {state && !state.ok && <Alert>{state.error}</Alert>}
      <div>
        <label htmlFor="nombre" className="cap-label">
          Nombre completo
        </label>
        <input id="nombre" name="nombre" required minLength={2} maxLength={120} autoComplete="name" className="cap-input" />
        <p className="mt-1.5 text-xs text-muted">Así aparecerá en tu certificado.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="correo" className="cap-label">
            Correo
          </label>
          <input id="correo" name="correo" type="email" required autoComplete="email" inputMode="email" className="cap-input" />
        </div>
        <div>
          <label htmlFor="telefono" className="cap-label">
            Teléfono (WhatsApp)
          </label>
          <input id="telefono" name="telefono" type="tel" required autoComplete="tel" inputMode="tel" className="cap-input" />
        </div>
      </div>
      <PasswordInput name="password" label="Contraseña" autoComplete="new-password" hint="Mínimo 8 caracteres." />
      <PasswordInput name="confirmar" label="Confirma tu contraseña" autoComplete="new-password" />
      {modo !== "aprobacion" && (
        <div>
          <label htmlFor="codigo" className="cap-label">
            Código de invitación {modo === "ambos" && <span className="font-normal text-muted">(opcional)</span>}
          </label>
          <input
            id="codigo"
            name="codigo"
            required={modo === "codigo"}
            autoComplete="off"
            autoCapitalize="characters"
            placeholder="XXXX-XXXX"
            className="cap-input uppercase tracking-[0.12em]"
          />
          <p className="mt-1.5 text-xs text-muted">
            {modo === "codigo"
              ? "Te lo da el administrador de Legacy Capital."
              : "Con código entras de inmediato. Sin código, tu registro queda pendiente de aprobación."}
          </p>
        </div>
      )}
      <Submit pending={pending}>Crear mi cuenta</Submit>
      <p className="text-center text-sm text-muted">
        ¿Ya tienes cuenta?{" "}
        <Link href="/capacitacion/entrar" className="font-semibold text-navy underline-offset-4 hover:underline">
          Entra aquí
        </Link>
      </p>
    </form>
  );
}

export function PasswordForm({ forced }: { forced: boolean }) {
  const [state, action, pending] = useActionState(changePasswordAction, undefined);
  return (
    <form action={action} className="grid gap-5">
      {forced && <Alert tone="warn">Estás usando una contraseña temporal. Crea una nueva para continuar.</Alert>}
      {state && !state.ok && <Alert>{state.error}</Alert>}
      <PasswordInput name="actual" label={forced ? "Contraseña temporal" : "Contraseña actual"} autoComplete="current-password" min={1} />
      <PasswordInput name="nueva" label="Nueva contraseña" autoComplete="new-password" hint="Mínimo 8 caracteres." />
      <PasswordInput name="confirmar" label="Confirma la nueva contraseña" autoComplete="new-password" />
      <Submit pending={pending}>Guardar contraseña</Submit>
    </form>
  );
}
