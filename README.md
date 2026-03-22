# Fullstack Mobiltelefon CRUD Alkalmazás

![CI Status](https://github.com/MrSoosGabor/FullStack-app-CICD/workflows/Full%20Stack%20CI/badge.svg)

Egy teljes stack webalkalmazás mobiltelefon adatok kezelésére React + Vite frontend és Node.js + Express + MongoDB backend használatával.

## 🚀 Funkciók

- ✅ Mobiltelefon hozzáadása gyártó információval
- ✅ Mobiltelefon lista megtekintése
- ✅ Mobiltelefon módosítása
- ✅ Mobiltelefon törlése
- ✅ Gyártók kezelése
- ✅ **CI/CD Pipeline** - Automatikus deployment GitHub Actions-szel

## 📋 Technológiák

### Frontend
- React 18
- Vite
- Formik (form kezelés)
- Bootstrap 5 + Reactstrap
- Fetch API

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- CORS
- dotenv

## 🛠️ Telepítés és Futtatás

### Előkövetelmények

- Node.js (v16+)
- MongoDB (helyi vagy MongoDB Atlas)
- Git

### 1. Repository klónozása

```bash
git clone <your-repo-url>
cd "FullStack app CICD"
```

### 2. Backend beállítás

```bash
cd backend
npm install
```

Hozz létre egy `.env` fájlt a backend mappában:

```env
DATABASE_URL=mongodb://localhost:27017/mobiltelefon_db
# vagy MongoDB Atlas connection string:
# DATABASE_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>
PORT=3000
```

Backend indítása:

```bash
npm start
```

A backend fut a `http://localhost:3000` címen.

### 3. Frontend beállítás

Új terminálban:

```bash
cd frontend
npm install
```

Hozz létre egy `.env` fájlt a frontend mappában:

```env
VITE_API_URL=http://localhost:3000
```

Frontend indítása:

```bash
npm run dev
```

A frontend fut a `http://localhost:5173` címen (vagy amit a Vite kiír).

## 🌐 Deployment (Ingyenes opciók)

### MongoDB Adatbázis
1. Menj a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)-hoz
2. Hozz létre egy ingyenes klasztert
3. Hozz létre egy database user-t
4. Whitelist-eld az IP címeket (vagy engedélyezd mindenhonnan: `0.0.0.0/0`)
5. Másold ki a connection string-et

### Backend Deployment

**Opció 1: Render**
1. Menj a [Render.com](https://render.com)-ra
2. Hozz létre egy új Web Service-t
3. Kapcsold össze a GitHub repo-val
4. Build Command: `cd backend && npm install`
5. Start Command: `cd backend && npm start`
6. Környezeti változók:
   - `DATABASE_URL`: MongoDB Atlas connection string
   - `PORT`: 10000 (Render automatikusan beállítja)

**Opció 2: Railway**
1. Menj a [Railway.app](https://railway.app)-ra
2. Deploy from GitHub repo
3. Állítsd be a root directory-t: `backend`
4. Add meg a környezeti változókat

**Opció 3: Fly.io**
- Ingyenes 3 kis VM
- CLI-vel történő deployment

### Frontend Deployment

**Opció 1: Vercel (ajánlott)**
1. Menj a [Vercel.com](https://vercel.com)-ra
2. Import GitHub repo
3. Framework Preset: Vite
4. Root Directory: `frontend`
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Környezeti változók:
   - `VITE_API_URL`: (deployed backend URL, pl. `https://your-app.onrender.com`)

**Opció 2: Netlify**
1. Menj a [Netlify.com](https://www.netlify.com)-ra
2. Import GitHub repo
3. Base directory: `frontend`
4. Build command: `npm run build`
5. Publish directory: `frontend/dist`
6. Environment variables:
   - `VITE_API_URL`: (deployed backend URL)

## 📁 Projekt Struktúra

```
FullStack app CICD/
├── backend/
│   ├── .env.example          # Példa környezeti változók
│   ├── .gitignore
│   ├── index.js              # Express szerver
│   ├── models.js             # Mongoose modellek
│   ├── routes.js             # API routes
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Fő komponens
│   │   ├── main.jsx
│   │   └── ...
│   ├── .env.example          # Példa környezeti változók
│   ├── .gitignore
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── .gitignore
└── README.md
```

## 🔒 Biztonsági Megjegyzések

- ⚠️ **SOHA** ne commitolj `.env` fájlokat!
- ⚠️ **SOHA** ne tedd publikussá az adatbázis jelszavakat!
- ✅ Használj `.env.example` fájlokat a szükséges változók dokumentálására
- ✅ Állítsd be a MongoDB IP whitelisting-et production-ben

## 📝 API Endpoints

- `GET /api/gyartok` - Összes gyártó lekérése
- `GET /api/mobilok` - Összes mobiltelefon lekérése
- `POST /api/mobilok` - Új mobiltelefon létrehozása
- `PATCH /api/mobilok/:id` - Mobiltelefon módosítása
- `DELETE /api/mobilok/:id` - Mobiltelefon törlése
- `GET /api/gyartok/:gyartoId/mobilok` - Egy gyártó telefonjai

## 🔄 CI/CD Pipeline

Ez a projekt automatikus CI/CD pipeline-t használ GitHub Actions segítségével.

**Részletes dokumentáció:** [CI-CD-DOCS.md](CI-CD-DOCS.md)

### Funkciók:
- ✅ Automatikus tesztelés minden commit-nál
- ✅ Külön workflow backend és frontend változásokhoz
- ✅ Automatikus deployment Render (backend) és Vercel (frontend) platformokra
- ✅ Build artifact mentés
- ✅ PR preview deployment-ek

### Workflow-k:
- **Backend CI** - Backend validáció és deploy
- **Frontend CI** - ESLint, build, deploy
- **Full Stack CI** - Integrált pipeline

## 🤝 Közreműködés

Pull request-ek üdvözöltek! Nagyobb változtatások esetén kérlek először nyiss egy issue-t.

**CI követelmények:**
- Minden PR automatikusan tesztelve van
- A CI-nek zöldnek kell lennie merge előtt

## 📄 Licenc

MIT

