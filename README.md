# La Main d'Or — One-page premium (GitHub Pages)

## Déploiement GitHub Pages (rapide)
1. Crée un repo GitHub (ex: `la-main-dor-site`)
2. Glisse **tout le contenu** de ce dossier `site-final/` à la racine du repo
3. GitHub → **Settings** → **Pages**
   - Source: `Deploy from a branch`
   - Branch: `main` + `/root`
4. Ton site sera accessible sur :
   - `https://<username>.github.io/<repo>/`

## À modifier (placeholders)
Dans `index.html`, remplace :
- `https://leiiito.github.io/la-main-dor-officiel/` → l’URL finale GitHub Pages
- `[ADRESSE]`, `[CODE_POSTAL]`, `[HORAIRES]`, `[LIEN_MENTIONS_LEGALES]`

## Prestations / Calendly
Les prestations sont déjà intégrées et chaque bouton **Réserver** ouvre **son lien Calendly exact**.
Pour ajouter une prestation :
- Duplique un bloc `<article class="card service">` dans la bonne catégorie.

## Photos / Galerie
- Les images sont dans `assets/img/`
- Renommage SEO-friendly déjà fait :
  - `ongles-gravelines-XX.jpg`
  - `cils-gravelines-XX.jpg`

Pour changer l’image hero :
- Dans `index.html`, cherche `img src="assets/img/ongles-gravelines-01.jpg"`

## SEO local (base)
- 1 seul H1 ✅
- Meta title + description ✅
- OpenGraph + Twitter ✅
- Schema.org BeautySalon ✅
- robots.txt + sitemap.xml ✅

> Pense à connecter Google Search Console une fois en ligne.
