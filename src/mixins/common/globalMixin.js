
import {
    i18n,
    switchLang,
    getCurrentLang,
} from "@/tools/i18n.js";
import api from "@/api.js";

export default {
    methods: {
        can: api.can,
        i18n,
        switchLang,
        getCurrentLang,
    }
};
