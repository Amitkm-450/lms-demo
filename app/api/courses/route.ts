import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        const {userId} = auth();
        const {title} = await req.json();

        if(!userId) {
            return new NextResponse("Unauthorized user", {status: 401});
        }

        const course = await db.course.create({
           data: {
            userId,
            title
           }
        });

        return NextResponse.json(course)
    } catch (error) {
        console.log("[COURSES]");
        return new NextResponse("Intenal error", {status: 500});
    }
}