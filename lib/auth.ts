export type StoredUser = {
  firstname?: string;
  lastname?: string;
  role?: string;
  house?: string;
};

export function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("user");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredUser(user: StoredUser) {
  localStorage.setItem("user", JSON.stringify(user));
  window.dispatchEvent(new Event("auth-change"));
}

export function clearStoredUser() {
  localStorage.removeItem("user");
  window.dispatchEvent(new Event("auth-change"));
}