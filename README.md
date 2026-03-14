# 📦 Tabtop

**Tabtop** is a modern, personalized dashboard for your browser. It features a sleek glassmorphism design, real-time synchronization, and a flexible grid layout to organize your digital life.

![Dashboard Preview](https://via.placeholder.com/800x450.png?text=Tabtop+Dashboard+Preview)

## ✨ Features

- **Dynamic Grid Layout**: Drag and drop widgets, links, and files anywhere on your dashboard.
- **Two Flavors of Content**:
  - **Widgets**: Framed, resizable tools like Clocks (Digital/Analog), Weather, and Search Bars.
  - **Desktop Icons**: Frameless, clean shortcuts for your favorite links and uploaded files.
- **Glassmorphism UI**: Beautiful, semi-transparent interface with smooth animations and hover effects.
- **Admin Dashboard**: Advanced user management system for administrators to control access and plan statuses.
- **PocketBase Integration**: Secure authentication and real-time data persistence.
- **File Support**: Drag and drop files directly onto the dashboard to upload and store them.
- **Live Sync**: All changes are synchronized across devices in real-time.

## 🚀 Self-Hosting Instructions

Hosting Tabtop yourself is straightforward. You'll need two main components: the **PocketBase** backend and the **React** frontend.

### 1. Backend: PocketBase Setup

1.  **Download PocketBase**: Get the latest version from [pocketbase.io](https://pocketbase.io/docs/).
2.  **Initialize**: Run `./pocketbase serve` to start the server.
3.  **Create Admin**: Go to `http://127.0.0.1:8090/_/` and create your first admin account.
4.  **Import Schema**: 
    - In the Admin UI, go to **Settings > Export collections**.
    - Click **Import (JSON)** and paste the contents of `pb_schema.json` from this repository.
    - *Note*: Ensure the `Tabtop` and `TabtopUsers` collections are created correctly.
5.  **Configure API Rules**: 
    - The schema includes predefined API rules for security. 
    - Make sure the `TabtopUsers` collection allows public creation if you want users to sign up themselves.

### 2. Frontend: Configuration & Deployment

1.  **Clone the Repo**:
    ```bash
    git clone https://github.com/cyberhirsch/Tabtop.git
    cd Tabtop/frontend
    ```
2.  **Environment Variables**:
    - Create a `.env` file in the `frontend` directory based on `.env.example`:
      ```bash
      VITE_POCKETBASE_URL=https://your-pocketbase-url.com
      ```
3.  **Install & Build**:
    ```bash
    npm install
    npm run build
    ```
4.  **Deploy**:
    - The `npm run build` command generates a `dist` folder.
    - You can host this `dist` folder on any static site host (Vercel, Netlify, Cloudflare Pages, or your own Nginx/Apache server).

## 🔒 Security & Privacy

- **No Sensitive Data**: All API URLs are configured via environment variables. Ensure you don't commit your `.env` file.
- **Data Ownership**: Since you host the PocketBase instance, you have full control over your dashboard data and uploaded files.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Zustand (State Management)
- **Styling**: Vanilla CSS (Modern CSS variables, Flexbox/Grid)
- **Grid System**: `react-grid-layout`
- **Backend**: PocketBase (Database, Auth, Real-time)
- **Icons**: Lucide React

## 📄 License

This project is licensed under the MIT License.
