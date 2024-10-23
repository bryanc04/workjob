import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Student } from "./Student";
import { Paper } from "@mui/material";

interface StudentItemProps {
  student: Student;
  index: number;
  onDragStart: () => void;
  onDragEnd: () => void;
  workjob: string;
}

export const StudentItem: React.FC<StudentItemProps> = ({
  student,
  index,
  onDragStart,
  onDragEnd,
  workjob,
}) => {
  const [hoverDisplay, setHoverDisplay] = useState(false);
  const stc = require("string-to-color");

  return (
    <div>
      <Draggable draggableId={student.name} index={index} key={student.name}>
        {(provided, snapshot) => (
          <div>
            {hoverDisplay || snapshot.isDragging ? (
              <div
                style={{
                  position: "absolute",
                  width: "200px",

                  backgroundColor: "white",
                  top: 20,
                  right: 20,
                  zIndex: 10000000,
                  gridTemplateColumns: "auto auto auto auto auto auto auto",
                  display: "grid",
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <div style={{ border: "1px solid black" }}>
                    {[1, 2, 3, 4].map((block) =>
                      student.frees[("D" + day) as keyof typeof student.frees][
                        block - 1
                      ] == 0 ? (
                        <div
                          style={{
                            background: "white",
                            color: "transparent",
                            border: "1px solid black",
                            borderTop: "1px solid black",
                            borderBottom: "0.5px solid black",
                            height: "20px",
                          }}
                        >
                          f
                        </div>
                      ) : (
                        <div
                          style={{
                            background: "black",
                            color: "transparent",
                            borderTop: "1px solid black",
                            borderBottom: "0.5px solid black",
                            height: "20px",
                          }}
                        >
                          f
                        </div>
                      )
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <></>
            )}
            <Paper
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              sx={{
                padding: "4px 8px",
                marginBottom: "4px",
                backgroundColor: snapshot.isDragging ? "grey" : "white",
                border: `2px solid ${stc(workjob)}`,
                fontSize: "0.875rem",
                justifyContent: "center",
                display: "flex",
                position: "relative",
              }}
              onMouseDown={() => {
                onDragStart();
                setHoverDisplay(true);
                console.log("mouse down");
              }}
              onMouseEnter={() => setHoverDisplay(true)}
              onMouseLeave={() => setHoverDisplay(false)}
              onMouseUp={() => {
                onDragEnd();
                setHoverDisplay(false);
              }}
            >
              <div>{student.name}</div>
            </Paper>
          </div>
        )}
      </Draggable>
    </div>
  );
};
