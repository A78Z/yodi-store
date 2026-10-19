"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { ArrowRight, ChevronRight, Check, Package, Pencil, UserRound, X, LogOut, LoaderCircle } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { OrderR, UserR } from "@/lib/utils";
import { orderProgress, orderStatusLabel, orderSteps, profileFields, profilePasswordError, profilePayload, type ProfilePasswords } from "@/lib/profile";
import styles from "./page.module.css";

type Stats = { totalOrders: number; totalSpent: number; delivered: number; pending: number; cancelled: number; processing: number };
const emptyPasswords = { old: "", next: "", confirm: "" };

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserR | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [lastOrder, setLastOrder] = useState<OrderR | null>(null);
  const [orderError, setOrderError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<UserR | null>(null);
  const [passwords, setPasswords] = useState<ProfilePasswords>(emptyPasswords);
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const requestLock = useRef(false);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const deleteErrorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      let redirecting = false;
      setLoading(true); setLoadError(false); setStats(null); setLastOrder(null); setOrderError(false);
      try {
        const responses = await Promise.allSettled(["/api/user", "/api/order/getstats", "/api/order/last"].map(url => fetch(url, { signal: controller.signal, cache: "no-store" })));
        if (controller.signal.aborted) return;
        const profile = responses[0];
        if (profile.status !== "fulfilled") throw new Error();
        if (profile.value.status === 401) { redirecting = true; router.replace("/connexion"); return; }
        if (!profile.value.ok) throw new Error();
        const data = await profile.value.json();
        if (controller.signal.aborted) return;
        setUser(data);
        const statistics = responses[1];
        if (statistics.status === "fulfilled" && statistics.value.ok) {
          const data = await statistics.value.json().catch(() => null);
          if (!controller.signal.aborted) setStats(data);
        }
        const order = responses[2];
        if (order.status === "fulfilled" && order.value.ok) {
          const data = await order.value.json().catch(() => null);
          if (!controller.signal.aborted) { setLastOrder(data); setOrderError(!data); }
        } else if (!controller.signal.aborted) setOrderError(order.status !== "fulfilled" || order.value.status !== 404);
      } catch { if (!controller.signal.aborted) setLoadError(true); }
      finally { if (!controller.signal.aborted && !redirecting) setLoading(false); }
    }
    void load();
    return () => controller.abort();
  }, [attempt, router]);

  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);
  useEffect(() => { if (deleteError) deleteErrorRef.current?.focus(); }, [deleteError]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editData || requestLock.current) return;
    setError(""); setSuccess("");
    const validation = profilePasswordError(passwords);
    if (validation) { setError(validation); return; }
    requestLock.current = true; setBusy(true);
    try {
      const response = await fetch("/api/user/update", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profilePayload(editData, passwords)) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Impossible d’enregistrer vos modifications.");
      setUser(current => current ? { ...current, ...profileFields(editData) } : current);
      setPasswords(emptyPasswords); setShowPassword(false);
      setSuccess("Vos modifications ont été enregistrées."); setEditOpen(false);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Une erreur est survenue. Réessayez."); }
    finally { requestLock.current = false; setBusy(false); }
  }

  async function deleteAccount() {
    if (requestLock.current) return;
    requestLock.current = true; setDeleting(true); setDeleteError("");
    try {
      const response = await fetch("/api/user/delete-account", { method: "DELETE" });
      if (!response.ok) { const data = await response.json(); throw new Error(data.error || "Impossible de supprimer votre compte."); }
      await signOut({ callbackUrl: "/" });
    } catch (cause) { setDeleteError(cause instanceof Error ? cause.message : "Une erreur est survenue. Réessayez."); }
    finally { requestLock.current = false; setDeleting(false); }
  }

  return <main className={styles.page}><div className={styles.container}>
    <nav className={styles.breadcrumb} aria-label="Fil d’Ariane"><Link href="/">Accueil</Link><ChevronRight size={12} aria-hidden="true"/><span aria-current="page">Mon compte</span></nav>
    <header className={styles.header}><p className={styles.eyebrow}>Votre espace personnel</p><h1>Mon <span>compte</span></h1><p>Vos informations, vos commandes et le plaisir de vous retrouver.</p></header>
    {loading ? <div className={styles.state} role="status"><LoaderCircle size={24} aria-hidden="true"/>Chargement de votre compte…</div> : loadError || !user ? <div className={styles.state}><h2>Votre compte est momentanément indisponible.</h2><p>Réessayez pour retrouver vos informations.</p><button className={styles.primary} onClick={() => setAttempt(value => value + 1)}>Réessayer</button></div> : <>
      {success && <p role="status" className={styles.success}>{success}</p>}
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <section className={styles.card} aria-labelledby="profile-heading">
            <div className={styles.avatar} aria-hidden="true">{`${user.firstname?.[0] || ""}${user.lastname?.[0] || ""}`.toUpperCase() || <UserRound size={26}/>}</div>
            <p className={styles.eyebrow}>Bienvenue</p><h2 id="profile-heading" className={styles.name}>{user.firstname} {user.lastname}</h2>
            <dl className={styles.details}>{[["Email", user.email], ["Téléphone", user.phone], ["Adresse", user.address], ["Ville", user.city], ["Région", user.country], ["Code postal", user.zip]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || "Non renseigné"}</dd></div>)}</dl>
            <Dialog open={editOpen} onOpenChange={open => { if (!busy) { setEditOpen(open); if (!open) { setPasswords(emptyPasswords); setShowPassword(false); } } }}>
              <DialogTrigger asChild><button className={styles.secondary} onClick={() => { setEditData({ ...user }); setError(""); setPasswords(emptyPasswords); setShowPassword(false); }}><Pencil size={15} aria-hidden="true"/>Modifier mes informations</button></DialogTrigger>
              <DialogContent className={styles.dialog} showCloseButton={false} onEscapeKeyDown={event => { if (busy) event.preventDefault(); }} onInteractOutside={event => { if (busy) event.preventDefault(); }}>
                <DialogTitle className={styles.dialogTitle}>Mes informations</DialogTitle><DialogDescription className={styles.description}>Mettez à jour vos coordonnées. Les champs marqués d’un * sont obligatoires.</DialogDescription>
                <DialogClose className={styles.close} aria-label="Fermer" disabled={busy}><X size={20}/></DialogClose>
                <form onSubmit={save}><fieldset disabled={busy} className={styles.fieldset}>
                  <div className={styles.fields}>{([ ["firstname", "Prénom", "given-name"], ["lastname", "Nom", "family-name"], ["phone", "Téléphone", "tel"], ["address", "Adresse", "street-address"], ["city", "Ville", "address-level2"], ["country", "Région", "address-level1"], ["zip", "Code postal", "postal-code"] ] as const).map(([key, label, autoComplete]) => <div className={styles.field} key={key}><label htmlFor={`profile-${key}`}>{label}{["firstname", "lastname", "phone"].includes(key) ? " *" : ""}</label><input id={`profile-${key}`} type={key === "phone" ? "tel" : "text"} autoComplete={autoComplete} required={["firstname", "lastname", "phone"].includes(key)} value={editData?.[key] || ""} onChange={event => setEditData(current => current && ({ ...current, [key]: event.target.value }))}/></div>)}</div>
                  <h3 className={styles.passwordHeading}>Changer de mot de passe</h3><p className={styles.description}>Facultatif. Laissez ces champs vides pour conserver votre mot de passe.</p>
                  {([ ["old", "Mot de passe actuel"], ["next", "Nouveau mot de passe"], ["confirm", "Confirmer le nouveau mot de passe"] ] as const).map(([key, label]) => <div className={styles.field} key={key}><label htmlFor={`password-${key}`}>{label}</label><input id={`password-${key}`} type={showPassword ? "text" : "password"} autoComplete={key === "old" ? "current-password" : "new-password"} minLength={key === "old" ? undefined : 6} aria-describedby={key !== "old" ? "password-help" : undefined} value={passwords[key]} onChange={event => setPasswords(current => ({ ...current, [key]: event.target.value }))}/></div>)}
                  <p id="password-help" className={styles.description}>Au moins 6 caractères pour le nouveau mot de passe.</p><label className={styles.checkbox}><input type="checkbox" checked={showPassword} onChange={event => setShowPassword(event.target.checked)}/>Afficher les mots de passe</label>
                  {error && <p className={styles.error} role="alert" ref={errorRef} tabIndex={-1}>{error}</p>}
                  <div className={styles.actions}><DialogClose className={styles.secondary}>Annuler</DialogClose><button className={styles.primary} type="submit">{busy ? "Enregistrement…" : "Enregistrer"}</button></div>
                </fieldset></form>
              </DialogContent>
            </Dialog>
          </section>
          <button className={styles.logout} onClick={() => void signOut({ callbackUrl: "/connexion" })}><LogOut size={16} aria-hidden="true"/>Se déconnecter</button>
        </aside>
        <div className={styles.content}>
          <section className={styles.card} aria-labelledby="orders-heading"><div className={styles.sectionHeader}><div><p className={styles.eyebrow}>En un regard</p><h2 id="orders-heading">Mes commandes</h2></div><Link href="/profile/commandes" className={styles.ordersLink}>Tout voir<ArrowRight size={15} aria-hidden="true"/></Link></div>
            {stats ? <><dl className={styles.stats}>{([["Commandes", stats.totalOrders], ["Livrées", stats.delivered], ["En attente", stats.pending], ["En préparation", stats.processing], ["Annulées", stats.cancelled]] as const).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><div className={styles.total}><div>Montant des commandes<small>Tous statuts confondus, y compris les annulations.</small></div><strong>{Number.isFinite(stats.totalSpent) ? `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(stats.totalSpent)} FCFA` : "Indisponible"}</strong></div></> : <p className={styles.description}>Les statistiques sont momentanément indisponibles.</p>}
          </section>
          <section className={styles.card} aria-labelledby="tracking-heading"><p className={styles.eyebrow}>Votre suivi</p><h2 id="tracking-heading">Ma dernière commande</h2>
            {orderError ? <p className={styles.description}>Le suivi est momentanément indisponible. Rechargez la page pour réessayer.</p> : lastOrder ? <>
              <div className={styles.orderMeta}><span>Passée le {new Date(lastOrder.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span><span className={styles.badge}>{orderStatusLabel(lastOrder.status)}</span></div>
              {orderProgress(lastOrder.status) >= 0 ? <ol className={styles.steps} aria-label="Suivi de la commande">{orderSteps.map((step, index) => <li key={step} className={index <= orderProgress(lastOrder.status) ? styles.active : undefined} aria-current={lastOrder.status === step ? "step" : undefined}><span aria-hidden="true">{index < orderProgress(lastOrder.status) ? <Check size={16}/> : index + 1}</span><p>{orderStatusLabel(step)}</p></li>)}</ol> : <p className={styles.description}>{lastOrder.status === "cancelled" ? "Cette commande a été annulée." : "Le suivi détaillé n’est pas disponible pour ce statut."}</p>}
            </> : <div className={styles.empty}><span className={styles.emptyIcon}><Package size={28} strokeWidth={1.2} aria-hidden="true"/></span><h3>Votre histoire commence ici</h3><p>Vous n’avez pas encore passé de commande.</p><Link href="/" className={styles.primary}>Découvrir la boutique<ArrowRight size={16} aria-hidden="true"/></Link></div>}
          </section>
          <div className={styles.accountManagement}><p>Gestion du compte</p><Dialog open={deleteOpen} onOpenChange={open => { if (!deleting) { setDeleteOpen(open); setDeleteError(""); } }}><DialogTrigger asChild><button className={styles.deleteLink}>Supprimer mon compte</button></DialogTrigger><DialogContent className={styles.dialog} showCloseButton={false} onEscapeKeyDown={event => { if (deleting) event.preventDefault(); }} onInteractOutside={event => { if (deleting) event.preventDefault(); }}><DialogTitle className={styles.dialogTitle}>Supprimer mon compte ?</DialogTitle><DialogDescription className={styles.description}>Cette action supprime définitivement votre compte et vous déconnecte. Vous ne pourrez plus vous connecter avec ce compte.</DialogDescription><DialogClose disabled={deleting} className={styles.close} aria-label="Fermer"><X size={20}/></DialogClose>{deleteError && <p className={styles.error} role="alert" ref={deleteErrorRef} tabIndex={-1}>{deleteError}</p>}<div className={styles.actions}><DialogClose autoFocus disabled={deleting} className={styles.secondary}>Conserver mon compte</DialogClose><button disabled={deleting} className={styles.danger} onClick={() => void deleteAccount()}>{deleting ? "Suppression…" : "Supprimer définitivement"}</button></div></DialogContent></Dialog></div>
        </div>
      </div>
    </>}
  </div></main>;
}
