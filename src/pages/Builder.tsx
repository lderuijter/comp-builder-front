import { useState } from "react";
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

const weapons = [
    { id: "splattershot", name: "Splattershot", icon: "🔫" },
    { id: "roller", name: "Roller", icon: "🧹" },
    { id: "blaster", name: "Blaster", icon: "💥" },
    { id: "dualies", name: "Dualies", icon: "🎯" },
    { id: "charger", name: "Charger", icon: "🏹" },
    { id: "inkbrush", name: "Inkbrush", icon: "🖌️" },
    { id: "slosher", name: "Slosher", icon: "🪣" },
    { id: "stringer", name: "Stringer", icon: "⚡" },
    { id: "splatling", name: "Splatling", icon: "🛡️" },
    { id: "brella", name: "Brella", icon: "☂️" },
    { id: "splatana", name: "Splatana", icon: "🗡️" },
    { id: "filler", name: "Filler", icon: "⬜" },
];

// Sortable item component
function SortableItem({ id, icon, name }: { id: string; icon: string; name: string }) {
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
            className="p-3 border rounded bg-white flex items-center gap-3 cursor-pointer select-none w-full"
        >
            <span className="text-2xl">{icon}</span>
            <span>{name}</span>
        </div>
    );
}

export default function Builder() {
    const [items, setItems] = useState(weapons.map((w) => w.id));

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
        <div className="p-6 overflow-hidden h-screen bg-gray-900 flex flex-col">
            <h1 className="text-white font-bold text-3xl mb-4 text-center">Weapon Order Builder</h1>
            <div className="flex-1 flex justify-center items-center">
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={items} strategy={rectSortingStrategy}>
                        <div className="grid grid-cols-4 gap-4">
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
