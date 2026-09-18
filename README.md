# Careers App — Job Application Landing Page + Admin Panel

Built with Next.js 14 (App Router), Tailwind CSS, Vercel Postgres, and Vercel Blob.

## Features
- Public landing page with open positions + apply form (resume upload)
- Duplicate-application check (same email + position)
- Basic honeypot spam protection
- Password-protected admin dashboard: search, filter by status/position,
  change status (pending/shortlisted/interview/rejected/hired), download resume, delete

---

## 🚀 Deploy in ~15-20 minutes

### 1. Push to GitHub
```bash
cd careers-app
git init
git add .
git commit -m "Initial commit"
# create a new repo on GitHub, then:
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### 2. Import into Vercel
- Go to https://vercel.com/new
- Import your GitHub repo
- Framework preset: Next.js (auto-detected) — click **Deploy** (first deploy will fail until env vars + storage are added, that's fine)

### 3. Add Vercel Postgres
- In your Vercel project → **Storage** tab → **Create Database** → **Postgres**
- Follow the prompts, then **Connect** it to this project
- This automatically adds `POSTGRES_URL` and related env vars — no manual copy-paste needed

### 4. Add Vercel Blob
- Same **Storage** tab → **Create Database** → **Blob**
- Connect it to this project
- This automatically adds `BLOB_READ_WRITE_TOKEN`

### 5. Add your own env vars
In **Project Settings → Environment Variables**, add:
| Key | Value |
|---|---|
| `ADMIN_PASSWORD` | your chosen admin password |
| `ADMIN_SESSION_SECRET` | any long random string (run `openssl rand -hex 32` locally, or just mash the keyboard) |

### 6. Redeploy
- Go to **Deployments** tab → click **Redeploy** on the latest deployment (so it picks up the new env vars + storage connections)

### 7. Test it
- Visit your live URL → fill the apply form → submit
- Visit `your-url.vercel.app/admin` → log in with `ADMIN_PASSWORD` → see the application, change its status, download the resume

---

## ✏️ Customize before going live
- `app/page.tsx` → change `COMPANY_NAME` and the `DEPARTMENTS` list to your actual departments.
  - Any department with a `specializations` array (e.g. Developer) will automatically show a
    second "Specialization" dropdown on the form (Laravel, Next.js, Go, HTML/CSS/JS, React, TypeScript).
  - If you add a new department that also needs a specialization dropdown, add its name to
    `DEPARTMENTS_REQUIRING_SPECIALIZATION` in `app/api/apply/route.ts` too, so it's validated as required.
- `tailwind.config.js` → change the `brand` color palette to match your company colors
- Add your logo / favicon in `app/layout.tsx` if needed

## 🧪 Run locally (optional)
```bash
npm install
# create a .env.local file based on .env.example
npm run dev
```
Note: `@vercel/postgres` and `@vercel/blob` need the project linked to Vercel
storage to work — easiest to just develop against the deployed Preview URL,
or run `vercel env pull` after connecting storage to get local env vars.
