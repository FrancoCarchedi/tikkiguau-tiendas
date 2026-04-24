# Documentación de Dependencias — TikkiGuau

> Guía de uso de cada dependencia instalada y configurada en el proyecto.

---

## Índice

1. [Tipografías](#tipografías)
2. [Tailwind CSS](#tailwind-css)
3. [Zustand](#zustand)
4. [React Hook Form](#react-hook-form)
5. [Axios](#axios)
6. [TanStack Query](#tanstack-query)
7. [Prisma](#prisma)
8. [Vercel Postgres](#vercel-postgres)
9. [Vercel Blob](#vercel-blob)
10. [Resend](#resend)

---

## Tipografías

El proyecto usa dos tipografías configuradas en `app/layout.tsx` vía `next/font`.

### Marykate (Primaria)

Font cargada como tipografía local mediante `next/font/local`.

**Acción requerida:** Debes colocar el archivo de la fuente en `app/fonts/marykate.woff2`.

Uso en CSS / Tailwind:

```css
font-family: var(--font-marykate);
```

```html
<!-- Con Tailwind (variable registrada en globals.css como --font-primary) -->
<h1 class="font-[family-name:var(--font-marykate)]">Título</h1>
```

### Poppins (Secundaria)

Font cargada desde Google Fonts mediante `next/font/google`. Pesos disponibles: 300, 400, 500, 600, 700.

Uso en CSS / Tailwind:

```css
font-family: var(--font-poppins);
```

```html
<p class="font-[family-name:var(--font-poppins)]">Texto</p>
```

> El body usa Poppins por defecto (configurado en `globals.css`).

---

## Tailwind CSS

**Versión:** v4 (ya configurada en el proyecto base).

Tailwind v4 se importa directamente en CSS sin necesidad de un archivo `tailwind.config.js`.

### Variables personalizadas

Las variables de tema se definen en `app/globals.css` dentro del bloque `@theme inline`:

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-primary: var(--font-marykate);
  --font-secondary: var(--font-poppins);
}
```

### Uso de colores y fuentes

```html
<div class="bg-background text-foreground">...</div>
```

Para agregar colores o valores personalizados, extiende el bloque `@theme` en `globals.css`:

```css
@theme inline {
  --color-brand: #ff6b6b;
  --color-brand-dark: #cc5252;
}
```

---

## Zustand

Gestor de estado global ligero para React.

### Crear un store

```typescript
// lib/stores/useAuthStore.ts
import { create } from "zustand";

interface AuthState {
  user: { id: string; name: string } | null;
  setUser: (user: AuthState["user"]) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
```

### Usar el store en un componente

```typescript
"use client";

import { useAuthStore } from "@/lib/stores/useAuthStore";

export function Profile() {
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);

  return <div>{user?.name}</div>;
}
```

### Persistencia (opcional)

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSettingsStore = create(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme: string) => set({ theme }),
    }),
    { name: "settings-storage" } // clave en localStorage
  )
);
```

---

## React Hook Form

Librería para manejo de formularios con validación eficiente.

### Uso básico

```typescript
"use client";

import { useForm, SubmitHandler } from "react-hook-form";

type FormValues = {
  email: string;
  password: string;
};

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("email", {
          required: "El email es requerido",
          pattern: { value: /^\S+@\S+$/i, message: "Email inválido" },
        })}
      />
      {errors.email && <p>{errors.email.message}</p>}

      <input
        type="password"
        {...register("password", { required: "La contraseña es requerida", minLength: 8 })}
      />
      {errors.password && <p>{errors.password.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        Ingresar
      </button>
    </form>
  );
}
```

### Con Zod (validación de esquema)

```bash
npm install zod @hookform/resolvers
```

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  // ...
}
```

---

## Axios

Cliente HTTP configurado en `lib/axios.ts` con `baseURL` apuntando a `/api` por defecto.

### Instancia preconfigurada

```typescript
import api from "@/lib/axios";

// GET
const response = await api.get("/products");

// POST
const response = await api.post("/products", { name: "Collar", price: 1500 });

// PUT
const response = await api.put("/products/1", { price: 1800 });

// DELETE
await api.delete("/products/1");
```

### Personalizar baseURL

En `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.externa.com
```

### Interceptores (opcional)

```typescript
// lib/axios.ts — agregar debajo de la instancia
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // redirigir a login
    }
    return Promise.reject(error);
  }
);
```

---

## TanStack Query

El `QueryClientProvider` está configurado en `app/providers.tsx` y ya está envolviendo toda la app desde `app/layout.tsx`.

### useQuery — obtener datos

```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

async function fetchProducts() {
  const { data } = await api.get("/products");
  return data;
}

export function ProductList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar productos</p>;

  return <ul>{data.map((p: any) => <li key={p.id}>{p.name}</li>)}</ul>;
}
```

### useMutation — crear/actualizar/eliminar

```typescript
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export function CreateProduct() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newProduct: { name: string; price: number }) =>
      api.post("/products", newProduct),
    onSuccess: () => {
      // Invalida la caché para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return (
    <button onClick={() => mutation.mutate({ name: "Juguete", price: 500 })}>
      {mutation.isPending ? "Creando..." : "Crear producto"}
    </button>
  );
}
```

### Prefetch en Server Components (opcional)

```typescript
// app/products/page.tsx
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export default async function ProductsPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["products"],
    queryFn: () => fetch("/api/products").then((r) => r.json()),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductList />
    </HydrationBoundary>
  );
}
```

> Las **React Query DevTools** están habilitadas en desarrollo y aparecen en la esquina inferior de la pantalla.

---

## Prisma

ORM para TypeScript. El cliente está configurado en `lib/prisma.ts` como singleton para evitar múltiples conexiones en desarrollo.

### Definir modelos

Edita `prisma/schema.prisma`:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Pet {
  id        String   @id @default(cuid())
  name      String
  species   String
  owner     User     @relation(fields: [ownerId], references: [id])
  ownerId   String
  createdAt DateTime @default(now())
}
```

