import { computed, watch } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { storeToRefs } from "pinia";
import { useClientsStore } from "@/store/clients";

import clientsApi from "@/api/clients-api";
import type { Client, ClientsResponse } from "@/clients/interfaces/client";

const getClients = async (page: number): Promise<ClientsResponse> => {
  await new Promise((resolve) => {
    setTimeout(() => resolve(true), 1000); // Simulamos un retraso de 1 segundo, para ver el efecto del isLoading
  });

  const { data } = await clientsApi.get<ClientsResponse>(`/clients?_page=${page}`);
  return data;
};

const useClients = () => {
  const store = useClientsStore();
  const { currentPage, clients, totalPages } = storeToRefs(store);

  const { isLoading, data } = useQuery({
    queryKey: ["clients?page=", currentPage],
    queryFn: () => getClients(currentPage.value),
    // { staleTime: 1000 * 60 }
  });

  watch(data, (clientsResponse) => {
    if (clientsResponse){
        store.setClients(clientsResponse.data);
        store.setTotalPages(clientsResponse.pages);
    }
  });

  return {
    // Properties
    clients,
    currentPage,
    isLoading,
    totalPages,
    // Methods
    getPage(page: number) {
      store.setPage(page);
    },
    // Getters (computeds)
  };
};

export default useClients;
