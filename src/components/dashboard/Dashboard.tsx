
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarCheck, BarChart2, Clock, Award, TrendingUp } from "lucide-react";

// Sample data - would be replaced with real data from backend
const weeklyData = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 3.2 },
  { day: "Wed", hours: 1.8 },
  { day: "Thu", hours: 4.0 },
  { day: "Fri", hours: 2.7 },
  { day: "Sat", hours: 5.1 },
  { day: "Sun", hours: 1.5 },
];

const monthlyData = [
  { week: "Week 1", hours: 14.3 },
  { week: "Week 2", hours: 16.8 },
  { week: "Week 3", hours: 12.5 },
  { week: "Week 4", hours: 18.2 },
];

const subjectData = [
  { subject: "Math", hours: 12.5 },
  { subject: "Science", hours: 8.3 },
  { subject: "Language", hours: 6.7 },
  { subject: "Coding", hours: 15.2 },
  { subject: "History", hours: 4.8 },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <Clock className="h-8 w-8 text-study-primary mb-2" />
            <CardTitle className="text-lg mb-1">Total Study Time</CardTitle>
            <p className="text-3xl font-bold">42.5h</p>
            <CardDescription>This month</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <CalendarCheck className="h-8 w-8 text-study-primary mb-2" />
            <CardTitle className="text-lg mb-1">Study Sessions</CardTitle>
            <p className="text-3xl font-bold">23</p>
            <CardDescription>This month</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <TrendingUp className="h-8 w-8 text-study-primary mb-2" />
            <CardTitle className="text-lg mb-1">Current Streak</CardTitle>
            <p className="text-3xl font-bold">5 days</p>
            <CardDescription>Keep it up!</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <Award className="h-8 w-8 text-study-primary mb-2" />
            <CardTitle className="text-lg mb-1">Global Rank</CardTitle>
            <p className="text-3xl font-bold">#342</p>
            <CardDescription>Top 5%</CardDescription>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="subjects">By Subject</TabsTrigger>
        </TabsList>
        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Study Hours</CardTitle>
              <CardDescription>Your study time distribution this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="hours" name="Study Hours" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Progress</CardTitle>
              <CardDescription>Study hours tracked per week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="hours" name="Study Hours" stroke="#6366f1" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects">
          <Card>
            <CardHeader>
              <CardTitle>Study by Subject</CardTitle>
              <CardDescription>Distribution of study time across subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectData} layout="vertical" margin={{ top: 20, right: 30, left: 60, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="subject" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="hours" name="Study Hours" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
