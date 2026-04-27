export interface JwtPayload {
  id: number;
  name: string;
  email: string | null;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
