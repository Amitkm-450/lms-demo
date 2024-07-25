import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"

export async function PATCH(
    req: Request, 
    {params}: {
        params: {
            courseId: string,
            chapterId: string
        }
    }
) {
    try {
        const {userId} = auth();
        if(!userId) {
            return new NextResponse("Unauthorized user", {status: 400})
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        })

        if(!ownCourse) {
            return new NextResponse("Unauthoruzed user", {status: 401});
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
        });

        if(!chapter) {
            return new NextResponse("Not Found", {status: 404});
        }

        

        const unpublishedChapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            data: {
                isPublishred: true
            }
        })
        
        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublishred: true
            }
        })

        if(!publishedChaptersInCourse.length) {
           await db.course.update({
            where: {
                id: params.courseId
            }
            , data: {
                isPublished: false
            }
           })
        }

        return NextResponse.json(unpublishedChapter)
    } catch (error) {
        return new NextResponse("Internal error", {status: 500});
    }
}