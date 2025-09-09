import { create } from 'zustand';

interface ResultItem {
  id: string;
  title: string;
  description: string;
}

interface ResultsStore {
  results: ResultItem[];
  setResults: (results: ResultItem[]) => void;
}

export const useResultsStore = create<ResultsStore>((set) => ({
  results: [],
  setResults: (results) => set({ results }),
}));
