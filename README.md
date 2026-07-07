# vue-router-composable-suspense-tanstack-vuequery-prefetching

Este proyecto de indole educativa, se hizo siguiendo los pasos de las secciones 3, 4 y 5 del curso de https://www.udemy.com/course/vue-intermedio hecho por F.Herrera.

---

## 📚 Análisis Educativo del Proyecto

### 🎯 **Descripción General**

Este proyecto enseña **5 conceptos avanzados de Vue 3**:
1. **Vue Router 4** - Enrutamiento dinámico y layouts anidados
2. **Composables** - Lógica reutilizable con Composition API
3. **Suspense** (preparado pero se dejó como código comentado)
4. **TanStack Vue Query** - Gestión de estado asincrónico y caché
5. **Prefetching** - Precarga inteligente de datos

---

### 📐 **Arquitectura General del Proyecto**

```mermaid
graph TB
    subgraph UI["🎨 Capa de Presentación"]
        App["App.vue<br/>(Raíz)"]
        NavBar["NavBar.vue<br/>(Navegación)"]
        Pages["Páginas<br/>PokemonList.vue<br/>PokemonById.vue<br/>PokemonSearch.vue"]
        Cards["Componentes<br/>PokemonCard.vue<br/>PokemonCardList.vue"]
    end
    
    subgraph Logic["🧠 Capa de Lógica"]
        Composables["Composables<br/>usePokemons()<br/>usePokemon()"]
        Helpers["Helpers<br/>get-pokemons.ts<br/>get-pokemon-by-id.ts"]
    end
    
    subgraph Data["💾 Capa de Datos"]
        VueQuery["TanStack Vue Query<br/>Cache & Queries"]
        Axios["Axios API Client"]
        Store["Reactive Store<br/>(Estado alternativo)"]
    end
    
    subgraph API["🌐 API Externa"]
        PokeAPI["PokéAPI v2"]
    end
    
    App --> NavBar
    App --> Pages
    Pages --> Cards
    Pages --> Composables
    Cards --> Composables
    Composables --> VueQuery
    Composables --> Helpers
    Helpers --> Axios
    Axios --> Store
    Axios --> PokeAPI
    VueQuery --> Helpers
```

---

### 🔄 **Flujo de Datos - Ciclo Completo**

```mermaid
sequenceDiagram
    participant User as 👤 Usuario
    participant View as 📄 PokemonList.vue
    participant Composable as 🧠 usePokemons()
    participant VueQuery as ⚡ TanStack Query
    participant Cache as 💾 Cache
    participant Helper as 📦 getPokemons()
    participant API as 🌐 PokéAPI

    User->>View: Carga página
    View->>Composable: Llama usePokemons()
    
    Composable->>VueQuery: Ejecuta useQuery('pokemons', getPokemons)
    
    VueQuery->>Cache: ¿Datos en cache?
    
    alt Datos en Cache (2 min)
        Cache-->>VueQuery: ✅ Retorna datos en caché
    else Cache Expirado
        VueQuery->>Helper: Ejecuta getPokemons()
        Helper->>API: GET /pokemon?limit=45
        API-->>Helper: Lista de 45 pokémon (URLs)
        Helper->>API: Promise.all() - GET cada pokémon
        API-->>Helper: Datos detallados de cada uno
        Helper->>Helper: Mapea a { id, name, frontSprite }
        Helper-->>VueQuery: Retorna datos procesados
        VueQuery->>Cache: Guarda en caché (2 min)
    end
    
    VueQuery-->>Composable: Retorna { pokemons, isLoading, isError }
    Composable-->>View: Estado reactivo
    View->>View: Re-renderiza con datos
    View-->>User: ✅ Muestra listado
```

---

### 🚀 **Sistema de Prefetching - La Característica Clave**

```mermaid
graph LR
    A["👆 Usuario pasa<br/>mouse sobre tarjeta"] 
    B["prefetchPokemon()<br/>Se ejecuta en<br/>@mouseenter"]
    C["queryClient.prefetchQuery<br/>Descarga silenciosamente"]
    D["Cache de Vue Query<br/>Guarda el pokémon"]
    E["👆 Usuario hace click"]
    F["Datos ya están en caché<br/>¡Instantáneo!"]
    
    A -->|triggeriza| B
    B -->|llama| C
    C -->|llena| D
    E -->|busca en| D
    D -->|retorna rápido| F
    
    style A fill:#e1f5ff
    style F fill:#c8e6c9
    style D fill:#fff9c4
```

