import { Express } from "express";

// Simplified auth setup for Firebase
// Since Firebase handles authentication on the client side,
// we only need minimal server-side auth handling

export function setupAuth(app: Express) {
  // Middleware to extract user info from Firebase token (if needed)
  // For now, we'll just handle guest users and basic API endpoints
  
  // Guest user endpoint for backward compatibility
  app.post("/api/guest", async (req, res) => {
    try {
      const guestUser = {
        id: `guest-${Date.now()}`,
        username: req.body.username || `guest-${Date.now()}`,
        name: req.body.name || "Guest User",
        email: null,
        isGuest: true,
        guestId: req.body.guestId,
        createdAt: new Date().toISOString(),
      };
      
      res.status(201).json(guestUser);
    } catch (err) {
      res.status(500).json({ message: "Failed to create guest user" });
    }
  });

  // User endpoint that returns null (Firebase handles auth on client)
  app.get("/api/user", (req, res) => {
    res.status(401).json({ message: "Authentication handled by Firebase" });
  });

  // Logout endpoint (no-op since Firebase handles this on client)
  app.post("/api/logout", (req, res) => {
    res.sendStatus(200);
  });

  // Remove old PostgreSQL auth endpoints
  // These are no longer needed with Firebase:
  // - /api/register
  // - /api/login
  // - /api/forgot-password
  // - /api/reset-password
}