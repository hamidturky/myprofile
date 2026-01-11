
# Personal AI-Powered Portfolio

A world-class digital profile for **Hamid Idris Mussa**, an Information Security Architect and IT Systems Specialist. This project is not just a portfolio but a demonstration of modern, resilient, and secure web application development.

[View Live Demo](https://hamidturky.github.io/myprofile)

---

## 🚀 Core Features

- **AI-Powered Assistant**: A built-in chatbot powered by Google's Gemini API to answer questions about Hamid's professional background.
- **Bilingual Content**: Fully localized for both English and Arabic, with a seamless language-switching experience.
- **Dynamic Data Layer**: Content is designed to be fetched from a headless CMS, with a hardened local fallback mechanism to ensure reliability.
- **Modern & Responsive UI**: Built with React and Tailwind CSS for a clean, fast, and mobile-friendly user experience.
- **Secure by Design**: Follows information security best practices from the ground up.

## 🛡️ Resilience & Fault Tolerance

This application is engineered to stay online and functional even under degraded conditions:

- **Global Error Boundary**: Captures runtime crashes and offers a "System Repair" utility to clear potentially corrupt local state.
- **Service Retries**: API calls to the CMS and AI services implement exponential backoff to handle transient network failures gracefully.
- **Hardened Fallback**: If external data sources are unreachable, the app automatically engages a pre-compiled, high-quality local dataset to ensure content is always available.
- **Health Monitoring**: A real-time connection status indicator in the footer keeps the user informed of service health.
- **Sanitized Errors**: All UI-facing error messages are cleaned of technical jargon to maintain a premium brand image while providing actionable feedback.

## 🛠️ Technology Stack

- **Frontend**: [React](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI**: [Google Gemini](https://ai.google.dev/)
- **Deployment**: [GitHub Pages](https://pages.github.com/)

## 📂 Project Structure

The project is organized to separate concerns and make navigation straightforward:

```
/
├── public/               # Static assets (images, resume.pdf)
├── src/                  # Main source code (removed in favor of root)
│
├── App.tsx               # Main React application component
├── data.ts               # Local data store (fallback content)
├── geminiService.ts      # Service for interacting with the Gemini API
├── index.html            # Entry HTML file
├── package.json          # Project dependencies and scripts
└── README.md             # This file
```

## 🏁 Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/hamidturky/myprofile.git
    cd myprofile
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## 🚢 Deployment

The portfolio is automatically built and deployed to GitHub Pages using the `gh-pages` package.

The deployment process is triggered by running the `deploy` script in `package.json`:

```bash
npm run deploy
```

This command first runs `npm run build` to create a production-ready build in the `dist` folder, and then pushes the contents of that folder to the `gh-pages` branch of the repository.

## ✅ Task Management & Future Enhancements

As requested, we are using **GitHub Issues** as the professional standard for tracking tasks, features, and bugs. This provides a clear and organized way to manage the project's lifecycle.

You can view, create, and manage tasks under the [**Issues** tab](https://github.com/hamidturky/myprofile/issues) of this repository. This is the recommended way to keep track of "tasks done" and "to be done."

---

**Designed & Developed by Hamid Idris Mussa**
*Architected for peak security performance.*
