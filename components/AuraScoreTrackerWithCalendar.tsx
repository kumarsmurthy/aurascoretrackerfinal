"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { format } from "date-fns"

import { DumbbellIcon, MoonIcon, UtensilsIcon, HeartIcon, TrophyIcon, SmileIcon, ArrowRightIcon, ArrowLeftIcon, PlusIcon } from "lucide-react"

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
    color: "orange",
    sliderMax: 60,
    sliderUnit: "minutes",
  },
  {
    title: "Sleep / Relaxation",
    icon: <MoonIcon />,
    toggleOptions: ["Poor Sleep", "Good Sleep"],
    color: "indigo",
    sliderMax: 12,
    sliderUnit: "hours",
  },
  {
    title: "Fasting",
    icon: <UtensilsIcon />,
    toggleOptions: ["Intermittent Fasting", "Extended Fasting"],
    color: "yellow",
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
    color: "green",
    isTextInput: true,
  },
  {
    title: "Gratitude",
    icon: <SmileIcon />,
    color: "purple",
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

const DynamicBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [backgroundColors, setBackgroundColors] = useState(['#FFE5E5', '#E5FFF2', '#E5F0FF'])

  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundColors(prevColors => {
        const newColors = prevColors.map(() => {
          const hue = Math.floor(Math.random() * 360)
          return `hsl(${hue}, 100%, 95%)`
        })
        return newColors
      })
    }, 10000) // Change colors every 10 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div 
      className="min-h-screen transition-colors duration-10000 ease-in-out"
      style={{
        background: `linear-gradient(135deg, ${backgroundColors[0]} 0%, ${backgroundColors[1]} 50%, ${backgroundColors[2]} 100%)`,
      }}
    >
      {children}
    </div>
  )
}

const WelcomePage: React.FC<{ onContinue: () => void, user: User | null, onSignIn: () => void }> = ({ onContinue, user, onSignIn }) => {
  const currentDate = new Date()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8"
    >
      <Card className="bg-white bg-opacity-50 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            {user ? `Welcome back, ${user.email}!` : "Hello! Welcome to AuraScore"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg sm:text-xl mb-6 text-gray-700">One place to track all your wellness goals</p>
          <p className="text-base sm:text-lg mb-8 text-gray-600">{format(currentDate, 'MMMM d, yyyy')}</p>
          <Button 
            onClick={user ? onContinue : onSignIn}
            className="bg-primary text-primary-foreground hover:bg-primary/80 focus:bg-blue-300 focus:text-white active:bg-blue-400 transition-colors duration-200 w-full sm:w-auto"
          >
            {user ? "Start Tracking" : "Get Started"}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const AuraScoreDisplay: React.FC<{ score: number, onReset: () => void }> = ({ score, onReset }) => {
  //Removed: const [windowDimension, setWindowDimension] = useState<{ width: number; height: number }>({ width: 0, height: 0 })
  //Removed: const [showConfetti, setShowConfetti] = useState(true)
  //Removed: const refAnimationInstance = useRef<((opts: any) => void) | null>(null)


  //Removed useEffect
  //Removed useEffect
  //Removed getInstance
  //Removed makeShot
  //Removed firePartyPopper
  //Removed useEffect


  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center w-full max-w-md px-4 sm:px-6 relative z-10"
    >
      {/*Removed ReactConfetti and ReactCanvasConfetti JSX */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Your AuraScore</h2>
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
            stroke={score < 33 ? "#FF4136" : score < 66 ? "#FFDC00" : "#2ECC40"}
            strokeWidth="10"
            strokeDasharray={`${score * 2.83} 283`}
            transform="rotate(-90 50 50)"
          />
          <text x="50" y="50" textAnchor="middle" dy=".3em" fontSize="20" fontWeight="bold" fill="#333">
            {score.toFixed(1)}
          </text>
        </svg>
      </div>
      <p className="mt-4 text-lg sm:text-xl mb-8 text-gray-700">Your AuraScore for today is: {score.toFixed(1)}</p>
      <Button
        onClick={onReset}
        className="bg-primary text-primary-foreground hover:bg-primary/80 focus:bg-blue-300 focus:text-white active:bg-blue-400 transition-colors duration-200 w-full sm:w-auto"
      >
        Start Over
      </Button>
    </motion.div>
  )
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
    <Card className="w-full max-w-md mx-auto px-4 sm:px-6 bg-white bg-opacity-50 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-bold text-center text-gray-800">Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white bg-opacity-75 text-gray-800 placeholder-gray-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white bg-opacity-75 text-gray-800 placeholder-gray-500"
            />
          </div>
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/80 focus:bg-blue-300 focus:text-white active:bg-blue-400 transition-colors duration-200">Sign In</Button>
        </form>
      </CardContent>
    </Card>
  )
}

