import { createApp } from 'vue';
import { Quasar } from 'quasar';
import App from './App.vue';
import router from './router';
import OpenLayersMap from 'vue3-openlayers';
import 'vue3-openlayers/styles.css';

const app = createApp(App);

app.use(Quasar, {
    plugins: {},
});
app.use(router);

app.use(OpenLayersMap, {
    debug: true // Включаем режим отладки для более подробных сообщений об ошибках
});

app.mount('#app'); 