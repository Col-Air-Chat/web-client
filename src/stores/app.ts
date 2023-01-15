import { defineStore } from 'pinia'

interface tabs {
    [key: string]: string
}

interface drawer{
    [key: string]: boolean
}

export const AppCommonStore = defineStore('appCommon', {
    state: () => ({
        theme: 'light',
        language: 'zhHans',
        tabs: {
            'left': 'recent',
        } as tabs,
        drawer: {
            'left': true,
            'middle': true,
        } as drawer,
        isMobile: false,
    }),
    getters: {
        getTheme: (state) => state.theme,
        getLanguage: (state) => state.language,
        getTabs: (state) => state.tabs,
        getDrawer: (state) => state.drawer,
        getIsMobile: (state) => state.isMobile,
    },
    actions: {
        setTheme(theme: string) {
            this.theme = theme
        },
        setLanguage(language: string) {
            this.language = language
        },
        setTabs(key: string, value: string) {
            this.tabs[key] = value
        },
        setDrawer(key: string, value: boolean) {
            this.drawer[key] = value
        },
        setIsMobile(isMobile: boolean) {
            this.isMobile = isMobile
        }
    },
    persist: true,
})