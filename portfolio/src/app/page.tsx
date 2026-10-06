import {
  CVView,
  Header,
  MainContent,
  MultitaskBar,
  ProgressiveBlur,
  ViewProvider,
} from "@/components";

const SECTIONS = [
  {
    title: "4 ans de design et de code, tant appris, tant à apprendre",
    body: "Tout a commencé en DUT informatique, où j'ai conçu mes premières interfaces : fonctionnelles, mais sans émotion. J'ai compris que ce qui m'animait, ce n'était pas seulement le code, mais ce qu'il permet de faire exister. J'ai donc choisi une voie hybride, et j'ai surtout appris en faisant. De 2022 à 2026, chez DJTAL System, j'ai conçu et développé les interfaces d'un TMS (Transport Management System) : comprendre le besoin métier, maquetter quand c'est utile, puis livrer moi-même en production, en m'appuyant sur l'IA pour passer du design au code sans rien perdre en route. Ce qui me motive : créer à partir de rien quelque chose que les gens trouvent utile, simple et inspirant.",
  },
  {
    title: "Ce en quoi je crois",
    body: "Le design, c'est du jugement : décider de ce qui compte et de ce qui n'a pas sa place. Et ce jugement ne s'arrête pas à la maquette, il se poursuit jusque dans le code, là où se jouent les vrais détails. D'abord la fonction : servir un usage réel, guider plutôt que submerger, ne révéler la complexité que lorsqu'elle le mérite. Ensuite la résonance : une micro-interaction juste, un détail que personne n'avait demandé, ce qui fait passer un produit d'utilisable à aimé. Utile et mémorable ne s'opposent pas. Tenir les deux, de la réflexion à la mise en production, c'est tout mon métier.",
  },
  // {
  //   title: "L'apprentissage par renforcement et les agents",
  //   body: "L'apprentissage par renforcement profond est sorti des laboratoires de recherche pour irriguer des systèmes concrets, notamment dans la robotique, la finance algorithmique et le pilotage de réseaux complexes. Le principe reste élégant : un agent apprend par essais et erreurs à maximiser une récompense au fil de ses interactions avec un environnement. Combiné aux modèles de langage, ce paradigme a donné naissance aux agents autonomes capables de planifier des séquences d'actions, d'utiliser des outils numériques et de s'adapter à des objectifs nouveaux. La récompense humaine, sous forme de préférences explicites, permet d'aligner ces agents sur des comportements souhaitables. Cependant, leur déploiement en production soulève des questions de sécurité, de prévisibilité et de responsabilité qui n'ont pas encore de réponses définitives. La recherche s'oriente vers des méthodes d'évaluation plus rigoureuses et des garde-fous explicites afin d'éviter les dérives.",
  // },
  // {
  //   title: "L'IA générative et la création",
  //   body: "L'IA générative a bouleversé les pratiques créatives en démocratisant la production de contenus visuels, sonores et textuels de haute qualité. Que ce soit pour générer une illustration à partir d'une description, composer une mélodie originale ou synthétiser une voix, des outils accessibles à tous bousculent les frontières entre amateur et professionnel. Cette nouvelle vague soulève des questions juridiques sur la propriété intellectuelle, le droit d'auteur des données d'entraînement et l'attribution des œuvres générées. Les artistes sont partagés entre l'opportunité d'augmenter leur productivité et la crainte de voir leur style imité sans consentement. Du côté des entreprises, l'automatisation de la création publicitaire, du prototypage produit ou de la génération de variations marketing offre des gains de temps spectaculaires. Les régulateurs commencent à proposer des cadres pour exiger la transparence des contenus synthétiques, notamment via le marquage cryptographique.",
  // },
  // {
  //   title: "Éthique, biais et responsabilité",
  //   body: "L'éthique de l'intelligence artificielle est passée du statut de préoccupation académique à celui d'enjeu central pour les organisations qui déploient ces technologies. Les biais hérités des données d'entraînement peuvent renforcer des discriminations historiques en matière de recrutement, de crédit ou de justice prédictive. Les chercheurs développent des méthodes pour mesurer ces biais, les atténuer et documenter les limites des modèles à travers des fiches techniques standardisées. La transparence devient un impératif : expliquer les décisions, divulguer les sources d'entraînement et permettre l'audit indépendant. Au-delà de la technique, c'est la question de la responsabilité juridique qui se pose : qui est responsable lorsqu'un système autonome cause un préjudice ? Les législations émergentes, comme le règlement européen sur l'IA, tentent de définir des catégories de risques et des obligations proportionnées, sans freiner l'innovation.",
  // },
  // {
  //   title: "L'avenir de l'IA dans le travail",
  //   body: "L'impact de l'intelligence artificielle sur le monde du travail fait l'objet de débats passionnés entre optimistes et inquiets. Plutôt qu'un remplacement massif des emplois, les études récentes décrivent une transformation profonde des tâches : les activités répétitives ou facilement codifiables sont automatisées tandis que les compétences de jugement, de créativité et d'empathie prennent davantage de valeur. Les développeurs gagnent en productivité grâce aux assistants de code, les analystes accèdent plus rapidement à des synthèses pertinentes et les métiers de service voient apparaître des copilotes spécialisés. Cette évolution pose la question de la formation continue et du partage équitable des gains de productivité au sein des organisations. Les compétences les plus recherchées combinent une compréhension fine des outils d'IA, un esprit critique sur leurs limites et une capacité à orchestrer des équipes hybrides humains-machines. La transition demandera des politiques publiques ambitieuses pour accompagner les reconversions.",
  // },
];

