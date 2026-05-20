const fs = require("fs");
const path = require("path");

const root = "sports-master-sports-day";

const structure = [
  "app/login",
  "app/leaderboard",
  "app/events",
  "app/admin",
  "components",
  "lib/supabase",
  "lib/queries",
  "types",
];

// Basic files
const files = [
  {
    path: "app/layout.tsx",
    content: `
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>Sports Master Sports Day</h1>
        </header>
        {children}
      </body>
    </html>
  );
}
    `.trim(),
  },
  {
    path: "app/page.tsx",
    content: `
export default function Home() {
  return (
    <main>
      <h2>Home</h2>
      <p>Date, time, countdown, location here</p>
    </main>
  );
}
    `.trim(),
  },
  {
    path: "app/login/page.tsx",
    content: `
export default function Login() {
  return (
    <main>
      <h2>Login</h2>
      <p>First name / last name login form</p>
    </main>
  );
}
    `.trim(),
  },
  {
    path: "app/leaderboard/page.tsx",
    content: `
export default function Leaderboard() {
  return (
    <main>
      <h2>Leaderboard</h2>
    </main>
  );
}
    `.trim(),
  },
  {
    path: "app/events/page.tsx",
    content: `
export default function Events() {
  return (
    <main>
      <h2>Events</h2>
    </main>
  );
}
    `.trim(),
  },
  {
    path: "app/admin/page.tsx",
    content: `
export default function Admin() {
  return (
    <main>
      <h2>Admin Panel</h2>
    </main>
  );
}
    `.trim(),
  },
  {
    path: "app/global.css",
    content: `
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}
    `.trim(),
  },
  {
    path: "lib/supabase/client.js",
    content: `
export const supabase = null; // plug in later
    `.trim(),
  },
  {
    path: ".env.local",
    content: `
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
    `.trim(),
  },
];

// Create folders
function createFolders() {
  structure.forEach((folder) => {
    const fullPath = path.join(root, folder);
    fs.mkdirSync(fullPath, { recursive: true });
    console.log("Created folder:", fullPath);
  });
}

// Create files
function createFiles() {
  files.forEach((file) => {
    const fullPath = path.join(root, file.path);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, file.content);
    console.log("Created file:", fullPath);
  });
}

// Run
fs.mkdirSync(root, { recursive: true });

createFolders();
createFiles();

console.log("Done scaffolding project.");