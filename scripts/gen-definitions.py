#!/usr/bin/env python3
"""Génère les pages HTML des 54 définitions RH."""
import os, json

OUT_DIR = "/Users/pierregaudard/Meilleur-Logiciel-RH/definitions-rh"
BASE = "https://meilleur-logiciel-rh.fr"
DATE = "2026-04-23"

NAV = '''<header class="site-header">
    <div class="site-header-inner">
      <a href="../" class="site-logo"><img src="../assets/images/mlrh-logo.png" alt="MLRH" title="Logo Meilleur Logiciel RH" width="82" height="30" style="height:30px;width:auto;filter:brightness(0)"></a>
      <nav class="site-nav">
        <a href="../comparatifs/">Comparatifs</a>
        <a href="../guides/">Guides</a>
        <a href="../definitions-rh/">Définitions</a>
        <a href="../alternatives/">Alternatives</a>
        <a href="../avis/">Avis</a>
        <a href="../outils/">Outils</a>
        <a href="../trouver-mon-logiciel.html" class="nav-cta">Trouver mon logiciel</a>
      </nav>
      <button class="nav-burger" aria-label="Ouvrir le menu" aria-expanded="false"><span></span><span></span><span></span></button>
    </div>
  </header>'''

FOOTER = '''<footer class="site-footer">
    <div class="site-footer-inner">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="footer-logo"><img src="../assets/images/mlrh-logo.png" alt="MLRH" title="Logo Meilleur Logiciel RH" width="82" height="30" style="height:30px;width:auto"></div>
          <p>Comparatifs et guides sur les logiciels RH, paie et SIRH pour les PME françaises.</p>
        </div>
        <div class="footer-col">
          <p class="footer-col-title">Comparatifs</p>
          <ul>
            <li><a href="../comparatifs/payfit-vs-factorial.html">PayFit vs Factorial</a></li>
            <li><a href="../comparatifs/">Tous les comparatifs</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <p class="footer-col-title">Ressources</p>
          <ul>
            <li><a href="../definitions-rh/">Définitions RH</a></li>
            <li><a href="../guides/choisir-logiciel-paie.html">Choisir son logiciel de paie</a></li>
            <li><a href="../alternatives/payfit.html">Alternatives à PayFit</a></li>
            <li><a href="../avis/payfit.html">PayFit avis 2026</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <p class="footer-col-title">Le site</p>
          <ul>
            <li><a href="../a-propos.html">À propos</a></li>
            <li><a href="../contact.html">Contact</a></li>
            <li><a href="../plan-du-site.html">Plan du site</a></li>
            <li><a href="../mentions-legales.html">Mentions légales</a></li>
            <li><a href="../cgu.html">CGU</a></li>
            <li><a href="../politique-de-confidentialite.html">Politique de confidentialité</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom"><span>&copy; 2026 MLRH. Tous droits réservés</span></div>
    </div>
  </footer>'''

SCRIPTS = '''<script>
    function toggleFaq(el){var item=el.closest(".faq-item");var isOpen=item.classList.contains("open");document.querySelectorAll(".faq-item.open").forEach(function(i){i.classList.remove("open")});if(!isOpen)item.classList.add("open");}
    (function(){var burger=document.querySelector(".nav-burger");var nav=document.querySelector(".site-nav");if(!burger||!nav)return;burger.addEventListener("click",function(){var open=nav.classList.toggle("open");burger.classList.toggle("open",open);burger.setAttribute("aria-expanded",open);});document.addEventListener("click",function(e){if(!burger.contains(e.target)&&!nav.contains(e.target)){nav.classList.remove("open");burger.classList.remove("open");burger.setAttribute("aria-expanded","false");}});})();
  </script>
  <script src="../assets/cookie-banner.js" defer></script>'''

LINKEDIN_SVG = '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>'
X_SVG = '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>'
FB_SVG = '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>'


