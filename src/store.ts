import { defineStore } from 'pinia'

import { computed, ref } from 'vue'

export type Store = ReturnType<typeof useStore>
declare module 'pinia' {
    export interface PiniaCustomProperties {
        $persist: PiniaPlugin
    }
}

export const useStore = defineStore('app', () => {
    
    return { }
}, {
    // @ts-ignore
    persist: {
        enabled: true,
        strategies: [{
            key: "app",
            storage: localStorage
        }]
    }   
})
