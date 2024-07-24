"use client"

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";

import {
    Form,
    FormControl,
    FormItem,
    FormMessage,
    FormField
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Chapter, Course } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { ChaptersList } from "./chapter-list";

interface ChapterFormProps {
    initialData: Course & {chapter: Chapter[]}
    courseId: string
}

const formSchema = z.object({
    title: z.string().min(1)
});

const ChapterForm = ({initialData, courseId} : ChapterFormProps) => {
   
   const [isCreating, setiscreating] = useState(false);
   const [isUpdating, setIsUpdating] = useState(false);

   const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          title:  "",
        }
    })
   
    const toggleCreating = () => {
      setiscreating(isCreating => !isCreating);
    }

   const router = useRouter();

   const {isSubmitting, isValid} = form.formState;
   
   const onSubmit = async(values: z.infer<typeof formSchema>) => {
       try {
        await axios.post(`/api/courses/${courseId}/chapters`, values);
        toast.success("Chapter Created");
        toggleCreating();
        router.refresh();
       } catch (error) {
        toast.error("Something went wrong")
       }
   }

   const onReorder = async (updatedData: {id: string, position: number}[]) => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updatedData
      });
      toast.success("Chapter reordered");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
   }
  
   const onEdit = (id: string) => {
     router.push(`/teacher/courses/${courseId}/chapters/${id}`);
   }
   
    return ( 
        <div className="mt-6 bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Chapters
               <Button variant="ghost" onClick={toggleCreating}>
                {isCreating ? (
                    <>
                      Cancel
                    </>
                )
                : (
                    <>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add a chapter
                    </>
                )}
                 
               </Button>
            </div>
            {isCreating && (
             <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 mt-4"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            disabled={isSubmitting}
                            placeholder="e.g Intro to course"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}       
                  />
                  <Button type="submit" disabled={isSubmitting || !isValid}
                 >
                  Create
                  </Button>
                </form>
              </Form>
            )}
            {!isCreating && (
                <div className={cn(
                    "text-sm mt-2",
                    !initialData.chapter.length && "text-slate-500 italic"
                )}>
                    {!initialData.chapter.length && 'No chapters'}
                    <ChaptersList
                      onEdit={onEdit}
                      onReorder={onReorder}
                      items={initialData.chapter || []}
                    />
                </div>
            )}
            {!isCreating && (
                <p className="text-xs text-muted-foreground mt-4">
                    Drag and drop to reorder the chapters
                </p>
            )}
        </div>
     );
}
 
export default ChapterForm;