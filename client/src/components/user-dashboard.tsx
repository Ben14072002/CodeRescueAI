import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  LogOut, 
  Crown, 
  Calendar,
  Target,
  Clock,
  TrendingUp,
  Settings,
  Mail
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { useSession } from "@/hooks/use-session";

interface UserDashboardProps {
  onClose: () => void;
  onSettings?: () => void;
}

export function UserDashboard({ onClose, onSettings }: UserDashboardProps) {
  const { user, logout } = useAuth();
  const { isPro, tier, status } = useSubscription();
  const { sessions, getSessionStats } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const stats = getSessionStats();
  const recentSessions = sessions.slice(0, 5);

  // Free tier limits
  const FREE_SESSIONS_LIMIT = 5;
  const currentMonthSessions = sessions.filter(session => {
    const sessionDate = new Date(session.startTime);
    const now = new Date();
    return sessionDate.getMonth() === now.getMonth() && 
           sessionDate.getFullYear() === now.getFullYear();
  }).length;

  const usagePercentage = (currentMonthSessions / FREE_SESSIONS_LIMIT) * 100;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      onClose();
    } catch (error) {
      // Error handled by useAuth hook
    } finally {
      setIsLoggingOut(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">{user?.displayName || "Developer"}</h1>
            <p className="text-slate-400 flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              {user?.email}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-slate-600 text-slate-300"
            onClick={onSettings}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-slate-400 hover:text-slate-200"
          >
            {isLoggingOut ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-400" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Subscription Status */}
      <Card className="surface-800 border-slate-700 mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-100 mb-2">
                {isPro ? "Pro Plan" : "Free Plan"}
              </h3>
              <p className="text-slate-400">
                {isPro 
                  ? "Unlimited rescue sessions and custom prompt generation"
                  : `${currentMonthSessions} of ${FREE_SESSIONS_LIMIT} rescue sessions used this month`
                }
              </p>
            </div>
            <Badge 
              variant="outline" 
              className={`${isPro 
                ? "bg-amber-500/20 text-amber-300 border-amber-500/30" 
                : "bg-slate-700 text-slate-300"
              }`}
            >
              {isPro ? (
                <>
                  <Crown className="w-3 h-3 mr-1" />
                  Pro Monthly
                </>
              ) : (
                "Free Tier"
              )}
            </Badge>
          </div>
          {!isPro && (
            <>
              <div className="mt-4">
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                  <span>Usage</span>
                  <span>{currentMonthSessions}/{FREE_SESSIONS_LIMIT}</span>
                </div>
                <Progress value={usagePercentage} className="h-2" />
              </div>
              {usagePercentage > 80 && (
                <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-400 font-medium">Almost at your limit</p>
                      <p className="text-sm text-slate-400">Upgrade to Pro for unlimited sessions</p>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => window.location.href = '/checkout?plan=pro_monthly'}
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
          {isPro && (
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center">
                <Crown className="w-5 h-5 text-amber-400 mr-3" />
                <div>
                  <p className="text-green-400 font-medium">Pro Subscription Active</p>
                  <p className="text-sm text-slate-400">Access to unlimited sessions and custom prompts</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card className="surface-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-100">{stats.total}</p>
            <p className="text-sm text-slate-400">Total Sessions</p>
          </CardContent>
        </Card>

        <Card className="surface-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-100">{stats.successful}</p>
            <p className="text-sm text-slate-400">Successful</p>
          </CardContent>
        </Card>

        <Card className="surface-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-100">{Math.round(stats.successRate)}%</p>
            <p className="text-sm text-slate-400">Success Rate</p>
          </CardContent>
        </Card>

        <Card className="surface-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-100">{formatTime(stats.averageTime)}</p>
            <p className="text-sm text-slate-400">Avg Time</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card className="surface-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-100">Recent Rescue Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {recentSessions.length > 0 ? (
            <div className="space-y-3">
              {recentSessions.map((session) => (
                <div 
                  key={session.id} 
                  className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-slate-200">
                      {session.problemType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                    <p className="text-sm text-slate-400">
                      {new Date(session.startTime).toLocaleDateString()} • {session.selectedStrategy}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={session.success ? "default" : "secondary"}
                      className={session.success ? "bg-emerald-500 text-white" : "bg-slate-600 text-slate-300"}
                    >
                      {session.success ? "Success" : "In Progress"}
                    </Badge>
                    <p className="text-sm text-slate-400 mt-1">
                      {formatTime(session.totalTimeSpent)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400">No rescue sessions yet</p>
              <p className="text-sm text-slate-500">Start your first session to see your progress here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}