declare global {
  namespace Express {
    interface Request {
      user: { id: string; profile_id: string };
    }
  }
}
