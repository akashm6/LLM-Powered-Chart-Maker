# 📊 LawBandit Chart Maker

An LLM-powered tool that transforms legal text into structured flowcharts — built in **TypeScript + Node.js** using **Next.js**, **React Flow**, and **OpenAI**.

This project is a submission for the **Fall 2025 LawBandit Software Internship Challenge**.

---

## Overview

Students highlight legal concepts, rules, or case descriptions, and prompt a large language model (LLM) to generate a clean, structured flowchart that visualizes the logic.

- **Input**: Raw legal text and a user prompt(e.g. from a casebook or rule explanation)
- **Processing**: LLM extracts nodes and relationships (edges)
- **Output**: Flowchart rendered using React Flow + auto-layout via Dagre

---

## 🛠️ Tech Stack

- **Next.js (App Router)** — fullstack framework (TypeScript + Node.js)
- **React Flow** — dynamic chart rendering
- **React-pdf** — PDF text selection integrated with Chart prompting
- **Dagre** — clean, automatic node layout
- **OpenAI API** — LLM-based structure generation
- **Tailwind CSS**, **Framer Motion** — styling

---

## Project Status

This repo currently contains the scaffolded code structure:

- `src/app/` — app routes, backend API, and data models (`/api/generate`, `/api/types`)
- `src/components/` — UI components (input form, chart canvas, PDF reader, prompt modal)
- `src/app/pdf-viewer/[id]/` — Dynamic routes for PDF readers
- `src/lib/` — layout utility using Dagre
- `public/test-pdfs/` — Test PDFs stored here
- Basic README, .gitignore, and Tailwind setup

---

## Submission Timeline

- Scaffold: Sep 4, 2025
- Custom Right-click Menu: Sep 7, 2025
- PromptModal for user prompts: Sep 7, 2025
- PDF viewer integration with context menu: Sep 8, 2025
- API integration: Sep 9, 2025
- UI flowchart: In Progress
- Deployment to Vercel: Coming soon!

---

## Demo

Demo video coming soon!
