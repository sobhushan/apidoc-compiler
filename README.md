# API Documentation Editor

This project is a web-based API documentation editor that allows users to write API documentation in multiple programming languages and preview the generated documentation in real-time. It is built using **React, Vite, and TypeScript** for the frontend and **Express with Axios** for the backend.

## 🎨 Features

- **Live API Documentation Preview** – Updates API docs in real-time as you modify in editor.
- **Multi-language Support** – Supports **JavaScript, Python, Ruby, and Perl** API documentation formats.
- **Syntax Validation** – Checks if the API documentation syntax matches the selected language.
- **Dynamic Code Editor** – Uses **CodeMirror** for an enhanced editing experience.
- **File Handling** – Ensures only the selected language’s API file is active.

## 📂 Folder Structure
```
apidoc-compiler/            # Root of the repository
│── apidoc-back/            # Backend folder
│   ├── api/                # API code directory
│   │   ├── api.js          # JavaScript API documentation file
│   │   ├── api.py          # Python API documentation file
│   │   ├── api.rb          # Ruby API documentation file
│   │   ├── api.pl          # Perl API documentation file
│   │
│   ├── apidoc/             # API documentation output folder
│   ├── docs/               # Static documentation served by Express
│   ├── node_modules/       # Dependencies installed via npm
│   ├── apidoc.json         # API documentation configuration
│   ├── nodemon.json        # Nodemon config for auto-reloading
│   ├── package.json        # Backend dependencies & scripts
│   ├── server.js           # Express server to serve API docs
│
│── apidoc-front/           # Frontend folder
│   ├── public/             # Frontend static assets
│   ├── src/                # React frontend source code
│   │   ├── App.tsx         # Main React app component
│   │   ├── main.tsx        # Entry point for React
│   │
│   ├── node_modules/       # Dependencies installed via npm
│   ├── package.json        # Frontend dependencies & scripts
│   ├── vite.config.ts      # Vite configuration file
│
│── apidoc-test/            #  (can be ignored)
│   ├── (Contains testing code to observe live changes in backend)
│
│── .gitignore              # Git ignore file
│── README.md               # Project documentation
```

## 🛠️ Initial Setup

### Prerequisites
Ensure you have the following installed:
- **Node.js** (v16+ recommended)
- **npm** or **yarn**

Follow these steps to set up the project locally:

### 1️⃣ Clone the Repository
   ```sh
   git clone https://github.com/sobhushan/apidoc-compiler.git
   ```

### 2️⃣ Backend Setup
1. Navigate to the backend folder:
   ```sh
   cd apidoc-back
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the backend server:
   ```sh
   npm run dev
   ```
   The backend will run on **http://localhost:3000**.

### 3️⃣ Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd apidoc-front
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
   The frontend will run on **http://localhost:5173**.

## 📌 Future Improvements

-  Add support for more languages.
-  Enhance error handling by detecting exact syntax errors.
-  Improve UI/UX for documentation preview.
-  Implement dark mode.


