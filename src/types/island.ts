export type NotchMode =
  | "pill"
  | "media"
  | "timer"
  | "water"
  | "shelf"
  | "todo"
  | "prayer"
  | "assistant"
  | "widgets";

export type WidgetId =
  | "this-week"
  | "next-prayer"
  | "water"
  | "focus-today"
  | "world-clock"
  | "battery"
  | "moon"
  | "countdown";

export interface NotchDimensions {
  width: number;
  height: number;
}
