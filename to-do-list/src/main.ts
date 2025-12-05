import { createApp } from "vue";
import App from "@/App.vue";
import { createPinia } from "pinia";
import router from "@/router";
import { useUserStore } from "@/stores/user.store.ts";
import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query";
import PrimeVue from "primevue/config";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import DatePicker from "primevue/datepicker";
import Select from "primevue/select";
import Button from "primevue/button";
import TabMenu from "primevue/tabmenu";
import DataTable from "primevue/datatable";
import ConfirmDialog from "primevue/confirmdialog";
import ConfirmPopup from "primevue/confirmpopup";
import Chip from "primevue/chip";
import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";

import "@/style.scss";

const app = createApp(App);
const pinia = createPinia();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

app.use(pinia);
app.use(router); // <-- apply router here
app.use(VueQueryPlugin, { queryClient });

app.use(PrimeVue);
app.use(ConfirmationService);
app.use(ToastService);

// --- register global components ---
app.component("Dialog", Dialog);
app.component("InputText", InputText);
app.component("DatePicker", DatePicker);
app.component("Select", Select);
app.component("Button", Button);
app.component("TabMenu", TabMenu);
app.component("DataTable", DataTable);
app.component("ConfirmDialog", ConfirmDialog);
app.component("ConfirmPopup", ConfirmPopup);
app.component("Toast", Toast);
app.component("Chip", Chip);

// --- init user store from cookie ---
const userStore = useUserStore();
userStore.initializeFromCookie();

app.mount("#app");
