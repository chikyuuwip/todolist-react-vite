export enum Filter {
  All,
  Pending,
  Completed,
}

export interface TodoModel {
  taskID: number;
  taskName: string;
  isSuccessful: boolean;
}

export interface AnchorEl {
  anchorEl: (EventTarget & SVGSVGElement) | null;
  anchorActiveID: number;
}
