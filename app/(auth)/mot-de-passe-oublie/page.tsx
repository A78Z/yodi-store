"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, Eye, EyeOff, KeyRound, LoaderCircle, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sanitizeVerificationCode } from "@/lib/registration-form";
import { passwordResetError, passwordResetPayload, type PasswordResetFields } from "@/lib/password-recovery";
import auth from "../connexion/page.module.css";
import styles from "./page.module.css";

const emptyFields: PasswordResetFields = { code: "", password: "", confirmPassword: "" };

export default function ResetPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "reset" | "complete">("email");
  const [email, setEmail] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [fields, setFields] = useState(emptyFields);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [busy, setBusy] = useState<"send" | "reset" | null>(null);
  const request = useRef(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const errorRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (redirectTimer.current) clearTimeout(redirectTimer.current); }, []);

  function showError(message: string) {
    setError(message);
    requestAnimationFrame(() => errorRef.current?.focus());
  }

  async function handleSendCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (request.current || step !== "email") return;
    request.current = true;
    setBusy("send");
    setError("");
    setNotice("");
    const requestedEmail = email.trim();
    try {
      const response = await fetch("/api/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: requestedEmail }) });
      const data = await response.json();
      if (!response.ok) { showError(data.message || "Le code n’a pas pu être envoyé. Veuillez réessayer."); return; }
      setRecoveryEmail(requestedEmail);
      setFields(emptyFields);
      setStep("reset");
      requestAnimationFrame(() => codeRef.current?.focus());
    } catch { showError("L’envoi est momentanément indisponible. Veuillez réessayer dans quelques instants."); }
    finally { request.current = false; setBusy(null); }
  }

  async function handleReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (request.current || step !== "reset") return;
    setError("");
    const validationError = passwordResetError(fields);
    if (validationError) { showError(validationError); return; }
    request.current = true;
    setBusy("reset");
    try {
      const response = await fetch("/api/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(passwordResetPayload(recoveryEmail, fields)) });
      const data = await response.json();
      if (!response.ok) { showError(data.message || "Le mot de passe n’a pas pu être réinitialisé. Veuillez réessayer."); return; }
      setFields(emptyFields);
      setShowPassword(false);
      setShowConfirmation(false);
      setStep("complete");
      requestAnimationFrame(() => successRef.current?.focus());
      redirectTimer.current = setTimeout(() => router.push("/connexion"), 2000);
    } catch { showError("La réinitialisation est momentanément indisponible. Veuillez réessayer."); }
    finally { request.current = false; setBusy(null); }
  }

  function restart() {
    if (request.current) return;
    setFields(emptyFields);
    setShowPassword(false);
    setShowConfirmation(false);
    setError("");
    setNotice("Vérifiez votre adresse, puis cliquez sur « Envoyer le code » pour demander un nouveau code.");
    setStep("email");
    requestAnimationFrame(() => emailRef.current?.focus());
  }

  return <main className={auth.page}><div className={auth.container}>
    <nav className={auth.breadcrumb} aria-label="Fil d’Ariane"><Link href="/">Accueil</Link><ChevronRight size={12} aria-hidden="true" /><Link href="/connexion">Connexion</Link><ChevronRight size={12} aria-hidden="true" /><span aria-current="page">Mot de passe oublié</span></nav>
    <div className={`${auth.layout} ${styles.layout}`}>
      <section className={auth.welcome} aria-labelledby="recovery-title">
        <p className={auth.eyebrow}>Maison Yodi-K · Votre compte</p>
        <h1 id="recovery-title">Retrouvez votre espace<span aria-hidden="true">.</span></h1>
        <p className={auth.intro}>Un mot de passe oublié ? Reprenons simplement l’accès à votre compte.</p>
        <ol className={auth.features} aria-label="Étapes de récupération">
          <li aria-current={step === "email" ? "step" : undefined}><Mail size={21} strokeWidth={1.3} aria-hidden="true" /><div><strong>01 · Recevez votre code</strong><p>Utilisez l’adresse email associée à votre compte.</p></div></li>
          <li aria-current={step === "reset" ? "step" : undefined}><KeyRound size={21} strokeWidth={1.3} aria-hidden="true" /><div><strong>02 · Choisissez un mot de passe</strong><p>Renseignez le code reçu et votre nouveau mot de passe.</p></div></li>
        </ol>
        <Link href="/connexion" className={auth.back}><ArrowLeft size={16} aria-hidden="true" />Retour à la connexion</Link>
      </section>
      <section className={auth.card} aria-labelledby="form-title">
        <p className={auth.eyebrow}>{step === "complete" ? "Votre compte" : step === "email" ? "Étape 01 · Votre adresse email" : "Étape 02 · Votre nouveau mot de passe"}</p>
        <h2 id="form-title">{step === "complete" ? "Mot de passe mis à jour." : step === "email" ? "Recevoir un code" : "Nouveau mot de passe"}</h2>
        <p className={auth.description}>{step === "complete" ? "Vous pouvez maintenant retrouver votre compte." : step === "email" ? "Saisissez votre adresse email pour demander un code de récupération." : "Saisissez le code reçu, puis choisissez votre nouveau mot de passe."}</p>
        {step === "complete" ? <div ref={successRef} tabIndex={-1} role="status" className={styles.success}><CheckCircle2 size={30} strokeWidth={1.4} aria-hidden="true" /><p>Votre mot de passe a été réinitialisé. Vous allez être redirigé vers la connexion.</p><Link className={auth.primary} href="/connexion">Se connecter<ArrowRight size={17} aria-hidden="true" /></Link></div> : <>
          {error && <div className={auth.error} ref={errorRef} role="alert" tabIndex={-1}><p>{error}</p></div>}
          {step === "email" ? <form onSubmit={handleSendCode} aria-label="Demander un code de récupération" aria-busy={busy === "send"}>
            {notice && <p className={styles.notice} role="status">{notice}</p>}
            <fieldset className={auth.fields} disabled={!!busy}><legend className={auth.srOnly}>Votre adresse email</legend><div className={auth.field}><label htmlFor="email">Adresse email</label><input ref={emailRef} id="email" name="email" type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="votre@email.com" aria-describedby="email-help" /><p id="email-help" className={styles.help}>Ce champ est obligatoire.</p></div></fieldset>
            <button type="submit" disabled={!!busy} className={`${auth.primary} ${styles.submit}`}>{busy === "send" ? <><LoaderCircle size={18} className={auth.spinner} aria-hidden="true" />Envoi en cours…</> : <>Envoyer le code<ArrowRight size={17} aria-hidden="true" /></>}</button>
          </form> : <form onSubmit={handleReset} aria-label="Choisir un nouveau mot de passe" aria-busy={busy === "reset"}>
            <div className={styles.sent} role="status"><Mail size={20} strokeWidth={1.4} aria-hidden="true" /><p>Un code de récupération a été envoyé à <strong>{recoveryEmail}</strong>.</p></div>
            <fieldset className={auth.fields} disabled={!!busy}><legend className={auth.srOnly}>Code et nouveau mot de passe</legend>
              <div className={auth.field}><label htmlFor="code">Code de récupération</label><input ref={codeRef} id="code" name="code" className={styles.code} inputMode="numeric" autoComplete="one-time-code" maxLength={6} pattern="[0-9]{6}" required value={fields.code} onChange={(event) => setFields((current) => ({ ...current, code: sanitizeVerificationCode(event.target.value) }))} aria-describedby="code-help" /><p id="code-help" className={styles.help}>Les 6 chiffres reçus par email. Tous les champs sont obligatoires.</p></div>
              <div className={auth.field}><label htmlFor="password">Nouveau mot de passe</label><div className={auth.password}><input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" minLength={6} required value={fields.password} onChange={(event) => setFields((current) => ({ ...current, password: event.target.value }))} aria-describedby="password-help" /><button type="button" aria-label={showPassword ? "Masquer le nouveau mot de passe" : "Afficher le nouveau mot de passe"} aria-pressed={showPassword} aria-controls="password" onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}</button></div><p id="password-help" className={styles.help}>6 caractères minimum.</p></div>
              <div className={auth.field}><label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label><div className={auth.password}><input id="confirmPassword" name="confirmPassword" type={showConfirmation ? "text" : "password"} autoComplete="new-password" minLength={6} required value={fields.confirmPassword} onChange={(event) => setFields((current) => ({ ...current, confirmPassword: event.target.value }))} /><button type="button" aria-label={showConfirmation ? "Masquer la confirmation du mot de passe" : "Afficher la confirmation du mot de passe"} aria-pressed={showConfirmation} aria-controls="confirmPassword" onClick={() => setShowConfirmation((visible) => !visible)}>{showConfirmation ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}</button></div></div>
            </fieldset>
            <button type="submit" disabled={!!busy} className={`${auth.primary} ${styles.submit}`}>{busy === "reset" ? <><LoaderCircle size={18} className={auth.spinner} aria-hidden="true" />Réinitialisation en cours…</> : <>Réinitialiser le mot de passe<ArrowRight size={17} aria-hidden="true" /></>}</button>
            <div className={styles.retry}><p>Vous n’avez pas reçu le code ?</p><button type="button" onClick={restart} disabled={!!busy}>Vérifier l’adresse et renvoyer</button></div>
          </form>}
        </>}
        {step !== "complete" && <div className={auth.signup}><p>Vous avez votre mot de passe ?</p><Link href="/connexion">Se connecter<ArrowRight size={15} aria-hidden="true" /></Link></div>}
      </section>
    </div>
  </div></main>;
}
