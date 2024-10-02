import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DumbbellIcon, MoonIcon, UtensilsIcon, HeartIcon, TrophyIcon, SmileIcon, ArrowRightIcon, ArrowLeftIcon, PlusIcon, LogOutIcon, UserIcon, CalendarIcon, MenuIcon } from "lucide-react"
import { motion } from "framer-motion"
import { format } from "date-fns"

type User = {
  email: string;
  password: string;
  auraScores: { [date: string]: number[] };
}

type Category = {
  title: string;
  icon: React.ReactNode;
  toggleOptions?: [string, string];
  color: string;
  sliderMax?: number;
  sliderUnit?: string;
  isTextInput?: boolean;
}

const categories: Category[] = [
  {
    title: "Physical Wellbeing",
    icon: <DumbbellIcon />,
    toggleOptions: ["Light Workout", "Heavy Workout"],
    color: "blue",
    sliderMax: 60,
    sliderUnit: "minutes",
  },
  {
    title: "Sleep / Relaxation",
    icon: <MoonIcon />,
    toggleOptions: ["Poor Sleep", "Good Sleep"],
    color: "blue",
    sliderMax: 12,
    sliderUnit: "hours",
  },
  {
    title: "Fasting",
    icon: <UtensilsIcon />,
    toggleOptions: ["Intermittent Fasting", "Extended Fasting"],
    color: "blue",
    sliderMax: 24,
    sliderUnit: "hours",
  },
  {
    title: "Emotional Wellbeing",
    icon: <HeartIcon />,
    toggleOptions: ["In-person Interaction", "Virtual Interaction"],
    color: "blue",
    sliderMax: 60,
    sliderUnit: "minutes",
  },
  {
    title: "Accomplishment",
    icon: <TrophyIcon />,
    color: "blue",
    isTextInput: true,
  },
  {
    title: "Gratitude",
    icon: <SmileIcon />,
    color: "blue",
    isTextInput: true,
  },
]

const SpeedometerChart: React.FC<{ score: number }> = ({ score }) => {
  const angle = (score / 200) * 180 - 90;
  const color = score < 70 ? "#FF4136" : score < 140 ? "#FFDC00" : "#2ECC40";

  return (
    <div className="w-16 h-8 relative">
      <svg className="w-full h-full" viewBox="0 0 100 50">
        <path
          d="M5 50 A 45 45 0 0 1 95 50"
          fill="none"
          stroke="#e0e0e0"
          strokeWidth="10"
        />
        <path
          d="M5 50 A 45 45 0 0 1 95 50"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={`${(score / 200) * 141.37} 141.37`}
        />
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="5"
          stroke="#333"
          strokeWidth="2"
          transform={`rotate(${angle} 50 50)`}
        />
        <circle cx="50" cy="50" r="3" fill="#333" />
        <text x="50" y="30" textAnchor="middle" fontSize="12" fontWeight="bold">
          {score.toFixed(1)}
        </text>
      </svg>
    </div>
  )
}

const AuthForm: React.FC<{ onAuth: (user: User) => void }> = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    if (isLogin) {
      // Login
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const user = users.find((u: User) => u.email === email && u.password === password)
      if (user) {
        onAuth(user)
      } else {
        setError('Invalid email or password')
      }
    } else {
      // Sign up
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const existingUser = users.find((u: User) => u.email === email)
      if (existingUser) {
        setError('User already exists')
      } else {
        const newUser = { email, password, auraScores: {} }
        users.push(newUser)
        localStorage.setItem('users', JSON.stringify(users))
        onAuth(newUser)
      }
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {isLogin ? "Log in to AuraScore" : "Sign up for AuraScore"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full">
            {isLogin ? "Log In" : "Sign Up"}
          </Button>
        </form>
        <p className="mt-4 text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <Button
            variant="link"
            className="ml-1 p-0"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign up" : "Log in"}
          </Button>
        </p>
      </CardContent>
    </Card>
  )
}

