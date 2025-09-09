import { create } from 'zustand';

// Define la interfaz para los datos del usuario
interface User {
  name?: string;
  email?: string;
  picture?: string;
  credential?: string; // Token JWT de Google
  // Puedes agregar más campos según lo que necesites
}

// Define la interfaz para el store de Zustand
interface UserStore {
  user: User | null; // El usuario puede ser null si no está autenticado
  setUser: (user: User) => void; // Función para guardar los datos del usuario
  clearUser: () => void; // Función para limpiar los datos del usuario (logout)
}

// Crea el store con Zustand
export const useUserStore = create<UserStore>((set) => ({
  user: null, // Estado inicial: usuario no autenticado
  setUser: (user) => set({ user }), // Función para guardar los datos del usuario
  clearUser: () => set({ user: null }), // Función para limpiar los datos del usuario
}));
