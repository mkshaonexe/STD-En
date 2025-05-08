
import StudyTimer from "@/components/timer/StudyTimer";
import SidebarLayout from "@/components/layout/SidebarLayout";

const Index = () => {
  return (
    <SidebarLayout>
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Study Time Tracker</h1>
          <p className="text-muted-foreground">
            Track your study hours, compete on global leaderboards, and improve your productivity.
          </p>
        </div>
        
        <StudyTimer />
      </div>
    </SidebarLayout>
  );
};

export default Index;
