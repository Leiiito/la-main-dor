/* La Main d'Or — main.js (vanilla)
   - menu mobile
   - header elevate
   - reveal on scroll
   - prestations dynamiques + filtres + recherche
   - galerie lightbox
   - avis slider
   - année footer
*/

(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

  // ---------------------------
  // Header elevate
  // ---------------------------
  const header = $(".header[data-elevate]");
  // Throttle with rAF to avoid scroll jank on mobile
  let scrollTicking = false;
  const updateHeaderElevate = () => {
    scrollTicking = false;
    if (!header) return;
    header.classList.toggle("is-elevated", window.scrollY > 8);
  };
  const onScroll = () => {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(updateHeaderElevate);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  updateHeaderElevate();

  // ---------------------------
  // Mobile nav toggle
  // ---------------------------
  const navToggle = $("[data-nav-toggle]");
  const navPanel = $("[data-nav-panel]");
  let lastNavFocus = null;

  const closeNav = () => {
    if (!navPanel || !navToggle) return;
    navPanel.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Ouvrir le menu");
    document.body.classList.remove("no-scroll");

    // restore focus
    if (lastNavFocus && typeof lastNavFocus.focus === "function") {
      lastNavFocus.focus();
    }
    lastNavFocus = null;
  };

  const openNav = () => {
    if (!navPanel || !navToggle) return;
    lastNavFocus = document.activeElement;
    navPanel.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Fermer le menu");
    document.body.classList.add("no-scroll");

    // focus first actionable item in panel
    window.setTimeout(() => {
      const first = navPanel.querySelector("a, button, input, [tabindex]:not([tabindex='-1'])");
      if (first && typeof first.focus === "function") first.focus();
    }, 0);
  };

  if (navToggle && navPanel) {
    navToggle.addEventListener("click", () => {
      const isOpen = navPanel.classList.contains("is-open");
      isOpen ? closeNav() : openNav();
    });

    // close when clicking links
    navPanel.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (a && a.getAttribute("href")?.startsWith("#")) closeNav();
    });

    // close on escape
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });

    // close on resize to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 780) closeNav();
    });
  }

  // ---------------------------
  // Reveal on scroll
  // ---------------------------
  const revealEls = $$("[data-reveal], .reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
  }

  // ---------------------------
  // Year
  // ---------------------------
  const yearEl = $("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ---------------------------
  // Prestations data (Calendly par prestation)
  // ---------------------------
  const FALLBACK_WHATSAPP = "https://wa.me/33750126032";

  // Liens Calendly (publics) — fournis par toi ✅
  const CAL_LINKS = {
    // --- Mains
    semiMains: "https://calendly.com/behramanon/semi-permanent-mains-25-45-min",
    deposeSemi: "https://calendly.com/behramanon/depose-semi-permanent-15-20min",
    gainageRenfort: "https://calendly.com/behramanon/gainage-renfort-40-75-min",
    remplissageGel: "https://calendly.com/behramanon/remplissage-gel-35-90-min",
    deposeGel: "https://calendly.com/behramanon/depose-gel-20-45-min",
    poseAmericaine: "https://calendly.com/behramanon/pose-americaine-35-90-min",
    deposePoseAmericaine: "https://calendly.com/behramanon/depose-pose-americaine-15-30-min",
    rallongementChablon: "https://calendly.com/behramanon/rallongement-chablon-50-120-min",

    // --- Pieds
    semiPieds: "https://calendly.com/behramanon/semi-permanent-pieds-25-45-min",

    // --- Cils (rehaussement)
    rehaussement: "https://calendly.com/behramanon/rehaussement-de-cils-45-70-min",
    rehaussementTeinture: "https://calendly.com/behramanon/rehaussement-de-cils-teinture-55-75min",

    // --- Cils (extensions : poses)
    cilsACils: "https://calendly.com/behramanon/extensions-de-cils-cils-a-cils-40-90-min",
    volumeMixteNaturel: "https://calendly.com/behramanon/extensions-de-cils-volume-mixte-naturel-50-90-min",
    volumeMixteFourni: "https://calendly.com/behramanon/extensions-de-cils-volume-mixte-fourni-55-90-min",
    volumeRusse: "https://calendly.com/behramanon/extensions-de-cils-volume-russe-60-90-min",
    megaRusse: "https://calendly.com/behramanon/extensions-de-cils-volume-mega-russe-70-90-min",

    // --- Cils (extensions : remplissages)
    rempCilsACils2: "https://calendly.com/behramanon/remplissage-cils-a-cils-2-semaines-30-60-min",
    rempCilsACils3: "https://calendly.com/behramanon/remplissage-cils-a-cils-3-semaines-35-75-min",

    rempMixteNat2: "https://calendly.com/behramanon/remplissage-mixte-naturel-2-semaines-40-60-min",
    rempMixteNat3: "https://calendly.com/behramanon/remplissage-mixte-naturel-3-semaines-45-75-min",

    rempMixteFourni2: "https://calendly.com/behramanon/remplissage-mixte-fourni-2-semaines-45-60min",
    rempMixteFourni3: "https://calendly.com/behramanon/remplissage-mixte-fourni-3-semaines-50-75min",

    rempRusse2: "https://calendly.com/behramanon/remplissage-volume-russe-2-semaines-45-60-min",
    rempRusse3: "https://calendly.com/behramanon/remplissage-volume-russe-3-semaines-50-75-min",

    rempMega2: "https://calendly.com/behramanon/remplissage-mega-russe-2-semaines-55-60min",
    rempMega3: "https://calendly.com/behramanon/remplissage-mega-russe-3-semaines-60-75-min",

    // --- Cils (déposes)
    deposeCilsExterieure: "https://calendly.com/behramanon/depose-extensions-de-cils-pose-exterieure-15-15min",
    deposeCilsMaison: "https://calendly.com/behramanon/depose-extensions-de-cils-realisee-par-mes-soins-10",

    // --- Packs
    packSemiMainsPieds: "https://calendly.com/behramanon/pack-semi-mains-pieds-45-105-min",
    packPoseAmSemiPieds: "https://calendly.com/behramanon/pack-pose-americaine-semi-pieds-55-105-min",
    packDeposeSemiNouvelleSemi: "https://calendly.com/behramanon/pack-depose-semi-nouvelle-pose-semi-35-60min",
    packDeposeCapsuleNouvelleCapsule: "https://calendly.com/behramanon/pack-depose-capsule-nouvelle-pose-capsule-45-90min",
  };

  const isValidPublicCalendly = (url) =>
    typeof url === "string" &&
    url.startsWith("https://calendly.com/") &&
    !url.includes("/app/");

  const booking = (url) => (isValidPublicCalendly(url) ? url : FALLBACK_WHATSAPP);

  /** @type {{id:string, name:string, category:"mains"|"pieds"|"cils"|"packs", price:string, duration:string, desc:string, tags:string[], bookingUrl:string}[]} */
  const SERVICES = [
    // ONGLES MAINS
    {
      id: "m_semi_mains",
      name: "Semi-permanent mains",
      category: "mains",
      price: "25€",
      duration: "45 min",
      desc: "Couleur nette, brillance, rendu fin.",
      tags: ["Couleur", "Mains"],
      bookingUrl: booking(CAL_LINKS.semiMains),
    },
    {
      id: "m_depose_semi",
      name: "Dépose semi-permanent",
      category: "mains",
      price: "15€",
      duration: "20 min",
      desc: "Dépose propre + préparation si besoin.",
      tags: ["Dépose", "Soin"],
      bookingUrl: booking(CAL_LINKS.deposeSemi),
    },
    {
      id: "m_gainage",
      name: "Gainage / renfort",
      category: "mains",
      price: "40€",
      duration: "75 min",
      desc: "Renforcement pour une tenue au top.",
      tags: ["Renfort", "Tenue"],
      bookingUrl: booking(CAL_LINKS.gainageRenfort),
    },
    {
      id: "m_remplissage_gel",
      name: "Remplissage gel",
      category: "mains",
      price: "35€",
      duration: "90 min",
      desc: "Entretien propre, équilibre, finition premium.",
      tags: ["Entretien", "Gel"],
      bookingUrl: booking(CAL_LINKS.remplissageGel),
    },
    {
      id: "m_depose_gel",
      name: "Dépose gel",
      category: "mains",
      price: "20€",
      duration: "45 min",
      desc: "Dépose propre + respect de l’ongle.",
      tags: ["Dépose", "Gel"],
      bookingUrl: booking(CAL_LINKS.deposeGel),
    },
    {
      id: "m_pose_americaine",
      name: "Pose américaine",
      category: "mains",
      price: "35€",
      duration: "90 min",
      desc: "Allongement + rendu net et durable.",
      tags: ["Allongement", "Capsules"],
      bookingUrl: booking(CAL_LINKS.poseAmericaine),
    },
    {
      id: "m_depose_pose_americaine",
      name: "Dépose pose américaine",
      category: "mains",
      price: "15€",
      duration: "30 min",
      desc: "Dépose propre des capsules.",
      tags: ["Dépose", "Capsules"],
      bookingUrl: booking(CAL_LINKS.deposePoseAmericaine),
    },
    {
      id: "m_chablon",
      name: "Rallongement chablon",
      category: "mains",
      price: "50€",
      duration: "120 min",
      desc: "Allongement sur mesure (chablon).",
      tags: ["Allongement", "Sur-mesure"],
      bookingUrl: booking(CAL_LINKS.rallongementChablon),
    },

    // ONGLES PIEDS
    {
      id: "p_semi_pieds",
      name: "Semi-permanent pieds",
      category: "pieds",
      price: "25€",
      duration: "45 min",
      desc: "Pieds propres, couleur nette, tenue durable.",
      tags: ["Pieds", "Couleur"],
      bookingUrl: booking(CAL_LINKS.semiPieds),
    },

    // CILS (Rehaussement)
    {
      id: "c_rehaussement",
      name: "Rehaussement de cils",
      category: "cils",
      price: "45€",
      duration: "70 min",
      desc: "Courbure naturelle, regard ouvert.",
      tags: ["Naturel", "Rehaussement"],
      bookingUrl: booking(CAL_LINKS.rehaussement),
    },
    {
      id: "c_rehaussement_teinture",
      name: "Rehaussement + teinture",
      category: "cils",
      price: "55€",
      duration: "75 min",
      desc: "Rehaussement + intensité (teinture).",
      tags: ["Teinture", "Rehaussement"],
      bookingUrl: booking(CAL_LINKS.rehaussementTeinture),
    },

    // CILS (Extensions — pose)
    {
      id: "c_pose_cils_a_cils",
      name: "Extensions — cils à cils",
      category: "cils",
      price: "40€",
      duration: "90 min",
      desc: "Pose classique, rendu naturel.",
      tags: ["Extensions", "Classique"],
      bookingUrl: booking(CAL_LINKS.cilsACils),
    },
    {
      id: "c_pose_mixte_naturel",
      name: "Extensions — volume mixte naturel",
      category: "cils",
      price: "50€",
      duration: "90 min",
      desc: "Mixte léger, naturel mais visible.",
      tags: ["Mixte", "Naturel"],
      bookingUrl: booking(CAL_LINKS.volumeMixteNaturel),
    },
    {
      id: "c_pose_mixte_fourni",
      name: "Extensions — volume mixte fourni",
      category: "cils",
      price: "55€",
      duration: "90 min",
      desc: "Mixte plus dense, effet fourni.",
      tags: ["Mixte", "Fourni"],
      bookingUrl: booking(CAL_LINKS.volumeMixteFourni),
    },
    {
      id: "c_pose_russe",
      name: "Extensions — volume russe",
      category: "cils",
      price: "60€",
      duration: "90 min",
      desc: "Volume russe, densité élégante.",
      tags: ["Russe", "Volume"],
      bookingUrl: booking(CAL_LINKS.volumeRusse),
    },
    {
      id: "c_pose_mega_russe",
      name: "Extensions — mega russe",
      category: "cils",
      price: "70€",
      duration: "90 min",
      desc: "Mega russe, volume intense.",
      tags: ["Mega", "Volume"],
      bookingUrl: booking(CAL_LINKS.megaRusse),
    },

    // CILS (Extensions — remplissages)
    {
      id: "c_remp_cac_2",
      name: "Remplissage cils à cils — 2 semaines",
      category: "cils",
      price: "30€",
      duration: "60 min",
      desc: "Entretien 2 semaines (cils à cils).",
      tags: ["Remplissage", "2 sem"],
      bookingUrl: booking(CAL_LINKS.rempCilsACils2),
    },
    {
      id: "c_remp_cac_3",
      name: "Remplissage cils à cils — 3 semaines",
      category: "cils",
      price: "35€",
      duration: "75 min",
      desc: "Entretien 3 semaines (cils à cils).",
      tags: ["Remplissage", "3 sem"],
      bookingUrl: booking(CAL_LINKS.rempCilsACils3),
    },
    {
      id: "c_remp_mixte_nat_2",
      name: "Remplissage mixte naturel — 2 semaines",
      category: "cils",
      price: "40€",
      duration: "60 min",
      desc: "Entretien 2 semaines (mixte naturel).",
      tags: ["Remplissage", "2 sem"],
      bookingUrl: booking(CAL_LINKS.rempMixteNat2),
    },
    {
      id: "c_remp_mixte_nat_3",
      name: "Remplissage mixte naturel — 3 semaines",
      category: "cils",
      price: "45€",
      duration: "75 min",
      desc: "Entretien 3 semaines (mixte naturel).",
      tags: ["Remplissage", "3 sem"],
      bookingUrl: booking(CAL_LINKS.rempMixteNat3),
    },
    {
      id: "c_remp_mixte_fourni_2",
      name: "Remplissage mixte fourni — 2 semaines",
      category: "cils",
      price: "45€",
      duration: "60 min",
      desc: "Entretien 2 semaines (mixte fourni).",
      tags: ["Remplissage", "2 sem"],
      bookingUrl: booking(CAL_LINKS.rempMixteFourni2),
    },
    {
      id: "c_remp_mixte_fourni_3",
      name: "Remplissage mixte fourni — 3 semaines",
      category: "cils",
      price: "50€",
      duration: "75 min",
      desc: "Entretien 3 semaines (mixte fourni).",
      tags: ["Remplissage", "3 sem"],
      bookingUrl: booking(CAL_LINKS.rempMixteFourni3),
    },
    {
      id: "c_remp_russe_2",
      name: "Remplissage volume russe — 2 semaines",
      category: "cils",
      price: "45€",
      duration: "60 min",
      desc: "Entretien 2 semaines (volume russe).",
      tags: ["Remplissage", "2 sem"],
      bookingUrl: booking(CAL_LINKS.rempRusse2),
    },
    {
      id: "c_remp_russe_3",
      name: "Remplissage volume russe — 3 semaines",
      category: "cils",
      price: "50€",
      duration: "75 min",
      desc: "Entretien 3 semaines (volume russe).",
      tags: ["Remplissage", "3 sem"],
      bookingUrl: booking(CAL_LINKS.rempRusse3),
    },
    {
      id: "c_remp_mega_2",
      name: "Remplissage mega russe — 2 semaines",
      category: "cils",
      price: "55€",
      duration: "60 min",
      desc: "Entretien 2 semaines (mega russe).",
      tags: ["Remplissage", "2 sem"],
      bookingUrl: booking(CAL_LINKS.rempMega2),
    },
    {
      id: "c_remp_mega_3",
      name: "Remplissage mega russe — 3 semaines",
      category: "cils",
      price: "60€",
      duration: "75 min",
      desc: "Entretien 3 semaines (mega russe).",
      tags: ["Remplissage", "3 sem"],
      bookingUrl: booking(CAL_LINKS.rempMega3),
    },

    // Déposes cils
    {
      id: "c_depose_exterieure",
      name: "Dépose extensions (pose extérieure)",
      category: "cils",
      price: "15€",
      duration: "15 min",
      desc: "Dépose d’extensions posées ailleurs.",
      tags: ["Dépose"],
      bookingUrl: booking(CAL_LINKS.deposeCilsExterieure),
    },
    {
      id: "c_depose_maison",
      name: "Dépose extensions (réalisée par mes soins)",
      category: "cils",
      price: "10€",
      duration: "—",
      desc: "Dépose d’extensions posées par moi.",
      tags: ["Dépose"],
      bookingUrl: booking(CAL_LINKS.deposeCilsMaison),
    },

    // PACKS
    {
      id: "k_pack_semi_mains_pieds",
      name: "Pack semi mains + pieds",
      category: "packs",
      price: "45€",
      duration: "105 min",
      desc: "Combo semi-permanent mains + pieds.",
      tags: ["Pack", "Semi"],
      bookingUrl: booking(CAL_LINKS.packSemiMainsPieds),
    },
    {
      id: "k_pack_poseam_semi_pieds",
      name: "Pack pose américaine + semi pieds",
      category: "packs",
      price: "55€",
      duration: "105 min",
      desc: "Pose américaine mains + semi pieds.",
      tags: ["Pack", "Pose am."],
      bookingUrl: booking(CAL_LINKS.packPoseAmSemiPieds),
    },
    {
      id: "k_pack_depose_semi_nouvelle_semi",
      name: "Pack dépose semi + nouvelle pose semi",
      category: "packs",
      price: "35€",
      duration: "60 min",
      desc: "Dépose + nouvelle pose semi-permanent.",
      tags: ["Pack", "Dépose"],
      bookingUrl: booking(CAL_LINKS.packDeposeSemiNouvelleSemi),
    },
    {
      id: "k_pack_depose_capsule_nouvelle_capsule",
      name: "Pack dépose capsule + nouvelle pose capsule",
      category: "packs",
      price: "45€",
      duration: "90 min",
      desc: "Dépose + nouvelle pose capsules.",
      tags: ["Pack", "Capsules"],
      bookingUrl: booking(CAL_LINKS.packDeposeCapsuleNouvelleCapsule),
    },
  ];

  const CAT_META = {
    mains: { title: "Ongles mains", sub: "Renforcement, gel, semi-permanent, entretien." },
    pieds: { title: "Ongles pieds", sub: "Pieds propres, couleur nette, tenue durable." },
    cils: { title: "Cils", sub: "Rehaussement, extensions, remplissages, déposes." },
    packs: { title: "Packs", sub: "Combos pratiques, gain de temps." },
  };

  // ---------------------------
  // Prestations render + filter + search
  // ---------------------------
  const servicesWrap = $("[data-services]");
  const filterBtns = $$("[data-filter]");
  const searchInput = $("#svcSearch");

  let activeFilter = "all";
  let activeQuery = "";

  const normalize = (s) =>
    (s || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const serviceMatches = (svc) => {
    const byFilter = activeFilter === "all" ? true : svc.category === activeFilter;
    if (!byFilter) return false;
    if (!activeQuery) return true;

    const hay = normalize([svc.name, svc.desc, svc.price, svc.duration, ...(svc.tags || [])].join(" "));
    return hay.includes(activeQuery);
  };

  const groupByCategory = (items) => {
    const map = new Map();
    items.forEach((it) => {
      const k = it.category;
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(it);
    });
    return map;
  };

  const renderServices = () => {
    if (!servicesWrap) return;

    const visible = SERVICES.filter(serviceMatches);

    if (!visible.length) {
      servicesWrap.innerHTML = `<div class="svcEmpty">Aucune prestation trouvée. Essayez un autre filtre ou une recherche plus simple.</div>`;
      return;
    }

    const grouped = groupByCategory(visible);
    const order = ["mains", "pieds", "cils", "packs"].filter((k) => grouped.has(k));

    servicesWrap.innerHTML = order
      .map((catKey) => {
        const meta = CAT_META[catKey];
        const list = grouped.get(catKey) || [];

        return `
          <section class="svc__cat" aria-label="${meta?.title || catKey}">
            <div class="svc__catHead">
              <div>
                <h3 class="svc__catTitle">${meta?.title || catKey}</h3>
                <p class="svc__catSub">${meta?.sub || ""}</p>
              </div>
              <div class="svc__count">${list.length}</div>
            </div>

            <div class="svc__grid">
              ${list
                .map((svc) => {
                  const tags = (svc.tags || [])
                    .slice(0, 3)
                    .map((t) => `<span class="svcChip">${t}</span>`)
                    .join("");

                  const url = svc.bookingUrl || FALLBACK_WHATSAPP;

                  return `
                    <article class="svcCard" data-svc-id="${svc.id}">
                      <div class="svcCard__top">
                        <div>
                          <h4 class="svcCard__name">${svc.name}</h4>
                          <div class="svcCard__meta">
                            ${tags}
                          </div>
                        </div>
                        <div class="svcCard__price">
                          <span class="svcPrice">${svc.price}</span>
                          <span class="svcDur">${svc.duration}</span>
                        </div>
                      </div>

                      <p class="svcCard__desc">${svc.desc}</p>

                      <div class="svcCard__bottom">
                        <span class="svcCard__micro">Réservation via Calendly</span>
                        <a class="btn btn--primary btn--sm svcCard__cta" href="${url}" target="_blank" rel="noopener noreferrer">
                          Réserver
                        </a>
                      </div>
                    </article>
                  `;
                })
                .join("")}
            </div>
          </section>
        `;
      })
      .join("");
  };

  // Filter buttons behavior
  if (filterBtns.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        activeFilter = btn.dataset.filter || "all";
        filterBtns.forEach((b) => {
          const isActive = b === btn;
          b.classList.toggle("is-active", isActive);
          b.setAttribute("aria-selected", isActive ? "true" : "false");
        });
        renderServices();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      activeQuery = normalize(searchInput.value.trim());
      renderServices();
    });
  }

  renderServices();

  // ---------------------------
  // Lightbox (gallery)
  // ---------------------------
  const lightbox = $("[data-lightbox]");
  const lbImg = $("[data-lb-img]");
  const lbCloseBtns = $$("[data-lb-close]");
  const gallery = $("[data-gallery]");

  const lbCloseBtn = $(".lightbox__close", lightbox || document);
  let lastLbFocus = null;

  const openLightbox = (src, alt = "") => {
    if (!lightbox || !lbImg) return;
    lastLbFocus = document.activeElement;
    lbImg.src = src;
    lbImg.alt = alt || "Aperçu image";
    lightbox.hidden = false;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");

    // focus close button for accessibility
    window.setTimeout(() => {
      if (lbCloseBtn && typeof lbCloseBtn.focus === "function") lbCloseBtn.focus();
    }, 0);
  };

  const closeLightbox = () => {
    if (!lightbox || !lbImg) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    window.setTimeout(() => {
      if (!lightbox.classList.contains("is-open")) {
        lightbox.hidden = true;
        lbImg.removeAttribute("src");
        if (lastLbFocus && typeof lastLbFocus.focus === "function") lastLbFocus.focus();
        lastLbFocus = null;
      }
    }, 150);
  };

  if (gallery) {
    gallery.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-img]");
      if (!btn) return;
      const src = btn.getAttribute("data-img");
      const img = $("img", btn);
      const alt = img?.getAttribute("alt") || "";
      if (src) openLightbox(src, alt);
    });
  }

  lbCloseBtns.forEach((b) => b.addEventListener("click", closeLightbox));

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  // ---------------------------
  // Reviews slider
  // ---------------------------
  const revViewport = $(".reviews__viewport");
  const revItems = $$("[data-rev]", revViewport || document);
  const revPrev = $("[data-rev-prev]");
  const revNext = $("[data-rev-next]");
  let revIndex = 0;

  const showReview = (idx) => {
    if (!revItems.length) return;
    revIndex = (idx + revItems.length) % revItems.length;
    revItems.forEach((el, i) => {
      el.hidden = i !== revIndex;
    });
  };

  if (revItems.length) showReview(0);

  if (revPrev) revPrev.addEventListener("click", () => showReview(revIndex - 1));
  if (revNext) revNext.addEventListener("click", () => showReview(revIndex + 1));
})();