### Comandos principales

```bash
# Crear y aplicar una migración (desarrollo)
npx prisma migrate dev --name nombre-de-la-migracion

# Aplicar migraciones en producción
npx prisma migrate deploy

# Sincronizar esquema sin migraciones (solo desarrollo)
npx prisma db push

# Abrir Prisma Studio (GUI de base de datos)
npx prisma studio

# Regenerar el cliente después de cambiar el schema
npx prisma generate
```

### Usar el cliente en API Routes

```typescript
// app/api/users/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();
  const user = await prisma.user.create({
    data: { email: body.email, name: body.name },
  });
  return NextResponse.json(user, { status: 201 });
}
```

### Variables de entorno requeridas

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?schema=public"
DATABASE_URL_UNPOOLED="postgresql://USER:PASSWORD@HOST:5432/DB?schema=public"
```

> `DATABASE_URL` es la URL **pooled** (para queries). `DATABASE_URL_UNPOOLED` es la URL **directa** usada por Prisma para migraciones. En Vercel Postgres / Neon, ambas están disponibles en el dashboard.

---

## Vercel Postgres

Integración de base de datos PostgreSQL con Vercel (migrado a Neon). Permite ejecutar queries SQL directamente sin Prisma si se prefiere.

> **Nota:** `@vercel/postgres` está deprecado. Si vas a crear una nueva base de datos, considera usar el SDK de Neon directamente (`@neondatabase/serverless`). La configuración actual es funcional para proyectos existentes.

### Uso (Server Actions / API Routes)

```typescript
import { sql } from "@vercel/postgres";

// Query directa
const { rows } = await sql`SELECT * FROM users WHERE id = ${userId}`;

// Con parámetros
const { rows } = await sql`
  INSERT INTO products (name, price)
  VALUES (${name}, ${price})
  RETURNING *
`;
```

### Variables de entorno requeridas

Vercel las inyecta automáticamente al conectar la base de datos desde el dashboard:

```env
POSTGRES_URL=""
POSTGRES_URL_NON_POOLING=""
POSTGRES_USER=""
POSTGRES_HOST=""
POSTGRES_PASSWORD=""
POSTGRES_DATABASE=""
```

---

## Vercel Blob

Almacenamiento de archivos (imágenes, PDFs, etc.) en la CDN de Vercel.

### Subir un archivo (Server Action)

```typescript
// app/api/upload/route.ts
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename") ?? "file";

  const blob = await put(filename, request.body!, {
    access: "public",
  });

  return NextResponse.json(blob);
}
```

### Subir desde el cliente

```typescript
"use client";

