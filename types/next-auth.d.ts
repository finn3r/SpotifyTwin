import { Session } from "next-auth"
import { JWT } from "next-auth/jwt"
import {NextApiRequest} from "next";
import {NextURL} from "next/dist/server/web/next-url";

declare module "next-auth/jwt" {
    interface JWT {
        accessToken:string,
        refreshToken: string,
        accessTokenExpires: number,
        username: string,
        error?: string,
        image?: string,
        name?: string
    }
}

declare module "next" {
    interface NextApiRequest {
        nextUrl?: NextURL;
    }
}

declare module "next-auth" {
    interface Session {
        user: {
            accessToken:string,
            refreshToken: string,
            username: string,
            image?: string,
            name?: string
        }
        error?: string,
    }
}