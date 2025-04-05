"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import React from "react"

interface WeeklyCalendarProps {
  className?: string
  studentId?: string
}

export function WeeklyCalendar({ className, studentId }: WeeklyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [days, setDays] = useState<Date[]>([])
  const [currentWeekStart, setCurrentWeekStart] = useState<Date | null>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const timeColumnRef = useRef<HTMLDivElement>(null)
  const currentTimeRef = useRef<HTMLDivElement>(null)
  const [scrollbarWidth, setScrollbarWidth] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date())
  
  // Calculate scrollbar width on mount
  useEffect(() => {
    // Create a dummy element to measure scrollbar width
    const outer = document.createElement('div')
    outer.style.visibility = 'hidden'
    outer.style.overflow = 'scroll'
    document.body.appendChild(outer)
    
    // Create inner element to calculate difference
    const inner = document.createElement('div')
    outer.appendChild(inner)
    
    // Calculate scrollbar width
    const scrollbarSize = outer.offsetWidth - inner.offsetWidth
    setScrollbarWidth(scrollbarSize)
    
    // Cleanup
    document.body.removeChild(outer)
  }, [])

  // Generate time slots from 00:00 to 23:30 in 30-minute intervals
  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2)
    const minute = i % 2 === 0 ? 0 : 30
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
  })

  // Generate days of the week based on the current date
  useEffect(() => {
    const calculateWeekDays = (baseDate: Date) => {
      const day = baseDate.getDay() // 0 = Sunday, 1 = Monday, ...
      
      // Calculate the date of the most recent Monday
      const monday = new Date(baseDate)
      monday.setDate(baseDate.getDate() - (day === 0 ? 6 : day - 1))
      monday.setHours(0, 0, 0, 0)
      
      setCurrentWeekStart(new Date(monday))
      
      // Generate an array of 7 days starting from Monday
      const weekDays = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(monday)
        day.setDate(monday.getDate() + i)
        return day
      })
      
      setDays(weekDays)
    }
    
    calculateWeekDays(currentDate)
  }, [currentDate])

  // Update current time every minute
  useEffect(() => {
    // Set the initial current time
    setCurrentTime(new Date())
    
    const interval = setInterval(() => {
      // Update the current time directly
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  // Scroll to current time on initial load
  useEffect(() => {
    if (currentTimeRef.current && timelineRef.current) {
      const now = new Date()
      const totalMinutesSinceMidnight = now.getHours() * 60 + now.getMinutes()
      const scrollPosition = (totalMinutesSinceMidnight / 30) * 50 // Each 30-min slot is 50px high

      timelineRef.current.scrollTop = scrollPosition - 200 // Scroll to position the current time in the middle of the viewport
    }
  }, [days])

  // Format day for display (e.g., "Mon 31")
  const formatDay = (date: Date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return `${days[date.getDay()]} ${date.getDate()}`
  }

  // Format date for the week header (e.g., "Mar 31 – Apr 6, 2025")
  const formatWeekRange = () => {
    if (!days.length || days.length < 7) return ""
    
    const startDate = days[0]
    const endDate = days[6]
    
    const startMonth = startDate.toLocaleString('default', { month: 'short' })
    const endMonth = endDate.toLocaleString('default', { month: 'short' })
    const startDay = startDate.getDate()
    const endDay = endDate.getDate()
    const year = endDate.getFullYear()
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} – ${endDay}, ${year}`
    } else {
      return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${year}`
    }
  }

  // Navigate to previous week
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 7)
    setCurrentDate(newDate)
  }

  // Navigate to next week
  const goToNextWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 7)
    setCurrentDate(newDate)
  }

  // Go to current week
  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Calculate current time position using the currentTime state
  const getCurrentTimePosition = () => {
    const hours = currentTime.getHours()
    const minutes = currentTime.getMinutes()
    const totalMinutes = hours * 60 + minutes
    const percentage = ((totalMinutes % 30) / 30) * 100

    return {
      slot: Math.floor(totalMinutes / 30),
      percentage,
    }
  }

  const { slot, percentage } = getCurrentTimePosition()
  
  // Get the current day index (0 = Monday, 1 = Tuesday, etc.)
  const currentDayIndex = currentTime.getDay() === 0 ? 6 : currentTime.getDay() - 1
  
  // Check if the current day is in the displayed week
  const isCurrentDayInView = days.some(day => 
    day.getDate() === currentTime.getDate() && 
    day.getMonth() === currentTime.getMonth() && 
    day.getFullYear() === currentTime.getFullYear()
  )

  // Sync time column scroll with timeline scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (timeColumnRef.current) {
      timeColumnRef.current.style.transform = `translateY(-${e.currentTarget.scrollTop}px)`;
    }
  }

  return (
    <div className={cn("flex flex-col h-full ", className)}>
      {/* Navigation bar */}
      <div className="flex items-center justify-between py-4 bg-white">
        <div className="flex items-center space-x-2 gap-2">
          <button
            onClick={goToToday}
            className="px-4 py-2 font-semibold font-inter text-[15px] bg-white text-black border border-gray-200 rounded-md hover:bg-gray-200 transition-colors"
          >
            Today
          </button>
          <div className="flex items-center border rounded-md">
            <button 
              onClick={goToPreviousWeek}
              className="p-2 hover:bg-gray-100  transition-colors border-r text-black"
            >
              <svg width="25" height="25" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button 
              onClick={goToNextWeek}
              className="p-2 hover:bg-gray-100  transition-colors border-l text-black"
            >
              <svg width="25" height="25" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <h2 className="font-bold font-[20px] font-inter text-black">{formatWeekRange()}</h2>
        </div>
        <div className="flex items-end justify-end space-x-2 gap-3">
          <button className="  font-inter font-semibold text-gray-400">
            ✓ Confirmed
          </button>
          <button className=" font-inter font-semibold text-gray-400">
            Weekly
          </button>
          <button className="font-inter font-semibold text-gray-400">
            Single
          </button>
        </div>
      </div>

      {/* Calendar table with fixed header and time column */}
      <div className="flex-1 flex flex-col overflow-hidden border justify-center">
        {/* Header row with scrollbar compensation */}
        <div className="flex">
          {/* Time column header */}
          <div className="w-[100px] flex-shrink-0 p-3 text-[13px] font-inter text-center text-gray-500 border-r border-b">
            GMT +1:00
          </div>
          
          {/* Days header with same width as content plus scrollbar width */}
          <div className="flex-1 grid grid-cols-7 border-b" 
               style={{ paddingRight: scrollbarWidth }}>
            {days.map((day, index) => {
              // Check if this day is the current day
              const isCurrentDay = 
                day.getDate() === currentTime.getDate() && 
                day.getMonth() === currentTime.getMonth() && 
                day.getFullYear() === currentTime.getFullYear();
              
              return (
                <div
                  key={index}
                  className={cn(
                    "p-3 text-center font-semibold border-r last:border-r-0 font-inter text-black text-[15px] ",
                    isCurrentDay && "text-blue-600 font-bold font-inter text-[15px] border-b-2 border-b-blue-600",
                  )}
                >
                  {formatDay(day)}
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Content area with time column and scrollable grid */}
        <div className="flex-1 flex overflow-hidden">
          {/* Time column with overflow-hidden */}
          <div className="w-[100px] flex-shrink-0 overflow-hidden bg-white">
            <div 
              ref={timeColumnRef} 
              className="w-full"
              style={{ willChange: "transform" }}
            >
              {timeSlots.map((time, index) => (
                <div
                  key={index}
                  className={cn("h-[50px] p-3 text-sm text-gray-500 border-r text-center", 
                               index % 2 === 0 ? "border-b" : "border-b")}
                >
                  {index % 2 === 0 ? time : ""}
                </div>
              ))}
            </div>
          </div>
          
          {/* Scrollable grid area */}
          <div 
            ref={timelineRef}
            className="flex-1 overflow-y-auto overflow-x-hidden"
            onScroll={handleScroll}
          >
            {/* Grid with relative positioning for time indicator */}
            <div className="grid grid-cols-7 relative">
              {/* Current time indicator - only on current day */}
              {isCurrentDayInView && (
                <div
                  ref={currentTimeRef}
                  className="absolute z-10 pointer-events-none"
                  style={{
                    top: `${slot * 50 + (percentage * 0.5)}px`,
                    left: `${currentDayIndex * (100 / 7)}%`,
                    width: `${100 / 7}%`,
                  }}
                >
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                    <div className="h-[1px] bg-pink-500 flex-1"></div>
                  </div>
                </div>
              )}

              {/* Calendar cells */}
              {Array.from({ length: 7 }).map((_, dayIndex) => (
                <div key={dayIndex} className="border-r last:border-r-0">
                  {timeSlots.map((_, timeIndex) => (
                    <div key={timeIndex} className="h-[50px] border-b" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}