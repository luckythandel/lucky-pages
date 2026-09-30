# luckythandel-site

Static article site for **Lucky Thandel** — cybersecurity writeups, CTF solutions,
retired HTB walkthroughs, and career guides. Dark/night hacking theme, zero build
step, zero dependencies. Deployed to GitHub Pages at `https://luckythandel.github.io/lucky-pages/`.

## Preview locally

```sh
cd luckythandel-site
python3 -m http.server 4000
# open http://127.0.0.1:4000/
```

## Pages

| Path | Page |
|---|---|
| `/` | homepage (hero + latest articles) |
| `/articles/` | article listing |
| `/articles/htb-blue-walkthrough/` | HTB Blue EternalBlue walkthrough |
| `/articles/picoctf-sqli-writeup/` | picoCTF SQL injection writeup |
| `/articles/cybersecurity-career-roadmap/` | career roadmap 2026 |
| `/about/` | about Lucky Thandel |
| `/contact/` | LinkedIn / GitHub / email |

## Deploy

- **GitHub Actions** (`.github/workflows/deploy.yml`): validates HTML + internal
  links, then publishes the `luckythandel-site/` subtree to GitHub Pages on push
  to `main`. Live at `https://luckythandel.github.io/lucky-pages/`.
- **Jenkins** (`Jenkinsfile`): same link check, publishes the
  `luckythandel-site/` subtree to `gh-pages`. Job: `luckythandel-site-deploy`.

Target repo: `luckythandel/lucky-pages`.
