import UserModel from "@/lib/models/user";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/db";


export const options: NextAuthOptions = {
  pages: {
    signIn: "/connexion",
    signOut: "/",
    newUser: "/inscription",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"email" | "password", string> | undefined
      ) {
        if (credentials) {
          await connectDB();
          const isUserExist = await UserModel.findOne({
            email: credentials.email,
          });
          if (!isUserExist) {
            throw new Error("Adresse E-mail incorrect");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            isUserExist.password
          );
          if (!isPasswordCorrect) {
            throw new Error("Mot de passe incorrect");
          }

          return {
            id: isUserExist._id.toString(),
            email: isUserExist.email,
            phone: isUserExist.phone,
            firstname: isUserExist.firstname,
            lastname: isUserExist.lastname,
            address: isUserExist.address,
            city: isUserExist.city,
            zip: isUserExist.zip,
            country: isUserExist.country,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.phone = user.phone;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
        token.address = user.address;
        token.city = user.city;
        token.zip = user.zip;
        token.country = user.country;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.phone = token.phone as string;
        session.user.firstname = token.firstname as string;
        session.user.lastname = token.lastname as string;
        session.user.address = token.address as string;
        session.user.city = token.city as string;
        session.user.zip = token.zip as string;
        session.user.country = token.country as string;
      }
      return session;
    },
  },
};