import { upload } from "@vercel/blob/client";

async function handleUpload(file: File) {
  const blob = await upload(file.name, file, {
    access: "public",
    handleUploadUrl: "/api/upload",
  });
  console.log(blob.url); // URL pública del archivo
}
```

### Listar y eliminar blobs

```typescript
import { list, del } from "@vercel/blob";

// Listar todos los blobs
const { blobs } = await list();

// Eliminar un blob por URL
await del("https://xxx.public.blob.vercel-storage.com/file.png");
```

### Variable de entorno requerida

```env
BLOB_READ_WRITE_TOKEN=""
```

> Obtén el token desde el dashboard de Vercel → Storage → Blob.

---

## Resend

Servicio de envío de emails transaccionales. El cliente está configurado en `lib/resend.ts`.

### Enviar un email simple

```typescript
// app/api/email/route.ts
import { resend } from "@/lib/resend";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const { data, error } = await resend.emails.send({
    from: "TikkiGuau <no-reply@tikkiguau.com>",
    to: [body.email],
    subject: "¡Bienvenido a TikkiGuau!",
    html: "<p>Gracias por registrarte en TikkiGuau 🐾</p>",
  });

  if (error) return NextResponse.json({ error }, { status: 500 });

  return NextResponse.json({ data });
}
```

### Con React Email (plantillas)

```bash
npm install react-email @react-email/components
```

```typescript
// emails/WelcomeEmail.tsx
import { Html, Text, Button } from "@react-email/components";

export function WelcomeEmail({ name }: { name: string }) {
  return (
    <Html>
      <Text>Hola {name}, bienvenido a TikkiGuau 🐾</Text>
      <Button href="https://tikkiguau.com">Visitar sitio</Button>
    </Html>
  );
}
```

```typescript
// En el API Route
import { render } from "@react-email/render";
import { WelcomeEmail } from "@/emails/WelcomeEmail";

const html = await render(<WelcomeEmail name={body.name} />);

await resend.emails.send({
  from: "TikkiGuau <no-reply@tikkiguau.com>",
  to: [body.email],
  subject: "¡Bienvenido!",
  html,
});
```

### Variable de entorno requerida

```env
RESEND_API_KEY=""
```

> Obtén tu API Key desde [resend.com/api-keys](https://resend.com/api-keys).  
> Para enviar desde un dominio personalizado debes verificarlo en el dashboard de Resend.

---

## Variables de entorno — Resumen

Copia `.env.example` a `.env.local` y completa los valores:

```bash
cp .env.example .env.local
```

| Variable                  | Descripción                                       |
|---------------------------|---------------------------------------------------|
| `DATABASE_URL`            | URL de conexión pooled para Prisma               |
| `DATABASE_URL_UNPOOLED`   | URL de conexión directa para migraciones          |
| `POSTGRES_URL`            | URL pooled para `@vercel/postgres`               |
| `POSTGRES_URL_NON_POOLING`| URL directa para `@vercel/postgres`              |
| `BLOB_READ_WRITE_TOKEN`   | Token de Vercel Blob Storage                      |
| `RESEND_API_KEY`          | API Key de Resend                                 |
| `NEXT_PUBLIC_API_URL`     | Base URL para Axios (vacío = usa `/api`)         |

---

## Fuente Marykate — Acción requerida

La tipografía primaria **Marykate** debe ser instalada manualmente:

1. Obtén el archivo de la fuente en formato `.woff2`
2. Colócalo en: `app/fonts/marykate.woff2`
3. El proyecto ya está configurado para cargarla automáticamente desde esa ruta

Si tienes otros formatos (`.woff`, `.ttf`), actualiza la configuración en `app/layout.tsx`:

```typescript
const marykate = localFont({
  src: [
    { path: "./fonts/marykate.woff2", format: "woff2" },
    { path: "./fonts/marykate.woff", format: "woff" },
  ],
  variable: "--font-marykate",
  display: "swap",
});
```
