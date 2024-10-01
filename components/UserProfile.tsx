import React from 'react'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type User = {
  email: string;
  password: string;
  auraScores: { [date: string]: number[] };
  accomplishments: { [date: string]: string[] };
  gratitude: { [date: string]: string[] };
}

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
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Accomplishments and Gratitude:</h3>
          <ScrollArea className="h-[200px] rounded-md border p-4">
            {Object.entries(user.accomplishments).map(([date, accomplishments]) => (
              <div key={date} className="mb-4">
                <h4 className="font-semibold">{format(new Date(date), 'MMMM d, yyyy')}</h4>
                <p className="text-sm text-gray-600">Accomplishments:</p>
                <ul className="list-disc list-inside">
                  {accomplishments.map((accomplishment, index) => (
                    <li key={index}>{accomplishment}</li>
                  ))}
                </ul>
                {user.gratitude[date] && (
                  <>
                    <p className="text-sm text-gray-600 mt-2">Gratitude:</p>
                    <ul className="list-disc list-inside">
                      {user.gratitude[date].map((gratitude, index) => (
                        <li key={index}>{gratitude}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            ))}
          </ScrollArea>
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

export default UserProfile
