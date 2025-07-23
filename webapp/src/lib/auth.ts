import KeycloakProvider from 'next-auth/providers/keycloak';
import { NextAuthOptions } from "next-auth";
import pool from '@/lib/db';
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
            const client = await pool.connect()
            try {
                await insertUser.run(
                    { email: user.email },
                    client
                )
            } catch {
                updateUserLogin.run(
                    { email: user.email },
                    client
                )
            } finally {
                client.release();
                return true;
            }
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};
