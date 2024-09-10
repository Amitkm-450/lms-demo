import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Mux from "@mux/mux-node"



const {video} = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
  ) {
    try {
      const { userId } = auth();
  
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const ownCourse = await db.course.findUnique({
        where: {
          id: params.courseId,
          userId,
        }
      });
  
      if (!ownCourse) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const chapter = await db.chapter.findUnique({
        where: {
          id: params.chapterId,
          courseId: params.courseId,
        }
      });
  
      if (!chapter) {
        return new NextResponse("Not Found", { status: 404 });
      }
  
      if (chapter.videoUrl) {
        const existingMuxData = await db.muxData.findFirst({
          where: {
            chapterid: params.chapterId,
          }
        });
  
        if (existingMuxData) {
          await video.assets.delete(existingMuxData.assetId);
          await db.muxData.delete({
            where: {
              id: existingMuxData.id,
            }
          });
        }
      }
  
      const deletedChapter = await db.chapter.delete({
        where: {
          id: params.chapterId
        }
      });
  
      const publishedChaptersInCourse = await db.chapter.findMany({
        where: {
          courseId: params.courseId,
          isPublishred: true,
        }
      });
  
      if (!publishedChaptersInCourse.length) {
        await db.course.update({
          where: {
            id: params.courseId,
          },
          data: {
            isPublished: false,
          }
        });
      }
  
      return NextResponse.json(deletedChapter);
    } catch (error) {
      console.log("[CHAPTER_ID_DELETE]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }
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