import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/src/components/ui/button';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
            <div className="text-center">
                <div className="mb-8">
                    <h1 className="font-display text-9xl font-bold text-primary mb-4">404</h1>
                    <h2 className="font-display text-3xl font-bold mb-2">Page Not Found</h2>
                    <p className="text-muted-foreground">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>

                <div className="flex gap-4 justify-center">
                    <Button asChild variant="default">
                        <Link href="/">
                            <Home className="w-4 h-4 mr-2" />
                            Go Home
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="javascript:history.back()">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Go Back
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
