import {createApp} from 'vue'
import App from '@/App.vue'
import {createPinia} from "pinia";
import router from "@/router";
import {useUserStore} from "@/stores/user.store.ts";
import {QueryClient, VueQueryPlugin} from "@tanstack/vue-query";
import PrimeVue from "primevue/config";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import DatePicker from "primevue/datepicker";
import Select from "primevue/select";
import Button from "primevue/button";
import TabMenu from 'primevue/tabmenu';
import DataTable from 'primevue/datatable';
import '@/style.scss';
import '@/styles/primevue-overrides.scss';

const app = createApp(App);
const pinia = createPinia()
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

app.use(pinia)
app.use(router);  // <-- apply router here
app.use(VueQueryPlugin, {queryClient});

app.use(PrimeVue);
app.component("Dialog", Dialog);
app.component("InputText", InputText);
app.component("DatePicker", DatePicker);
app.component("Select", Select);
app.component("Button", Button);
app.component("TabMenu", TabMenu);
app.component("DataTable", DataTable);

// --- init user store from cookie ---
const userStore = useUserStore();
userStore.initializeFromCookie();

app.mount('#app');
