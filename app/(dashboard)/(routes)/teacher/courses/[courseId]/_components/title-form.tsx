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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface TitleFormProps {
    initialData: {
        title: string
    };
    courseId: string
}

const formSchema = z.object({
    title: z.string().min(1, {
        message: "title is required"
    })
});

const TitleForm = ({initialData, courseId} : TitleFormProps) => {
   const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    })

   const router = useRouter();

   const [isEditing, setIsEditing] = useState(false);
   const toggleEdit = () => {
     setIsEditing(isEditing => !isEditing);
   }

   const {isSubmitting, isValid} = form.formState;
   
   const onSubmit = async(values: z.infer<typeof formSchema>) => {
       try {
        await axios.patch(`/api/courses/${courseId}`, values);
        toast.success("Course Updated");
        toggleEdit();
        router.refresh();
       } catch (error) {
        toast.error("Something went wrong")
       }
   }

    return ( 
        <div className="mt-6 bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
               Course title
               <Button variant="ghost" onClick={toggleEdit}>
                {isEditing ? (
                    <>
                      Cancel
                    </>
                )
                : (
                    <>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit title
                    </>
                )}
                 
               </Button>
            </div>
            {!isEditing ?
             (<p>
                {initialData.title}
             </p>)
            : (
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
                          <Input disabled={isSubmitting}
                           placeholder="shadcn"
                          {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}       
                  />
                 <Button type="submit" disabled={isSubmitting || !isValid}
                 >save</Button>
                </form>
              </Form>
            )}
        </div>
     );
}
 
export default TitleForm;