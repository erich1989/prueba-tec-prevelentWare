# Frontend - App Contenido Drupal

Aplicación Next.js 16 LTS para la interfaz de usuario del sistema de importación de documentos Word a Drupal.

## Stack Tecnológico

- **Next.js 16 LTS** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Material-UI (MUI)** - Librería de componentes UI (Material Design)
- **Tailwind CSS** - Utilidades CSS adicionales

## Desarrollo local

### Instalar dependencias

```bash
npm install
```

### Ejecutar en desarrollo

```bash
npm run dev
```

La app estará disponible en: http://localhost:3000

### Prisma y base de datos (Supabase)

El archivo `.env` debe tener `DATABASE_URL` y `DIRECT_URL` (URIs de Supabase). Para crear las tablas:

```bash
npm run db:generate
npm run db:push
```

Si `db:push` falla con **P1011 (TLS)**, copia la URI exacta desde Supabase (Project Settings → Database → Connection pooling para `DATABASE_URL`, direct URL para `DIRECT_URL`).

### Better Auth y GitHub OAuth

1. En `.env` configura:
   - `BETTER_AUTH_SECRET`: mínimo 32 caracteres (ej.: `openssl rand -base64 32`).
   - `BETTER_AUTH_URL`: URL de la app (ej.: `http://localhost:3000`).
   - `GITHUB_CLIENT_ID` y `GITHUB_CLIENT_SECRET`: crea una OAuth App en [GitHub Developer Settings](https://github.com/settings/developers). **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github` (en producción usa tu dominio).

## Estructura del proyecto

```
Frontend/
├── app/                    # App Router de Next.js
├── components/              # Componentes organizados con Atomic Design
│   ├── atoms/              # Componentes básicos (Button, Input, Label)
│   ├── molecules/          # Combinaciones de átomos (FormField)
│   ├── organisms/           # Componentes complejos
│   └── templates/           # Layouts y estructuras
├── public/                 # Archivos estáticos
└── package.json            # Dependencias
```

## Arquitectura: Atomic Design + Material Design

Este proyecto utiliza **Atomic Design** como metodología para organizar los componentes y **Material-UI (MUI)** como librería de componentes UI basada en Material Design.

Ver [app/components/README.md](./app/components/README.md) para más detalles sobre Atomic Design.

### Niveles
- **Atoms**: Componentes básicos e indivisibles (pueden ser wrappers de MUI o componentes custom)
- **Molecules**: Combinaciones simples de átomos
- **Organisms**: Componentes complejos
- **Templates**: Layouts y estructuras de página

### Material Design

El proyecto usa **Material-UI (MUI)** para los componentes UI. Los componentes de MUI pueden:
- Usarse directamente en páginas
- Wrappearse en Atoms para personalización
- Combinarse en Molecules y Organisms

**Documentación:**
- [Material-UI](https://mui.com/)
- [Material Design](https://m3.material.io/)

---

## Despliegue en Vercel

### 1. Repositorio en GitHub

- Sube el código a un repositorio en GitHub (si el proyecto está en la raíz del repo, en Vercel deberás indicar **Root Directory**: `Frontend`).

### 2. Crear proyecto en Vercel

1. Entra en [vercel.com](https://vercel.com) e inicia sesión (con GitHub si quieres conectar el repo).
2. **Add New** → **Project**.
3. Importa el repositorio de GitHub.
4. **Root Directory**: selecciona `Frontend` (carpeta donde está el `package.json` y `next.config.ts`).
5. **Framework Preset**: Next.js (detectado automáticamente).
6. **Build Command**: `npm run build` (por defecto; el script ya incluye `prisma generate`).
7. **Output Directory**: dejar por defecto (Next.js).
8. **Install Command**: `npm install`.

### 3. Variables de entorno en Vercel

En **Settings** → **Environment Variables** del proyecto, añade:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | URI de Postgres (Supabase). Usar **Connection pooling** (puerto 6543) con `?pgbouncer=true&connection_limit=1` recomendado para serverless. | `postgresql://postgres.xxx:xxx@aws-0-xx.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require` |
| `DIRECT_URL` | URI directa a Postgres (Supabase), sin pooler. Para migraciones y Prisma. | `postgresql://postgres.xxx:xxx@db.xxx.supabase.co:5432/postgres?sslmode=require` |
| `BETTER_AUTH_URL` | URL pública de la app en producción. | `https://tu-proyecto.vercel.app` |
| `BETTER_AUTH_SECRET` | Secreto para firmar sesiones (mín. 32 caracteres). | `openssl rand -base64 32` |
| `GITHUB_CLIENT_ID` | Client ID de la GitHub OAuth App. | |
| `GITHUB_CLIENT_SECRET` | Client Secret de la GitHub OAuth App. | |
| `NEXT_PUBLIC_APP_URL` | (Opcional) Misma URL que `BETTER_AUTH_URL` si el cliente debe conocer la base URL. | `https://tu-proyecto.vercel.app` |

### 4. GitHub OAuth (Better Auth)

En [GitHub → Developer settings → OAuth Apps](https://github.com/settings/developers):

- Crea una aplicación (o edita la existente).
- **Authorization callback URL** en producción:  
  `https://tu-dominio.vercel.app/api/auth/callback/github`  
  (reemplaza `tu-dominio.vercel.app` por la URL que te asigne Vercel, p. ej. `mi-app-xxx.vercel.app`).

Puedes añadir tanto `http://localhost:3000/api/auth/callback/github` como la URL de Vercel en la misma OAuth App si usas la misma para desarrollo y producción.

### 5. Desplegar

- **Deploy** desde el dashboard de Vercel (o con cada push a la rama principal si dejaste los deploys automáticos).
- Tras el primer deploy, comprueba que la URL de la app coincida con `BETTER_AUTH_URL` y con la callback de GitHub.

### 6. Base de datos y migraciones

- Las tablas deben existir en Supabase antes del primer deploy (ejecuta `npm run db:push` o `npm run db:migrate` desde local con `DATABASE_URL` y `DIRECT_URL` apuntando a la misma base que usarás en producción).
- No ejecutes migraciones desde Vercel; hazlas desde tu máquina o desde un job/script que tenga acceso a la base.

### Resumen rápido

1. Repo en GitHub, Root Directory = `Frontend`.
2. Variables de entorno: `DATABASE_URL`, `DIRECT_URL`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`.
3. Callback de GitHub OAuth = `https://<tu-url-vercel>/api/auth/callback/github`.
4. Deploy; si algo falla, revisar logs de build en Vercel y que las variables estén definidas para el entorno correcto (Production/Preview).
# prueba-tec-prevelentWare
