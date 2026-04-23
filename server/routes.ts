// 1. Paste this at the top of routes.ts
import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client("1016292843361-dfg016gmdq929kaksd71o7pqkv39hlen.apps.googleusercontent.com");

// 2. Replace the old login/register routes with this one
app.post("/api/auth/google", async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "1016292843361-dfg016gmdq929kaksd71o7pqkv39hlen.apps.googleusercontent.com",
    });
    
    const payload = ticket.getPayload();
    if (!payload?.email) return res.status(400).send("Invalid Google Token");

    const email = payload.email.toLowerCase();

    // THE SEU GATEKEEPER
    if (!email.endsWith("@seu.edu.bd")) {
      return res.status(403).json({ message: "Access Denied: Only @seu.edu.bd emails allowed." });
    }

    let user = await storage.getUserByEmail(email);
    if (!user) {
      // Create them automatically if they are a real SEU student
      user = await storage.createUser({
        username: email.split('@')[0], 
        email: email,
        password: "google-auth-protected" 
      });
    }

    req.login(user, (err) => {
      if (err) return res.status(500).send("Session error");
      res.json(user);
    });
  } catch (error) {
    res.status(500).json({ message: "Google Authentication failed" });
  }
});
