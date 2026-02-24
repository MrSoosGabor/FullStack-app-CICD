# CI/CD Pipeline Documentation

## 🔄 Automated CI/CD Workflows

Ez a projekt 3 GitHub Actions workflow-val rendelkezik az automatikus teszteléshez és deploymenthez.

### Workflow-k

#### 1. **Backend CI/CD** (`.github/workflows/backend-ci.yml`)
- **Mikor fut:** Backend módosításoknál
- **Mit csinál:**
  - ✅ Dependency telepítés
  - ✅ Lint check (ha van)
  - ✅ Tesztek futtatása (ha van)
  - 🚀 Auto-deploy jelzés (Render automatikusan deployol)

#### 2. **Frontend CI/CD** (`.github/workflows/frontend-ci.yml`)
- **Mikor fut:** Frontend módosításoknál
- **Mit csinál:**
  - ✅ Dependency telepítés
  - ✅ ESLint futtatás
  - ✅ Build készítés
  - ✅ Build artifacts mentése
  - 🚀 Auto-deploy jelzés (Vercel automatikusan deployol)

#### 3. **Full Stack CI** (`.github/workflows/full-ci.yml`)
- **Mikor fut:** Bármilyen push/PR
- **Mit csinál:**
  - 🔍 Detektálja melyik rész változott
  - ✅ Csak a módosított részeket teszteli
  - 📊 Összesített státusz

---

## 🚀 A CI/CD működése

### Auto-Deployment

**Render (Backend):**
- Automatikusan deploy-ol minden `master/main` branch push után
- Nincs szükség manuális triggerelésre

**Vercel (Frontend):**
- Automatikusan deploy-ol minden `master/main` branch push után
- Preview deployment-eket készít PR-ekhez

### GitHub Actions Jogosultságok

A workflow-k futásához **NEM kell** semmi extra beállítás, mert:
- Render és Vercel a repo-t figyelik direkt GitHub integráción keresztül
- A Actions csak tesztel és validál

---

## 📊 CI Pipeline Lépései

```
┌─────────────────────┐
│  Git Push/PR        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Detect Changes     │ ← Full CI Workflow
│  (backend/frontend) │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
┌─────────┐  ┌──────────┐
│ Backend │  │ Frontend │
│   CI    │  │    CI    │
└────┬────┘  └────┬─────┘
     │            │
     ▼            ▼
  Install     Install
  Deps        Deps
     │            │
     ▼            ▼
  (Tests)      Lint
     │            │
     ▼            ▼
  ✅ Pass      Build
     │            │
     ▼            ▼
                ✅ Pass
     │            │
     └─────┬──────┘
           ▼
  ┌────────────────┐
  │ Auto-Deploy    │
  │ Render/Vercel  │
  └────────────────┘
```

---

## 🔧 GitHub Secrets Beállítása (Opcionális)

Ha később environment változókat akarsz használni a CI-ben:

1. GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret**

Példa secretek:
```
VITE_API_URL = https://your-backend.onrender.com
```

Használat a workflow-ban:
```yaml
env:
  VITE_API_URL: ${{ secrets.VITE_API_URL }}
```

---

## ✅ CI Status Badge

Adj hozzá egy badge-et a README-hez:

```markdown
![CI Status](https://github.com/MrSoosGabor/FullStack-app-CICD/workflows/Full%20Stack%20CI/badge.svg)
```

---

## 🎯 Best Practices

1. **Branch Protection Rules:**
   - Settings → Branches → Add rule
   - Require status checks before merging
   - Require CI passes

2. **Pull Request workflow:**
   - CI automatikusan fut minden PR-nél
   - Csak zöld (✅) CI után merge-elj

3. **Monitoring:**
   - GitHub Actions tab → Nézd a futásokat
   - Render Dashboard → Deploy logs
   - Vercel Dashboard → Deployment logs

---

## 🐛 Troubleshooting

### Ha a CI fail-el:

1. **Check logs:** Actions tab → Failed workflow → View logs
2. **Common issues:**
   - `npm ci` fail → Törölj `package-lock.json`-t és generálj újat
   - Build fail → Ellenőrizd az env változókat
   - Lint error → Futtasd lokálisan: `npm run lint`

### Ha a deployment fail-el:

**Render:**
- Dashboard → Service → Logs
- Ellenőrizd az Environment Variables-t

**Vercel:**
- Dashboard → Project → Deployments → View logs
- Ellenőrizd az Environment Variables-t

---

## 📈 Következő lépések (Opcionális fejlesztések)

- [ ] Unit tesztek hozzáadása (Jest)
- [ ] E2E tesztek (Playwright/Cypress)
- [ ] Code coverage report
- [ ] Automated dependency updates (Dependabot)
- [ ] Security scanning
- [ ] Performance testing

---

**Készítve:** GitHub Actions  
**Auto-deploy:** Render + Vercel  
**Status:** ✅ Production Ready
