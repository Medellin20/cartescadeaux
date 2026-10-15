"use client";

import { T, useLanguage } from "@/components/LanguageProvider";
import { useEffect, useRef, useState } from "react";

const comments = [
  "Achat rapide et très simple. J’ai reçu mon code quelques minutes après le paiement.",
  "Première commande sur le site et tout s’est très bien passé.",
  "Carte cadeau reçue rapidement par e-mail, aucun problème pour l’utiliser.",
  "Service efficace, paiement simple et livraison du code très rapide.",
  "J’ai acheté une carte Google Play et le code fonctionnait parfaitement.",
  "Très satisfait de mon achat. Le processus est clair et rapide.",
  "J’avais besoin d’une carte cadeau en urgence et je l’ai reçue immédiatement.",
  "Site facile à utiliser et commande reçue sans difficulté.",
  "Bonne expérience, je recommanderai certainement sur la plateforme.",
  "Ma carte Apple a été envoyée rapidement et l’activation s’est faite sans problème.",
  "Transaction rapide et sécurisée. Très satisfait du service.",
  "J’ai reçu exactement le montant commandé. Rien à signaler.",
  "Deuxième achat sur la plateforme et toujours aussi rapide.",
  "Très pratique pour acheter une carte cadeau sans se déplacer.",
  "Le code a été envoyé directement après la validation de mon paiement.",
  "J’étais un peu hésitant au début, mais tout s’est parfaitement déroulé.",
  "Achat simple, confirmation rapide et carte cadeau fonctionnelle.",
  "Bonne plateforme pour acheter des cartes cadeaux en ligne.",
  "J’ai acheté une carte PlayStation et je l’ai utilisée immédiatement.",
  "Interface simple et service rapide. Je suis satisfait.",
  "Ma commande a été traitée très rapidement. Je recommande.",
  "Aucun souci avec le paiement ni avec le code reçu.",
  "Très bonne expérience pour mon premier achat de carte cadeau.",
  "J’ai reçu ma carte Amazon rapidement. Le code était valide.",
  "Service pratique et efficace. Je referai certainement un achat.",
  "Le processus de commande est très clair, même pour une première utilisation.",
  "Carte cadeau reçue par e-mail et activée sans aucun problème.",
  "Très satisfait de la rapidité de traitement de ma commande.",
  "Achat effectué facilement depuis mon téléphone. Tout a fonctionné correctement.",
  "Bonne expérience dans l’ensemble : paiement rapide, code reçu et utilisable immédiatement."
];

export default function Comments() {
  const { t } = useLanguage();
  const [interacting, setInteracting] = useState(false);
  const viewportRef = useRef(null);
  useEffect(() => {
    const viewport = viewportRef.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame;
    let previous;
    let inView = false;
    let position = viewport.scrollLeft;
    const tick = (now) => {
      if (previous !== undefined && inView && !document.hidden && !interacting && !preference.matches) {
        const loopWidth = viewport.firstElementChild.offsetWidth;
        position += Math.min(now - previous, 50) * 0.035;
        if (position >= loopWidth) position %= loopWidth;
        viewport.scrollLeft = position;
      }
      if (interacting || preference.matches) position = viewport.scrollLeft;
      previous = now;
      frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; });
    observer.observe(viewport);
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [interacting]);
  return (
    <section id="commentaires" className="bg-white py-16" aria-labelledby="comments-title">
      <div className="container-p">
        <div className="mb-9 max-w-2xl" data-reveal>
          <p className="catalog-eyebrow"><T>Commentaires fournis · non vérifiés</T></p>
          <h2 id="comments-title" className="mt-3 text-3xl font-extrabold text-brand-900"><T>Commentaires</T></h2>
        </div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-stone-500"><T>30 commentaires · Faites défiler pour les parcourir</T></p>
        </div>
        <div id="comments-list" ref={viewportRef} className="comments-viewport" tabIndex={0} role="region" aria-label={t("Commentaires à défilement automatique")} onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)} onFocus={() => setInteracting(true)} onBlur={() => setInteracting(false)} onTouchStart={() => setInteracting(true)} onTouchEnd={() => setInteracting(false)} onTouchCancel={() => setInteracting(false)}>
          {[0, 1].map((copy) => <div key={copy} className={`comments-group ${copy ? "comments-copy" : ""}`} aria-hidden={copy ? true : undefined}>
            {comments.map((text, index) => (
              <article key={index} className="comment-card rounded-2xl border border-brand-100 bg-brand-50/50 p-6">
                <div className="flex items-center gap-3"><span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">✦</span><h3 className="font-bold text-brand-900"><T>Commentaire</T>{" "}{String(index + 1).padStart(2, "0")}</h3></div>
                <p className="mt-5 leading-relaxed text-stone-600">« <T>{text}</T> »</p>
              </article>
            ))}
          </div>)}
        </div>
      </div>
    </section>
  );
}
