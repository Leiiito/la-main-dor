# La Main d’Or — Site vitrine premium (HTML/CSS/JS)

Site one‑page **mobile‑first** pour *La Main d’Or* (prothésiste ongulaire à Gravelines), pensé pour :
- donner une **perception haut de gamme** (typographies, espace, détails)
- **rassurer** (preuves sociales, process, micro‑copy)
- favoriser la **prise de rendez‑vous** (CTA WhatsApp persistent)

## Structure

```
la-main-dor-site/
  index.html
  css/
    style.css
  js/
    main.js
  assets/
    images/
      og-cover.jpg
      hero-nails.jpg
      cta-detail.jpg
      gallery-01.jpg ... gallery-06.jpg
    icons/
      favicon.svg
      instagram.svg
      star.svg
      chevron-left.svg
      chevron-right.svg
      x.svg
```

## Lancer en local

Aucune dépendance.

### Option 1 — ouvrir directement
Double‑cliquez sur `index.html`.

### Option 2 — serveur local (recommandé)
- VS Code : extension **Live Server**
- ou un serveur simple :

```bash
python -m http.server 5173
```
Puis ouvrez `http://localhost:5173`.

## Personnaliser rapidement

Dans `index.html` :
- **Nom / baseline** : zone header
- **Texte / prestations / prix indicatifs** : sections `Prestations` et `FAQ`
- **Liens** :
  - WhatsApp : `https://wa.me/33750126032`
  - Instagram : `https://instagram.com/manon__behra`
  - Avis Google : `https://g.page/r/CTha_eAXpwwcEAE/review`

Images : remplacez les fichiers dans `assets/images/` en gardant les mêmes noms (ou mettez à jour les chemins dans `index.html`).

## Déployer

### GitHub Pages
1. Créez un repo GitHub et glissez le contenu du dossier.
2. `Settings` → `Pages` → choisissez la branche (souvent `main`) et `/root`.
3. Le site est servi automatiquement.

### Netlify / Vercel
Importez le repo, aucun build nécessaire (site statique).

---

© <span data-year></span> La Main d’Or
