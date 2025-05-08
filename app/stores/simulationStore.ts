import { create } from "zustand";

export type Viseme = {
  visemeId: number;
  audioOffset: number;
};

export type Character = {
  characterId: string;
  visemes: Viseme[];
  isSpeaking: boolean;
};

type SimulationStore = {
  characters: Character[];
  environmentId: string;

  setCharacters: (chars: Character[]) => void;
  setCharacterSpeaking: (characterId: string, visemes: Viseme[]) => void;
  resetAllSpeaking: () => void;
  setEnvironmentId: (id: string) => void;
};

export const useSimulationStore = create<SimulationStore>((set) => ({
  characters: [],
  environmentId: "",

  setCharacters: (chars) => set({ characters: chars }),
  setEnvironmentId: (id) => set({ environmentId: id }),

  setCharacterSpeaking: (characterId, visemes) =>
    set((state) => ({
      characters: state.characters.map((char) =>
        char.characterId === characterId
          ? { ...char, visemes, isSpeaking: true }
          : char
      ),
    })),

  resetAllSpeaking: () =>
    set((state) => ({
      characters: state.characters.map((char) => ({
        ...char,
        isSpeaking: false,
      })),
    })),
}));
