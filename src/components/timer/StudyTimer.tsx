
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Play, Pause, RotateCcw, CheckCircle, Clock, 
  Coffee, Bell, X, Plus, Minus
} from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const SECONDS_IN_MINUTE = 60;

interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  mode: 'pomodoro' | 'break' | 'longBreak';
  sessionsCompleted: number;
  totalTimeStudied: number; // in seconds
}

interface TimerSettings {
  pomodoroMinutes: number;
  breakMinutes: number;
  longBreakMinutes: number;
  sessionsUntilLongBreak: number;
}

const StudyTimer = () => {
  const [timer, setTimer] = useState<TimerState>({
    minutes: 25,
    seconds: 0,
    isRunning: false,
    mode: 'pomodoro',
    sessionsCompleted: 0,
    totalTimeStudied: 0,
  });
  
  const [settings, setSettings] = useState<TimerSettings>({
    pomodoroMinutes: 25,
    breakMinutes: 5,
    longBreakMinutes: 15,
    sessionsUntilLongBreak: 4,
  });
  
  const [tag, setTag] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  
  useEffect(() => {
    // Set up audio for timer completion
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (timer.isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimer(prevTimer => {
          // Update elapsed time for study sessions
          if (prevTimer.mode === 'pomodoro') {
            setElapsedTime(prev => prev + 1);
          }
          
          if (prevTimer.seconds === 0) {
            if (prevTimer.minutes === 0) {
              // Timer completed
              const newSessionsCompleted = prevTimer.mode === 'pomodoro' 
                ? prevTimer.sessionsCompleted + 1 
                : prevTimer.sessionsCompleted;
                
              const newTotalTimeStudied = prevTimer.mode === 'pomodoro'
                ? prevTimer.totalTimeStudied + (settings.pomodoroMinutes * SECONDS_IN_MINUTE)
                : prevTimer.totalTimeStudied;
                
              // Play sound
              if (audioRef.current) {
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
              }
              
              // Show notification
              toast(
                prevTimer.mode === 'pomodoro' 
                  ? "Time to take a break!" 
                  : "Break finished! Ready to focus?",
                {
                  description: prevTimer.mode === 'pomodoro'
                    ? `You completed a ${settings.pomodoroMinutes} minute focus session`
                    : `Your ${prevTimer.mode === 'break' ? settings.breakMinutes : settings.longBreakMinutes} minute break is over`
                }
              );
              
              // Determine next mode
              let nextMode: 'pomodoro' | 'break' | 'longBreak' = 'pomodoro';
              let nextMinutes = settings.pomodoroMinutes;
              
              if (prevTimer.mode === 'pomodoro') {
                const isLongBreakDue = newSessionsCompleted % settings.sessionsUntilLongBreak === 0;
                nextMode = isLongBreakDue ? 'longBreak' : 'break';
                nextMinutes = isLongBreakDue ? settings.longBreakMinutes : settings.breakMinutes;
              }
              
              return {
                ...prevTimer,
                minutes: nextMinutes,
                seconds: 0,
                isRunning: false,
                mode: nextMode,
                sessionsCompleted: newSessionsCompleted,
                totalTimeStudied: newTotalTimeStudied,
              };
            } else {
              // Decrement minute, reset seconds
              return {
                ...prevTimer,
                minutes: prevTimer.minutes - 1,
                seconds: 59,
              };
            }
          } else {
            // Just decrement seconds
            return {
              ...prevTimer,
              seconds: prevTimer.seconds - 1,
            };
          }
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer.isRunning, settings]);
  
  const startTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: true }));
  };
  
  const pauseTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: false }));
  };
  
  const resetTimer = () => {
    let minutes;
    switch (timer.mode) {
      case 'pomodoro':
        minutes = settings.pomodoroMinutes;
        break;
      case 'break':
        minutes = settings.breakMinutes;
        break;
      case 'longBreak':
        minutes = settings.longBreakMinutes;
        break;
    }
    
    setTimer(prev => ({
      ...prev,
      minutes,
      seconds: 0,
      isRunning: false,
    }));
    
    if (timer.mode === 'pomodoro') {
      setElapsedTime(0);
    }
  };
  
  const switchMode = (mode: 'pomodoro' | 'break' | 'longBreak') => {
    let minutes;
    switch (mode) {
      case 'pomodoro':
        minutes = settings.pomodoroMinutes;
        break;
      case 'break':
        minutes = settings.breakMinutes;
        break;
      case 'longBreak':
        minutes = settings.longBreakMinutes;
        break;
    }
    
    setTimer({
      ...timer,
      mode,
      minutes,
      seconds: 0,
      isRunning: false,
    });
    
    setElapsedTime(0);
  };
  
  const adjustTimer = (amount: number) => {
    if (!timer.isRunning) {
      setTimer(prev => ({
        ...prev,
        minutes: Math.max(1, prev.minutes + amount),
        seconds: 0
      }));
    }
  };
  
  const addTag = () => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTag('');
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };
  
  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const formatElapsedTime = () => {
    const hours = Math.floor(elapsedTime / 3600);
    const minutes = Math.floor((elapsedTime % 3600) / 60);
    const seconds = elapsedTime % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const progressPercentage = () => {
    let totalSeconds;
    switch (timer.mode) {
      case 'pomodoro':
        totalSeconds = settings.pomodoroMinutes * 60;
        break;
      case 'break':
        totalSeconds = settings.breakMinutes * 60;
        break;
      case 'longBreak':
        totalSeconds = settings.longBreakMinutes * 60;
        break;
    }
    
    const currentSeconds = timer.minutes * 60 + timer.seconds;
    return ((totalSeconds - currentSeconds) / totalSeconds) * 100;
  };
  
  const formatTotalStudyTime = () => {
    const totalMinutes = Math.floor(timer.totalTimeStudied / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };
  
  return (
    <div className="flex flex-col items-center gap-6">
      <Card className="w-full max-w-xl">
        <CardContent className="p-6">
          <Tabs defaultValue="timer" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="timer">Timer</TabsTrigger>
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            </TabsList>
            <TabsContent value="timer" className="space-y-6">
              <div className="flex justify-center mb-6">
                <div className="flex space-x-2">
                  <Button 
                    variant={timer.mode === 'pomodoro' ? "default" : "outline"} 
                    onClick={() => switchMode('pomodoro')}
                  >
                    Focus
                  </Button>
                  <Button 
                    variant={timer.mode === 'break' ? "default" : "outline"} 
                    onClick={() => switchMode('break')}
                  >
                    Short Break
                  </Button>
                  <Button 
                    variant={timer.mode === 'longBreak' ? "default" : "outline"} 
                    onClick={() => switchMode('longBreak')}
                  >
                    Long Break
                  </Button>
                </div>
              </div>
              
              <div className="timer-container">
                <div className="timer-circle mb-4">
                  <svg className="w-full h-full" viewBox="0 0 120 120">
                    <circle
                      r="54"
                      cx="60"
                      cy="60"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="text-gray-100 dark:text-gray-700"
                    />
                    <circle
                      r="54"
                      cx="60"
                      cy="60"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeDasharray="339.292"
                      strokeDashoffset={339.292 - (339.292 * progressPercentage() / 100)}
                      className="text-study-primary transform -rotate-90 origin-center transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <div className="text-5xl font-bold">
                      {formatTime(timer.minutes, timer.seconds)}
                    </div>
                    {timer.mode === 'pomodoro' && timer.isRunning && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Elapsed: {formatElapsedTime()}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-4">
                  {!timer.isRunning && (
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => adjustTimer(-1)}
                      disabled={timer.isRunning || timer.minutes <= 1}
                      className="rounded-full"
                    >
                      <Minus size={18} />
                    </Button>
                  )}
                  
                  {!timer.isRunning ? (
                    <Button 
                      onClick={startTimer} 
                      size="icon" 
                      className="btn-timer bg-study-primary hover:bg-study-accent text-white animate-pulse-shadow"
                    >
                      <Play size={24} fill="currentColor" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={pauseTimer} 
                      size="icon" 
                      className="btn-timer bg-study-primary hover:bg-study-accent text-white"
                    >
                      <Pause size={24} />
                    </Button>
                  )}
                  
                  <Button 
                    onClick={resetTimer} 
                    size="icon" 
                    variant="outline"
                    className="rounded-full"
                  >
                    <RotateCcw size={18} />
                  </Button>
                  
                  {!timer.isRunning && (
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => adjustTimer(1)}
                      disabled={timer.isRunning}
                      className="rounded-full"
                    >
                      <Plus size={18} />
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col gap-2 mt-6">
                <label className="text-sm font-medium">Session Tags</label>
                <div className="flex items-center gap-2">
                  <Input 
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="Add a tag (e.g. Math)"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button onClick={addTag} variant="outline" size="sm">Add</Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((t, i) => (
                    <Badge key={i} variant="secondary" className="px-2 py-1 text-sm">
                      {t}
                      <X 
                        size={14} 
                        className="ml-1 cursor-pointer" 
                        onClick={() => removeTag(t)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <div>Sessions: {timer.sessionsCompleted}</div>
                <div>Total study time: {formatTotalStudyTime()}</div>
              </div>
            </TabsContent>
            
            <TabsContent value="manual" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Study Duration</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input 
                      type="number" 
                      placeholder="Hours"
                      min={0}
                      className="w-24"
                    />
                    <Input 
                      type="number" 
                      placeholder="Minutes"
                      min={0}
                      max={59}
                      className="w-24"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Subject/Category</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="math">Mathematics</SelectItem>
                      <SelectItem value="programming">Programming</SelectItem>
                      <SelectItem value="languages">Languages</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Tags</label>
                  <div className="flex items-center gap-2">
                    <Input 
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      placeholder="Add a tag"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button onClick={addTag} variant="outline" size="sm">Add</Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((t, i) => (
                      <Badge key={i} variant="secondary" className="px-2 py-1 text-sm">
                        {t}
                        <X 
                          size={14} 
                          className="ml-1 cursor-pointer" 
                          onClick={() => removeTag(t)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button className="w-full">Log Study Session</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyTimer;
