export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  focusMinutes: number;
  createdAt: number;
}

export type AlarmSound = "chime" | "radar" | "cosmic" | "apex" | "zen-bowl";
