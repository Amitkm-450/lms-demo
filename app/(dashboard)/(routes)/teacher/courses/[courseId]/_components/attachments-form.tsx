"use client"

import * as z from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { CrossIcon, Delete, DeleteIcon, File, Loader2, PlusCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";
import { deepEqual } from "assert";
import { attachReactRefresh } from "next/dist/build/webpack-config";

interface AttachmentFormProps {
    initialData: Course & {attachments: Attachment[]}
    courseId: string
}

const formSchema = z.object({
    url: z.string().min(1)
});

const AttachmentForm = ({initialData, courseId} : AttachmentFormProps) => {
   

   const router = useRouter();

   const [isEditing, setIsEditing] = useState(false);
   const [deteingId, setDeletingId] = useState<string | null>(null)

   useEffect(() => {
      const attachment = initialData.attachments.filter((attachment) => attachment.id === deteingId)

      console.log(attachment[0]?.name);
   }, [deteingId]);

   const toggleEdit = () => {
     setIsEditing(isEditing => !isEditing);
   }
   
   const onSubmit = async(values: z.infer<typeof formSchema>) => {
       try {
        await axios.post(`/api/courses/${courseId}/attachments`, values);
        toast.success("Course Updated");
        toggleEdit();
        router.refresh();
       } catch (error) {
        toast.error("Something went wrong")
       }
   }
   
   const onDelete = async (id: string) => {
       try {
         setDeletingId(id);
         await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
         toast.success("Deleted successfully");
         router.refresh();
       } catch (error) {
         toast.error("Something went wrong");
       } finally {
         setDeletingId(null)
       }
   }
    return ( 
        <div className="mt-6 bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
               Course attachments
               <Button variant="ghost" onClick={toggleEdit}>
                {isEditing && (
                    <>
                      Cancel
                    </>
                )}
                {!isEditing &&  (
                    <>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add a file
                    </>
                )}

               </Button>
            </div>
            {!isEditing ?
              <>
                {initialData.attachments.length === 0 && (
                    <p className="text-sm mt-2 text-slate-500 italic">
                        No attachments yet
                    </p>
                )}
                {initialData.attachments.length > 0 && (
                   <div className="space-y-2">
                      {initialData.attachments.map((attachment) => 
                        (
                            <div key={attachment.id}
                             className="flex items-center p-3 w-full bg-sky-100border-sky-200 border text-sky-700 rounded-md"
                            >
                               <File className="h-4 w-4 mr-2 flex-shrink-0"/>
                               <p className="text-xs line-clamp-1">
                                {attachment.name}
                                </p>
                                { deteingId === attachment.id && (
                                    <div>
                                      <Loader2 className="h-4 w-4 animate-spin"/>
                                    </div>
                                )}
                                { deteingId !== attachment.id && (
                                    <button className="ml-auto hover:opacity-75 transition"
                                       onClick={() => onDelete(attachment.id)}
                                    >
                                      <X className="h-4 w-4"/>
                                    </button>
                                )}
                            </div>
                        )
                      )}
                   </div>
                )
                
                }
              </>
            : (
              <div>
                <FileUpload 
                   endpoint="courseAttchment"
                   onChange={(url) => {
                    if(url) {
                      onSubmit({url: url})
                    }
                   }}
                />
                <div className="text-xs text-muted-foreground mt-4">
                    Add anything your students might need to complete the project
                </div>
              </div>
            )}
        </div>
     );
}
 
export default AttachmentForm;