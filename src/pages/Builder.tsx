import {useEffect, useState} from "react";

import {
    DndContext,
    closestCenter,
    type DragEndEvent,
} from "@dnd-kit/core";

import {
    arrayMove,
    SortableContext,
    useSortable,
    rectSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import { weapons } from "../features/weapons/weaponList";
import type { Weapon } from "../features/weapons/types";

function SortableItem({ id, icon, name }: Weapon) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 0,
        boxShadow: isDragging ? "0 4px 12px rgba(0,0,0,0.3)" : undefined,
        scale: isDragging ? 1.05 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="p-4 border rounded bg-white flex items-center gap-2 cursor-pointer select-none w-full touch-none"
        >
            <span className="text-2xl">{icon}</span>
            <span className="hidden sm:inline">{name}</span>
        </div>
    );
}

export default function Builder() {
    const [items, setItems] = useState<string[]>(() => {
        const saved = localStorage.getItem("weaponOrder");
        return saved ? JSON.parse(saved) : weapons.map(w => w.id);
    });

    useEffect(() => {
        localStorage.setItem("weaponOrder", JSON.stringify(items));
    }, [items]);

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over) return;

        if (active.id !== over.id) {
            setItems((current) => {
                const oldIndex = current.indexOf(active.id as string);
                const newIndex = current.indexOf(over.id as string);

                return arrayMove(current, oldIndex, newIndex);
            });
        }
    }

    return (
        <div className="p-6 overflow-hidden min-h-screen bg-gray-900 flex flex-col">
            <h1 className="text-white font-bold text-3xl mb-4 text-center">Weapon Order Builder</h1>
            <div className="flex-1 flex justify-center items-center">
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={items} strategy={rectSortingStrategy}>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                            {items.map((id) => {
                                const weapon = weapons.find((w) => w.id === id)!;
                                return <SortableItem key={id} {...weapon} />;
                            })}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
        </div>


    );
}
