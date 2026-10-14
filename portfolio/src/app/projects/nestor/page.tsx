import Link from "next/link";
import Image from "next/image";

const SCREENS = Array.from({ length: 24 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return `/nestor/nestor-${n}.png`;
});

const MECANIQUES = [
  {
    title: "L'accueil contextuel",
    body: "Trois cartes de situation — je charge, je roule, je décharge — remplacent le champ vide et dépliant chacune une quinzaine de formulations maîtrisées. C'est la mécanique qui détermine le taux d'usage et tient lieu d'onboarding. Elle cohabite avec un sélecteur de contrat type dont la persistance est un vrai risque métier : rester sur le mauvais référentiel renvoie des articles qui ne s'appliquent pas à la remorque.",
  },
  {
    title: "Le format de bulle",
    body: "La donnée ou la règle en tête, en gros. L'article ensuite sous forme de puce qui ouvre le texte source. Deux niveaux de source restent distinguables — réglementaire et interne au transporteur — avec un signalement lisible quand un document interne est périmé. La bulle porte aussi les actions d'enchaînement, dont l'appel à l'exploitation.",
  },
  {
    title: "Le chrono de mise à disposition",
    body: "Démarre dans le fil de conversation et se poursuit en Live Activity, pour que le conducteur suive son temps d'attente sans garder l'application ouverte.",
  },
  {
    title: "Le mode à côté du client",
    body: "Fournit la formulation à adresser au donneur d'ordre, dans une situation où le conducteur est observé et doit parler vite et juste.",
  },
  {
    title: "La photo comme question",
    body: "Permet de soumettre une lettre de voiture, une étiquette ou un relevé de température en lieu et place d'une question tapée.",
  },
];

export default function NestorProject() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-[120px] pb-[200px] flex flex-col gap-16">
      <Link
        href="/"
        className="font-sans font-medium text-[13px] tracking-[-0.2px] text-neutrallight-700 dark:text-neutraldark-600 hover:text-neutrallight-900 dark:hover:text-neutraldark-900 transition-colors w-fit"
      >
        ← Retour
      </Link>

      <header className="flex flex-col gap-6">
        <p className="font-sans font-medium text-[13px] tracking-[-0.2px] text-neutrallight-700 dark:text-neutraldark-600 uppercase">
          Projet · Mobile · 2026
        </p>
        <h1 className="text-[44px] sm:text-[56px] leading-[1.05] font-semibold tracking-[-1.5px] text-neutrallight-900 dark:text-neutraldark-900">
          Nestor — l'assistant juridique voix-first des conducteurs routiers.
        </h1>
        <p className="font-sans font-medium text-[16px] leading-[1.6] tracking-[-0.3px] text-neutrallight-700 dark:text-neutraldark-600">
          Une réponse juridique fiable en quelques secondes, depuis un quai ou
          une cabine, sans lire un texte ni appeler l'exploitation.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-[22px] font-medium tracking-[-0.6px] text-neutrallight-900 dark:text-neutraldark-900">
          Le besoin
        </h2>
        <p className="font-sans font-medium text-[14px] leading-[1.7] tracking-[-0.3px] text-neutrallight-700 dark:text-neutraldark-600">
          En tant que conducteur routier, je veux obtenir une réponse juridique
          fiable en quelques secondes depuis mon quai ou ma cabine, afin de
          trancher une situation immédiate sans devoir lire un texte ni appeler
          l'exploitation. Nestor répond, à la voix ou au clavier, aux questions
          sur les contrats types de transport et le corpus juridique qui
          encadre le métier.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-[22px] font-medium tracking-[-0.6px] text-neutrallight-900 dark:text-neutraldark-900">
          L'utilisateur cible
        </h2>
        <p className="font-sans font-medium text-[14px] leading-[1.7] tracking-[-0.3px] text-neutrallight-700 dark:text-neutraldark-600">
          25 à 60 ans. Debout sur un quai ou assis en cabine. Souvent avec des
          gants, parfois de nuit, réseau mobile médiocre. Il consulte
          l'application 4 secondes, pas 4 minutes. Il ne tape pas un
          paragraphe — il parle. Le ton de l'assistant est celui d'un ancien
          du métier qui explique en trois secondes sur un quai, pas d'un
          juriste qui rédige une note : tutoiement, deux ou trois phrases,
          chiffre ou règle d'abord, article ensuite, jamais de morale, et
          quand il ne sait pas il le dit sans détour.
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-[22px] font-medium tracking-[-0.6px] text-neutrallight-900 dark:text-neutraldark-900">
          Les cinq mécaniques
        </h2>
        <div className="flex flex-col gap-6">
          {MECANIQUES.map((m) => (
            <div key={m.title} className="flex flex-col gap-2">
              <h3 className="font-sans font-semibold text-[15px] tracking-[-0.3px] text-neutrallight-900 dark:text-neutraldark-900">
                {m.title}
              </h3>
              <p className="font-sans font-medium text-[14px] leading-[1.7] tracking-[-0.3px] text-neutrallight-700 dark:text-neutraldark-600">
                {m.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-[22px] font-medium tracking-[-0.6px] text-neutrallight-900 dark:text-neutraldark-900">
          Identité & direction visuelle
        </h2>
        <p className="font-sans font-medium text-[14px] leading-[1.7] tracking-[-0.3px] text-neutrallight-700 dark:text-neutraldark-600">
          La marque est un N blanc en Archivo 600 sur fond sombre, sans avatar
          ni personnage dessiné — le personnage étant porté par le ton des
          réponses. Le parti pris initial : palette sombre par défaut (fond
          0E0F10, texte F2F1EE), accent ocre réservé au bouton micro et à
          l'anneau de source. La version actuelle a dérivé vers une interface
          claire et un accent vert d'eau, qui cohabitent mal avec l'icône de
          l'application. Trancher entre les deux directions fait partie de la
          mission, l'interface claire se défendant mieux en plein jour sur un
          quai.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-[22px] font-medium tracking-[-0.6px] text-neutrallight-900 dark:text-neutraldark-900">
          Contraintes d'usage
        </h2>
        <p className="font-sans font-medium text-[14px] leading-[1.7] tracking-[-0.3px] text-neutrallight-700 dark:text-neutraldark-600">
          Gants, lumière directe, nuit, usage à une main, réseau dégradé —
          d'où un soin particulier porté aux états d'erreur et de latence
          longue, qui ne sont pas des cas limites mais le quotidien.
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-[22px] font-medium tracking-[-0.6px] text-neutrallight-900 dark:text-neutraldark-900">
          Écrans
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SCREENS.map((src, i) => (
            <div
              key={src}
              className="relative aspect-[9/19.5] rounded-xl overflow-hidden bg-neutrallight-200 dark:bg-neutraldark-200"
            >
              <Image
                src={src}
                alt={`Écran Nestor ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
