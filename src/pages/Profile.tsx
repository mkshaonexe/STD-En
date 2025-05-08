
import { useState } from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

const Profile = () => {
  // Mock profile data - in a real app this would come from Supabase
  const [profile, setProfile] = useState({
    displayName: "John Doe",
    username: "johndoe",
    email: "john.doe@example.com",
    bio: "I am a student studying computer science. I love learning new things and challenging myself.",
    profilePicUrl: "/placeholder.svg",
    profileVisibility: "public",
    allowFollowRequests: true,
  });

  // Handler to update profile
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would update the profile in Supabase here
    toast.success("Profile updated successfully!");
  };

  // Handler for file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, we would upload the file to Supabase Storage here
      // and then update the profile with the new URL
      // For now, we'll just show a success message
      toast.success("Profile picture updated!");
    }
  };

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information here.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center space-y-2">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={profile.profilePicUrl} alt={profile.displayName} />
                        <AvatarFallback>{profile.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex items-center justify-center">
                        <Label 
                          htmlFor="picture" 
                          className="cursor-pointer text-sm text-primary hover:underline"
                        >
                          Change Picture
                        </Label>
                        <Input 
                          id="picture" 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleFileUpload} 
                        />
                      </div>
                    </div>

                    <div className="space-y-4 flex-1">
                      <div className="grid gap-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input 
                          id="displayName" 
                          value={profile.displayName}
                          onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input 
                          id="username" 
                          value={profile.username}
                          onChange={(e) => setProfile({...profile, username: e.target.value})}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={profile.email}
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      placeholder="Tell us about yourself" 
                      className="min-h-24"
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize how the app looks and feels.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-6">
                  You can change the theme using the theme selector in the sidebar or top-right corner.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control who can see your information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Profile Visibility</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose who can see your profile and study logs.
                    </p>
                  </div>
                  
                  <RadioGroup 
                    value={profile.profileVisibility} 
                    onValueChange={(value) => setProfile({...profile, profileVisibility: value})}
                    className="grid gap-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="public" id="public" />
                      <Label htmlFor="public">Public (Everyone can see your profile)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="friends" id="friends" />
                      <Label htmlFor="friends">Friends Only (Only people you follow can see)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="private" id="private" />
                      <Label htmlFor="private">Private (Only you can see your profile)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Follow Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage how others can interact with you.
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={profile.allowFollowRequests} 
                      onCheckedChange={(checked) => 
                        setProfile({...profile, allowFollowRequests: checked})
                      } 
                      id="follow-requests"
                    />
                    <Label htmlFor="follow-requests">Allow follow requests</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={() => toast.success("Privacy settings saved!")}>Save Privacy Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
};

export default Profile;
