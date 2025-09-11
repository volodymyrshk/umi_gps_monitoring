"use client"

import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface FuelLevelChartProps {
  currentLevel: number
  historicalData?: Array<{
    time: string
    level: number
  }>
}

// Generate some mock historical fuel data based on current level
const generateFuelHistory = (currentLevel: number) => {
  const hours = Array.from({ length: 24 }, (_, i) => i)
  let level = Math.min(currentLevel + Math.random() * 20, 100)
  
  return hours.map((hour) => {
    // Simulate fuel consumption over time
    level = Math.max(level - Math.random() * 3, Math.max(currentLevel - 10, 0))
    if (hour === 23) level = currentLevel // End with current level
    
    return {
      time: `${hour.toString().padStart(2, '0')}:00`,
      level: Math.round(level)
    }
  }).reverse() // Most recent first
}

const chartConfig = {
  level: {
    label: "Уровень топлива",
    color: "hsl(142, 76%, 36%)", // Green color for fuel
  },
} satisfies ChartConfig

export default function FuelLevelChart({ currentLevel, historicalData }: FuelLevelChartProps) {
  const chartData = historicalData || generateFuelHistory(currentLevel)
  
  // Calculate trend
  const firstLevel = chartData[0]?.level || currentLevel
  const lastLevel = chartData[chartData.length - 1]?.level || currentLevel
  const trend = lastLevel - firstLevel
  const trendPercentage = firstLevel > 0 ? Math.abs((trend / firstLevel) * 100) : 0
  
  const getTrendIcon = () => {
    if (trend > 1) return <TrendingUp className="h-3 w-3" />
    if (trend < -1) return <TrendingDown className="h-3 w-3" />
    return <Minus className="h-3 w-3" />
  }
  
  const getTrendColor = () => {
    if (trend > 1) return "text-green-600"
    if (trend < -1) return "text-red-600"
    return "text-gray-500"
  }
  
  const getTrendText = () => {
    if (trend > 1) return `+${trendPercentage.toFixed(1)}% за 24ч`
    if (trend < -1) return `-${trendPercentage.toFixed(1)}% за 24ч`
    return "Стабильно"
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
          <span className="text-xs font-medium text-gray-700">Уровень топлива</span>
        </div>
        <div className={`flex items-center gap-1 text-xs ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="font-medium">{getTrendText()}</span>
        </div>
      </div>
      
      <div className="h-[32px] w-full">
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={chartData}
            margin={{
              left: 0,
              right: 0,
              top: 2,
              bottom: 2,
            }}
          >
            <defs>
              <linearGradient id="fillLevel" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-level)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-level)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" hide />
            <Area
              dataKey="level"
              type="monotone"
              fill="url(#fillLevel)"
              fillOpacity={0.6}
              stroke="var(--color-level)"
              strokeWidth={1.5}
            />
          </AreaChart>
        </ChartContainer>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500 mt-0.5">
        <span>24ч назад</span>
        <span className="font-bold text-gray-900">{currentLevel}%</span>
        <span>Сейчас</span>
      </div>
    </div>
  )
}