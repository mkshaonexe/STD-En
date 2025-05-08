
import { useState, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Filter, Trophy, Users, Star, Medal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LeaderboardUser {
  id: number;
  name: string;
  username: string;
  avatar: string;
  hours: number;
  rank: number;
  country: string;
  subject?: string;
}

// Mock data for the leaderboard
const globalUsers: LeaderboardUser[] = [
  { id: 1, name: "Alex Johnson", username: "@alexj", avatar: "/placeholder.svg", hours: 156, rank: 1, country: "US" },
  { id: 2, name: "Maria Garcia", username: "@mariag", avatar: "/placeholder.svg", hours: 142, rank: 2, country: "ES" },
  { id: 3, name: "Hiroshi Tanaka", username: "@hiroshi", avatar: "/placeholder.svg", hours: 135, rank: 3, country: "JP" },
  { id: 4, name: "Sarah Wilson", username: "@sarahw", avatar: "/placeholder.svg", hours: 129, rank: 4, country: "CA" },
  { id: 5, name: "Omar Hassan", username: "@omarh", avatar: "/placeholder.svg", hours: 118, rank: 5, country: "EG" },
  { id: 6, name: "Emma Thompson", username: "@emmat", avatar: "/placeholder.svg", hours: 112, rank: 6, country: "UK" },
  { id: 7, name: "Liu Wei", username: "@liuw", avatar: "/placeholder.svg", hours: 105, rank: 7, country: "CN" },
  { id: 8, name: "Carlos Mendoza", username: "@carlosm", avatar: "/placeholder.svg", hours: 98, rank: 8, country: "MX" },
  { id: 9, name: "Priya Sharma", username: "@priyas", avatar: "/placeholder.svg", hours: 92, rank: 9, country: "IN" },
  { id: 10, name: "Daniel Kim", username: "@danielk", avatar: "/placeholder.svg", hours: 87, rank: 10, country: "KR" },
];

const friendsUsers: LeaderboardUser[] = [
  { id: 2, name: "Maria Garcia", username: "@mariag", avatar: "/placeholder.svg", hours: 142, rank: 2, country: "ES" },
  { id: 5, name: "Omar Hassan", username: "@omarh", avatar: "/placeholder.svg", hours: 118, rank: 5, country: "EG" },
  { id: 7, name: "Liu Wei", username: "@liuw", avatar: "/placeholder.svg", hours: 105, rank: 7, country: "CN" },
];

const subjectUsers: LeaderboardUser[] = [
  { id: 1, name: "Alex Johnson", username: "@alexj", avatar: "/placeholder.svg", hours: 45, rank: 1, country: "US", subject: "Mathematics" },
  { id: 3, name: "Hiroshi Tanaka", username: "@hiroshi", avatar: "/placeholder.svg", hours: 42, rank: 2, country: "JP", subject: "Mathematics" },
  { id: 6, name: "Emma Thompson", username: "@emmat", avatar: "/placeholder.svg", hours: 38, rank: 3, country: "UK", subject: "Mathematics" },
];

const UserRow = ({ user, rank }: { user: LeaderboardUser; rank: number }) => (
  <div className="flex items-center justify-between py-3 border-b last:border-0">
    <div className="flex items-center gap-4">
      <div className="w-8 text-center font-semibold">{rank}</div>
      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
      </div>
      <div>
        <p className="font-medium">{user.name}</p>
        <p className="text-sm text-muted-foreground">{user.username}</p>
      </div>
    </div>
    <div className="flex items-center">
      <div className="text-right mr-2">
        <p className="font-medium">{user.hours} hrs</p>
        <p className="text-xs text-muted-foreground">{user.country}</p>
      </div>
      {rank <= 3 && (
        <div className={`p-1 rounded-full ${rank === 1 ? 'bg-yellow-400' : rank === 2 ? 'bg-gray-300' : 'bg-amber-600'}`}>
          {rank === 1 ? <Trophy size={16} /> : rank === 2 ? <Medal size={16} /> : <Star size={16} />}
        </div>
      )}
    </div>
  </div>
);

const SearchInput = ({ placeholder, value, onChange }: { 
  placeholder: string; 
  value: string; 
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="relative">
    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
    <Input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="pl-8"
    />
  </div>
);

const Leaderboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('global');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter users based on search query
  const filteredGlobalUsers = globalUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFriendsUsers = friendsUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubjectUsers = subjectUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl">Leaderboard</CardTitle>
        <div className="flex flex-col md:flex-row gap-3 mt-4">
          <SearchInput 
            placeholder="Search users..." 
            value={searchQuery} 
            onChange={handleSearch}
          />
          <div className="flex gap-2">
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter size={16} />
                  <SelectValue placeholder="Filter by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="global" className="flex gap-2 items-center">
              <Trophy size={16} />
              <span className="hidden sm:inline">Global</span>
            </TabsTrigger>
            <TabsTrigger value="friends" className="flex gap-2 items-center">
              <Users size={16} />
              <span className="hidden sm:inline">Friends</span>
            </TabsTrigger>
            <TabsTrigger value="subjects" className="flex gap-2 items-center">
              <Star size={16} />
              <span className="hidden sm:inline">Subjects</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="global" className="mt-4">
            <ScrollArea className="h-[400px]">
              {filteredGlobalUsers.map((user, index) => (
                <UserRow key={user.id} user={user} rank={index + 1} />
              ))}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="friends" className="mt-4">
            {filteredFriendsUsers.length > 0 ? (
              <ScrollArea className="h-[400px]">
                {filteredFriendsUsers.map((user, index) => (
                  <UserRow key={user.id} user={user} rank={index + 1} />
                ))}
              </ScrollArea>
            ) : (
              <div className="py-12 text-center">
                <Users className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-semibold">No friends yet</h3>
                <p className="text-muted-foreground mt-2">Add friends to see how they compare on the leaderboard.</p>
                <Button className="mt-4">Find Friends</Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="subjects" className="mt-4">
            <div className="mb-4">
              <Select defaultValue="mathematics">
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="language">Languages</SelectItem>
                  <SelectItem value="programming">Programming</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ScrollArea className="h-[360px]">
              {filteredSubjectUsers.map((user, index) => (
                <UserRow key={user.id} user={user} rank={index + 1} />
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