const ProfilePage: React.FC<{ user: User, onBack: () => void }> = ({ user, onBack }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto px-4 sm:px-6 bg-white bg-opacity-50 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800">Your AuraScore History</CardTitle>
      </CardHeader>
      <CardContent>
        {user.auraScores && user.auraScores.length > 0 ? (
          <ul className="space-y-2">
            {user.auraScores.map((entry, index) => (
              <li key={index} className="flex justify-between items-center text-gray-700">
                <span>{entry.date}</span>
                <span className="font-bold">{entry.score.toFixed(1)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700">No AuraScore history available yet.</p>
        )}
        <Button onClick={onBack} className="mt-4 w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/80 focus:bg-blue-300 focus:text-white active:bg-blue-400 transition-colors duration-200">Back to Tracking</Button>
      </CardContent>
    </Card>
  )
}

const AuraScoreTracker: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [showProfile, setShowProfile] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [showFinalScore, setShowFinalScore] = useState(false)
  const [auraScore, setAuraScore] = useState(0)
  
  const [showAuth, setShowAuth] = useState(false)
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0)
  const [toggleStates, setToggleStates] = useState(categories.map(() => false))
  const [sliderValues, setSliderValues] = useState(categories.map((cat) => cat.sliderMax ? Math.floor(cat.sliderMax / 2) : 0))
  const [textInputs, setTextInputs] = useState(categories.map(() => ['']))

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

  const handleAuth = (authenticatedUser: User) => {
    setUser(authenticatedUser)
    setShowAuth(false)
    setShowWelcome(false)
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

    if (user) {
      const newEntry: AuraScoreEntry = {
        date: format(new Date(), 'yyyy-MM-dd'),
        score: score
      }
      const updatedUser = {
        ...user,
        auraScores: [newEntry, ...user.auraScores].slice(0, 20)
      }
      setUser(updatedUser)

      // Update localStorage
      const storedUserData = localStorage.getItem('userData')
      const parsedUserData = storedUserData ? JSON.parse(storedUserData) : {}
      parsedUserData.user = updatedUser
      localStorage.setItem('userData', JSON.stringify(parsedUserData))
    }
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

  return (
    <DynamicBackground>
      <div className="flex flex-col min-h-screen">
        <nav className="bg-white bg-opacity-50 py-4 px-4 sm:px-6 w-full z-10 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-0">AuraScore</h1>
            {user ? (
              <div className="flex items-center space-x-4">
                <Button onClick={() => setShowProfile(true)} variant="outline" className="w-full sm:w-auto bg-white bg-opacity-50 text-gray-800 hover:bg-blue-100 focus:bg-blue-300 focus:text-white active:bg-blue-400 transition-colors duration-200">
                  Profile
                </Button>
                <Button onClick={() => {
                  setUser(null);
                  resetTracker();
                }} variant="outline" className="w-full sm:w-auto bg-white bg-opacity-50 text-gray-800 hover:bg-blue-100 focus:bg-blue-300 focus:text-white active:bg-blue-400 transition-colors duration-200">
                  Sign out
                </Button>
              </div>
            ) : (
              <Button onClick={() => setShowAuth(true)} variant="outline" className="w-full sm:w-auto bg-white bg-opacity-50 text-gray-800 hover:bg-blue-100 focus:bg-blue-300 focus:text-white active:bg-blue-400 transition-colors duration-200">
                Sign in
              </Button>
            )}
          </div>
        </nav>
        <div className="flex-grow flex items-center justify-center p-4 sm:p-6 md:p-8">
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
              className="w-full max-w-2xl px-4 sm:px-6"
            >
              <Card className="mb-4 overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-lg bg-white bg-opacity-50 backdrop-blur-md">
                <CardHeader className={`bg-${categories[currentCategoryIndex].color}-100`}>
                  <CardTitle className="flex items-center text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
                    {React.cloneElement(categories[currentCategoryIndex].icon as React.ReactElement, { className: `h-6 w-6 md:h-8 md:w-8 mr-3 text-${categories[currentCategoryIndex].color}-500` })}
                    {categories[currentCategoryIndex].title}
                  </CardTitle>
                  <p className="mt-2 text-sm text-gray-600">
                    {categories[currentCategoryIndex].title === "Physical Wellbeing" && "Working out everyday will lead to good mental and physical health. How many minutes did you workout today?"}
                    {categories[currentCategoryIndex].title === "Sleep / Relaxation" && "Relaxation is as important as physical workout for a peaceful state of mind."}
                    {categories[currentCategoryIndex].title === "Fasting" && "Fasting for few hours a day will help in reducing weight and boosts metabolism."}
                    {categories[currentCategoryIndex].title === "Emotional Wellbeing" && "Connecting with your loved ones helps reduce anxiety, stress and improves overall mental health. How many hours did you interact with your loved ones today?"}
                    {categories[currentCategoryIndex].title === "Accomplishment" && "Accomplishing a task will improve your self confidence and promotes positive mindset. What did you accomplish today?"}
                    {categories[currentCategoryIndex].title === "Gratitude" && "Being grateful for what we have in our life will lead to a positive mindset and makes us happy and calm, What are you grateful for today?"}
                  </p>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 md:p-8 text-gray-800">
                  {categories[currentCategoryIndex].isTextInput ? (
                    <div className="space-y-4">
                      {textInputs[currentCategoryIndex].map((text, index) => (
                        <Textarea
                          key={index}
                          placeholder={`Enter your ${categories[currentCategoryIndex].title.toLowerCase()} point ${index + 1}`}
                          value={text}
                          onChange={(e) => handleTextInputChange(index, e.target.value)}
                          className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-${categories[currentCategoryIndex].color}-500 bg-white bg-opacity-75 text-gray-800 placeholder-gray-500`}
                        />
                      ))}
                      <Button
                        onClick={addTextInput}
                        className={`mt-2 bg-black text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-400 w-full sm:w-auto`}
                      >
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Add Another Point
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                        <span className="text-sm sm:text-base font-medium mb-2 sm:mb-0">{categories[currentCategoryIndex].toggleOptions?.[0]}</span>
                        <Switch
                          checked={toggleStates[currentCategoryIndex]}
                          onCheckedChange={handleToggleChange}
                          className={`bg-${categories[currentCategoryIndex].color}-500 my-2 sm:my-0`}
                        />
                        <span className="text-sm sm:text-base font-medium">{categories[currentCategoryIndex].toggleOptions?.[1]}</span>
                      </div>
                      <div className="space-y-6">
                        <Slider
                          value={[sliderValues[currentCategoryIndex]]}
                          onValueChange={handleSliderChange}
                          max={categories[currentCategoryIndex].sliderMax}
                          step={1}
                          className={`text-${categories[currentCategoryIndex].color}-500`}
                        />
                        <div className="text-center text-base sm:text-lg md:text-xl font-medium">
                          {sliderValues[currentCategoryIndex]} {categories[currentCategoryIndex].sliderUnit}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              <div className="flex flex-col sm:flex-row justify-between mt-6 space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  onClick={handleBack}
                  disabled={currentCategoryIndex === 0}
                  className={`text-sm sm:text-base px-4 py-2 sm:py-3 bg-primary text-primary-foreground hover:bg-primary/80 focus:bg-blue-300 focus:text-white active:bg-blue-400 transition-colors duration-200 w-full sm:w-auto ${currentCategoryIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <ArrowLeftIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  className={`text-sm sm:text-base px-4 py-2 sm:py-3 bg-primary text-primary-foreground hover:bg-primary/80 focus:bg-blue-300 focus:text-white active:bg-blue-400 transition-colors duration-200 w-full sm:w-auto`}
                >
                  {currentCategoryIndex < categories.length - 1 ? (
                    <>
                      Next <ArrowRightIcon className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </>
                  ) : (
                    "Submit and Calculate my AuraScore"
                  )}
                </Button>
              </div>
            </motion.div>
          ) : (
            <AuraScoreDisplay score={auraScore} onReset={resetTracker} />
          )}
        </div>
      </div>
    </DynamicBackground>
  )
}

export default AuraScoreTracker
