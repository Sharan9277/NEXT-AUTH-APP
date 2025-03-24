import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import transporter from '@/lib/nodemailer';
import Student from "@/models/Student";
import Tutor from "@/models/Tutor";
import { cookies } from "next/headers"; // ✅ Use Next.js headers API
import { parse } from "cookie";


export const authOptions = {
  providers: [
    // Google Authentication
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        url: "https://accounts.google.com/o/oauth2/auth",
        params: {
          scope: "https://www.googleapis.com/auth/calendar.events openid email profile",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
    // Facebook Authentication
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    // Apple Authentication
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET,
    }),
    // Credentials (Email & Password)
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDatabase();
        const user = await User.findOne({ email: credentials.email });

        if (!user) throw new Error("User not found");

        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) throw new Error("Invalid credentials");

        return user;
      },
    }),
  ],
  callbacks: { 

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async signIn({ user, account, profile, context}) {
      await connectToDatabase();
    
      let role = "student"; // Default role
      console.log("cookie from request: ", context?.req?.headers?.cookie);
      // ✅ Retrieve the role from cookies
      if (account?.provider === "google") {
        console.log("cookie: ", context?.req?.headers?.cookie);
        const cookies = parse(context?.req?.headers?.cookie || ""); 
        console.log("Cookies:", cookies); // ✅ Debugging
        if (cookies.signupRole) {
          role = cookies.signupRole;
          console.log("Role from cookie:", role); // ✅ Debugging
        }
      }
    
      const existingUser = await User.findOne({ email: user.email });


    
      if (!existingUser) {

        const password = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create user with the correct role
        const newUser = await User.create({
          email: user.email,
          password: hashedPassword, 
          role: role, // ✅ Use role from state
        });
    
        user.id = newUser._id;
        user.role = newUser.role;

        let profileData;
          if (role === "student") {
            profileData = await Student.create({
              user_id: newUser._id,
              student_id: uuidv4(),
              name: user.name,

              isVerified: true 
            });
          } else { 
            profileData = await Tutor.create({
              user_id: newUser._id,
              tutor_id: uuidv4(),
              name: user.name,

              subject_expertise: [],
              hourly_rate: 0,
              isVerified: true 
            });
          } 

              const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Account Creation Confirmation',
                text: `Your account has been created successfully. Use the following credentials to sign in: Email: ${user.email}, Password: ${password}`,
              };
              console.log("Password:", password);
          
              await transporter.sendMail(mailOptions);
              console.log("Assignment submission email sent");

        
      } else {
        user.id = existingUser._id;
        user.role = existingUser.role;
      }
    
      return true;
    }
    
  },
  pages: {
    signIn: "/login-selection",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
