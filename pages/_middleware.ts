import {getToken, JWT} from "next-auth/jwt";
import {NextResponse} from "next/server";
import {NextApiRequest} from "next";

export const middleware = async (req: NextApiRequest) => {
    const token: JWT | null = await getToken({req, secret: process.env.JWT_SECRET});
    const pathname: string = req.nextUrl?.pathname ?? "";
    if (pathname.includes('/api/auth') || token) {
        return NextResponse.next();
    }
    if (!token && pathname !== '/login') {
        return NextResponse.redirect(new URL('/login', req.url));
    }
}