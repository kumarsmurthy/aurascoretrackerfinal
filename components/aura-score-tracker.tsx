'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { format } from "date-fns"

import { DumbbellIcon, MoonIcon, UtensilsIcon, HeartIcon, TrophyIcon, SmileIcon, ArrowRightIcon, ArrowLeftIcon, PlusIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

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
    sliderMax: 8,
    sliderUnit: "hours",
  },
  {
    title: "Emotional Wellbeing",
    icon: <HeartIcon />,
    toggleOptions: ["In-person Interaction", "Virtual Interaction"],
    color: "blue",
    sliderMax: 6,
    sliderUnit: "hours",
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

type AuraScoreEntry = {
  date: string;
  score: number;
}

type User = {
  email: string;
  password: string;
  auraScores: AuraScoreEntry[];
}

const AuthForm: React.FC<{ onAuth: (user: User) => void }> = ({ onAuth }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would validate the input and perform actual authentication here
    onAuth({ email, password, auraScores: [] })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
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
          <Button type="submit" className="w-full">Sign In</Button>
        </form>
      </CardContent>
    </Card>
  )
}

const WelcomePage: React.FC<{ onContinue: () => void, user: User | null, onSignIn: () => void }> = ({ onContinue, user, onSignIn }) => {
  const currentDate = new Date()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto text-center"
    >
      <Card className="bg-gradient-to-br from-purple-400 to-indigo-600 text-white">
        <CardHeader>
          <CardTitle className="text-4xl font-bold mb-4">
            {user ? `Welcome back, ${user.email}!` : "Hello! Welcome to AuraScore"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl mb-6">One place to track all your wellness goals</p>
          <p className="text-lg mb-8">{format(currentDate, 'MMMM d, yyyy')}</p>
          <Button 
            onClick={user ? onContinue : onSignIn}
            className="bg-white text-purple-600 hover:bg-gray-100 hover:text-purple-700 transition-colors duration-200"
          >
            {user ? "Start Tracking" : "Get Started"}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const ProfilePage: React.FC<{ user: User, onBack: () => void }> = ({ user, onBack }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Your AuraScore History</CardTitle>
      </CardHeader>
      <CardContent>
        {user.auraScores && user.auraScores.length > 0 ? (
          <ul className="space-y-2">
            {user.auraScores.map((entry, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{entry.date}</span>
                <span className="font-bold">{entry.score.toFixed(1)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No AuraScore history available yet.</p>
        )}
        <Button onClick={onBack} className="mt-4">Back to Tracking</Button>
      </CardContent>
    </Card>
  )
}

export function AuraScoreTracker() {
  const [user, setUser] = useState<User | null>(null)
  const [showWelcome, setShowWelcome] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0)
  const [toggleStates, setToggleStates] = useState(categories.map(() => false))
  const [sliderValues, setSliderValues] = useState(categories.map((cat) => cat.sliderMax ? Math.floor(cat.sliderMax / 2) : 0))
  const [textInputs, setTextInputs] = useState(categories.map(() => ['']))
  const [showFinalScore, setShowFinalScore] = useState(false)
  const [auraScore, setAuraScore] = useState(0)

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData')
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData)
      setUser(parsedUserData.user)
      setToggleStates(parsedUserData.toggleStates || categories.map(() => false))
      setSliderValues(parsedUserData.sliderValues || categories.map((cat) => cat.sliderMax ? Math.floor(cat.sliderMax / 2) : 0))
      setTextInputs(parsedUserData.textInputs || categories.map(() => ['']))
    }
  }, [])

  useEffect(() => {
    if (user) {
      const userData = {
        user,
        toggleStates,
        sliderValues,
        textInputs
      }
      localStorage.setItem('userData', JSON.stringify(userData))
    }
  }, [user, toggleStates, sliderValues, textInputs])

  const currentCategory = categories[currentCategoryIndex] || categories[0]

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
    const score = (
      ((sliderValues[0] / 60) * 20) + // Physical Wellbeing
      ((sliderValues[1] / 12) * 20) + // Sleep / Relaxation
      ((sliderValues[2] / 8) * 20) +  // Fasting
      ((sliderValues[3] / 6) * 20) +  // Emotional Wellbeing
      10 +                            // Accomplishment
      10                              // Gratitude
    )
    setAuraScore(score)
    setShowFinalScore(true)

    const newEntry: AuraScoreEntry = {
      date: format(new Date(), 'yyyy-MM-dd'),
      score: score
    }

    let updatedUser: User
    if (user) {
      updatedUser = {
        ...user,
        auraScores: [newEntry, ...(user.auraScores || [])].slice(0, 20)
      }
    } else {
      updatedUser = {
        email: '',
        password: '',
        auraScores: [newEntry]
      }
    }
    setUser(updatedUser)

    // Update localStorage
    const storedUserData = localStorage.getItem('userData')
    const parsedUserData = storedUserData ? JSON.parse(storedUserData) : {}
    parsedUserData.user = updatedUser
    localStorage.setItem('userData', JSON.stringify(parsedUserData))
  }

  const resetTracker = () => {
    setCurrentCategoryIndex(0)
    setToggleStates(categories.map(() => false))
    setSliderValues(categories.map((cat) => cat.sliderMax ? Math.floor(cat.sliderMax / 2) : 0))
    setTextInputs(categories.map(() => ['']))
    setShowFinalScore(false)
    setAuraScore(0)
    setShowWelcome(true)
  }

  const handleAuth = (authenticatedUser: User) => {
    const storedUserData = localStorage.getItem('userData')
    const parsedUserData = storedUserData ? JSON.parse(storedUserData) : {}
    
    const userWithAuraScores = {
      ...authenticatedUser,
      auraScores: parsedUserData.user?.auraScores || []
    }
    setUser(userWithAuraScores)
    setShowAuth(false)
    setShowWelcome(false)

    // Update localStorage
    parsedUserData.user = userWithAuraScores
    localStorage.setItem('userData', JSON.stringify(parsedUserData))
  }

  const handleLogout = () => {
    setUser(null)
    resetTracker()
    setShowWelcome(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-blue-900 flex flex-col">
      <nav className="bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90 py-4 px-4 md:px-6 w-full z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">AuraScore</h1>
          {user ? (
            <div className="flex items-center space-x-4">
              <Button onClick={() => setShowProfile(true)} variant="outline">
                Profile
              </Button>
              <Button onClick={handleLogout} variant="outline">
                Sign out
              </Button>
            </div>
          ) : (
            <Button onClick={() => setShowAuth(true)} variant="outline">
              Sign in
            </Button>
          )}
        </div>
      </nav>
      <div className="flex-grow flex items-center justify-center p-4 md:p-8">
        {showAuth || (!user && !showWelcome) ? (
          <AuthForm onAuth={handleAuth} />
        ) : showProfile && user ? (
          <ProfilePage user={user} onBack={() => setShowProfile(false)} />
        ) : showWelcome ? (
          <WelcomePage onContinue={() => setShowWelcome(false)} user={user} onSignIn={() => setShowAuth(true)} />
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
                {currentCategory.title === "Physical Wellbeing" && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Working out everyday will lead to good mental and physical health. How many minutes did you workout today?
                  </p>
                )}
                {currentCategory.title === "Sleep / Relaxation" && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Relaxation is as important as physical workout for a peaceful state of mind.
                  </p>
                )}
                {currentCategory.title === "Fasting" && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Fasting for few hours a day will help in reducing weight and boosts metabolism.
                  </p>
                )}
                {currentCategory.title === "Emotional Wellbeing" && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Connecting with your loved ones helps reduce anxiety, stress and improves overall mental health. How many hours did you interact with your loved ones today?
                  
                  </p>
                )}
                {currentCategory.title === "Accomplishment" && (
                  <p  className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Accomplishing a task will improve your self confidence and promotes positive mindset. What did you accomplish today?
                  </p>
                )}
                {currentCategory.title === "Gratitude" && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Being grateful for what we have in our life will lead to a positive mindset and makes us happy. What are you grateful for today?
                  </p>
                )}
              </CardHeader>
              <CardContent className="p-4 md:p-8">
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
            <div className="w-48 h-48 mx-auto mb-6">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e0e0e0"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={auraScore < 33 ? "#FF4136" : auraScore < 66 ? "#FFDC00" : "#2ECC40"}
                  strokeWidth="10"
                  strokeDasharray={`${auraScore * 2.83} 283`}
                  transform="rotate(-90 50 50)"
                />
                <text x="50" y="50" textAnchor="middle" dy=".3em" fontSize="20" fontWeight="bold">
                  {auraScore.toFixed(1)}
                </text>
              </svg>
            </div>
            <p className="mt-4 text-lg md:text-xl">Your AuraScore for today is: {auraScore.toFixed(1)}</p>
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