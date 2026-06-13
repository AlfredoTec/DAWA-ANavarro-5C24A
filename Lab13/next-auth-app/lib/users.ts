import fs from "fs";
import path from "path";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

const DB_PATH = path.join(process.cwd(), "data", "users.json");

export function getUsers(): User[] {
  if (!fs.existsSync(DB_PATH)) return [];
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw) as User[];
}

export function findUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email === email);
}

export function createUser(user: User): void {
  const users = getUsers();
  users.push(user);
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
}
