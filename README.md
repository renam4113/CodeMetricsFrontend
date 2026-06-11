# CodeMetrics Frontend

React-дашборд для метрик Gitea, SonarQube и AI-анализа через бэкенд CodeMetrics.

## Возможности

- **Обзор** — сводка коммитов и Quality Gate
- **Сканирования** — запросы к SonarQube через `/api/SonarQube/*` (исправлены URL, кодирование projectKey, query-параметры metrics)
- **Аналитика** — метрики автора из Gitea
- **Репозитории** — синхронизация с Gitea
- **AI-ассистент** — Ollama с контекстом SonarQube

## Локальная разработка

```bash
cd CodeMetricsFrontend
cp .env.example .env
npm install
npm run dev
```

Приложение: http://localhost:5173  
API проксируется на `http://localhost:8080` (см. `vite.config.ts`).

Убедитесь, что бэкенд запущен:

```bash
curl http://localhost:8080/api/config
```

## Docker

Сеть контейнера **должна совпадать** с бэкендом: `codemetrics-dev-network`.

### Сборка

```bash
cd CodeMetricsFrontend
docker build -t codemetrics-frontend .
```

### Запуск

Сначала поднимите бэкенд и проверьте сервисы:

```bash
cd ../CodeMetricsBackend
docker compose up -d
docker ps
```

Все контейнеры (`codemetrics-backend`, `gitea`, `sonarqube`, `codemetrics-ollama`, …) должны быть в статусе **Up**.

Затем фронтенд:

```bash
cd ../CodeMetricsFrontend
docker run -d \
  --name codemetrics-frontend \
  --network codemetrics-dev-network \
  -p 3001:80 \
  -e BACKEND_URL=http://backend:8080 \
  codemetrics-frontend
```

Откройте: http://localhost:3001

Nginx внутри контейнера проксирует `/api/*` на `backend:8080` — браузер обращается только к фронту, CORS не требуется.

### Проверка

```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
curl http://localhost:3001/
curl http://localhost:3001/api/config
```

### Остановка

```bash
docker stop codemetrics-frontend
docker rm codemetrics-frontend
```

## Переменные окружения

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `VITE_SONAR_PROJECT_KEY` | Ключ проекта SonarQube | `renamshina` |
| `VITE_SONAR_DEFAULT_BRANCH` | Ветка по умолчанию | `main` |
| `BACKEND_URL` (Docker) | URL бэкенда в сети compose | `http://backend:8080` |

## Зависимости для работы

Для корректной работы фронтенда должны быть доступны:

1. **backend** (`:8080`) — обязателен
2. **SonarQube** — для раздела «Сканирования» (токен в backend)
3. **Gitea + БД** — для репозиториев и аналитики
4. **Ollama** — для AI-ассистента

Проверка: `docker ps` и `curl http://localhost:8080/api/config`.
