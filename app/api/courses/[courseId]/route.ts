import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req:NextRequest, {params}: {params: {courseId: string}}) {
    try {
        const {userId} = auth();
        const {courseId} = params;
        const values = await req.json()

        if(!userId) {
            return new NextResponse("Unauthorized user", {status: 401});
        }

        const course = await db.course.update({
           where: {
            id: courseId,
            userId
           },
           data: {
            ...values
           }
        });

        return NextResponse.json(course)
    } catch (error) {
        console.log("[COURSES]");
        return new NextResponse("Intenal error", {status: 500});
    }
}