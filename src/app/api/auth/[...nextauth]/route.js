import NextAuth from "next-auth/next";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import DB from "../../../../../services/database";

//AUTHENTICATION 
export const authOptions = {
    providers: [
        Credentials({
            name: 'credentials',
            credentials:{
                email: {label: "Email", type: "email", placeholder: "email@email.com"},
                password: {label: "Password", type:"password"}
            },

            async authorize(credentials, req) {
                const { User } = await DB();
                const userFound = await User.findOne({
                    email: credentials?.email,
                }).select("+password");

                if (!userFound) throw new Error ("Invalid credentials");

                const passwordMatch = await bcrypt.compare(
                    credentials.password,
                    userFound.password
                );

                if (!passwordMatch) throw new Error ("Invalid password");

                return { ...userFound, email: credentials.email }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.user = user;
            return token;
        }, 
        
        async session({ session, token }) {
            session.user = token.user;
            return session;
        },

        async getSession({ session, token, maxAge }) {
            if (Date.now() - session.timestamp > maxAge * 1000){
                throw new Error('Session expired');
            };
            return session;
        },
    },
    session: {
        maxAge: 60 * 60,
    },

    pages: {
        signIn: '/login',
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };