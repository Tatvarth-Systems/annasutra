"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock, LogIn, User } from "lucide-react";
import { useT } from "@/lib/i18n/provider";
import { CREDENTIALS } from "@/config/credentials";
import { writeSessionCookie } from "@/lib/auth/session";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function SignInPage() {
  const t = useT();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      username === CREDENTIALS.username &&
      password === CREDENTIALS.password
    ) {
      writeSessionCookie(username);
      router.replace("/welcome");
      return;
    }

    setError(true);
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm">
        <h1 className="text-xl font-semibold text-ink">{t("auth.title")}</h1>
        <p className="mt-1 text-sm text-muted">{t("auth.subtitle")}</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Field label={t("auth.username")} htmlFor="username" required>
            <Input
              id="username"
              name="username"
              autoComplete="username"
              icon={User}
              value={username}
              invalid={error}
              onChange={(event) => {
                setUsername(event.target.value);
                setError(false);
              }}
            />
          </Field>

          <Field label={t("auth.password")} htmlFor="password" required>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              icon={Lock}
              value={password}
              invalid={error}
              onChange={(event) => {
                setPassword(event.target.value);
                setError(false);
              }}
            />
          </Field>

          {error ? (
            <p className="text-sm text-danger">
              {t("auth.invalidCredentials")}
            </p>
          ) : null}

          <Button type="submit" className="w-full">
            <LogIn className="h-4 w-4" />
            {t("auth.signIn")}
          </Button>
        </form>
      </Card>
    </main>
  );
}
