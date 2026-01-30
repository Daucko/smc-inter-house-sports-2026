import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Trophy, LogIn, LogOut, Settings } from 'lucide-react';

export function Header() {
  const { user, isAdmin, signOut } = useAuth();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Trophy className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl">Sports Day</h1>
            <p className="text-xs text-muted-foreground">Inter-House Competition</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm">
                <LogIn className="w-4 h-4 mr-2" />
                Admin Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
