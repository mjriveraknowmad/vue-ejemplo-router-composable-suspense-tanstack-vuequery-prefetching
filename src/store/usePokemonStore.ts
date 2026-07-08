import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Pokemon } from '@/pokemons/interfaces';

export const usePokemonStore = defineStore('pokemon', () => {
  // State
  const list = ref<Pokemon[]>([]);
  const count = ref(0);
  const isLoading = ref(false);
  const hasError = ref(false);
  const errorMessage = ref<string | undefined>(undefined);

  const pokemons = computed(() => ({
    list: list.value,
    count: count.value,
    isLoading: isLoading.value,
    hasError: hasError.value,
    errorMessage: errorMessage.value,
  }));

  // Actions
  const loadedPokemons = (data: Pokemon[]) => {
    list.value = data;
    count.value = data.length;
    isLoading.value = false;
    hasError.value = false;
    errorMessage.value = undefined;
  };

  const loadPokemonsFailed = (error: string) => {
    isLoading.value = false;
    hasError.value = true;
    errorMessage.value = error;
  };

  const startLoading = () => {
    isLoading.value = true;
    hasError.value = false;
    errorMessage.value = undefined;
  };

  return {
    // State
    pokemons,
    list,
    count,
    isLoading,
    hasError,
    errorMessage,
    // Actions
    loadedPokemons,
    loadPokemonsFailed,
    startLoading,
  };
});
