import { computed, ref, watch } from 'vue';
import { useMutation, useQuery } from '@tanstack/vue-query';

import clientsApi from '@/api/clients-api';
import type { Client } from '@/clients/interfaces/client';

const getClient = async( id: number  ):Promise<Client> => {
    const { data } = await clientsApi.get(`/clients/${ id }`);
    return data;
}

const updateClient = async( client: Client ):Promise<Client> => {
    const { data } = await clientsApi.patch<Client>(`/clients/${ client.id }`, client ); 
    // Para que al actualizar el cliente, se refresquen las queries de clientes (caché) con key 'clients?page='  
        // const queryClient = useQueryClient(); // useQueryClient
        // const queries = queryClient.getQueryCache().findAll(['clients?page='],{ exact: false });
        // queries.forEach( query => query.reset() )
        // queries.forEach( query => query.fetch() );
    return data;
}


const useClient = ( id: number ) => {

    const client = ref<Client>();

    const { isLoading, data, isError } = useQuery({
      queryKey: ['client', id ],
      queryFn: () => getClient(id),
      retry: false,
    });

    const clientMutation = useMutation({
        mutationFn: ( client: Client ) => updateClient( client ),
    });    

    watch( data, () => {
        if ( data.value )
            client.value = {...data.value};
    },{ immediate: true });

    return {
        client,
        clientMutation,
        isError,
        isLoading,

        // Method
        updateClient:      clientMutation.mutate,
        isUpdating:        computed( () => isLoading.value ),
        isUpdatingSuccess: computed( () => clientMutation.isSuccess.value ),
        isErrorUpdating:   computed( () => clientMutation.isError.value ),        
    }
}

export default useClient;