def render(slug, d):
    # slug: kebab-case id, d: dict with all fields
    url = f"{BASE}/definitions-rh/{slug}.html"
    title = d["title"]
    meta_desc = d["meta_desc"]
    og_desc = d.get("og_desc", meta_desc)
    h1 = d["h1"]
    hero_strong = d["hero_strong"]
    hero_rest = d["hero_rest"]
    image = d.get("image", f"{slug}.jpg")
    image_alt = d["image_alt"]
    keywords = d.get("keywords", [])
    tldr = d["tldr"]  # list of 3-4 strings
    sections = d["sections"]  # list of {"h2": str, "html": str}
    case_box = d.get("case_box")  # str
    legal_box = d.get("legal_box")  # dict {"title": str, "html": str} or None
    stats = d.get("stats")  # list of {"value": str, "label": str} or None
    related = d["related"]  # list of {"slug": str, "name": str, "desc": str}
    next_steps = d.get("next_steps", [])  # list of {"href": str, "text": str}
    faq = d["faq"]  # list of {"q": str, "a": str}
    alt_names = d.get("alt_names", [])
    dt_desc = d.get("dt_desc", hero_strong + " " + hero_rest)
    word_count = d.get("word_count", 520)
    time_min = d.get("time_min", 3)

    breadcrumb_name = d.get("breadcrumb_name", h1)

    # H1 affiché : on ajoute " : définition" après le terme court
    # Pour les H1 avec parenthèses "ABC (Full Name)", on insère entre le sigle et la parenthèse
    import re as _re
    m = _re.match(r'^([^(]+?)\s*\(([^)]+)\)$', h1)
    if m:
        h1_display = f"{m.group(1).strip()} : définition ({m.group(2).strip()})"
    else:
        h1_display = f"{h1} : définition"

    # Build JSON-LD
    jsonld = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "DefinedTerm",
                "@id": f"{url}#term",
                "name": h1,
                "alternateName": alt_names,
                "description": dt_desc,
                "inDefinedTermSet": f"{BASE}/definitions-rh/",
                "url": url
            },
            {
                "@type": "Article",
                "headline": title,
                "description": meta_desc,
                "image": {"@type": "ImageObject", "url": f"{BASE}/assets/images/definitions/{image}", "width": 1200, "height": 800},
                "datePublished": f"{DATE}T00:00:00+02:00",
                "dateModified": f"{DATE}T00:00:00+02:00",
                "inLanguage": "fr-FR",
                "wordCount": word_count,
                "timeRequired": f"PT{time_min}M",
                "author": {"@type": "Organization", "name": "La rédaction Meilleur Logiciel RH", "url": f"{BASE}/"},
                "publisher": {"@type": "Organization", "name": "MLRH", "url": BASE, "logo": {"@type": "ImageObject", "url": f"{BASE}/assets/images/mlrh-logo.png"}},
                "mainEntityOfPage": {"@type": "WebPage", "@id": url},
                "keywords": keywords
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Accueil", "item": f"{BASE}/"},
                    {"@type": "ListItem", "position": 2, "name": "Définitions RH", "item": f"{BASE}/definitions-rh/"},
                    {"@type": "ListItem", "position": 3, "name": breadcrumb_name, "item": url}
                ]
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {"@type": "Question", "name": f["q"], "acceptedAnswer": {"@type": "Answer", "text": f["a"]}}
                    for f in faq
                ]
            }
        ]
    }
    jsonld_str = json.dumps(jsonld, ensure_ascii=False, indent=None)

    # tldr html
    tldr_html = "\n".join([f"          <li>{x}</li>" for x in tldr])

    # sections html
    sections_html = ""
    for s in sections:
        sections_html += f'\n      <h2>{s["h2"]}</h2>\n{s["html"]}'

    # case box
    case_html = ""
    if case_box:
        case_html = f'\n      <div class="case-box"><div class="case-box-title">Cas concret</div><p>{case_box}</p></div>'

    # legal box
    legal_html = ""
    if legal_box:
        legal_html = f'\n      <div class="legal-box"><div class="legal-box-title">{legal_box["title"]}</div><p>{legal_box["html"]}</p></div>'

    # stats
    stats_html = ""
    if stats:
        cards = "".join([f'<div class="stat-card"><div class="sv">{s["value"]}</div><div class="sl">{s["label"]}</div></div>' for s in stats])
        stats_html = f'\n      <div class="stat-row">{cards}</div>'

    # related terms
    rel_cards = "".join([f'\n          <a href="{r["slug"]}.html" class="related-card"><div class="rt">{r["name"]}</div><div class="rd">{r["desc"]}</div></a>' for r in related])
    related_html = f'''\n      <div class="related-terms">
        <div class="related-terms-title">Termes liés</div>
        <div class="related-grid">{rel_cards}
        </div>
      </div>'''

    # next steps
    next_html = ""
    if next_steps:
        lis = "\n".join([f'          <li><a href="{n["href"]}">{n["text"]}</a></li>' for n in next_steps])
        next_html = f'''\n      <div class="next-steps">
        <h3>Pour aller plus loin</h3>
        <ul>
{lis}
        </ul>
      </div>'''

    # faq html
    faq_items = "\n".join([f'        <div class="faq-item"><div class="faq-q" onclick="toggleFaq(this)">{f["q"]}</div><div class="faq-a">{f["a"]}</div></div>' for f in faq])

    # share bar
    import urllib.parse
    enc_url = urllib.parse.quote(url, safe="")
    enc_title = urllib.parse.quote(f"{h1} : définition")
    share_html = f'''\n      <div class="share-bar">
        <span class="share-bar-label">Partager :</span>
        <a href="https://www.linkedin.com/sharing/share-offsite/?url={enc_url}" target="_blank" rel="noopener" class="share-btn share-btn-linkedin">{LINKEDIN_SVG}LinkedIn</a>
        <a href="https://twitter.com/intent/tweet?url={enc_url}&text={enc_title}" target="_blank" rel="noopener" class="share-btn share-btn-x">{X_SVG}X</a>
        <a href="https://www.facebook.com/sharer/sharer.php?u={enc_url}" target="_blank" rel="noopener" class="share-btn share-btn-facebook">{FB_SVG}Facebook</a>
      </div>'''

    alt_names_str = "[" + ",".join([f'"{n}"' for n in alt_names]) + "]"

    html = f'''<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <meta name="description" content="{meta_desc}">
  <meta name="author" content="La rédaction Meilleur Logiciel RH">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="{url}">
  <link rel="icon" href="../assets/images/favicon-mlrh.png" type="image/png">
  <link rel="preload" href="../assets/style.css" as="style">
  <link rel="stylesheet" href="../assets/style.css">
  <link rel="stylesheet" href="../assets/definitions.css">

  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{og_desc}">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="fr_FR">
  <meta property="og:image" content="{BASE}/assets/images/definitions/{image}">
  <meta property="og:url" content="{url}">
  <meta property="article:published_time" content="{DATE}">
  <meta property="article:modified_time" content="{DATE}">

  <link rel="alternate" hreflang="fr" href="{url}">
  <link rel="alternate" hreflang="x-default" href="{url}">

  <script type="application/ld+json">
  {jsonld_str}
  </script>
</head>
<body class="article-page-wrap">

  {NAV}

  <nav class="breadcrumb" aria-label="Fil d'Ariane">
    <div class="breadcrumb-inner">
      <a href="../">Accueil</a>
      <span class="breadcrumb-sep">/</span>
      <a href="../definitions-rh/">Définitions RH</a>
      <span class="breadcrumb-sep">/</span>
      <span>{breadcrumb_name}</span>
    </div>
  </nav>

  <section class="article-hero">
    <div class="article-hero-flex">
      <div class="article-hero-left">
        <img class="sponsored-mention" src="../assets/images/mention-sponsorisee-fr.png" alt="Publication sponsorisée" width="206" height="25">
        <span class="badge">Définition RH</span>
        <h1>{h1_display}</h1>
        <p class="article-hero-sub">
          <strong>{hero_strong}</strong> {hero_rest}
        </p>
        <!-- emplacement des disclaimers sante et finance (p.content-disclaimer) -->
        <div class="article-hero-meta">
          <div class="author-line"><div class="author-avatar" aria-hidden="true">M</div><span class="author-signature">La rédaction Meilleur Logiciel RH</span></div>
          <span>Mis à jour le 23 avril 2026</span>
          <span>Lecture : {time_min} min</span>
        </div>
      </div>
      <img class="hero-thumb" src="../assets/images/definitions/{image}" alt="{image_alt}" title="Illustration - {h1}" width="300" height="200">
    </div>
  </section>

  <div class="def-outer">
    <main class="def-main">

      <div class="tldr">
        <div class="tldr-title">En bref</div>
        <ul>
{tldr_html}
        </ul>
      </div>
{sections_html}{case_html}{legal_html}{stats_html}{related_html}{next_html}{share_html}

      <section class="faq-section" id="faq">
        <h2>Questions fréquentes</h2>
{faq_items}
      </section>

      <section class="author-box" aria-label="À propos de l'auteur">
        <div class="author-box-avatar" aria-hidden="true">M</div>
        <div class="author-box-text">
          <p class="author-box-label">À propos de l'auteur</p>
          <p class="author-box-name">La rédaction Meilleur Logiciel RH</p>
          <p class="author-box-bio">Meilleur Logiciel RH est un média sur les logiciels RH, la paie et les SIRH, édité par upearly, agence SEO et GEO. Ses articles peuvent avoir une portée promotionnelle : certaines marques citées sont clientes d'upearly.</p>
          <a class="author-box-link" href="../a-propos.html">En savoir plus sur nous</a>
        </div>
      </section>

    </main>
  </div>

  {FOOTER}

  {SCRIPTS}
</body>
</html>
'''
    return html


# ============================================================
# DATA — 54 définitions RH
# ============================================================
DEFINITIONS = {}


def run():
    from definitions_data import DEFINITIONS as D
    for slug, data in D.items():
        html = render(slug, data)
        path = f"{OUT_DIR}/{slug}.html"
        with open(path, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"✓ {slug}")
    print(f"\n{len(D)} définitions générées dans {OUT_DIR}")


if __name__ == "__main__":
    run()
