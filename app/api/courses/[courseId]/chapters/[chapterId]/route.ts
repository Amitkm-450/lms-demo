import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node"

const {video} = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function PATCH(req: Request, {params}: {params: {courseId: string, chapterId: string}}) {
    try {
        const {userId} = auth();
        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }
        
        const {isPublishred, ...value} = await req.json();
        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        });

        if(!ownCourse) {
            return new NextResponse("Unauthorized", {status: 401});
        }
        
        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },

            data: {
                ...value
            }
        });

        if(value.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterid: params.chapterId,
                }
            });

            if(existingMuxData) {
                await video.assets.delete(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                })
            }
            const asset = await video.assets.create({
                input: value.videoUrl,
                playback_policy: ["public"],
                test: false
            })

            await db.muxData.create({
                data: {
                    chapterid: params.chapterId,
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0]?.id
                }
            });
        }

        return NextResponse.json(chapter);
    } catch (error) {
        console.log("[CHAPTERID]", error);
        return new NextResponse("Internal error", {status: 500});
    }
}