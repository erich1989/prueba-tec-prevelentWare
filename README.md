# Sistema de Gestión de Ingresos y Gastos

Aplicación fullstack con Next.js para la gestión de ingresos y egresos, usuarios y reportes. Incluye autenticación con Better Auth (GitHub OAuth), control de acceso por roles (RBAC) y API REST documentada.

## Stack tecnológico

- **Next.js** (Pages Router) – Framework React
- **TypeScript** – Tipado estático
- **Material-UI (MUI)** – Componentes UI
- **Tailwind CSS** – Utilidades CSS
- **Prisma** – ORM (Postgres en Supabase)
- **Better Auth** – Autenticación y sesiones (GitHub OAuth)

## Requisitos previos

- Node.js 18+
- Cuenta en [Supabase](https://supabase.com) (Postgres)
- Cuenta en [GitHub](https://github.com) (OAuth App para login)

## Desarrollo local

### 1. Clonar e instalar dependencias

```bash
git clone <url-del-repositorio>
cd prueba-tec-prevalentWare
npm install
```

### 2. Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con:

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | URI de Postgres (Supabase). Usar **Connection pooling** (puerto 6543). |
| `DIRECT_URL` | URI directa a Postgres (Supabase), sin pooler. Para Prisma. |
| `BETTER_AUTH_SECRET` | Secreto para firmar sesiones (mín. 32 caracteres). Ej.: `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | URL de la app. En local: `http://localhost:3000` |
| `GITHUB_CLIENT_ID` | Client ID de la GitHub OAuth App |
| `GITHUB_CLIENT_SECRET` | Client Secret de la GitHub OAuth App |

### 3. Base de datos (Prisma + Supabase)

Con `DATABASE_URL` y `DIRECT_URL` configurados en `.env`:

```bash
npm run db:generate
npm run db:push
```

Si `db:push` falla con **P1011 (TLS)**, copia la URI exacta desde Supabase (Project Settings → Database → Connection pooling para `DATABASE_URL`, direct URL para `DIRECT_URL`).

### 4. GitHub OAuth (Better Auth)

1. En [GitHub → Developer settings → OAuth Apps](https://github.com/settings/developers), crea una OAuth App.
2. **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
3. Copia el Client ID y el Client Secret a tu `.env`.

### 5. Arrancar la aplicación

```bash
npm run dev
```

La app estará disponible en: **http://localhost:3000**

- **Login**: inicia sesión con GitHub.
- **Rutas**: Inicio (`/`), Movimientos (`/movimientos`), Usuarios (`/usuarios`, solo ADMIN), Reportes (`/reportes`, solo ADMIN).

## Estructura del proyecto

```
├── app/
│   ├── components/          # Componentes reutilizables (diálogos, gráficos, navegación)
│   ├── config/              # Configuración (nav, tests)
│   └── theme/               # Tema MUI
├── pages/
│   ├── api/                 # API Routes (auth, movimientos, usuarios, reportes)
│   ├── index.tsx            # Inicio
│   ├── login/
│   ├── movimientos/
│   ├── usuarios/
│   └── reportes/
├── hooks/                   # Hooks (useMovimientos, useUsuarios, useReportes, useResumenMes)
├── styles/                  # Estilos por página (*.styles.ts)
├── lib/                     # Auth, Prisma, formatters, OpenAPI
├── prisma/
│   └── schema.prisma
└── package.json
```

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run db:generate` | Genera cliente Prisma |
| `npm run db:push` | Aplica schema a la base de datos |
| `npm test` | Ejecuta tests (Jest) |

## Documentación del API

Con la app en marcha, la documentación OpenAPI está en:

- **http://localhost:3000/docs** (o la ruta configurada en el proyecto)

## Despliegue en Vercel

### 1. Repositorio en GitHub

- Sube el código a un repositorio en GitHub.
- El **Root Directory** en Vercel debe ser la raíz del repo (donde está `package.json`).

### 2. Crear proyecto en Vercel

1. Entra en [vercel.com](https://vercel.com) e inicia sesión (por ejemplo con GitHub).
2. **Add New** → **Project** e importa el repositorio.
3. **Framework Preset**: Next.js (detectado automáticamente).
4. **Build Command**: `npm run build`
5. **Install Command**: `npm install`

### 3. Variables de entorno en Vercel

En **Settings** → **Environment Variables** del proyecto, añade:

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | URI de Postgres (Supabase). Usar Connection pooling (puerto 6543) con `?pgbouncer=true&connection_limit=1` para serverless. |
| `DIRECT_URL` | URI directa a Postgres (Supabase). |
| `BETTER_AUTH_URL` | URL pública de la app en producción (ej.: `https://tu-proyecto.vercel.app`). |
| `BETTER_AUTH_SECRET` | Secreto para sesiones (mín. 32 caracteres). |
| `GITHUB_CLIENT_ID` | Client ID de la GitHub OAuth App. |
| `GITHUB_CLIENT_SECRET` | Client Secret de la GitHub OAuth App. |

### 4. Callback de GitHub OAuth en producción

En la OAuth App de GitHub, añade como **Authorization callback URL**:

```
https://tu-dominio.vercel.app/api/auth/callback/github
```

(Sustituye `tu-dominio.vercel.app` por la URL que asigne Vercel.)

Puedes tener en la misma OAuth App la URL de localhost y la de Vercel.

### 5. Base de datos antes del primer deploy

- Las tablas deben existir en Supabase antes del primer deploy.
- Ejecuta `npm run db:push` en local con las mismas `DATABASE_URL` y `DIRECT_URL` que usarás en producción.
- No ejecutes migraciones desde Vercel; hazlas desde tu máquina.

### 6. Desplegar

- **Deploy** desde el dashboard de Vercel (o con cada push si tienes deploys automáticos).
- Comprueba que `BETTER_AUTH_URL` coincida con la URL de la app y con la callback de GitHub.

## Resumen rápido (Vercel)

1. Repo en GitHub, Root Directory = raíz del repo.
2. Variables: `DATABASE_URL`, `DIRECT_URL`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`.
3. Callback GitHub: `https://<tu-url-vercel>/api/auth/callback/github`.
4. Base de datos creada en Supabase y `db:push` ejecutado en local.
5. Deploy; si falla, revisar logs en Vercel y que las variables estén definidas para el entorno correcto (Production/Preview).
