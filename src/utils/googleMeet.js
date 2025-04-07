// utils/googleMeet.js
"use client";
import { useEffect } from 'react';

// Configuration constants (to be configured in your app)
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.app.created',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.events.owned'
];

// Initialize Google API client
export function useGoogleApi() {
  useEffect(() => {
    // Load the Google API client library
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = initializeGapiClient;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  function initializeGapiClient() {
    window.gapi.load('client:auth2', () => {
      window.gapi.auth2.init({ client_id: CLIENT_ID });
      window.gapi.client.setApiKey(API_KEY);
      window.gapi.client.load("https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest")
        .then(() => console.log("GAPI client loaded for API"))
        .catch(err => console.error("Error loading GAPI client for API", err));
    });
  }
}

// Authenticate the user
export async function authenticate() {
  try {
    if (!window.gapi || !window.gapi.auth2) {
      console.error("Google API client not loaded yet");
      return false;
    }
    
    const authInstance = window.gapi.auth2.getAuthInstance();
    
    // Check if already signed in
    if (authInstance.isSignedIn.get()) {
      console.log("User is already signed in");
      return true;
    }
    
    // Sign in
    await authInstance.signIn({ scope: SCOPES.join(' ') });
    console.log("Sign-in successful");
    return true;
  } catch (err) {
    console.error("Error authenticating with Google", err);
    return false;
  }
}

// Create Google Meet link
export async function createGoogleMeetLink(bookingDetails) {
  try {
    // Ensure authentication
    const isAuthenticated = await authenticate();
    if (!isAuthenticated) {
      throw new Error("Authentication failed");
    }
    
    // Safely parse date and time
    let startDateTime, endDateTime;
    
    try {
      // Convert 12-hour format to 24-hour format if needed
      const convertTo24Hour = (timeStr) => {
        // Check if it's in 12-hour format with AM/PM
        if (timeStr.includes('AM') || timeStr.includes('PM')) {
          const [time, period] = timeStr.split(' ');
          let [hours, minutes] = time.split(':');
          
          // Convert to 24-hour format
          hours = parseInt(hours);
          if (period === 'PM' && hours < 12) {
            hours += 12;
          } else if (period === 'AM' && hours === 12) {
            hours = 0;
          }
          
          // Format with leading zeros
          return `${hours.toString().padStart(2, '0')}:${minutes}`;
        }
        return timeStr;
      };
      
      const startTime = convertTo24Hour(bookingDetails.start_time);
      const endTime = convertTo24Hour(bookingDetails.end_time);
      
      console.log(`Converted times: start=${startTime}, end=${endTime}`);
      
      // Create date objects using ISO format
      const dateStr = bookingDetails.date;
      
      // Create ISO format dates
      const startISOString = `${dateStr}T${startTime}:00`;
      const endISOString = `${dateStr}T${endTime}:00`;
      
      startDateTime = new Date(startISOString);
      endDateTime = new Date(endISOString);
      
      // Ensure we have valid dates
      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        throw new Error(`Invalid date or time: ${dateStr} ${startTime} - ${endTime}`);
      }
      
      console.log("Start DateTime:", startDateTime);
      console.log("End DateTime:", endDateTime);
    } catch (error) {
      console.error("Date parsing error:", error);
      
      // Fallback: Use current date + 1 day with fixed times
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0); // 10:00 AM
      startDateTime = tomorrow;
      
      const tomorrowEnd = new Date(tomorrow);
      tomorrowEnd.setHours(11, 0, 0); // 11:00 AM
      endDateTime = tomorrowEnd;
      
      console.log("Using fallback dates:", startDateTime, endDateTime);
    }
    
    // Create a calendar event with conferencing data
    const event = {
      summary: `Lesson with ${bookingDetails.studentName || 'Student'}`,
      description: `${bookingDetails.booking_type || 'individual'} lesson`,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'UTC'
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'UTC'
      },
      conferenceData: {
        createRequest: {
          requestId: `meeting-${Date.now()}`,
          conferenceSolutionKey: { 
            type: 'hangoutsMeet' 
          }
        }
      }
    };
    
    console.log("Event payload:", JSON.stringify(event, null, 2));
    
    try {
      // Using the updated parameters from the working example
      const response = await window.gapi.client.calendar.events.insert({
        calendarId: 'primary',
        conferenceDataVersion: 1,
        maxAttendees: 2,
        sendNotifications: true,
        sendUpdates: 'all',
        supportsAttachments: true,
        resource: event
      });
      
      console.log("API response status:", response.status);
      const result = response.result;
      
      // Extract and return the Meet link
      const meetLink = result.conferenceData?.entryPoints?.find(
        entry => entry.entryPointType === 'video'
      )?.uri;
      
      if (!meetLink) {
        console.log("No meet link found in response. Response data:", JSON.stringify(result, null, 2));
      } else {
        console.log("Successfully created Google Meet link:", meetLink);
      }
      
      return meetLink;
    } catch (err) {
      console.error("API call error:", err.message);
      if (err.result) {
        console.error("Response error details:", JSON.stringify(err.result, null, 2));
      }
      throw err;
    }
  } catch (error) {
    console.error('Error creating Google Meet link:', error.message);
    return null;
  }
}

// Example usage in a React component
export function GoogleMeetButton({ bookingDetails, onMeetLinkCreated }) {
  const handleCreateMeeting = async () => {
    try {
      const meetLink = await createGoogleMeetLink(bookingDetails);
      if (meetLink) {
        onMeetLinkCreated(meetLink);
      } else {
        console.error("Failed to create meet link");
      }
    } catch (error) {
      console.error("Error creating meeting:", error);
    }
  };

  return (
    <div>
      <button onClick={handleCreateMeeting}>Create Google Meet Link</button>
    </div>
  );
}