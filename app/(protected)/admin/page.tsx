'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth';
import { Header } from '@/src/components/Header';
import { AddEventForm } from '@/src/components/AddEventForm';
import { EventsList } from '@/src/components/EventsList';
import { Loader2, ShieldCheck } from 'lucide-react';

export default function AdminPage() {
    const { user, isAdmin, isLoading } = useAuth();
    const router = useRouter();
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        if (!isLoading && (!user || !isAdmin)) {
            router.push('/auth');
        }
    }, [user, isAdmin, isLoading, router]);

    const handleEventAdded = () => {
        setRefreshKey((k) => k + 1);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user || !isAdmin) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-hero">
            <Header />

            <section className="py-8 px-4">
                <div className="container mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="font-display text-2xl font-bold">Admin Dashboard</h1>
                            <p className="text-sm text-muted-foreground">Manage events and results</p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        <AddEventForm onEventAdded={handleEventAdded} />
                        <EventsList key={refreshKey} />
                    </div>
                </div>
            </section>
        </div>
    );
}
