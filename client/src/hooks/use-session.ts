import { useState, useEffect } from "react";
import { Session, InsertSession } from "@shared/schema";
import { storage } from "@/lib/storage";

export function useSession() {
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    const loadedSessions = storage.getSessions();
    setSessions(loadedSessions);
    
    // Load the most recent session if no current session
    if (!currentSession && loadedSessions.length > 0) {
      const mostRecent = loadedSessions.sort((a, b) => 
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      )[0];
      setCurrentSession(mostRecent);
    }
  };

  const createSession = (sessionData: InsertSession) => {
    const newSession: Session = {
      ...sessionData,
      id: Date.now(),
      startTime: new Date(sessionData.startTime),
      completedAt: sessionData.completedAt ? new Date(sessionData.completedAt) : undefined,
      actionSteps: sessionData.actionSteps.map(step => ({
        ...step,
        startTime: step.startTime ? new Date(step.startTime) : undefined,
      })),
    };

    storage.saveSession(newSession);
    setCurrentSession(newSession);
    loadSessions();
    
    return newSession;
  };

  const updateSession = (updatedSession: Session) => {
    storage.saveSession(updatedSession);
    setCurrentSession(updatedSession);
    loadSessions();
  };

  const deleteSession = (id: number) => {
    storage.deleteSession(id);
    if (currentSession?.id === id) {
      setCurrentSession(null);
    }
    loadSessions();
  };

  const markSessionSuccess = (id: number) => {
    const session = storage.getSession(id);
    if (session) {
      const updatedSession = {
        ...session,
        success: true,
        completedAt: new Date(),
      };
      storage.saveSession(updatedSession);
      setCurrentSession(updatedSession);
      loadSessions();
    }
  };

  const getSessionStats = () => {
    const totalSessions = sessions.length;
    const successfulSessions = sessions.filter(s => s.success).length;
    const averageTime = sessions.length > 0 
      ? sessions.reduce((acc, s) => acc + s.totalTimeSpent, 0) / sessions.length 
      : 0;
    
    return {
      total: totalSessions,
      successful: successfulSessions,
      successRate: totalSessions > 0 ? (successfulSessions / totalSessions) * 100 : 0,
      averageTime: Math.round(averageTime),
    };
  };

  return {
    currentSession,
    sessions,
    createSession,
    updateSession,
    deleteSession,
    markSessionSuccess,
    getSessionStats,
    setCurrentSession,
  };
}