const UserProfile: React.FC<{ user: User; onBack: () => void }> = ({ user, onBack }) => {
  const sortedScores = Object.entries(user.auraScores)
    .flatMap(([date, scores]) => {
      if (Array.isArray(scores)) {
        return scores.map((score, index) => ({ date, score, index }));
      } else if (typeof scores === 'number') {
        return [{ date, score: scores, index: 0 }];
      }
      return [];
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Email:</h3>
          <p>{user.email}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">AuraScore History:</h3>
          {sortedScores.length > 0 ? (
            <ScrollArea className="h-[400px] rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Date</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead className="text-right">Visualization</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedScores.map(({ date, score, index }) => (
                    <TableRow key={`${date}-${index}`}>
                      <TableCell className="font-medium">{format(new Date(date), 'MMMM d, yyyy')}</TableCell>
                      <TableCell>{score.toFixed(1)}</TableCell>
                      <TableCell className="text-right">
                        <SpeedometerChart score={score} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          ) : (
            <p>No AuraScores recorded yet.</p>
          )}
        </div>
        <Button onClick={onBack} className="mt-6">
          Back to Tracker
        </Button>
      </CardContent>
    </Card>
  )
}

export default function AuraScoreTrackerWithCalendar() {
  const [user, setUser] = useState<User | null>(null)
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0)
  const [toggleStates, setToggleStates] = useState(categories.map(() => false))
  const [sliderValues, setSliderValues] = useState(categories.map((cat) => cat.sliderMax ? Math.floor(cat.sliderMax / 2) : 0))
  const [textInputs, setTextInputs] = useState(categories.map(() => ['']))
  const [showFinalScore, setShowFinalScore] = useState(false)
  const [auraScore, setAuraScore] = useState(0)
  const [showProfile, setShowProfile] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [showCalendar, setShowCalendar] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      if (!parsedUser.auraScores) {
        parsedUser.auraScores = {}
      }
      setUser(parsedUser)
    }
  }, [])

  const currentCategory = categories[currentCategoryIndex] || categories[0]

  const handleAuth = (authUser: User) => {
    if (!authUser.auraScores) {
      authUser.auraScores = {}
    }
    setUser(authUser)
    localStorage.setItem('currentUser', JSON.stringify(authUser))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
    resetTracker()
  }

  const handleNext = () => {
    if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1)
    } else {
      calculateAuraScore()
    }
  }

  const handleBack = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1)
    }
  }

  const handleToggleChange = (checked: boolean) => {
    const newToggleStates = [...toggleStates]
    newToggleStates[currentCategoryIndex] = checked
    setToggleStates(newToggleStates)
  }

  const handleSliderChange = (value: number[]) => {
    const newSliderValues = [...sliderValues]
    newSliderValues[currentCategoryIndex] = value[0]
    setSliderValues(newSliderValues)
  }

  const handleTextInputChange = (index: number, value: string) => {
    const newTextInputs = [...textInputs]
    newTextInputs[currentCategoryIndex][index] = value
    setTextInputs(newTextInputs)
  }

  const addTextInput = () => {
    const newTextInputs = [...textInputs]
    newTextInputs[currentCategoryIndex].push('')
    setTextInputs(newTextInputs)
  }

  const calculateAuraScore = () => {
    const score = sliderValues[0] + // Physical Wellbeing minutes
                  sliderValues[1] + // Sleep hours
                  sliderValues[2] + // Fasting hours
                  sliderValues[3] + // Emotional Wellbeing minutes
                  1 + // Accomplishment (always 1)
                  1   // Gratitude (always 1)
    setAuraScore(score)
    setShowFinalScore(true)

    // Save the score to user's history
    if (user && selectedDate) {
      const dateString = format(selectedDate, 'yyyy-MM-dd')
      const updatedUser = {
        ...user,
        auraScores: {
          ...user.auraScores,
          [dateString]: Array.isArray(user.auraScores[dateString])
            ? [...user.auraScores[dateString], score]
            : [score]
        }
      }
      setUser(updatedUser)
      localStorage.setItem('currentUser', JSON.stringify(updatedUser))

      // Update the user in the users array
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const updatedUsers = users.map((u: User) => u.email === user.email ? updatedUser : u)
      localStorage.setItem('users', JSON.stringify(updatedUsers))
    }
  }

  const resetTracker = () => {
    setCurrentCategoryIndex(0)
    setToggleStates(categories.map(() => false))
    setSliderValues(categories.map((cat) => cat.sliderMax ? Math.floor(cat.sliderMax / 2) : 0))
    setTextInputs(categories.map(() => ['']))
    setShowFinalScore(false)
    setAuraScore(0)
    setSelectedDate(new Date())
    setShowCalendar(false)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setShowCalendar(false)
    resetTracker()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-blue-900 flex flex-col">
      <nav className="bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90 py-4 px-4 md:px-6 w-full z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">AuraScore</h1>
          {user && (
            <div className="flex items-center">
              <span className="hidden md:inline text-sm md:text-base text-gray-600 dark:text-gray-300 mr-4">
                Logged in as: {user.email}
              </span>
              <div className="hidden md:flex space-x-2">
                <Button onClick={() => setShowProfile(true)} variant="outline" size="sm">
                  <UserIcon className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button onClick={() => setShowCalendar(true)} variant="outline" size="sm">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Calendar
                </Button>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  <LogOutIcon className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
              <Button onClick={() => setShowMenu(!showMenu)} variant="outline" size="sm" className="md:hidden">
                <MenuIcon className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        {showMenu && user && (
          <div className="mt-4 space-y-2 md:hidden">
            <Button onClick={() => { setShowProfile(true); setShowMenu(false); }} variant="outline" size="sm" className="w-full">
              <UserIcon className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <Button onClick={() => { setShowCalendar(true); setShowMenu(false); }} variant="outline" size="sm" className="w-full">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Calendar
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm" className="w-full">
              <LogOutIcon className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </nav>
      <div className="flex-grow flex items-center justify-center p-4 md:p-8">
        {!user ? (
          <AuthForm onAuth={handleAuth} />
        ) : showProfile ? (
          <UserProfile user={user} onBack={() => setShowProfile(false)} />
        ) : showCalendar ? (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-bold text-center">Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        ) : !showFinalScore ? (
          <motion.div
            key={currentCategoryIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl"
          >
            <Card className="mb-4 overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-lg">
              <CardHeader className={`bg-${currentCategory.color}-100 dark:bg-${currentCategory.color}-900`}>
                <CardTitle className="flex items-center text-xl md:text-2xl font-semibold">
                  {React.cloneElement(currentCategory.icon as React.ReactElement, { className: `h-6 w-6 md:h-8 md:w-8 mr-3 text-${currentCategory.color}-500` })}
                  {currentCategory.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-8">
                <div className="mb-4 text-center">
                  <span className="text-base md:text-lg font-medium">Date: {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Not selected'}</span>
                </div>
                {currentCategory.isTextInput ? (
                  <div className="space-y-4">
                    {textInputs[currentCategoryIndex].map((text, index) => (
                      <Textarea
                        key={index}
                        placeholder={`Enter your ${currentCategory.title.toLowerCase()} point ${index + 1}`}
                        value={text}
                        onChange={(e) => handleTextInputChange(index, e.target.value)}
                        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-${currentCategory.color}-500`}
                      />
                    ))}
                    <Button
                      onClick={addTextInput}
                      className={`mt-2 bg-${currentCategory.color}-500 hover:bg-${currentCategory.color}-600 text-white w-full md:w-auto`}
                    >
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Add Another Point
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                      <span className="text-base md:text-lg font-medium mb-2 md:mb-0">{currentCategory.toggleOptions?.[0]}</span>
                      <Switch
                        checked={toggleStates[currentCategoryIndex]}
                        onCheckedChange={handleToggleChange}
                        className={`bg-${currentCategory.color}-500 my-2 md:my-0`}
                      />
                      <span className="text-base md:text-lg font-medium">{currentCategory.toggleOptions?.[1]}</span>
                    </div>
                    <div className="space-y-6">
                      <Slider
                        value={[sliderValues[currentCategoryIndex]]}
                        onValueChange={handleSliderChange}
                        max={currentCategory.sliderMax}
                        step={1}
                        className={`text-${currentCategory.color}-500`}
                      />
                      <div className="text-center text-lg md:text-xl font-medium">
                        {sliderValues[currentCategoryIndex]} {currentCategory.sliderUnit}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            <div className="flex flex-col md:flex-row justify-between mt-6 space-y-4 md:space-y-0">
              <Button
                onClick={handleBack}
                disabled={currentCategoryIndex === 0}
                className={`text-base md:text-lg px-4 md:px-6 py-2 md:py-3 bg-gray-500 hover:bg-gray-600 text-white w-full md:w-auto ${currentCategoryIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                className={`text-base md:text-lg px-4 md:px-6 py-2 md:py-3 bg-${currentCategory.color}-500 hover:bg-${currentCategory.color}-600 text-white w-full md:w-auto`}
              >
                {currentCategoryIndex < categories.length - 1 ? (
                  <>
                    Next <ArrowRightIcon className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                  </>
                ) : (
                  "Submit and Calculate my AuraScore"
                )}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center w-full max-w-md"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Your AuraScore</h2>
            <SpeedometerChart score={auraScore} />
            <p className="mt-4 text-lg md:text-xl">Your AuraScore for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'today'} is: {auraScore.toFixed(1)}</p>
            <Button
              onClick={resetTracker}
              className="mt-8 bg-blue-500 hover:bg-blue-600 text-white w-full md:w-auto"
            >
              Start Over
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
