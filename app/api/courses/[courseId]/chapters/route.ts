import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const { userId } = auth();
        const courseId = params.courseId;
        const { title } = await req.json();
        console.log("Title received:", title);

        if (!userId) {
            console.log("Unauthorized: No userId");
            return new NextResponse("Unauthorized access", { status: 401 });
        }

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        });

        if (!course) {
            console.log("Unauthorized: Course not found or user not authorized");
            return new NextResponse("Unauthorized access", { status: 401 });
        }

        console.log("Course found:", course);

        const lastChapter = await db.chapter.findFirst({
            where: {
                courseId
            },
            orderBy: {
                position: "desc"
            },
        });

        const newPosition = lastChapter ? lastChapter.position + 1 : 1;
        console.log("New position for the chapter:", newPosition);

        const chapter = await db.chapter.create({
            data: {
                title,
                courseId,
                position: newPosition
            }
        });

        console.log("Chapter created:", chapter);

        return NextResponse.json(chapter);
    } catch (error) {
        console.error("[Chapters] Error:", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
