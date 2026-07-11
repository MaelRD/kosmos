# Kosmos

Aplicación de gestión de proyecto para la tripulación: tablero kanban, backlog, agenda con
sincronización a Google Calendar e informes. Backend en Quarkus (Java) con arquitectura
hexagonal organizada *package-by-feature*, frontend en React (Vite).

## Arquitectura

```
back/   API Quarkus + Postgres + Flyway + JWT (RS256)
front/  SPA React (Vite)
```

El backend está organizado por feature, no por capa. Cada módulo bajo
`com.kosmos.board.<feature>` trae su propio `domain` (model / port / exception),
`application` e `infrastructure` (persistence / rest):

```
com.kosmos.board
├── users              → cuentas, roster de la tripulación
├── tasks              → tickets del kanban + informes (derivados, sin tabla propia)
├── agenda             → eventos propios + export .ics a Google Calendar
├── externalcalendar   → import de calendarios Google externos (solo lectura)
└── auth               → login/register/Google OAuth, emisión de JWT
```

## Requisitos

- Docker y Docker Compose
- Para desarrollo sin Docker: Java 21 + Maven, Node 20+

## Levantar todo con Docker

```bash
docker compose up --build
```

Esto levanta tres servicios:

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| `db`     | 5432   | Postgres 18 |
| `back`   | 8081   | API Quarkus |
| `front`  | 5173   | SPA servida por nginx |

La app queda disponible en `http://localhost:5173`.

## Base de datos (Docker)

La base la crea Docker automáticamente al levantar el stack — no hace falta ningún paso manual.

### Cómo se crea

El servicio `db` en `docker-compose.yml` usa la imagen oficial `postgres:18` y crea la base al
primer arranque a partir de estas variables:

```yaml
POSTGRES_DB: kosmos
POSTGRES_USER: kosmos
POSTGRES_PASSWORD: kosmos
```

Los datos persisten en el volumen `pgdata` (declarado al final del `docker-compose.yml`), así
que sobreviven a `docker compose down` (sin `-v`) y a rebuilds de las imágenes.

### Migraciones (esquema de tablas)

El esquema no lo crea Postgres — lo crean las migraciones de Flyway que corren automáticamente
cuando arranca `back` (`quarkus.flyway.migrate-at-start=true` en `application.properties`).
Viven en `back/src/main/resources/db/migration/`, numeradas `V1__...sql`, `V2__...sql`, etc.

Para agregar una tabla o columna nueva: crear un archivo `V{n+1}__descripcion.sql` ahí (nunca
editar una migración ya aplicada) y reiniciar `back` — Flyway detecta y aplica la nueva
versión sola.

### Levantar solo la base

Útil para correr el backend en modo dev (`./mvnw quarkus:dev`) contra una base real en vez de
la de Testcontainers:

```bash
docker compose up -d db
```

### Conectarse a la base

```bash
docker exec -it kosmos-db-1 psql -U kosmos -d kosmos
```

### Resetear la base desde cero

Esto borra el volumen y todos los datos — Flyway vuelve a correr todas las migraciones desde
`V1` en el próximo arranque:

```bash
docker compose down -v
docker compose up --build
```

## Variables de entorno

| Variable                | Dónde                  | Qué hace |
|--------------------------|-------------------------|----------|
| `GOOGLE_CLIENT_ID`       | `back` (env del contenedor) | OAuth Client ID para validar el login con Google. Tiene un default de desarrollo en `application.properties`. |
| `VITE_API_URL`           | `front/.env`             | URL base de la API que consume el frontend. |
| `VITE_GOOGLE_CLIENT_ID`  | `front/.env`             | Mismo Client ID que arriba, para el botón de Google Sign-In. |

## Desarrollo local sin Docker

Backend (usa Dev Services de Quarkus: levanta un Postgres descartable en Testcontainers,
no hace falta `docker compose up db` en este modo):

```bash
cd back
./mvnw quarkus:dev
```

Frontend:

```bash
cd front
npm install
npm run dev
```
