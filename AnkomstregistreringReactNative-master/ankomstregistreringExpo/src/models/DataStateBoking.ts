import LoadedBokning from "./LoadedBokning";

export interface DataStateBokning {
    loading: boolean,
    bokningar: null | LoadedBokning[],
    error: string | null
  }
  