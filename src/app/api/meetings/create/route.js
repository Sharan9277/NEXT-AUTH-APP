// app/api/meetings/create.js
import { google } from 'googleapis';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User'; // Assuming this is where your User model is defined

// Google API credentials - store these in your .env file
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'https://yourapp.com/api/auth/google/callback';
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

export async function POST(req) {
  try {
    // Connect to MongoDB database
    await connectToDatabase();
    
    // Parse the request body
    const body = await req.json();
    const { 
      date, 
      start_time, 
      end_time, 
      booking_type, 
      studentName, 
      tutorName,
      studentEmail,
      tutorEmail
    } = body;

    if (!date || !start_time || !end_time) {
      return Response.json({ success: false, error: 'Missing required booking details' }, { status: 400 });
    }

    // Parse dates and times
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
      
      const startTime = convertTo24Hour(start_time);
      const endTime = convertTo24Hour(end_time);
      
      // Create ISO format dates
      const startISOString = `${date}T${startTime}:00`;
      const endISOString = `${date}T${endTime}:00`;
      
      startDateTime = new Date(startISOString);
      endDateTime = new Date(endISOString);
      
      // Ensure we have valid dates
      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        throw new Error(`Invalid date or time: ${date} ${startTime} - ${endTime}`);
      }
    } catch (error) {
      console.error("Date parsing error:", error);
      return Response.json({ success: false, error: 'Invalid date or time format' }, { status: 400 });
    }

    // Fetch all admin users from MongoDB
    const adminUsers = await User.find({ role: 'admin' }).select('email');
    const adminEmails = adminUsers.map(admin => admin.email);

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI
    );

    // Set credentials using refresh token
    oauth2Client.setCredentials({
      refresh_token: GOOGLE_REFRESH_TOKEN
    });

    // Create Google Calendar instance
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Create attendees array with student, tutor, and all admin emails
    const attendees = [];
    
    if (studentEmail) {
      attendees.push({ email: studentEmail });
    }
    
    if (tutorEmail) {
      attendees.push({ email: tutorEmail });
    }
    
    // Add all admin users as attendees
    adminEmails.forEach(email => {
      if (email) {
        attendees.push({ email });
      }
    });

    // Create event with conferencing data and attendees
    const event = {
      summary: `Lesson with ${studentName || 'Student'}`,
      description: `${booking_type || 'individual'} lesson${tutorName ? ` with ${tutorName}` : ''}`,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'UTC'
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'UTC'
      },
      attendees: attendees, // Include student, tutor, and all admins
      conferenceData: {
        createRequest: {
          requestId: `meeting-${Date.now()}`,
          conferenceSolutionKey: { 
            type: 'hangoutsMeet' 
          }
        }
      }
    };

    console.log("Event to be created:", event);

    // Insert the event
    const response = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      maxAttendees: attendees.length, // Update max attendees to accommodate all participants
      sendNotifications: true,
      sendUpdates: 'all', // This will send invitations to attendees
      supportsAttachments: true,
      resource: event
    });

    // Extract the Google Meet link
    const meetLink = response.data.conferenceData?.entryPoints?.find(
      entry => entry.entryPointType === 'video'
    )?.uri;

    if (!meetLink) {
      return Response.json({ 
        success: false, 
        error: 'No Meet link found in response',
        details: response.data 
      }, { status: 500 });
    }

    // Return the Google Meet link
    return Response.json({ 
      success: true,
      meetLink,
      eventId: response.data.id
    }, { status: 200 });
  } catch (error) {
    console.error('Error creating Google Meet link:', error);
    return Response.json({ 
      success: false, 
      error: 'Failed to create Google Meet link',
      message: error.message 
    }, { status: 500 });
  }
}