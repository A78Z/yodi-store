"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, Eye, EyeOff, LoaderCircle, Mail, ShoppingBag, UserRound, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { isVerificationCode, registrationPasswordError, registrationPayload, sanitizeVerificationCode, type RegistrationFields } from "@/lib/registration-form";
import styles from "./page.module.css";

const initialFields: RegistrationFields = { firstname: "", lastname: "", email: "", phone: "", address: "", city: "", zip: "", country: "", password: "", confirmPassword: "" };

export default function InscriptionPage() {
  const router = useRouter();
  const [fields, setFields] = useState(initialFields);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [busy, setBusy] = useState<"register" | "verify" | "resend" | null>(null);
  const request = useRef(false);
  const [error, setError] = useState("");
  const errorRef = useRef<HTMLDivElement>(null);
  const [pendingEmail, setPendingEmail] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [code, setCode] = useState("");
  const codeRef = useRef<HTMLInputElement>(null);
  const [verificationError, setVerificationError] = useState("");
  const verificationErrorRef = useRef<HTMLDivElement>(null);
  const [verificationStatus, setVerificationStatus] = useState("");
  const [verified, setVerified] = useState(false);
  const reopenRef = useRef<HTMLButtonElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (redirectTimer.current) clearTimeout(redirectTimer.current); }, []);

  function changeField(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFields((current) => ({ ...current, [event.target.name]: event.target.value }));
  }
  function showError(message: string) {
    setError(message);
    requestAnimationFrame(() => errorRef.current?.focus());
  }
  function showCodeError(message: string) {
    setVerificationError(message);
    requestAnimationFrame(() => verificationErrorRef.current?.focus());
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (request.current || pendingEmail || verified) return;
    setError("");
    const passwordError = registrationPasswordError(fields.password, fields.confirmPassword);
    if (passwordError) { showError(passwordError); return; }
    request.current = true;
    setBusy("register");
    const payload = registrationPayload(fields);
    try {
      const response = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) { showError(data.message || "L’inscription n’a pas pu être finalisée. Veuillez réessayer."); return; }
      setPendingEmail(payload.email);
      setFields((current) => ({ ...current, password: "", confirmPassword: "" }));
      setShowPassword(false);
      setShowConfirmation(false);
      setDialogOpen(true);
    } catch { showError("La connexion est momentanément indisponible. Veuillez réessayer dans quelques instants."); }
    finally { request.current = false; setBusy(null); }
  }

  async function handleVerification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (request.current || !pendingEmail || verified) return;
    if (!isVerificationCode(code)) { showCodeError("Saisissez le code à 6 chiffres reçu par email."); return; }
    request.current = true;
    setBusy("verify");
    setVerificationError("");
    setVerificationStatus("");
    try {
      const response = await fetch("/api/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: pendingEmail, code }) });
      const data = await response.json();
      if (!response.ok) { showCodeError(data.message || "Ce code est invalide ou expiré. Vérifiez-le ou demandez un nouveau code."); return; }
      setVerified(true);
      setDialogOpen(false);
      setCode("");
      requestAnimationFrame(() => successRef.current?.focus());
      redirectTimer.current = setTimeout(() => router.push("/connexion"), 2000);
    } catch { showCodeError("La vérification est momentanément indisponible. Veuillez réessayer."); }
    finally { request.current = false; setBusy(null); }
  }

  async function handleResend() {
    if (request.current || !pendingEmail || verified) return;
    request.current = true;
    setBusy("resend");
    setVerificationError("");
    setVerificationStatus("");
    try {
      const response = await fetch("/api/resend-code", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: pendingEmail }) });
      const data = await response.json();
      if (!response.ok) { showCodeError(data.message || "Le nouveau code n’a pas pu être envoyé. Veuillez réessayer."); return; }
      setCode("");
      setVerificationStatus("Un nouveau code a été envoyé à votre adresse email.");
    } catch { showCodeError("L’envoi est momentanément indisponible. Veuillez réessayer."); }
    finally { request.current = false; setBusy(null); }
  }

  return <main className={styles.page}><div className={styles.container}>
    <nav className={styles.breadcrumb} aria-label="Fil d’Ariane"><Link href="/">Accueil</Link><ChevronRight size={12} aria-hidden="true" /><span aria-current="page">Inscription</span></nav>
    <div className={styles.layout}>
      <section className={styles.welcome} aria-labelledby="welcome-title">
        <p className={styles.eyebrow}>Maison Yodi-K · Votre compte</p>
        <h1 id="welcome-title">Votre espace commence ici<span aria-hidden="true">.</span></h1>
        <p className={styles.intro}>Quelques informations pour vous retrouver, et accompagner vos prochains rituels de soin.</p>
        <ul className={styles.features}><li><UserRound size={21} strokeWidth={1.3} aria-hidden="true" /><div><strong>Vos informations réunies</strong><p>Retrouvez et mettez à jour votre profil.</p></div></li><li><ShoppingBag size={21} strokeWidth={1.3} aria-hidden="true" /><div><strong>Vos commandes à portée de main</strong><p>Consultez vos commandes et leur suivi.</p></div></li><li><Mail size={21} strokeWidth={1.3} aria-hidden="true" /><div><strong>Une dernière étape par email</strong><p>Un code vous permet de vérifier votre compte.</p></div></li></ul>
        <Link href="/" className={styles.back}><ArrowLeft size={16} aria-hidden="true" />Retour à la boutique</Link>
      </section>
      <section className={styles.card} aria-labelledby="register-title">
        <p className={styles.eyebrow}>Bienvenue chez vous</p><h2 id="register-title">Créer un compte</h2>
        <p className={styles.description}>Complétez vos informations, puis vérifiez votre adresse email.</p>
        {verified ? <div ref={successRef} tabIndex={-1} role="status" className={styles.success}><CheckCircle2 size={28} aria-hidden="true" /><h3>Votre compte est vérifié.</h3><p>Vous allez être redirigé vers la connexion.</p><Link href="/connexion" className={styles.primary}>Se connecter<ArrowRight size={17} aria-hidden="true" /></Link></div>
          : pendingEmail ? <div className={styles.pending} role="status"><Mail size={28} aria-hidden="true" /><h3>Vérifiez votre adresse email.</h3><p>Un code de vérification a été envoyé à <strong>{pendingEmail}</strong>.</p><button type="button" ref={reopenRef} onClick={() => setDialogOpen(true)} className={styles.primary}>Saisir mon code<ArrowRight size={17} aria-hidden="true" /></button><p className={styles.help}>Vous pouvez rouvrir cette étape sans soumettre à nouveau votre inscription.</p></div>
          : <form onSubmit={handleSubmit} aria-label="Création de votre compte" aria-busy={busy === "register"}>
            <p className={styles.requiredNote}>Les champs marqués d’un astérisque (*) sont obligatoires.</p>
            {error && <div ref={errorRef} role="alert" tabIndex={-1} className={styles.error}><p>{error}</p></div>}
            <fieldset className={styles.section} disabled={!!busy}><legend><span className={styles.number}>01</span>Vos coordonnées</legend>
              <div className={styles.fields}>
                <div className={styles.field}><label htmlFor="firstname">Prénom *</label><input id="firstname" name="firstname" autoComplete="given-name" value={fields.firstname} onChange={changeField} required pattern=".*\S.*" /></div>
                <div className={styles.field}><label htmlFor="lastname">Nom *</label><input id="lastname" name="lastname" autoComplete="family-name" value={fields.lastname} onChange={changeField} required pattern=".*\S.*" /></div>
                <div className={styles.field}><label htmlFor="email">Adresse email *</label><input id="email" name="email" type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} value={fields.email} onChange={changeField} required /></div>
                <div className={styles.field}><label htmlFor="phone">Téléphone *</label><input id="phone" name="phone" type="tel" autoComplete="tel" value={fields.phone} onChange={changeField} required pattern=".*\S.*" /></div>
              </div>
            </fieldset>
            <fieldset className={styles.section} disabled={!!busy}><legend><span className={styles.number}>02</span>Votre adresse</legend>
              <div className={styles.fields}>
                <div className={`${styles.field} ${styles.wide}`}><label htmlFor="address">Adresse *</label><input id="address" name="address" autoComplete="street-address" value={fields.address} onChange={changeField} required pattern=".*\S.*" /></div>
                <div className={styles.field}><label htmlFor="city">Ville *</label><input id="city" name="city" autoComplete="address-level2" value={fields.city} onChange={changeField} required pattern=".*\S.*" /></div>
                <div className={styles.field}><label htmlFor="zip">Code postal <span>(facultatif)</span></label><input id="zip" name="zip" autoComplete="postal-code" value={fields.zip} onChange={changeField} /></div>
                <div className={`${styles.field} ${styles.wide}`}><label htmlFor="country">Pays <span>(facultatif)</span></label><select id="country" name="country" autoComplete="country-name" value={fields.country} onChange={changeField}><option value="">Choisissez votre pays</option><option value="Sénégal">Sénégal</option><option value="Canada">Canada</option></select></div>
              </div>
            </fieldset>
            <fieldset className={styles.section} disabled={!!busy}><legend><span className={styles.number}>03</span>Votre mot de passe</legend>
              <div className={styles.fields}>
                <div className={styles.field}><label htmlFor="password">Mot de passe *</label><div className={styles.password}><input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" minLength={6} required value={fields.password} onChange={changeField} aria-describedby="password-help" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"} aria-pressed={showPassword} aria-controls="password">{showPassword ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}</button></div><p id="password-help" className={styles.help}>6 caractères minimum.</p></div>
                <div className={styles.field}><label htmlFor="confirmPassword">Confirmer le mot de passe *</label><div className={styles.password}><input id="confirmPassword" name="confirmPassword" type={showConfirmation ? "text" : "password"} autoComplete="new-password" minLength={6} required value={fields.confirmPassword} onChange={changeField} /><button type="button" onClick={() => setShowConfirmation((visible) => !visible)} aria-label={showConfirmation ? "Masquer la confirmation du mot de passe" : "Afficher la confirmation du mot de passe"} aria-pressed={showConfirmation} aria-controls="confirmPassword">{showConfirmation ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}</button></div></div>
              </div>
            </fieldset>
            <button type="submit" disabled={!!busy} className={styles.primary}>{busy === "register" ? <><LoaderCircle size={18} className={styles.spinner} aria-hidden="true" />Inscription en cours…</> : <>Créer mon compte<ArrowRight size={17} aria-hidden="true" /></>}</button>
            <p className={styles.afterSubmit}>Vous recevrez ensuite un code de vérification par email.</p>
          </form>}
        <div className={styles.signin}><p>Vous avez déjà un compte ?</p><Link href="/connexion">Se connecter<ArrowRight size={15} aria-hidden="true" /></Link></div>
      </section>
    </div>
  </div>
    <Dialog open={dialogOpen} onOpenChange={(open) => { if (!request.current) setDialogOpen(open); }}>
      <DialogContent className={styles.verification} showCloseButton={false} onOpenAutoFocus={(event) => { event.preventDefault(); codeRef.current?.focus(); }} onCloseAutoFocus={(event) => { event.preventDefault(); if (!verified) reopenRef.current?.focus(); }} onEscapeKeyDown={(event) => { if (request.current) event.preventDefault(); }}>
        <DialogClose asChild><button type="button" className={styles.close} disabled={!!busy} aria-label="Fermer la vérification"><X size={20} aria-hidden="true" /></button></DialogClose>
        <p className={styles.eyebrow}>Une dernière étape</p><DialogTitle className={styles.dialogTitle}>Vérifiez votre compte.</DialogTitle>
        <DialogDescription className={styles.dialogDescription}>Saisissez le code à 6 chiffres envoyé à <strong>{pendingEmail}</strong>.</DialogDescription>
        <form onSubmit={handleVerification} aria-label="Vérification de votre compte" aria-busy={!!busy}>
          {verificationError && <div ref={verificationErrorRef} role="alert" tabIndex={-1} className={styles.error}><p>{verificationError}</p></div>}
          <div className={styles.field}><label htmlFor="verification-code">Code de vérification</label><input ref={codeRef} id="verification-code" name="code" className={styles.code} inputMode="numeric" autoComplete="one-time-code" maxLength={6} pattern="[0-9]{6}" required value={code} onChange={(event) => setCode(sanitizeVerificationCode(event.target.value))} disabled={!!busy} aria-describedby="code-help" /><p id="code-help" className={styles.help}>Entrez les 6 chiffres du code reçu par email.</p></div>
          <p className={styles.verificationStatus} role="status">{verificationStatus}</p>
          <button type="submit" className={styles.primary} disabled={!!busy || !isVerificationCode(code)}>{busy === "verify" ? <><LoaderCircle size={18} className={styles.spinner} aria-hidden="true" />Vérification en cours…</> : <>Vérifier mon compte<ArrowRight size={17} aria-hidden="true" /></>}</button>
          <button type="button" className={styles.resend} onClick={handleResend} disabled={!!busy}>{busy === "resend" ? "Envoi en cours…" : "Renvoyer le code"}</button>
        </form>
      </DialogContent>
    </Dialog>
  </main>;
}
