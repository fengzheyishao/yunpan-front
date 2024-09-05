import "@/assets/less/index.less";

import Verify from '@/utils/Verify'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import HljsVuePlugin from '@highlightjs/vue-plugin'
import "highlight.js/styles/atom-one-light.css";
import 'highlight.js/lib/common'

import VueCookies from 'vue-cookies'

import api from '@/api/api.js'

import message from '@/utils/Message'
import Utils from '@/utils/Utils'

import ElementPlus from "element-plus";
import 'element-plus/dist/index.css';

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import Dialog from '@/components/Dialog.vue'
import Table from '@/components/Table.vue'
import Uploader from "./views/main/Uploader.vue";
import Icon from "./components/Icon.vue";
import FolderSeletct from "./components/FolderSeletct.vue";
import Navigation from "./components/Navigation.vue";
import Preview from '@/components/preview/Preview.vue'

const app = createApp(App)

app.config.globalProperties.Verify = Verify;
app.config.globalProperties.$api = api;
app.config.globalProperties.Message = message;
app.config.globalProperties.VueCookies = VueCookies
app.config.globalProperties.Utils = Utils;

app.use(ElementPlus)
app.use(createPinia())
app.use(HljsVuePlugin);
app.use(router)

app.component("Dialog", Dialog);
app.component("Table", Table);
app.component("Uploader", Uploader);
app.component("Icon", Icon);
app.component("FolderSeletct", FolderSeletct);
app.component("Navigation", Navigation);
app.component("Preview", Preview);



app.mount('#app')

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
