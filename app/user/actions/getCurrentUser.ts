"use server";
import { getServerSession } from "next-auth/next";
import { BACKEND_URL } from "@/constants/constants";
import { authOptions } from "@/lib/auth";

export default async function getLoggedInUser() {
    // Get the server-side session
    const session = await getServerSession(authOptions);

    if (!session || !session?.accessToken) {
        return {
            body: null,
            status: 401,
        };
    }

    try {
        const res = await fetch(`${BACKEND_URL}/portal-users/me`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.accessToken}`,
                "Cache-Control": "no-cache",
            },
            method: "GET",
            cache: "no-store", // Ensure fresh data
        });

        const result = await res.json();
        return {
            body: result,
            status: res.status,
        };
    } catch (error) {
        console.error("Error fetching user details:", error);
        return {
            body: null,
            status: 500,
        };
    }
}