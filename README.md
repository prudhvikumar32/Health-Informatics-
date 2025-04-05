# Health Informatics Dashboard

A modern, responsive web application designed to provide deep insights into job roles, skills, and salary trends in the health informatics domain across the United States.

## 📌 Project Features

- **Role Explorer**: Browse health informatics roles with insights into salary, growth rate, requirements, and skillsets.
- **Skill Insights**: Analyze in-demand technical and soft skills by role or category.
- **Salary Explorer**: Compare salary trends based on location, experience, and role.
- **Interactive Charts**: Visualize data using Recharts including bar, line, and area charts.
- **Dynamic Filters**: Job role, region, experience level, and salary range filters.
- **Toasts and Alerts**: Save or export insights with helpful notifications.

## 🧠 Tech Stack

- **Frontend**: React + TypeScript
- **UI Framework**: Tailwind CSS + shadcn/ui + lucide-react icons
- **Charts**: Recharts
- **State & Data Fetching**: React Query (`@tanstack/react-query`)
- **Components**: Custom modular UI components from `/components/ui`

## 🛠️ Project Structure

```
📁 src
 ┣ 📂 components
 ┣ 📂 pages
 ┃ ┣ 📄 role-explorer.tsx
 ┃ ┣ 📄 skill-insights.tsx
 ┃ ┗ 📄 salary-explorer.tsx
 ┣ 📂 shared
 ┃ ┗ 📄 schema.ts
 ┣ 📂 hooks
 ┃ ┗ 📄 use-toast.ts
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/health-informatics-dashboard.git
cd health-informatics-dashboard
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Run the development server

```bash
npm run dev
# or
yarn dev
```

The app will be running at [http://localhost:3000](http://localhost:3000)

### 4. Build for production

```bash
npm run build
# or
yarn build
```

### 5. Preview production build

```bash
npm run preview
# or
yarn preview
```

## 📊 API Expectations

This project expects mock API endpoints like:

- `/api/jobs` — Returns list of job roles
- `/api/skills` — Returns all skills or skills by role
- `/api/salary/job` — Returns salary data by role and region

You can implement these APIs using tools like Next.js API routes, Express.js, or connect them to a backend.

## 📦 Dependencies

- `@tanstack/react-query`
- `lucide-react`
- `recharts`
- `tailwindcss`
- `shadcn/ui` components

## 📎 License

This project is licensed under the MIT License.

---

Built with ❤️ for Health Informatics market intelligence.
