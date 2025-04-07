// lib/googleMeetServer.js

/**
 * Creates a Google Meet link using the server API
 * This replaces the client-side implementation with a server-side call
 */
export async function createGoogleMeetLink(bookingDetails) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/meetings/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingDetails),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error('Error creating Google Meet link:', data.error);
        return null;
      }
  
      return data.meetLink;
    } catch (error) {
      console.error('Error creating Google Meet link:', error);
      return null;
    }
  }