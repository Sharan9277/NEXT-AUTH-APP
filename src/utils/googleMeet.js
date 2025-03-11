import { google } from "googleapis";

export async function generateGoogleMeetLink(accessToken) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: "v3", auth });

  const event = {
    summary: "Tutoring Session",
    start: { dateTime: new Date().toISOString(), timeZone: "UTC" },
    end: { dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), timeZone: "UTC" },
    conferenceData: { createRequest: { requestId: `meet-${Date.now()}` } },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      sendUpdates: "none",
      conferenceDataVersion: 1,
    });

    return response.data.hangoutLink;
  } catch (error) {
    console.error("❌ Error creating Google Meet link:", error);
    return null;
  }
}
