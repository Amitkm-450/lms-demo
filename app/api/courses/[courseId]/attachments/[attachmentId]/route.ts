import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function  DELETE(req: NextRequest, {params}: {params: {courseId: string, attachmentId: string}}) {
    try {
        const {userId} = auth();
        
        if(!userId) {
            return new NextResponse("Unauthorized user1", {status: 401});
        }
        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        })

        if(!courseOwner) {
            return new NextResponse("Unauthorized user", {status: 401});
        }

        const attachment = await db.attachment.delete({
            where: {
                courseId: params.courseId,
                id: params.attachmentId
            },
        });

        return NextResponse.json(attachment);

    } catch (error) {
        console.log("Eroor in [attachmentId]", error);
        return new NextResponse("Internal error", {status: 500})
    }
}