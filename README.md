# 🏋️‍♂️ Fitness Application - Frontend (Next.js)

This repository contains the frontend application for the Fitness Management System. It is built using modern web technologies to ensure high performance, scalability, and an excellent user experience.

## 🛠 Tech Stack
* **Framework:** [Next.js](https://nextjs.org/) (React)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Data Validation:** Zod
* **HTTP Client:** Axios
* **Backend Integration:** PHP & MySQL (via RESTful APIs)

---

## ⚙️ Getting Started (Local Development)

To run this project locally on your machine, please follow these steps carefully:

### 1. Prerequisites
* Node.js (v18.x or higher recommended)
* npm, yarn, or pnpm
* The PHP/MySQL Backend must be running (typically on `http://localhost:8000`)

### 2. Installation
Clone the repository and install the required dependencies:
```bash
git clone <your-repository-url>
cd fitness-website
npm install
```
### 3. Environment Variables (Crucial Step)
The frontend needs to know where the backend API is located.

Look for the .env.example file in the root directory.

Duplicate this file and rename the copy to .env (or .env.local for local development).

Update the value to match your running backend:

# Example for local development
NEXT_PUBLIC_API_URL=http://localhost:8000
### 4. Run the Development Server
Bash
npm run dev
Open http://localhost:3000 in your browser to see the result.

🚀 Production Deployment Guide
If you are deploying this project to a live server (e.g., Vercel, VPS, cPanel with Node.js), follow these instructions to ensure a smooth deployment.

### 1. Backend Pre-requisites
Before building the frontend, ensure the backend is fully deployed:

The database (tst_fitness.sql) is imported.

The backend domain is active (e.g., https://api.yourdomain.com).

Images: Ensure that the uploads folder (containing product images like uploads/Products/...) is present in the backend's public directory so Next.js can fetch them.

### 2. Frontend Environment Setup
On your hosting platform, set the following environment variable before running the build process:

NEXT_PUBLIC_API_URL = https://api.yourdomain.com (Replace with your actual backend URL)

### 3. Build Command
Run the following command to create an optimized production build:

Bash
npm run build
(Note: The build process is strictly typed. It will check for TypeScript and ESLint errors to guarantee code stability in production.)

### 4. Start the Production Server
Bash
npm run start
📂 Key Architecture Notes for Developers
API Proxy / Routing: To handle CORS and dynamic API URLs, we utilize Next.js API Routes (e.g., app/api/user-requests/route.ts). It acts as a proxy, reading the NEXT_PUBLIC_API_URL dynamically.

Environment Configuration: Check lib/env.ts to see how Zod is used to validate environment variables at runtime, ensuring the app falls back to localhost:8000 safely if variables are missing.

Next.js Config (next.config.mjs): Configured to accept remote images dynamically from any secure production host (https://**) while allowing localhost for local testing.

🤝 Support
If you encounter any issues during the deployment or setup phase, please ensure that:

The backend URL in the .env file does not end with a trailing slash (e.g., use http://localhost:8000 instead of http://localhost:8000/).

The backend server is accepting requests and is not blocking the frontend via CORS policies.
