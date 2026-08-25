// Minimal typing for Express request augmentation
declare namespace Express {
  export interface Request {
    user?: { sub: string; role: "user" | "admin"; email: string; iat?: number; exp?: number };
  }
}

