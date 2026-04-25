"use client";

import { CollarElement, CUSTOM_EMOJIS, ELEMENT_COLORS } from '@/types/collar';
import { EmojiRenderer } from '@/app/components/custom-emojis/EmojiRenderer';
import { X, GripHorizontal, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

interface ElementEditorProps {
  elements: CollarElement[];
  onAddElement: (el: Omit<CollarElement, 'id'>) => void;
  onRemoveElement: (id: string) => void;
  onChangeColor: (id: string, color: string) => void;
  onReorder: (elements: CollarElement[]) => void;
  onClear: () => void;
  maxElements: number;
  minElements: number;
  mode?: 'collar' | 'leash';
  title?: string;
  subtitle?: string;
}

const QWERTY_ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['Z','X','C','V','B','N','M'],
];

function SortableElement({
  element,
  onRemove,
  onChangeColor,
  selectedForColor,
  onSelectForColor,
}: {
  element: CollarElement;
  onRemove: () => void;
  onChangeColor: (color: string) => void;
  selectedForColor: boolean;
  onSelectForColor: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-colors ${
        selectedForColor ? 'border-primary bg-neutral-700' : 'border-transparent bg-neutral-800'
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <GripHorizontal className="w-3 h-3 text-neutral-400" />
      </div>
      {element.type === 'emoji' ? (
        <div onClick={onSelectForColor} className="cursor-pointer">
          <EmojiRenderer emojiKey={element.value} fillColor={element.color || '#FAFAFA'} style={{ width: '1.5rem', height: '1.5rem' }} />
        </div>
      ) : (
        <span
          className="text-xl font-bold cursor-pointer"
          style={{ color: element.color }}
          onClick={onSelectForColor}
        >
          {element.value}
        </span>
      )}
      <button
        onClick={onRemove}
        className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

const ElementEditor = ({
  elements,
  onAddElement,
  onRemoveElement,
  onChangeColor,
  onReorder,
  onClear,
  maxElements,
  minElements,
  mode = 'collar',
  title = 'Personaliza tu collar',
  subtitle,
}: ElementEditorProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const isFull = elements.length >= maxElements;
  const showLetters = mode === 'collar';

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = elements.findIndex((e) => e.id === active.id);
      const newIndex = elements.findIndex((e) => e.id === over.id);
      onReorder(arrayMove(elements, oldIndex, newIndex));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="text-start">
        <h2 className="text-2xl font-semibold text-foreground">
          {title}
        </h2>
        <p className="text-muted-foreground mt-1">
          {subtitle || `Agrega ${showLetters ? 'letras y ' : ''}emojis (${elements.length}/${maxElements}, mínimo ${minElements})`}
        </p>
      </div>

      <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {elements.length > 0 ? 'Elementos' : 'No hay elementos seleccionados'}
            </span>
            {elements.length > 0 && (
              <button
                onClick={onClear}
                className="text-sm text-destructive hover:text-destructive/80 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Limpiar
              </button>
            )}
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={elements} strategy={horizontalListSortingStrategy}>
              <div className="flex flex-wrap gap-2 min-h-16 content-start">
                {elements.map((el) => (
                  <SortableElement
                    key={el.id}
                    element={el}
                    onRemove={() => {
                      onRemoveElement(el.id);
                      if (selectedId === el.id) setSelectedId(null);
                    }}
                    onChangeColor={() => setSelectedId(el.id === selectedId ? null : el.id)}
                    selectedForColor={selectedId === el.id}
                    onSelectForColor={() =>
                      setSelectedId(el.id === selectedId ? null : el.id)
                    }
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

      {selectedId && (
        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">Color del elemento</span>
          <div className="flex gap-2">
            {ELEMENT_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => onChangeColor(selectedId, c)}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  elements.find((e) => e.id === selectedId)?.color === c
                    ? 'border-primary scale-110'
                    : 'border-border'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      )}

      {showLetters && (
        <div className="space-y-1.5">
          <span className="text-sm font-medium text-foreground">Letras</span>
          {QWERTY_ROWS.map((row, i) => (
            <div key={i} className="flex justify-start gap-1.5" style={{ paddingLeft: i === 1 ? '1rem' : i === 2 ? '2rem' : '0' }}>
              {row.map((l) => (
                <button
                  key={l}
                  disabled={isFull}
                  onClick={() => onAddElement({ type: 'letter', value: l, color: '#FFFFFF' })}
                  className="w-9 h-9 rounded-lg bg-secondary text-secondary-foreground font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {l}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <span className="text-sm font-medium text-foreground">Emojis</span>
        <div className="flex gap-2 flex-wrap">
          {CUSTOM_EMOJIS.filter((emoji) => !(mode === 'leash' && emoji.key === 'pez')).map((emoji) => (
            <button
              key={emoji.key}
              disabled={isFull}
              onClick={() => onAddElement({ type: 'emoji', value: emoji.key, color: '#FAFAFA' })}
              title={emoji.label}
              className="w-11 h-11 rounded-lg bg-secondary hover:bg-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center p-2"
            >
              <EmojiRenderer emojiKey={emoji.key} fillColor="#C70F11" style={{ width: '100%', height: '100%' }} />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ElementEditor;
