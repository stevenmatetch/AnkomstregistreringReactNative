import { LoadedBetalPost } from './LoadedBetalPost';

export interface DataStateBetalPost {
    loading: boolean,
    betalningar: null | LoadedBetalPost[],
    error: string | null
  }
  