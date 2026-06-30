# DocSphere
DocSphere is an AI-powered document and resource management platform that enables users to upload, organize, search, and access PDFs, notes, reports, and presentations. It features intelligent search, document summarization, and AI-driven question answering for efficient knowledge sharing.

## Local Setup

### Database

Create a PostgreSQL database, then run the initialization script:

```bash
psql -U postgres -d docsphere -f Database-main/init.sql
```

For an existing database created before share links and document metadata were added, run:

```bash
psql -U postgres -d docsphere -f Database-main/feature_migration.sql
```

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

The backend runs on `http://localhost:5000` by default.

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default and calls the API at `http://localhost:5000/api`.

## Useful Scripts

Backend:

```bash
npm run dev
npm test
```

Frontend:

```bash
npm run dev
npm run lint
npm run build
```
