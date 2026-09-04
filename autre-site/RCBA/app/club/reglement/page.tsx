import { getSession } from "@/lib/authentication";
import PageLabel from "@/components/PageLabel";
import HudCorners from "@/components/HudCorners";
import { FileText, Download, AlertCircle, Shield, Users, Clock, BookOpen, Scale, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function ReglementPage() {
  const session = await getSession();

  const sections = [
    {
      title: "Préambule & Objet",
      icon: <BookOpen size={18} className="text-gold" />,
      content: "Le Racing Club Bû Abondant (RCBA) est une association à but non lucratif (loi 1901) ayant pour vocation la pratique, l'enseignement et la promotion du football amateur.",
      points: [
        "Le présent règlement intérieur a pour but de compléter les statuts du club et de fixer les règles générales de fonctionnement.",
        "Il s'applique à l'ensemble des adhérents, joueurs, dirigeants, éducateurs et parents."
      ]
    },
    {
      title: "Article 1 - Inscription et Cotisation",
      icon: <FileText size={18} className="text-gold" />,
      content: "L'adhésion au RCBA implique l'acceptation sans réserve du présent règlement.",
      points: [
        "L'inscription n'est définitive qu'après remise du dossier complet, incluant la demande de licence validée.",
        "Le paiement de la cotisation annuelle est obligatoire.",
        "Tout joueur non à jour de sa cotisation ne pourra participer ni aux entraînements ni aux rencontres officielles."
      ]
    },
    {
      title: "Article 2 - Droits et Devoirs du Joueur",
      icon: <Users size={18} className="text-gold" />,
      content: "Le joueur représente le club et s'engage à avoir un comportement exemplaire.",
      points: [
        "Être assidu aux entraînements et aux matchs.",
        "Respecter les horaires fixés par son éducateur, et prévenir en cas d'absence.",
        "Respecter les décisions arbitrales, ses partenaires, ses adversaires et le public.",
        "Le port de la tenue officielle du club est exigé lors des rencontres."
      ]
    },
    {
      title: "Article 3 - Rôle des Éducateurs et Dirigeants",
      icon: <Shield size={18} className="text-gold" />,
      content: "Les éducateurs ont la responsabilité sportive et morale de leur équipe.",
      points: [
        "Prodiguer un encadrement de qualité, basé sur le respect, la pédagogie et le fair-play.",
        "Faire des choix sportifs (compositions d'équipe, temps de jeu) en toute objectivité.",
        "Veiller à l'intégration de tous les joueurs et au bon déroulement de la saison."
      ]
    },
    {
      title: "Article 4 - Rôle des Parents",
      icon: <Users size={18} className="text-gold" />,
      content: "Les parents sont des partenaires essentiels de la vie du club.",
      points: [
        "Accompagner et encourager les équipes dans un esprit sportif.",
        "S'abstenir de toute intervention sur les choix techniques ou de toute critique envers l'arbitrage.",
        "Respecter les horaires de convocation et accompagner les enfants lors des déplacements."
      ]
    },
    {
      title: "Article 5 - Infrastructures et Matériel",
      icon: <Clock size={18} className="text-gold" />,
      content: "Les adhérents se doivent de respecter les infrastructures mises à leur disposition.",
      points: [
        "Respecter les terrains, vestiaires et foyers du club.",
        "Laisser les vestiaires propres après chaque utilisation.",
        "Manipuler et ranger avec soin le matériel pédagogique après chaque séance."
      ]
    },
    {
      title: "Article 6 - Discipline et Sanctions",
      icon: <Scale size={18} className="text-gold" />,
      content: "Le non-respect du règlement fera l'objet d'un examen par la commission de discipline.",
      points: [
        "Les sanctions peuvent aller de l'avertissement à l'exclusion temporaire ou définitive.",
        "Les actes de violence, insultes ou comportements antisportifs sont sévèrement réprimés.",
        "Les amendes sportives (cartons rouges pour comportement) infligées par les instances seront à la charge exclusive du licencié fautif."
      ]
    }
  ];

  const downloadLinks = [
    { label: "Règlement Intérieur (PDF)", url: "https://s1.static-footeo.com/uploads/rcba/Medias/R%C3%A8glement%20int%C3%A9rieur%20RCBA__qg1ap8.pdf", available: true },
    { label: "Statuts du Club (PDF)", url: "https://s2.static-footeo.com/uploads/rcba/Medias/Statuts%20RCBA__qg1bkg.pdf", available: true },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-gold/30 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-5%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-32 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24 pb-12 border-b border-white/5 relative">
          <HudCorners color="#d4af37" opacity={0.05} />
          <PageLabel 
            section="Club"
            category="Gouvernance"
            title="Règlement Intérieur" 
            subtitle="Les règles fondamentales qui régissent la vie interne du Racing Club Bû Abondant."
            icon="club" 
            variant="gold"
          />
        </div>

        <main className="space-y-16 pb-32">
          {/* Download Section */}
          <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-xl font-black uppercase tracking-wider text-gold mb-8 flex items-center gap-3">
                <Download size={20} />
                Documents Officiels
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {downloadLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.available ? link.url : "#"}
                    target={link.available ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between p-4 rounded-xl border transition duration-300 ${
                      link.available 
                        ? "border-white/10 bg-white/5 hover:border-gold/50 hover:bg-gold/5 cursor-pointer" 
                        : "border-white/5 bg-white/2 cursor-not-allowed opacity-60"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <FileText size={18} className={link.available ? "text-gold" : "text-white/30"} />
                      <span className="text-sm font-medium">{link.label}</span>
                    </span>
                    {link.available ? (
                      <ChevronRight size={18} className="text-white/40" />
                    ) : (
                      <AlertCircle size={18} className="text-orange-400" />
                    )}
                  </a>
                ))}
              </div>
              {!downloadLinks[0].available && (
                <p className="text-sm text-orange-400 mt-4 flex items-center gap-2">
                  <AlertCircle size={12} />
                  Le PDF du règlement intérieur est actuellement indisponible. Veuillez contacter le secrétariat du club.
                </p>
              )}
            </div>
          </section>

          {/* Articles */}
          <section className="space-y-6">
            <h2 className="text-xl font-black uppercase tracking-wider text-gold mb-8 flex items-center gap-3">
              <BookOpen size={20} />
              Extraits du Règlement
            </h2>
            
            <div className="space-y-4">
              {sections.map((section, idx) => (
                <div 
                  key={idx}
                  className="group bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:border-gold/30 hover:bg-white/[0.04] transition duration-500"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                      {section.icon || <Scale size={18} className="text-gold" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-white mb-2 group-hover:text-gold transition-colors">
                        {section.title}
                      </h3>
                      {section.content && (
                        <p className="text-sm text-white/60 leading-relaxed mb-3">
                          {section.content}
                        </p>
                      )}
                      {section.points && section.points.length > 0 && (
                        <ul className="space-y-2">
                          {section.points.map((point, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                              <span className="text-gold mt-1 text-[10px]">â—</span>
                              <span className="leading-relaxed">{point}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-gradient-to-r from-gold/10 to-transparent border border-gold/20 rounded-3xl p-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center shrink-0">
                <Users size={24} className="text-gold" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Questions sur le règlement ?</h3>
                <p className="text-sm text-white/60 mb-4">
                  Pour toute question concernant le règlement intérieur, contactez le secrétariat du club.
                </p>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center gap-2 text-gold text-sm font-medium hover:gap-3 transition"
                >
                  Contacter le club <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
