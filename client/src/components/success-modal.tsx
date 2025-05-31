import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, Target, CheckCircle } from "lucide-react";
import { Session } from "@shared/schema";

interface SuccessModalProps {
  show: boolean;
  session: Session | null;
  onClose: () => void;
  onNewSession: () => void;
}

export function SuccessModal({ show, session, onClose, onNewSession }: SuccessModalProps) {
  if (!session) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionDuration = () => {
    if (!session.startTime) return "0 minutes";
    const now = new Date();
    const start = new Date(session.startTime);
    const diffMinutes = Math.floor((now.getTime() - start.getTime()) / (1000 * 60));
    return `${diffMinutes} minutes`;
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="surface-800 border-emerald-500/20 max-w-md">
        <DialogHeader>
          <div className="text-center">
            <Trophy className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <DialogTitle className="text-2xl font-bold text-emerald-400 mb-2">
              Success! 🎉
            </DialogTitle>
            <p className="text-slate-300">
              You've successfully gotten unstuck and made progress on your project!
            </p>
          </div>
        </DialogHeader>

        <div className="bg-slate-700 rounded-lg p-4 mb-6">
          <h4 className="font-semibold mb-3 flex items-center">
            <Target className="w-4 h-4 mr-2" />
            Session Summary:
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Problem:</span>
              <span>{session.problemType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Strategy Used:</span>
              <span>{session.selectedStrategy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Time to Solution:
              </span>
              <span>{getSessionDuration()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                Steps Completed:
              </span>
              <span>{session.stepsCompleted} of {session.actionSteps.length}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={onNewSession}
            className="bg-primary hover:bg-primary/90 flex-1"
          >
            New Session
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="surface-600 border-slate-500 hover:surface-500 flex-1"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
