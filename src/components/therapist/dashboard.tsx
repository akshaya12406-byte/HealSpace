'use client';

import { useState, useMemo } from 'react';
import { collection, query, where } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase, WithId } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, Loader2, MessageCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserProfile } from '@/lib/firebase/firestore';
import { updateChatRequestStatus, type ChatRequest } from '@/lib/firebase/chat-requests';
import { useUserProfile } from '@/hooks/use-user-profile';

interface TherapistDashboardProps {
    userProfile: UserProfile;
}

const UserRequestCard = ({ request, onAccept, onDecline }: { request: WithId<ChatRequest>, onAccept: (id: string) => void, onDecline: (id: string) => void }) => {
    const { userProfile, loading } = useUserProfile(request.userId);

    if (loading) {
        return (
            <Card className="bg-blue-50/50">
                <CardContent className="p-3 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin" />
                </CardContent>
            </Card>
        );
    }
    
    return (
        <Card className="bg-blue-50/50">
            <CardContent className="p-3">
                <p className="text-sm font-semibold">{userProfile?.displayName ?? 'A User'}</p>
                <p className="text-xs text-muted-foreground">Sent: {new Date(request.createdAt.seconds * 1000).toLocaleString()}</p>
                <div className="flex gap-2 mt-2">
                    <Button size="sm" onClick={() => onAccept(request.id)} className="bg-green-500 hover:bg-green-600">
                        <Check className="h-4 w-4 mr-1" />
                        Accept
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => onDecline(request.id)}>
                        <X className="h-4 w-4 mr-1" />
                        Decline
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default function TherapistDashboard({ userProfile }: TherapistDashboardProps) {
  const [isAvailable, setIsAvailable] = useState(true);
  const firestore = useFirestore();

  const chatRequestsQuery = useMemoFirebase(() => {
    if (!firestore || !userProfile) return null;
    return query(
        collection(firestore, 'chat_requests'), 
        where('therapistId', '==', userProfile.uid),
        where('status', '==', 'pending')
    );
  }, [firestore, userProfile]);

  const { data: chatRequests, isLoading } = useCollection<ChatRequest>(chatRequestsQuery);

  const handleUpdateRequest = async (requestId: string, status: 'accepted' | 'declined') => {
    await updateChatRequestStatus(requestId, status);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-[80vw] h-[70vh] max-w-sm md:max-w-md shadow-2xl rounded-lg flex flex-col">
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between border-b p-4">
          <div className="flex items-center gap-3">
             <Avatar className="h-10 w-10 border">
                <AvatarImage src={userProfile?.photoURL ?? ''} />
                <AvatarFallback>{userProfile?.displayName?.charAt(0) ?? 'T'}</AvatarFallback>
            </Avatar>
            <div>
                <CardTitle className="text-base font-bold">{userProfile?.displayName ?? "Therapist"}</CardTitle>
                <p className="text-xs text-muted-foreground">Therapist Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="availability-switch" checked={isAvailable} onCheckedChange={setIsAvailable} />
            <Label htmlFor="availability-switch" className={cn(isAvailable ? 'text-green-600' : 'text-red-600', 'font-semibold')}>
              {isAvailable ? 'Available' : 'Busy'}
            </Label>
          </div>
        </CardHeader>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-sm flex items-center">
              <MessageCircle className="h-4 w-4 mr-2" />
              Incoming Chat Requests
              {chatRequests && chatRequests.length > 0 && <Badge variant="destructive" className="ml-2">{chatRequests.length}</Badge>}
            </h3>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {isLoading && <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin"/></div>}
              {!isLoading && chatRequests && chatRequests.length > 0 ? (
                chatRequests.map(req => (
                  <UserRequestCard 
                    key={req.id} 
                    request={req} 
                    onAccept={(id) => handleUpdateRequest(id, 'accepted')}
                    onDecline={(id) => handleUpdateRequest(id, 'declined')}
                  />
                ))
              ) : (
                !isLoading && <p className="text-sm text-muted-foreground text-center py-4">No pending chat requests.</p>
              )}
            </div>
          </ScrollArea>
        </div>
      </Card>
    </div>
  );
}