export default function Home() {
  return (
    <ViewProvider>
      <Header />
      <MainContent>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-[256px] pb-[200px] flex flex-col gap-12">
          <header className="flex flex-col">
            <p className="font-sans font-medium text-[14px] leading-[18.9px] tracking-[-0.3px] text-neutrallight-700 dark:text-neutraldark-600 mb-4">
              Clément Fradet — Product Designer & Design Engineer
            </p>
            <h1 className="text-[44px] sm:text-[56px] leading-[1.05] font-semibold tracking-[-1.5px] text-neutrallight-900 dark:text-neutraldark-900 mb-[120px]">
              Je conçois des interfaces métier complexes, de la réflexion au
              code en production.
            </h1>
          </header>

          {SECTIONS.map((s, idx) => {
            const isStacked = idx === 1;
            const stackedSplit = "D'abord la fonction";
            const [firstPart, secondPart] = isStacked
              ? (() => {
                  const i = s.body.indexOf(stackedSplit);
                  if (i === -1) return [s.body, ""];
                  return [s.body.slice(0, i).trim(), s.body.slice(i).trim()];
                })()
              : ["", ""];
            return (
              <section key={s.title} className="flex flex-col gap-6">
                <h2 className="text-[28px] font-medium tracking-[-1px] text-neutrallight-900 dark:text-neutraldark-900 leading-8">
                  {s.title}
                </h2>
                {isStacked ? (
                  <div className="flex flex-col gap-4">
                    <p className="font-sans font-medium text-[14px] leading-[18.9px] tracking-[-0.3px] text-neutrallight-700 dark:text-neutraldark-600">
                      {firstPart}
                    </p>
                    <p className="font-sans font-medium text-[14px] leading-[18.9px] tracking-[-0.3px] text-neutrallight-700 dark:text-neutraldark-600">
                      {secondPart}
                    </p>
                  </div>
                ) : (
                  <p className="font-sans font-medium text-[14px] leading-[18.9px] tracking-[-0.3px] text-neutrallight-700 dark:text-neutraldark-600 sm:columns-2 sm:gap-12">
                    {s.body}
                  </p>
                )}
              </section>
            );
          })}

          <footer className="font-sans font-medium text-[12px] tracking-[-0.2px] text-neutrallight-700 dark:text-neutraldark-600">
            Site designé et développé par moi — Next.js, Tailwind.
          </footer>
        </div>
      </MainContent>
      <CVView />
      <ProgressiveBlur position="top" height={160} />
      <ProgressiveBlur position="bottom" height={200} />

      {/* Background fade layers — same color as page bg, fade from solid at edges to transparent */}
      <div
        className="pointer-events-none fixed top-0 left-0 right-0 z-30"
        style={{
          height: 160,
          background:
            "linear-gradient(to bottom, var(--background) 0%, var(--background) 30%, transparent 100%)",
        }}
      />
      <div
        className="pointer-events-none fixed bottom-0 left-0 right-0 z-30"
        style={{
          height: 200,
          background:
            "linear-gradient(to top, var(--background) 0%, var(--background) 30%, transparent 100%)",
        }}
      />

      <MultitaskBar />
    </ViewProvider>
  );
}
