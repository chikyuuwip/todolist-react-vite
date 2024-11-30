export enum Filter {
    All,
    Pending,
    Completed,
  }
  
  export interface TodoModel {
    taskName: string;
    isSuccessful: boolean;
  }