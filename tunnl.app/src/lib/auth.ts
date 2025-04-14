import KeycloakProvider from 'next-auth/providers/keycloak';
import { NextAuthOptions } from "next-auth";
import client from '@/lib/db';
import { insertUser, updateUserLogin } from '@/db/types/users.queries';

export const authOptions: NextAuthOptions = {
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_CLIENT_ID!,
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
            issuer: process.env.KEYCLOAK_ISSUER!,
        })
    ],
    callbacks: {
        async signIn({ user }) {
            try {
                insertUser.run(
                    { email: user.email },
                    client
                )
            } catch {
                updateUserLogin.run(
                    { email: 'aidanhop1@gmail.com' },
                    client
                )
            }
            return true;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};
