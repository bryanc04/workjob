import { Frees } from "./Student";
import { Student } from "./Student";

export interface Assignments {
  D1: Student[][];
  D2: Student[][];
  D3: Student[][];
  D4: Student[][];
  D5: Student[][];
  D6: Student[][];
  D7: Student[][];
}

export class Workjob {
  name: string;
  type: string;
  min: number;
  max: number;
  priority: number;
  periods: string[];
  totcount: number;
  assignments: Assignments;
  id: string;

  constructor(
    name: string,
    type: string,
    min: number,
    max: number,
    priority: number,
    periods: string[],
    id: string
  ) {
    this.name = name;
    this.type = type;
    this.min = min;
    this.max = max;
    this.priority = priority;
    this.periods = periods;
    this.totcount = 0;
    this.id = id;

    this.assignments = {
      D1: [[], [], [], []],
      D2: [[], [], [], []],
      D3: [[], [], [], []],
      D4: [[], [], [], []],
      D5: [[], [], [], []],
      D6: [[], [], [], []],
      D7: [[], [], [], []],
    };
  }
}
