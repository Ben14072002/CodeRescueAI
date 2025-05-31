import { Session, UserPreferences } from "@shared/schema";

const SESSIONS_KEY = "codebreaker-sessions";
const PREFERENCES_KEY = "codebreaker-preferences";

export class LocalStorage {
  // Sessions
  getSessions(): Session[] {
    try {
      const sessions = localStorage.getItem(SESSIONS_KEY);
      return sessions ? JSON.parse(sessions) : [];
    } catch (error) {
      console.error("Error loading sessions:", error);
      return [];
    }
  }

  saveSession(session: Session): void {
    try {
      const sessions = this.getSessions();
      const existingIndex = sessions.findIndex(s => s.id === session.id);
      
      if (existingIndex >= 0) {
        sessions[existingIndex] = session;
      } else {
        sessions.push(session);
      }
      
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error("Error saving session:", error);
    }
  }

  getSession(id: number): Session | undefined {
    const sessions = this.getSessions();
    return sessions.find(s => s.id === id);
  }

  deleteSession(id: number): void {
    try {
      const sessions = this.getSessions().filter(s => s.id !== id);
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  }

  // User Preferences
  getPreferences(): UserPreferences {
    try {
      const prefs = localStorage.getItem(PREFERENCES_KEY);
      return prefs ? JSON.parse(prefs) : {
        theme: "dark",
        defaultPromptStyle: "direct"
      };
    } catch (error) {
      console.error("Error loading preferences:", error);
      return {
        theme: "dark",
        defaultPromptStyle: "direct"
      };
    }
  }

  savePreferences(preferences: UserPreferences): void {
    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  }

  // Utility methods
  clearAll(): void {
    try {
      localStorage.removeItem(SESSIONS_KEY);
      localStorage.removeItem(PREFERENCES_KEY);
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  }

  exportData(): string {
    return JSON.stringify({
      sessions: this.getSessions(),
      preferences: this.getPreferences()
    });
  }

  importData(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      if (parsed.sessions) {
        localStorage.setItem(SESSIONS_KEY, JSON.stringify(parsed.sessions));
      }
      if (parsed.preferences) {
        localStorage.setItem(PREFERENCES_KEY, JSON.stringify(parsed.preferences));
      }
      return true;
    } catch (error) {
      console.error("Error importing data:", error);
      return false;
    }
  }
}

export const storage = new LocalStorage();
