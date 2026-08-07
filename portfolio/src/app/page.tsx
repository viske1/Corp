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
    title: "Plus de 3ans de design, tant appris, tant à apprendre",
    body: "Tout a commencé durant mes premières études supérieurs en IUT informatiques où je concu mes premières interfaces interfaces, fonctionnelles mais où l'émotion était absente. Je réalisa que ma passion ne résidait pas uniquement dans la programmation algorythmique. C'est pourquoi j'ai suivi une voix plus hybride avec une école axée sur le digital général. J'ai principalement appris en faisant, plutôt qu'en suivant la théorie que l'on nous apprenait en cours. C'est de cette manière que je continue d'évoluer de jour en jour, de challenger mes idées au quotidien, de remettre en question mes design, pour que l'en découle d'un produit utilisable à un produit indispensable. Depuis 2023, je design pour DJTAL System sur un TMS (transport management service). Créer quelque chose à partir de rien, que les gens trouvent utiles, pratiques, facile et inspirant, est ma plus grande motivation dans ce que je fais. J'ai l'impression d'avoir pour l'instant, gratté la surface d'un monde aux milliers de possibilités.",
  },
  {
    title: "Ce en quoi je crois",
    body: "Le design n'est pas de l'exécution. C'est du jugement. Après 3 ans dans le métier, c'est le principe auquel je reviens toujours. N'importe qui peut produire un écran correct. Ce pour quoi on nous engage vraiment, c'est un point de vue — la décision de ce qui compte et de ce qui n'a pas sa place. Ce jugement s'exerce en deux temps. D'abord la fonction. Un produit doit servir un usage et résoudre un vrai problème, intelligemment. Cela veut dire guider plutôt que submerger, ne révéler la complexité que lorsqu'elle le mérite, croiser la recherche avec un vrai parti pris, et concevoir des systèmes qui accompagnent la croissance au lieu de la freiner. Ensuite la résonance. La fonction rend un produit utilisable ; l'émotion le rend aimé. C'est de là que viennent la confiance et la fidélité — et, très concrètement, l'avantage qu'aucun concurrent ne copie. En pratique, ça tient à peu de choses : une microinteraction juste, un détail que personne n'avait demandé, un onboarding qui semble écrit pour une seule personne, un encouragement au bon moment. Utile et mémorable ne s'opposent pas. Tenir les deux, c'est tout le métier.",
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
            <h1 className="text-[44px] sm:text-[56px] leading-[1.05] font-semibold tracking-[-1.5px] text-neutrallight-900 dark:text-neutraldark-900 mb-[120px]">
              Simplifier le complexe, façonner le mémorable, créer des
              expériences qui durent.
            </h1>
          </header>

          {SECTIONS.map((s, idx) => {
            const isStacked = idx === 1;
            const stackedSplit = "Ce jugement s'exerce en deux temps.";
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
