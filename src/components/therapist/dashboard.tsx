'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, MessageCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserProfile } from '@/lib/firebase/firestore';

// Mock data for demonstration purposes
const waitingUsers = [
  { id: 'user1', name: 'AnxiousAndy', issue: 'General Anxiety', waitingFor: '5 mins' },
  { id: 'user2', name: 'StressedStudent', issue: 'Exam Stress', waitingFor: '12 mins' },
  { id: 'user3', name: 'SadSam', issue: 'Feeling Down', waitingFor: '2 mins' },
];

const chatRequests = [
  { id: 'req1', userName: 'AnxiousAndy', message: 'Can I talk to someone please? I\'m feeling very overwhelmed.' },
];

interface TherapistDashboardProps {
    userProfile: UserProfile;
}

export default function TherapistDashboard({ userProfile }: TherapistDashboardProps) {
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(waitingUsers[0]);
  const [currentRequests, setCurrentRequests] = useState(chatRequests);

  const handleAcceptRequest = (requestId: string) => {
    // In a real app, this would update Firestore
    setCurrentRequests(prev => prev.filter(req => req.id !== requestId));
  };
  
  const handleDeclineRequest = (requestId: string) => {
    // In a real app, this would update Firestore
    setCurrentRequests(prev => prev.filter(req => req.id !== requestId));
  };


  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-[80vw] h-[70vh] max-w-4xl shadow-2xl rounded-lg flex flex-col">
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
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 overflow-hidden">
          {/* Left Panel: Waiting Users */}
          <div className="col-span-1 border-r flex flex-col">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-sm">Waiting for Therapy</h3>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {waitingUsers.map(user => (
                  <Button
                    key={user.id}
                    variant={selectedUser?.id === user.id ? 'secondary' : 'ghost'}
                    className="w-full justify-start h-auto p-2 text-left"
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex flex-col">
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.issue}</p>
                      <p className="text-xs text-primary">{user.waitingFor}</p>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel: Chat and Requests */}
          <div className="md:col-span-2 flex flex-col">
            {/* Incoming Requests */}
            <div className="p-4 border-b">
              <h3 className="font-semibold text-sm flex items-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                Incoming Chat Requests
                {currentRequests.length > 0 && <Badge variant="destructive" className="ml-2">{currentRequests.length}</Badge>}
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {currentRequests.length > 0 ? currentRequests.map(req => (
                <Card key={req.id} className="bg-blue-50/50">
                  <CardContent className="p-3">
                    <p className="text-sm font-semibold">{req.userName}</p>
                    <p className="text-sm text-muted-foreground my-2">"{req.message}"</p>
                    <div className="flex gap-2 mt-2">
                       <Button size="sm" onClick={() => handleAcceptRequest(req.id)} className="bg-green-500 hover:bg-green-600">
                           <Check className="h-4 w-4 mr-1" />
                           Accept
                       </Button>
                       <Button size="sm" variant="ghost" onClick={() => handleDeclineRequest(req.id)}>
                           <X className="h-4 w-4 mr-1" />
                           Decline
                       </Button>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <p className="text-sm text-muted-foreground text-center py-4">No pending chat requests.</p>
              )}
            </div>
            <div className="flex-1 border-t p-4 flex items-center justify-center bg-gray-50">
                 <p className="text-muted-foreground">Select a user to view session details.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
