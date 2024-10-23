import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { Student } from "./Student";
import { StudentItem } from "./StudentItem";

interface WorkjobCellProps {
  day: string;
  block: number;
  students: Student[];
  workjobName: string;
  onDragStart: () => void;
  onDragEnd: () => void;
  bgColor: string;
}

export const WorkjobCell: React.FC<WorkjobCellProps> = ({
  day,
  block,
  students,
  workjobName,
  onDragStart,
  onDragEnd,
  bgColor = "white",
}) => {
  const droppableId = `${workjobName}-${day}-${block}`;

  return (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            height: "100%",
            minHeight: "60px",
            background: `${snapshot.isDraggingOver ? "green" : bgColor}`,
            width: "150px",
          }}
          className={`p-2 border border-gray-700 transition-colors`}
        >
          <div
            style={{
              minHeight: students.length ? "0" : "30px",
              zIndex: 10000000,
            }}
          >
            {students.map((student, index) => (
              <StudentItem
                key={student.name}
                student={student}
                index={index}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                workjob={workjobName}
              />
            ))}
          </div>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
