import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import Papa from "papaparse";
import { Student } from "./Student";
import { Workjob } from "./Workjob";
import { Frees } from "./Student";
import { WorkjobBox } from "./Workjobbox";
import toast, { Toaster } from "react-hot-toast";
import { FileInput, MantineProvider, Button, Checkbox } from "@mantine/core";
import "@mantine/core/styles.css";
import CoffeeIcon from "@mui/icons-material/Coffee";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

const STORAGE_KEY = "workjob_persistence";

interface StudentCSVFields {
  "Full Name": string;
  Grade: string;
  "Person ID": string;
  [key: string]: string;
}

interface WorkjobCSVFields {
  name: string;
  type: string;
  min: string;
  max: string;
  priority: string;
  periods: string;
  id: string;
}

interface ClassIDCSVFields {
  "Class ID": string;
  "Internal Class ID": string;
  Description: string;
  "Grading Periods": string;
}

function App() {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [file3, setFile3] = useState<File | null>(null);
  const [workjobdata, setWorkjobdata] = useState<Map<string, string[]>>(
    new Map()
  );
  const [bothEntered, setBothEntered] = useState(false);
  const [students, setStudents] = useState<Student[] | []>([]);
  const [workjobs, setWorkjobs] = useState<Workjob[] | []>([]);
  const [leftStudents, setLeftStudents] = useState<Student[] | []>([]);
  const [visibleWorkjobs, setVisibleWorkjobs] = useState<Set<string>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (message: string) => {
    setError(message);
    toast.error(message);
    setIsLoading(false);
  };

  const validateStudentCSV = (data: any[]): data is StudentCSVFields[] => {
    const requiredFields = ["Full Name", "Grade", "Person ID"];
    return data.every(
      (row) =>
        requiredFields.every((field) => field in row) &&
        Object.entries(row).every(([key, value]) => typeof value === "string")
    );
  };

  const validateWorkjobCSV = (data: any[]): data is WorkjobCSVFields[] => {
    const requiredFields = [
      "name",
      "type",
      "min",
      "max",
      "priority",
      "periods",
      "id",
    ];
    return data.every(
      (row) =>
        requiredFields.every((field) => field in row) &&
        typeof row.type === "string" &&
        !isNaN(Number(row.min)) &&
        !isNaN(Number(row.max)) &&
        !isNaN(Number(row.priority))
    );
  };

  const validateClassIDCSV = (data: any[]): data is ClassIDCSVFields[] => {
    const requiredFields = [
      "Class ID",
      "Internal Class ID",
      "Description",
      "Grading Periods",
    ];
    return data.every((row) => requiredFields.every((field) => field in row));
  };

  const handleFile1Change = (event: any) => {
    try {
      setError(null);
      setIsLoading(true);

      if (!event) {
        throw new Error("No file selected");
      }

      const file = event;
      setFile1(file);

      Papa.parse(file, {
        complete: (result: Papa.ParseResult<any>) => {
          try {
            if (result.errors.length > 0) {
              throw new Error(`CSV parsing error: ${result.errors[0].message}`);
            }

            if (!validateStudentCSV(result.data)) {
              throw new Error(
                "Invalid student CSV format. Please check the required fields."
              );
            }

            let tmpArray: Student[] = [];
            result.data.forEach((entry: any) => {
              try {
                if (!entry["Full Name"] || !entry["Grade"]) {
                  throw new Error(
                    `Invalid student data for entry: ${JSON.stringify(entry)}`
                  );
                }

                tmpArray.push(
                  new Student(
                    entry["Full Name"],
                    entry["Grade"],
                    {
                      D1: [
                        entry["D1B1"],
                        entry["D1B2"],
                        entry["D1B3"],
                        entry["D1B4"],
                      ],
                      D2: [
                        entry["D2B2"],
                        entry["D2B3"],
                        entry["D2B4"],
                        entry["D2B5"],
                      ],
                      D3: [
                        entry["D3B3"],
                        entry["D3B4"],
                        entry["D3B5"],
                        entry["D3B6"],
                      ],
                      D4: [
                        entry["D4B4"],
                        entry["D4B5"],
                        entry["D4B6"],
                        entry["D4B7"],
                      ],
                      D5: [
                        entry["D5B5"],
                        entry["D5B6"],
                        entry["D5B7"],
                        entry["D5B1"],
                      ],
                      D6: [
                        entry["D6B6"],
                        entry["D6B7"],
                        entry["D6B1"],
                        entry["D6B2"],
                      ],
                      D7: [
                        entry["D7B7"],
                        entry["D7B1"],
                        entry["D7B2"],
                        entry["D7B3"],
                      ],
                    },
                    entry["Person ID"]
                  )
                );
              } catch (e) {
                throw new Error(
                  `Error processing student: ${
                    e instanceof Error ? e.message : String(e)
                  }`
                );
              }
            });

            tmpArray.sort((a, b) => {
              let aFrees = Object.values(a.frees)
                .flatMap((arr) => arr)
                .filter((value) => value === "1").length;
              let bFrees = Object.values(b.frees)
                .flatMap((arr) => arr)
                .filter((value) => value === "1").length;

              return aFrees - bFrees;
            });

            setStudents(tmpArray);
            setIsLoading(false);
            toast.success("Student data loaded successfully");
          } catch (e) {
            handleError(
              `Error processing student file: ${
                e instanceof Error ? e.message : String(e)
              }`
            );
          }
        },

        header: true,
        skipEmptyLines: true,
      });
    } catch (e) {
      handleError(
        `Error handling student file: ${
          e instanceof Error ? e.message : String(e)
        }`
      );
    }
  };

  const handleFile2Change = (event: any) => {
    try {
      setError(null);
      setIsLoading(true);

      if (!event) {
        throw new Error("No file selected");
      }

      const file = event;
      setFile2(file);

      Papa.parse(file, {
        complete: (result: Papa.ParseResult<any>) => {
          try {
            if (result.errors.length > 0) {
              throw new Error(`CSV parsing error: ${result.errors[0].message}`);
            }

            if (!validateWorkjobCSV(result.data)) {
              throw new Error(
                "Invalid workjob CSV format. Please check the required fields."
              );
            }

            let tmpArray: Workjob[] = [];
            result.data.forEach((entry: any) => {
              try {
                if (
                  !entry.name ||
                  !entry.type ||
                  isNaN(Number(entry.min)) ||
                  isNaN(Number(entry.max))
                ) {
                  throw new Error(
                    `Invalid workjob data for entry: ${JSON.stringify(entry)}`
                  );
                }

                tmpArray.push(
                  new Workjob(
                    entry.name,
                    entry.type,
                    Number(entry.min),
                    Number(entry.max),
                    entry.priority,
                    entry.periods
                      .replace("or", ",")
                      .replace(/ /g, "")
                      .split(","),
                    entry.id
                  )
                );
              } catch (e) {
                throw new Error(
                  `Error processing workjob: ${
                    e instanceof Error ? e.message : String(e)
                  }`
                );
              }
            });

            tmpArray.sort((a, b) => Number(a.priority) - Number(b.priority));

            setWorkjobs(tmpArray);
            setVisibleWorkjobs(new Set(tmpArray.map((w) => w.name)));
            setIsLoading(false);
            toast.success("Workjob data loaded successfully");
          } catch (e) {
            handleError(
              `Error processing workjob file: ${
                e instanceof Error ? e.message : String(e)
              }`
            );
          }
        },

        header: true,
        skipEmptyLines: true,
      });
    } catch (e) {
      handleError(
        `Error handling workjob file: ${
          e instanceof Error ? e.message : String(e)
        }`
      );
    }
  };

  const handleFile3Change = (event: any) => {
    try {
      setError(null);
      setIsLoading(true);

      if (!event) {
        throw new Error("No file selected");
      }

      const file = event;
      setFile3(file);

      Papa.parse(file, {
        complete: (result: Papa.ParseResult<any>) => {
          try {
            if (result.errors.length > 0) {
              throw new Error(`CSV parsing error: ${result.errors[0].message}`);
            }

            if (!validateClassIDCSV(result.data)) {
              throw new Error(
                "Invalid class ID CSV format. Please check the required fields."
              );
            }

            let tmpArray = new Map();
            result.data.forEach((entry: any) => {
              try {
                tmpArray.set(entry["Class ID"], [
                  entry["Internal Class ID"],
                  entry["Class ID"],
                  entry["Description"],
                  entry["Grading Periods"],
                ]);
              } catch (e) {
                throw new Error(
                  `Error processing class ID: ${
                    e instanceof Error ? e.message : String(e)
                  }`
                );
              }
            });

            setWorkjobdata(tmpArray);
            setIsLoading(false);
            toast.success("Class ID data loaded successfully");
          } catch (e) {
            handleError(
              `Error processing class ID file: ${
                e instanceof Error ? e.message : String(e)
              }`
            );
          }
        },

        header: true,
        skipEmptyLines: true,
      });
    } catch (e) {
      handleError(
        `Error handling class ID file: ${
          e instanceof Error ? e.message : String(e)
        }`
      );
    }
  };
  const handleWorkjobToggle = (workjobName: string) => {
    setVisibleWorkjobs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(workjobName)) {
        newSet.delete(workjobName);
      } else {
        newSet.add(workjobName);
      }
      return newSet;
    });
  };
  const stc = require("string-to-color");

  const alert = (s: string) => {
    toast.dismiss();
    toast.success(s, { duration: 3000 });
  };

  const handleContinue = () => {
    toast.error(
      "Did you make sure to donate to Bryan? He could really use some money!",
      { duration: 4000 }
    );
    let minstudentnum = 0;
    let maxstudentnum = 0;
    workjobs.forEach((workjob) => {
      if (workjob.type == "E") {
        if (workjob.periods[0].includes("B")) {
          minstudentnum += workjob.min * workjob.periods.length * 4;

          maxstudentnum += workjob.max * workjob.periods.length * 4;
        } else {
          minstudentnum += workjob.min * workjob.periods.length * 7;

          maxstudentnum += workjob.max * workjob.periods.length * 7;
        }
      } else {
        minstudentnum += workjob.min;
        maxstudentnum += workjob.max;
      }
    });
    console.log(minstudentnum, maxstudentnum);
    console.log(students.length);
    if (students.length < minstudentnum) {
      alert(
        "Too little students for the number of workjobs--decrease the minimum availability of workjobs"
      );
    } else if (students.length > maxstudentnum) {
      alert(
        "Too little students for the number of workjobs--decrease the minimum increase of workjobs"
      );
    } else {
      setBothEntered(true);
      let tmpLeftStudents: Student[] = [];
      let isMinFilled = false;
      students?.forEach((s) => {
        let matchingfrees: string[] = [];
        for (let w of workjobs) {
          if (w.type == "E") {
            //Every instance
            if (w.periods[0].includes("B")) {
              //Every block
              Object.keys(s.frees).forEach((day) => {
                s.frees[day as keyof typeof s.frees].forEach((b, index) => {
                  if (b == 1) {
                    let block =
                      Number(day[1]) + index <= 7
                        ? Number(day[1]) + index
                        : Number(day[1]) + index - 7;
                    if (
                      w.periods.includes("B" + block) &&
                      w.assignments[day as keyof typeof w.assignments][index]
                        .length < w.min
                    ) {
                      matchingfrees.push(day + "B" + block);
                    }
                  }
                });
              });
            } else {
              Object.keys(s.frees).forEach((day) => {
                w.periods.forEach((p) => {
                  if (
                    s.frees[day as keyof typeof s.frees][Number(p) - 1] == 1 &&
                    w.assignments[day as keyof typeof w.assignments][
                      Number(p) - 1
                    ].length < w.min
                  ) {
                    matchingfrees.push(
                      day +
                        "B" +
                        (Number(day[1]) + Number(p) > 8
                          ? Number(day[1]) + Number(p) - 8
                          : Number(day[1]) + Number(p) - 1)
                    );
                  }
                });
              });
            }
          } else if (w.type == "T") {
            if (w.periods[0].includes("B")) {
              //Every block
              Object.keys(s.frees).forEach((day) => {
                s.frees[day as keyof typeof s.frees].forEach((b, index) => {
                  if (b == 1) {
                    let block =
                      Number(day[1]) + index <= 7
                        ? Number(day[1]) + index
                        : Number(day[1]) + index - 7;
                    if (w.periods.includes("B" + block) && w.totcount < w.min) {
                      matchingfrees.push(day + "B" + block);
                    }
                  }
                });
              });
            } else {
              Object.keys(s.frees).forEach((day) => {
                w.periods.forEach((period) => {
                  if (
                    s.frees[day as keyof typeof s.frees][Number(period) - 1] ==
                      1 &&
                    w.totcount < w.min
                  ) {
                    console.log(s, day, period);
                    console.log(
                      day +
                        "B" +
                        (Number(day[1]) > 7 - Number(period)
                          ? Number(day[1]) - 7 + Number(period)
                          : Number(day[1]) + Number(period) - 1)
                    );
                    matchingfrees.push(
                      day +
                        "B" +
                        (Number(day[1]) > 7 - Number(period)
                          ? Number(day[1]) - 7 + Number(period)
                          : Number(day[1]) + Number(period) - 1)
                    );
                  }
                });
              });
            }
          }
          console.log(w.name, matchingfrees);
          if (matchingfrees.length > 0) {
            const assignedblock =
              matchingfrees[Math.floor(Math.random() * matchingfrees.length)];
            w.totcount = w.totcount + 1;
            console.log(assignedblock);
            // console.log(matchingfrees);
            w.assignments[
              assignedblock.substring(0, 2) as keyof typeof w.assignments
            ][
              Number(assignedblock[3]) >= Number(assignedblock[1])
                ? Number(assignedblock[3]) - Number(assignedblock[1]) + 0
                : Number(assignedblock[3]) - Number(assignedblock[1]) + 7
            ].push(s);
            break;
          }
        }
        if (matchingfrees.length == 0) {
          console.log("No matching");
          for (let w of workjobs) {
            if (w.type == "E") {
              //Every instance
              if (w.periods[0].includes("B")) {
                //Every block
                Object.keys(s.frees).forEach((day) => {
                  s.frees[day as keyof typeof s.frees].forEach((b, index) => {
                    if (b == 1) {
                      let block =
                        Number(day[1]) + index <= 7
                          ? Number(day[1]) + index
                          : Number(day[1]) + index - 7;
                      if (
                        w.periods.includes("B" + block) &&
                        w.assignments[day as keyof typeof w.assignments][index]
                          .length < w.max
                      ) {
                        matchingfrees.push(day + "B" + block);
                      }
                    }
                  });
                });
              } else {
                Object.keys(s.frees).forEach((day) => {
                  w.periods.forEach((p) => {
                    if (
                      s.frees[day as keyof typeof s.frees][Number(p) - 1] ==
                        1 &&
                      w.assignments[day as keyof typeof w.assignments][
                        Number(p) - 1
                      ].length < w.max
                    ) {
                      matchingfrees.push(
                        day +
                          "B" +
                          (Number(day[1]) + Number(p) > 8
                            ? Number(day[1]) + Number(p) - 8
                            : Number(day[1]) + Number(p) - 1)
                      );
                    }
                  });
                });
              }
            } else if (w.type == "T") {
              if (w.periods[0].includes("B")) {
                Object.keys(s.frees).forEach((day) => {
                  s.frees[day as keyof typeof s.frees].forEach((b, index) => {
                    if (b == 1) {
                      let block =
                        Number(day[1]) + index <= 7
                          ? Number(day[1]) + index
                          : Number(day[1]) + index - 7;
                      if (
                        w.periods.includes("B" + block) &&
                        w.totcount < w.max
                      ) {
                        matchingfrees.push(day + "B" + block);
                      }
                    }
                  });
                });
              } else {
                Object.keys(s.frees).forEach((day) => {
                  w.periods.forEach((period) => {
                    if (
                      s.frees[day as keyof typeof s.frees][Number(period)] ==
                        1 &&
                      w.totcount < w.max
                    ) {
                      console.log(s, day, period);
                      console.log(
                        day +
                          "B" +
                          (Number(day[1]) > 7 - Number(period)
                            ? Number(day[1]) - 7 + Number(period)
                            : Number(day[1]) + Number(period) - 1)
                      );
                      matchingfrees.push(
                        day +
                          "B" +
                          (Number(day[1]) > 7 - Number(period)
                            ? Number(day[1]) - 7 + Number(period)
                            : Number(day[1]) + Number(period) - 1)
                      );
                    }
                  });
                });
              }
            }
            console.log(matchingfrees);
            if (matchingfrees.length > 0) {
              const assignedblock =
                matchingfrees[Math.floor(Math.random() * matchingfrees.length)];
              console.log(assignedblock);
              w.totcount = w.totcount + 1;
              console.log(matchingfrees);

              w.assignments[
                assignedblock.substring(0, 2) as keyof typeof w.assignments
              ][
                Number(assignedblock[3]) >= Number(assignedblock[1])
                  ? Number(assignedblock[3]) - Number(assignedblock[1]) + 0
                  : Number(assignedblock[3]) - Number(assignedblock[1]) + 7
              ].push(s);
              console.log(matchingfrees);
              break;
            }
          }
          console.log(matchingfrees);
          if (matchingfrees.length == 0) {
            console.log(matchingfrees);
            console.log(s.name, s.frees);
            tmpLeftStudents.push(s);
            console.log("left");
          }
        }
      });
      setLeftStudents(tmpLeftStudents);
      console.log(tmpLeftStudents.length);
      alert("Placed students into workjobs");
      // console.log(leftStudents);
      // console.log(workjobs);
      console.log("Moving to the next page...");
    }
  };

  const dayPeriodtoDayBlock = (day: string, period: number) => {
    return (
      day +
      "B" +
      (Number(day[1]) > 7 - Number(period)
        ? Number(day[1]) - 7 + Number(period)
        : Number(day[1]) + Number(period) - 1)
    );
  };
  const handleExportTXT = () => {
    const csvData: Array<{
      workjobName: string;
      dayBlock: string;
      studentName: string;
    }> = [];

    workjobs.forEach((workjob) => {
      Object.keys(workjob.assignments).forEach((day) => {
        workjob.assignments[day as keyof typeof workjob.assignments].forEach(
          (students, blockIndex) => {
            students.forEach((student) => {
              csvData.push({
                workjobName: workjob.name,
                dayBlock: `${day}B${blockIndex + 1}`,
                studentName: student.name,
              });
            });
          }
        );
      });
    });

    const csv = Papa.unparse(csvData);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "workjob_assignments.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert("CSV exported successfully!");
  };
  const schoolYear = (): number => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const juneDate = new Date(currentYear, 5, 1);
    if (currentDate > juneDate) {
      return currentYear;
    } else {
      return currentYear - 1;
    }
  };
  const handleExportCSV = () => {
    const csvData: Array<{
      internal_class_id: string;
      class_id: string;
      school_year: number;
      veracross_student_id: string;
      grade_level: number;
    }> = [];

    workjobs.forEach((workjob) => {
      Object.keys(workjob.assignments).forEach((day) => {
        workjob.assignments[day as keyof typeof workjob.assignments].forEach(
          (students, blockIndex) => {
            students.forEach((student) => {
              const dayBlockKey =
                dayPeriodtoDayBlock(day, blockIndex).substring(0, 2) +
                "-" +
                dayPeriodtoDayBlock(day, blockIndex).substring(2, 4) +
                "-WJ:" +
                workjob.id;
              const workjobEntry = workjobdata.get(dayBlockKey);
              console.log(dayBlockKey);
              if (workjobEntry) {
                csvData.push({
                  internal_class_id: workjobEntry[0],
                  class_id: workjobEntry[1],
                  school_year: schoolYear(),
                  veracross_student_id: student.id,
                  grade_level: student.grade,
                });
              }
            });
          }
        );
      });
    });

    const csv = Papa.unparse(csvData);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "workjob_assignments.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert("CSV exported successfully!");
  };
  const handleSave = () => {
    const dataToSave = {
      workjobs,
      leftStudents,
      workjobdata: Object.fromEntries(workjobdata),
      visibleWorkjobs: Array.from(visibleWorkjobs),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    alert("Current state saved successfully!");
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
    alert("Data reset successfully!");
  };
  useEffect(() => {
    const persistedData = localStorage.getItem(STORAGE_KEY);
    if (persistedData) {
      const {
        workjobs: savedWorkjobs,
        leftStudents: savedLeftStudents,
        workjobdata: savedWorkjobdata,
        visibleWorkjobs: savedVisibleWorkjobs,
      } = JSON.parse(persistedData);

      const reconstructedWorkjobs = savedWorkjobs.map((w: any) => {
        const workjob = new Workjob(
          w.name,
          w.type,
          w.min,
          w.max,
          w.priority,
          w.periods,
          w.id
        );
        workjob.assignments = w.assignments;
        workjob.totcount = w.totcount;
        return workjob;
      });

      const reconstructedLeftStudents = savedLeftStudents.map(
        (s: any) => new Student(s.name, s.grade, s.frees, s.id)
      );

      setWorkjobs(reconstructedWorkjobs);
      setLeftStudents(reconstructedLeftStudents);
      setWorkjobdata(new Map(Object.entries(savedWorkjobdata)));
      setVisibleWorkjobs(new Set(savedVisibleWorkjobs));
      setBothEntered(true);
    }
  }, []);
  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === "leftover-students") {
      const [destWorkjob, destDay, destBlock] =
        destination.droppableId.split("-");

      const newWorkjobs = [...workjobs];
      const newLeftStudents = [...leftStudents];

      const student = newLeftStudents[source.index];

      newLeftStudents.splice(source.index, 1);

      const destWorkjobObj = newWorkjobs.find((w) => w.name === destWorkjob);
      if (destWorkjobObj) {
        destWorkjobObj.assignments[
          destDay as keyof typeof destWorkjobObj.assignments
        ][parseInt(destBlock)].splice(destination.index, 0, student);
        destWorkjobObj.totcount += 1;
      }

      setWorkjobs(newWorkjobs);
      setLeftStudents(newLeftStudents);
      return;
    }

    const [sourceWorkjob, sourceDay, sourceBlock] =
      source.droppableId.split("-");
    const [destWorkjob, destDay, destBlock] =
      destination.droppableId.split("-");

    const newWorkjobs = [...workjobs];

    if (destination.droppableId === "leftover-students") {
      const sourceWorkjobObj = newWorkjobs.find(
        (w) => w.name === sourceWorkjob
      );
      if (!sourceWorkjobObj) return;

      const student =
        sourceWorkjobObj.assignments[
          sourceDay as keyof typeof sourceWorkjobObj.assignments
        ][parseInt(sourceBlock)][source.index];

      sourceWorkjobObj.assignments[
        sourceDay as keyof typeof sourceWorkjobObj.assignments
      ][parseInt(sourceBlock)].splice(source.index, 1);
      sourceWorkjobObj.totcount -= 1;

      // Add to leftover students
      setLeftStudents((prev) => [...prev, student]);
      setWorkjobs(newWorkjobs);
      return;
    }

    // Existing workjob-to-workjob drag logic
    const sourceWorkjobObj = newWorkjobs.find((w) => w.name === sourceWorkjob);
    const destWorkjobObj = newWorkjobs.find((w) => w.name === destWorkjob);

    if (!sourceWorkjobObj || !destWorkjobObj) return;

    const student =
      sourceWorkjobObj.assignments[
        sourceDay as keyof typeof sourceWorkjobObj.assignments
      ][parseInt(sourceBlock)][source.index];

    sourceWorkjobObj.assignments[
      sourceDay as keyof typeof sourceWorkjobObj.assignments
    ][parseInt(sourceBlock)].splice(source.index, 1);
    sourceWorkjobObj.totcount -= 1;

    destWorkjobObj.assignments[
      destDay as keyof typeof destWorkjobObj.assignments
    ][parseInt(destBlock)].splice(destination.index, 0, student);
    destWorkjobObj.totcount += 1;

    setWorkjobs(newWorkjobs);
  };

  return (
    <MantineProvider>
      <div className="App">
        <header className="App-header" style={{ height: "100vh" }}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Toaster
              toastOptions={{
                className: "",
                style: {
                  fontSize: "17px",
                },
              }}
            />
            {bothEntered ? (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100vh",
                  gridTemplateColumns: `20% ${
                    leftStudents.length == 0 ? "80%" : "60% 20%"
                  }`,
                  display: "grid",
                  overflow: "hidden",
                }}
              >
                {/* Workjob Filter Menu */}
                <div
                  style={{
                    position: "sticky",

                    zIndex: 1000,
                    backgroundColor: "white",
                    padding: "10px",

                    height: "100vh",
                    overflowY: "auto",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: "100%",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <div style={{ height: "60%", overflow: "scroll" }}>
                      <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>
                        Filter Workjobs:
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        {workjobs.map((w, index) => (
                          <label
                            key={index}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              backgroundColor: "white",
                              padding: "5px 10px",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "14px",
                              fontFamily: "inherit",
                            }}
                          >
                            <Checkbox
                              checked={visibleWorkjobs.has(w.name)}
                              onChange={() => handleWorkjobToggle(w.name)}
                              style={{ marginRight: "5px" }}
                            />
                            {w.name}
                          </label>
                        ))}
                      </div>
                    </div>
                    {/* Export Button */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 5,
                        left: 10,
                        width: "100%",
                      }}
                    >
                      <div style={{ marginLeft: "auto", marginRight: "auto" }}>
                        <div>
                          <Button
                            onClick={handleExportTXT}
                            className="bg-teal-600 hover:bg-teal-700"
                            size={"xs"}
                            variant="gradient"
                            gradient={{ from: "blue", to: "cyan", deg: 90 }}
                          >
                            Export to TXT
                          </Button>
                        </div>
                        <div>
                          <Button
                            onClick={handleExportCSV}
                            className="bg-teal-600 hover:bg-teal-700"
                            size={"xs"}
                            variant="gradient"
                            gradient={{ from: "blue", to: "cyan", deg: 90 }}
                          >
                            Export to CSV
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 w-full">
                          <Button
                            onClick={handleReset}
                            className="bg-red-600 hover:bg-red-700"
                            style={{ marginRight: "5px" }}
                            size={"xs"}
                            variant="gradient"
                            gradient={{ from: "blue", to: "cyan", deg: 90 }}
                          >
                            Restart
                          </Button>
                          <Button
                            onClick={handleSave}
                            className="bg-green-600 hover:bg-green-700"
                            size={"xs"}
                            variant="gradient"
                            gradient={{ from: "blue", to: "cyan", deg: 90 }}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Workjobs Area */}
                <div style={{ overflowY: "scroll" }}>
                  {workjobs.map((w, index) => (
                    <div
                      key={index}
                      style={{
                        display: visibleWorkjobs.has(w.name) ? "block" : "none",
                        fontFamily: "inherit",
                        // marginTop: "4px",
                        // marginBottom: "4px",
                        // border: `2px solid ${stc(w.name)}`,
                        // borderRadius: "10px",
                      }}
                    >
                      <WorkjobBox
                        name={w.name}
                        assignments={w.assignments}
                        workjob={w}
                      />
                    </div>
                  ))}
                </div>
                {/* Leftover Students Menu */}
                <div
                  style={{
                    zIndex: 1000,
                    backgroundColor: "white",
                    padding: "10px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                    height: "100vh",
                    overflowY: "auto",
                    right: "10px",
                    top: "10px",
                    width: "100%",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 10px 0",
                      fontSize: "16px",
                    }}
                  >
                    Unassigned Students ({leftStudents.length}):
                  </h3>
                  <Droppable droppableId="leftover-students">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          minHeight: "50px",
                          backgroundColor: "#f5f5f5",
                          padding: "8px",
                          borderRadius: "4px",
                        }}
                      >
                        {leftStudents.map((student, index) => (
                          <Draggable
                            key={student.name}
                            draggableId={`leftover-${student.name}`}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  userSelect: "none",
                                  padding: "8px",
                                  margin: "0 0 8px 0",
                                  backgroundColor: "white",
                                  borderRadius: "4px",
                                  ...provided.draggableProps.style,
                                }}
                              >
                                {student.name}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            ) : (
              <div>
                <FileInput
                  onChange={handleFile1Change}
                  label="Students File"
                  description="Click below to upload students file"
                  placeholder="Click here!"
                  withAsterisk
                  accept=".csv"
                />
                <FileInput
                  onChange={handleFile2Change}
                  label="Workjobs File"
                  description="Click below to upload workjobs file"
                  placeholder="Click here!"
                  withAsterisk
                  accept=".csv"
                />
                <FileInput
                  onChange={handleFile3Change}
                  label="Class ID File"
                  description="Click below to upload class ID file"
                  placeholder="Click here!"
                  withAsterisk
                  accept=".csv"
                />
                <a href="https://paypal.me/bchunger">
                  <div
                    style={{
                      top: "100px",
                      fontSize: "12px",
                      display: "grid",
                      gridTemplateColumns: "auto auto",
                      width: "130px",
                      marginLeft: "auto",
                      marginRight: "auto",
                      position: "relative",
                    }}
                  >
                    <CoffeeIcon />
                    <div style={{ lineHeight: "23px", textAlign: "center" }}>
                      Buy me a coffee
                    </div>
                  </div>
                </a>
                {file1 && file2 && file3 && (
                  <Button onClick={handleContinue} style={{ margin: "20px 0" }}>
                    Continue
                  </Button>
                )}
              </div>
            )}
          </DragDropContext>
        </header>
      </div>
    </MantineProvider>
  );
}

export default App;