---

### 📊 **Comparación: Dos Enfoques de Gestión de Estado**

#### **Opción 1: PokemonList.vue (Solo Vue Query)**
```mermaid
graph TD
    A["usePokemons()"] 
    B["useQuery con<br/>initialData"]
    C["Retorna directamente<br/>{ pokemons, isLoading, isError }"]
    D["Renderiza en componente"]
    
    A -->|usa| B
    B -->|simplificado| C
    C -->|props reactivos| D
    
    E["✅ Más simple<br/>❌ Menos testeable"]
    
    style E fill:#fff3e0
```

#### **Opción 2: PokemonListNative.vue (Vue Query + Store)**
```mermaid
graph TD
    A["useQuery()"] 
    B["select: función<br/>que ejecuta<br/>store.loadedPokemons()"]
    C["Store reactivo<br/>con métodos"]
    D["Renderiza desde<br/>store.pokemons"]
    
    A -->|con select| B
    B -->|actualiza| C
    C -->|propiedades| D
    
    E["✅ Más testeable<br/>✅ Más escalable<br/>❌ Más boilerplate"]
    
    style E fill:#fff3e0
```

---

### 🎭 **Enrutamiento Jerárquico con Layout en /pokemons**
En el caso de /pokemons, el component de la ruta es el PokemonLayout, y el resto va en los children.

```mermaid
graph TB
    Root["/"]
    Home["/"]
    About["/about"]
    Counter["/counter"]
    
    Pokemons["/pokemons"]
    subgraph "Layout: PokemonLayout.vue"
        PL["/pokemons/list<br/>PokemonList.vue"]
        PLN["/pokemons/list-native<br/>PokemonListNative.vue"]
        PID["/pokemons/by/:id<br/>PokemonById.vue"]
        PS["/pokemons/search<br/>PokemonSearch.vue"]
    end
    
    Root -->|home| Home
    Root -->|about| About
    Root -->|counter| Counter
    Root -->|pokemons| Pokemons
    Pokemons -->|redirect| PL
    Pokemons --> PL
    Pokemons --> PLN
    Pokemons --> PID
    Pokemons --> PS
    
    style Pokemons fill:#e8f5e9
    style PL fill:#fff9c4
    style PID fill:#ffe0b2
```

---

### 🧬 **Ciclo de Vida de Vue Query en PokemonById.vue**

```mermaid
stateDiagram-v2
    [*] --> Idle
    
    Idle --> Loading: useQuery ejecutado\ncon id de params
    
    Loading --> Cached: Dato en cache\n(2 min)
    Loading --> Success: API responde
    Loading --> Error: Fallo en API
    
    Success --> Cached: Guarda en cache
    
    Cached --> [*]
    Error --> [*]
    
    Success --> Invalidate: invalidateQueries()\nbotón clickeado
    Invalidate --> Loading: Fuerza recarga
    
    note right of Cached
        Cache expira después
        de 2 minutos
    end note
```

---

### 🔧 **Configuración Inicial de TanStack Query**

```javascript
// En main.ts se configura globalmente:
VueQueryPlugin.install(app, {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        cacheTime: 1000 * 120,        // ⏱️ Datos válidos 2 minutos
        refetchOnReconnect: 'always', // 🔄 Re-fetch si reconnecta
      }
    }
  }
});
```

---

### 📦 **Estructura de Composables**

#### **usePokemons() - Lista completa con Instant Feedback Pattern**

El composable `usePokemons()` implementa una estrategia inteligente de UX usando `initialData` (es el caso que no usa Store, Solo Vue Query):

```javascript
const { isLoading, data:pokemons, isError, error } = useQuery(
  ['pokemons'],
  getPokemons,
  {
    retry: 0,
    initialData: initialPokemons,  // ← 3 pokémon predefinidos
  }
);

// Retorna:
{
  pokemons,      // Array - primero initialPokemons (3), luego getPokemons (45)
  isLoading,     // boolean - cargando?
  isError,       // boolean - error?
  error,         // objeto Error
  count: computed(() => pokemons.value?.length ?? 0)  // count reactivo
}
```

