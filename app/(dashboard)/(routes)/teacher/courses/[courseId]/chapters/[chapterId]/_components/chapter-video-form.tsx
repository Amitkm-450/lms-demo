"use client"

import * as z from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle, VideoIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, Course, MuxData } from "@prisma/client";
import  Image  from "next/image"
import { FileUpload } from "@/components/file-upload";

interface ChapterVideoProps {
    initialData: Chapter & { muxData?: MuxData | null};
    courseId: string;
    chapterId: string;
}

const formSchema = z.object({
    videoUrl: z.string().min(1)
});

const ChapterVideoForm = ({initialData, courseId, chapterId} : ChapterVideoProps) => {
   

   const router = useRouter();

   const [isEditing, setIsEditing] = useState(false);
   const toggleEdit = () => {
     setIsEditing(isEditing => !isEditing);
   }
   
   const onSubmit = async(values: z.infer<typeof formSchema>) => {
       try {
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
        toast.success("Chapter Updated");
        toggleEdit();
        router.refresh();
       } catch (error) {
        toast.error("Something went wrong")
       }
   }

    return ( 
        <div className="mt-6 bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
               Chapter video
               <Button variant="ghost" onClick={toggleEdit}>
                {isEditing && (
                    <>
                      Cancel
                    </>
                )}
                {!isEditing && !initialData.videoUrl && (
                    <>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add a video
                    </>
                )}

                {!isEditing && initialData.videoUrl && (
                    <>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit video
                    </>
                )}
               </Button>
            </div>
            {!isEditing ?
             !initialData.videoUrl ? (
                <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                    <VideoIcon className="h-10 w-10 text-slate-500"/>
                </div>
             ) : (
                <div className="relative aspect-video mt-2">
                    Video uploaded!
                </div>
             )
            : (
              <div>
                <FileUpload 
                   endpoint="courseImage"
                   onChange={(url) => {
                    if(url) {
                      onSubmit({videoUrl: url})
                    }
                   }}
                />
                <div className="text-xs text-muted-foreground mt-4">
                    Upload this chapter&pos;s video
                </div>
              </div>
            )}
            {initialData.videoUrl && !isEditing && (
               <div className="text-xs text-muted-foreground mt-2">
                Video can take a few minutes to process. Refresh the page if video does not appear.
               </div>
            )}
        </div>
     );
}
 
export default ChapterVideoForm;