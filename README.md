# CodeMetrics Frontend

Vue 3 + PrimeVue клиент для бекенда CodeMetrics (Gitea, Ollama, SonarQube).

## Настройка

```bash
cp .env.example .env
# при необходимости измените VUE_APP_API_BASE
npm install
npm run serve
```

## Сборка

```bash
npm run build
```

## Модели API

Типы ответов описаны в `src/models/` (JSDoc, соответствие `swagger.json` бекенда):

- `src/models/codeMetrics.models.js` — CodeMetrics (коммиты, авторы, репозитории)
- `src/models/ollama.models.js` — Olama (`PerformanceAnalysisResponseDto`, `OllamaTextRequestDto`, …)
- `src/models/sonarQube.models.js` — SonarQube (`SonarQualityGateResult`, `SonarMeasuresResult`, `SonarScanSummaryDto`, …)

## Разделы

- **По репозиториям** — коммиты за период (`/api/CodeMetrics/GetByPeriod`)
- **По разработчикам** — анализ через Ollama `GET /api/Olama/analyze-performance` (проект SonarQube: `TestProject`)
- **Отчёты по проектам** — Quality Gate, measures, scan-summary, POST scan для `TestProject`
- **Обратная связь** — чаты с `POST /api/Olama/ask` и опциональными параметрами SonarQube/метрик