**¿Cómo funciona?**

```mermaid
sequenceDiagram
    participant Comp as 📄 Componente
    participant Query as ⚡ useQuery()
    participant Initial as 💾 initialPokemons<br/>[3 pokémon]
    participant Fetch as 📦 getPokemons()
    participant API as 🌐 PokéAPI

    Comp->>Query: usePokemons()
    Query->>Initial: Toma initialData
    Initial-->>Query: Retorna 3 pokémon
    Query-->>Comp: ✅ pokemons = [3]
    
    Note over Comp: Renderiza al instante con 3 pokémon
    
    par En Background
        Query->>Fetch: Ejecuta getPokemons()
        Fetch->>API: GET /pokemon?limit=45
        API-->>Fetch: 45 pokémon
        Fetch-->>Query: Retorna [45]
        Query-->>Comp: 🔄 UPDATE: pokemons = [45]
    end
    
    Note over Comp: Re-renderiza con todos los pokémon
```

**Ventajas:**
- ✅ Usuario ve datos **al instante** (no espera cargando)
- ✅ Mejor UX: transición suave de 3 → 45 pokémon
- ✅ Si la API falla, al menos tiene 3 pokémon iniciales
- ✅ En caché (< 2 min), usa los 45 sin petición adicional

---

#### **usePokemon(id) - Pokémon individual**
```javascript
// Retorna:
{
  pokemon,          // un pokémon
  isLoading,        // boolean
  isError,          // boolean
  errorMessage      // error
}
// La clave cambia con el ID: ['pokemon', id]
```

**Diferencia:** Usa `queryKey: ['pokemon', id]`, permitiendo caché separado por cada pokémon.

---

### 💡 **Conceptos Clave Enseñados**

| Concepto | Ubicación | Lección |
|----------|-----------|---------|
| **Script Setup** | `.vue files` | Azúcar sintáctico moderno |
| **Reactive Props** | PokemonCard.vue | `defineProps<Props>()` typed |
| **Lifecycle Hooks** | Composables | No usados aquí (Vue Query maneja) |
| **Router Navigation** | PokemonCard.vue | `router.push()` con params |
| **Computed Properties** | usePokemons.ts | `computed(() => ...)` |
| **Watch Effects** | usePokemons.ts | `watchEffect()` (sin usar) |
| **Query Keys** | Composables | Invalidación por keys |
| **Prefetching** | PokemonCard.vue | `prefetchQuery()` on hover |
| **Data Transformation** | get-pokemons.ts | Mapeo de API response |
| **Error Handling** | Pages | Condicionales con `v-if/else` |
| **Store Pattern** | store.ts | Reactive store alternativo |
| **TypeScript Interfaces** | `/interfaces/*` | Tipos para API responses |

---

### 🎓 **Lecciones de Arquitectura**

```
┌─────────────────────────────────────────────────┐
│  SEPARACIÓN DE RESPONSABILIDADES                │
├─────────────────────────────────────────────────┤
│  Componentes (.vue)   → UI solamente            │
│  Composables (.ts)    → Lógica reutilizable    │
│  Helpers (.ts)        → Transformación de datos│
│  API (.ts)            → Cliente HTTP            │
│  Interfaces (.ts)     → Contrato de tipos      │
│  Store (.ts)          → Estado global (alt.)   │
│  Router              → Navegación               │
└─────────────────────────────────────────────────┘
```

---

### 🚦 **Estados de UI Manejados**

```mermaid
graph TD
    Query["useQuery()"]
    
    Query --> L["isLoading = true"]
    Query --> E["isError = true"]
    Query --> S["¡Datos!"]
    
    L --> UI1["Mostrar 'Loading...'"]
    E --> UI2["Mostrar error message"]
    S --> UI3["Renderizar datos"]
    
    style L fill:#000
    style E fill:#000
    style S fill:#000
```

---

Esta estructura sigue **padrón profesional moderno** y enseña cómo construir aplicaciones Vue escalables con gestión robusta de estado asincrónico.