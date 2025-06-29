import type { Express } from "express";
import { storage } from "../storage";

// Input validation middleware for user registration
const validateUserRegistration = (req: any, res: any, next: any) => {
  const { uid, email } = req.body;
  
  if (!uid || !email) {
    return res.status(400).json({ error: "Firebase UID and email are required" });
  }
  
  if (typeof uid !== 'string' || uid.length < 1) {
    return res.status(400).json({ error: "Invalid Firebase UID" });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  
  next();
};

export function registerAuthRoutes(app: Express) {
  // User registration endpoint
  app.post("/api/register-user", validateUserRegistration, async (req, res) => {
    try {
      const { uid, email, username } = req.body;

      // Check if user already exists
      let existingUser = await storage.getUserByFirebaseUid(uid);
      if (existingUser) {
        return res.json({ success: true, user: existingUser, message: "User already exists" });
      }

      // Generate unique username to avoid conflicts
      const baseUsername = username || `user_${uid.substring(0, 8)}`;
      let finalUsername = baseUsername;
      
      // Check if username exists and generate unique one if needed
      let counter = 1;
      let isUsernameUnique = false;
      while (!isUsernameUnique && counter <= 100) { // Safety limit
        try {
          const existingUserByUsername = await storage.getUserByUsername(finalUsername);
          if (!existingUserByUsername) {
            isUsernameUnique = true;
          } else {
            finalUsername = `${baseUsername}_${counter}`;
            counter++;
          }
        } catch (error) {
          // Fallback: use timestamp to ensure uniqueness
          finalUsername = `${baseUsername}_${Date.now().toString().slice(-6)}`;
          isUsernameUnique = true;
        }
      }
      
      // Final safety check
      if (!isUsernameUnique) {
        finalUsername = `user_${uid}_${Date.now().toString().slice(-6)}`;
      }

      // Create new user with Firebase UID
      const newUser = await storage.createUser({
        username: finalUsername,
        email: email,
        role: "user",
        firebaseUid: uid
      });

      console.log(`✅ User registered: ${newUser.id} (Firebase UID: ${uid})`);
      res.json({ success: true, user: newUser, message: "User registered successfully" });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Failed to register user' });
    }
  });

  // Debug endpoint to check current user
  app.get("/api/debug/current-user/:firebaseUid", async (req, res) => {
    try {
      const { firebaseUid } = req.params;
      const user = await storage.getUserByFirebaseUid(firebaseUid);
      
      if (!user) {
        return res.status(404).json({ error: "User not found", firebaseUid });
      }

      const trialStatus = await storage.checkTrialStatus(user.id);
      const eligibility = await storage.isTrialEligible(user.id);
      
      res.json({ 
        user,
        trialStatus,
        eligibility,
        firebaseUid
      });
    } catch (error) {
      console.error('Error fetching user debug info:', error);
      res.status(500).json({ error: 'Failed to fetch user info' });
    }
  });
}