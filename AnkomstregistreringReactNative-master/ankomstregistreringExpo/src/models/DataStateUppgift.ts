import { LoadedUppgift } from './LoadedUppgift';

export default interface DataStateBokning {
    loading: boolean,
    uppgifter: null | LoadedUppgift[],
    error: string | null
  }
  