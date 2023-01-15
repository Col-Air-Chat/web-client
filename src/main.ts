import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

/* vuetify import */
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

/* vuetify icon import */
import '@mdi/font/css/materialdesignicons.css'

/* Translations provided by Vuetify */
import { pl, zhHans } from 'vuetify/locale'

/* pinia */
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App)

app.use(pinia)
app.use(router)

/* vuetify use */
const vuetify = createVuetify({
    locale: {
        locale: 'zhHans',
        messages: { zhHans, pl }
    }
})
app.use(vuetify)

app.mount('#app')
