import React, { useState } from "react";
import {
  Paper,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { WorkjobCell } from "./WorkjobCell";
import { Assignments, Workjob } from "./Workjob";
import Draggable from "react-draggable";

interface WorkjobBoxProps {
  name: string;
  assignments: Assignments;
  workjob: Workjob;
}

export const WorkjobBox: React.FC<WorkjobBoxProps> = ({
  name,
  assignments,
  workjob,
}) => {
  const days = ["D1", "D2", "D3", "D4", "D5", "D6", "D7"];
  const blocks = [0, 1, 2, 3];

  const [isRndEnabled, setIsRndEnabled] = useState(true);

  const handleDragStart = () => {
    setIsRndEnabled(false);
    console.log("dragStart");
  };
  const dayPeriodtoDayBlock = (day: string, period: number) => {
    return Number(day[1]) > 7 - Number(period)
      ? Number(day[1]) - 7 + Number(period)
      : Number(day[1]) + Number(period);
  };

  const handleDragEnd = () => setIsRndEnabled(true);

  return (
    // <Draggable handle=".handle">
    <Paper sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Typography variant="h6" sx={{ p: 2 }} className="handle">
        {name} ({workjob.type}) ({workjob.min}-{workjob.max}),{" "}
        {workjob.periods.join(" ")}
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              {days.map((day) => (
                <TableCell key={day} align="center">
                  {day}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {blocks.map((block) => {
              return (
                <TableRow key={block}>
                  <TableCell>{block + 1}</TableCell>
                  {days.map((day) => {
                    return (
                      <TableCell key={`${day}-${block}`} sx={{ p: 1 }}>
                        {(workjob.periods[0].includes("B") &&
                          workjob.periods.includes(
                            "B" + dayPeriodtoDayBlock(day, block)
                          )) ||
                        (!workjob.periods[0].includes("B") &&
                          workjob.periods.includes(String(block + 1))) ? (
                          <WorkjobCell
                            day={day}
                            block={block}
                            students={
                              assignments[day as keyof typeof assignments][
                                block
                              ]
                            }
                            workjobName={name}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            bgColor={"white"}
                          />
                        ) : (
                          <WorkjobCell
                            day={day}
                            block={block}
                            students={
                              assignments[day as keyof typeof assignments][
                                block
                              ]
                            }
                            workjobName={name}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            bgColor={"red"}
                          />
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
    // </Draggable>
  );
};
