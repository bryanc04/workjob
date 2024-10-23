export interface Frees {
  D1: number[];
  D2: number[];
  D3: number[];
  D4: number[];
  D5: number[];
  D6: number[];
  D7: number[];
}

export class Student {
  name: string;
  grade: number;
  frees: Frees;
  id: string;

  constructor(name: string, grade: number, frees: Frees, id: string) {
    this.name = name;
    this.grade = grade;
    this.frees = frees;
    this.id = id;
  }
}
