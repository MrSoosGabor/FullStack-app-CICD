# React Native Expo Mobilalkalmazás - EAS Build Útmutató

## Telepítési utasítások

### 1. Előfeltételek
- Node.js 18+ (már telepítve)
- npm/yarn
- Expo CLI: `npm install -g eas-cli`
- Expo fiók: https://expo.dev (regisztrálj/bejelentkezz)

### 2. EAS Login
```bash
eas login
```
Ezután add meg a bejelentkezési adataidat.

### 3. APK Build az Androidhoz

**A. Felhő alapú build (ajánlott - nincs szükség SDK-ra):**
```bash
cd mobile
eas build --platform android --profile preview
```

**B. Lokális build (szükséges Android SDK):**
```bash
eas build --platform android --local
```

### 4. APK Letöltés
Az `eas build` parancs után a konzolban megjelenik egy link, ahonnan letöltheted az APK-t.

### 5. Telepítés a teleforra

**Android:**
- Letöltött APK másolása a teleforra, majd:
  - Fájlkezelő → APK → Megnyitás → Telepítés
  - vagy: `adb install app.apk` (Android Debug Bridge)

### 6. Frissítés előtti lépések

Közzétételhez szükséges:
- Update `version` az app.json-ban
- EAS-ben konfigurálva van a preview és production buildfájl

## Build Profilok

- **preview**: Gyors APK build fejlesztéshez
- **production**: Optimalizált APK release-hez

## Útmutató az első buildhez

```bash
# 1. Login
eas login

# 2. Build
eas build --platform android --profile preview

# 3. Ez után már letöltheted az APK-t és telepítheted a teleforra
```

## Troubleshooting

- **"Owner has not been set"**: `eas login` utána ismét próbáld a buildet
- **Build sikertelen**: Ellenőrizd az `eas.json` és `app.json` szintaxisát
- **APK telepítés nem működik**: Engedélyezd az "Ismeretlen források" beállítást az Androidon

## Fejlesztés alatt

Fejlesztéshez továbbra is használhatod az Expo Go appot:
```bash
npx expo start
```
