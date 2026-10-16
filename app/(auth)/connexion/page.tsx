"use client";

import { useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, ChevronRight, Eye, EyeOff, LoaderCircle, ShoppingBag, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import styles from "./page.module.css";

export default function ConnexionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);
  const pending = useRef(false);
  const errorRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    pending.current = true;
    setIsLoading(true);
    setError("");
    let succeeded = false;
    try {
      const response = await signIn("credentials", { email: email.trim(), password, redirect: false });
      if (!response?.ok || response.error) {
        setError("La connexion n’a pas abouti. Vérifiez votre adresse email et votre mot de passe, puis réessayez.");
      } else {
        succeeded = true;
        setConnected(true);
        router.push("/");
      }
    } catch {
      setError("La connexion est momentanément indisponible. Veuillez réessayer dans quelques instants.");
    } finally {
      if (!succeeded) {
        pending.current = false;
        setIsLoading(false);
        requestAnimationFrame(() => errorRef.current?.focus());
      }
    }
  }

  return <main className={styles.page}>
    <div className={styles.container}>
      <nav className={styles.breadcrumb} aria-label="Fil d’Ariane"><Link href="/">Accueil</Link><ChevronRight size={12} aria-hidden="true" /><span aria-current="page">Connexion</span></nav>
      <div className={styles.layout}>
        <section className={styles.welcome} aria-labelledby="welcome-title">
          <p className={styles.eyebrow}>Maison Yodi-K · Votre compte</p>
          <h1 id="welcome-title">Heureux de vous retrouver<span aria-hidden="true">.</span></h1>
          <p className={styles.intro}>Votre espace pour prendre soin de l’essentiel.</p>
          <ul className={styles.features}>
            <li><UserRound size={21} strokeWidth={1.3} aria-hidden="true" /><div><strong>Vos informations, à portée de main</strong><p>Retrouvez et mettez à jour votre profil.</p></div></li>
            <li><ShoppingBag size={21} strokeWidth={1.3} aria-hidden="true" /><div><strong>Vos commandes, au même endroit</strong><p>Consultez vos commandes et leur suivi.</p></div></li>
          </ul>
          <Link href="/" className={styles.back}><ArrowLeft size={16} aria-hidden="true" />Retour à la boutique</Link>
        </section>
        <section className={styles.card} aria-labelledby="login-title">
          <p className={styles.eyebrow}>Bienvenue chez vous</p>
          <h2 id="login-title">Se connecter</h2>
          <p className={styles.description}>Saisissez vos identifiants pour retrouver votre compte.</p>
          <form onSubmit={handleSubmit} aria-label="Connexion à votre compte" aria-busy={isLoading}>
            <p className={styles.requiredNote}>Les deux champs sont obligatoires.</p>
            {error && <div ref={errorRef} className={styles.error} role="alert" tabIndex={-1}><p>{error}</p></div>}
            <fieldset className={styles.fields} disabled={isLoading}>
              <legend className={styles.srOnly}>Vos identifiants</legend>
              <div className={styles.field}>
                <label htmlFor="email">Adresse email</label>
                <input id="email" name="email" type="email" autoComplete="username" autoCapitalize="none" spellCheck={false} required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="votre@email.com" />
              </div>
              <div className={styles.field}>
                <label htmlFor="password">Mot de passe</label>
                <div className={styles.password}>
                  <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
                  <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"} aria-pressed={showPassword} aria-controls="password">{showPassword ? <EyeOff size={19} strokeWidth={1.5} aria-hidden="true" /> : <Eye size={19} strokeWidth={1.5} aria-hidden="true" />}</button>
                </div>
              </div>
            </fieldset>
            <div className={styles.recovery}><Link href="/mot-de-passe-oublie">Mot de passe oublié ?</Link></div>
            <button type="submit" disabled={isLoading} className={styles.primary}>{isLoading ? <><LoaderCircle size={18} className={styles.spinner} aria-hidden="true" />{connected ? "Redirection en cours…" : "Connexion en cours…"}</> : <>Se connecter<ArrowRight size={17} aria-hidden="true" /></>}</button>
            <p className={styles.status} role="status">{connected ? "Connexion réussie. Redirection vers l’accueil…" : ""}</p>
          </form>
          <div className={styles.signup}><p>Vous découvrez Maison Yodi-K ?</p><Link href="/inscription">Créer un compte<ArrowRight size={15} aria-hidden="true" /></Link></div>
        </section>
      </div>
    </div>
  </main>;
}
