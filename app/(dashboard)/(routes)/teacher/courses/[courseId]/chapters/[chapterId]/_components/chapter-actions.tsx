"use client"

import { ConfirmModel } from "@/components/models/confirm-nodel";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ChapterActionsProps {
    disabled: boolean;
    courseId: string;
    chapterId: string;
    isPublished: boolean;
}
export const ChapterActions = ({
    disabled,
    courseId,
    chapterId,
    isPublished
}: ChapterActionsProps) => {
    const router = useRouter()  

    const [isLoading, setIsloading] = useState(false)
    
    const onClick = async () => {
      try {
        setIsloading(true);
        if(isPublished) {
          await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`)
          toast.success("Chapter unpublished");
        }else {
          await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`)
          toast.success("Chapter published");
        }
        router.refresh()
      } catch (error) {
        toast.error("Something went wrong")
      } finally {
        setIsloading(false);
      }
    }

    const onDelete = async () => {
       try {
          setIsloading(true);
          await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`)
          toast.success("Chapter deleted");
          router.refresh();
          router.push(`/teacher/courses/${courseId}`);
       } catch (error) {
          toast.error("Something went wrong")
       } finally {
        setIsloading(false);
       }
    }
    return (
        <div className="flex items-center gap-x-2">
          <Button
            onClick={onClick}
            disabled={disabled || isLoading}
            variant="outline"
            size="sm"
          >
            {isPublished ? "Unpublish" : "Publish"}
          </Button>
          <ConfirmModel onConfirm={onDelete}>
            <Button size="sm" disabled={isLoading}>
              <Trash className="h4 w4" />
            </Button>
          </ConfirmModel>
          
        </div>
    )
}