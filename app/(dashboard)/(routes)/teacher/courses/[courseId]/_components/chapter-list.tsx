"use client"

import { Chapter } from "@prisma/client"
import { useEffect, useState } from "react"
import {
   DragDropContext,
   Droppable,
   Draggable,
   DropResult
} from "@hello-pangea/dnd"

import { cn } from "@/lib/utils"
import { Badge, Grip, PenIcon, RectangleHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChaptersListProps {
    items: Chapter[]
    onReorder: (updateData: {id: string, position: number}[]) => void
    onEdit: (id: string) => void
}

export  const ChaptersList = ({items,
    onReorder,
    onEdit
} : ChaptersListProps) => {
    const [isMounted, setIsMounted] = useState(false)
    const [chapters, setChapters] = useState(items);

    useEffect(() => {
      setIsMounted(true);
    }, [])

    useEffect(() => {
       setChapters(items);
    }, [items])

    if(!isMounted) {
        return null;
    }
    
    const onDragEnd = (result: DropResult) => {
        if(!result.destination) return;
        
        const items = Array.from(chapters);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const startIndex = Math.min(result.source.index, result.destination.index);
        const endIndex = Math.max(result.source.index, result.destination.index);

        const updatedChapters = items.slice(startIndex, endIndex + 1);

        setChapters(items);

        const bulkUpdatedData = updatedChapters.map((chapter) => ({
          id: chapter.id,
          position: items.findIndex((item) => item.id == chapter.id)
        }))

        onReorder(bulkUpdatedData)
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
           <Droppable droppableId="chapters">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                    {chapters.map((chapter, index) => (
                        <Draggable
                          key={chapter.id}
                          draggableId={chapter.id}
                          index={index}
                        >
                           {(provided) => (
                            <div
                              className={cn(
                                "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                                chapter.isPublishred && "bg-sky-100 border-sky-200 text-sky-700"
                              )}

                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                               <div
                                 className={cn(
                                    "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                                    chapter.isPublishred && "border-r-sky-200 hover:bg-sky-200"
                                 )}
                                 {...provided.dragHandleProps}
                               >
                                  <Grip className="h-5 w-5"/>
                               </div>
                               {chapter.title}
                               <div className="ml-auto pr-2 flex items-center gap-x-2">
                                {chapter.isFree && (
                                    <div className="flex justify-center rounded-md  h-auto w-20 ml-auto bg-green-300">
                                     Free
                                   </div>
                                )}
                                <div className="flex justify-center rounded-md  h-auto w-20 ml-auto bg-slate-400">
                                    {chapter.isPublishred ? "Published" : "Draft"}
                                </div>
                                <PenIcon 
                                className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                                onClick={() => onEdit(chapter.id)}
                                />
                               </div>
                            </div>
                           )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </div>
              )}
           </Droppable>
        </DragDropContext>
    )
}