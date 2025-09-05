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
- **Dagre** — clean, automatic node layout
- **OpenAI API** — LLM-based structure generation
- **Tailwind CSS** — styling

---

## Project Status

This repo currently contains the scaffolded code structure:

- `src/app/` — app routes and backend API (`/api/generate`)
- `src/components/` — UI components (input form, chart canvas)
- `src/lib/` — layout utility using Dagre
- Basic README, .gitignore, and Tailwind setup

---

## Submission Timeline

- Scaffold: Sep 4, 2025
- API integration: In Progress
- UI flowchart: In Progress
- Deployment to Vercel: Coming soon!

---

## Demo

Demo video coming soon!
