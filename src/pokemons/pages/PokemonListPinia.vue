<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { usePokemonStore } from '@/store/usePokemonStore';

import PokemonCardList from '../components/PokemonCardList.vue';
import { getPokemons } from '../helpers/get-pokemons';

const store = usePokemonStore();

useQuery(
  ['pokemons'],
  getPokemons,
  {
    select(data) {
      store.loadedPokemons(data);
    },
    onError(error: any) {
      store.loadPokemonsFailed(error.message || 'Error desconocido');
    },
    onSettled() {
      // Aquí cosas que se hacen al final, sea lo que sea
      console.log('Query terminada');
    },
  }
);


</script>

<template>
  <h1 v-if="store.isLoading">Loading</h1>

  <div v-else-if="store.hasError">
    {{ store.errorMessage }}
  </div>


  <div v-else>
    <h1>Pokemon List Pinia - ({{ store.count }})</h1>

    <PokemonCardList :pokemons="store.list" />

  </div>
</template>
