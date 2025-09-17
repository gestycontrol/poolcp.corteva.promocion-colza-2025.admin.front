import randomIdMixin from '@/mixins/common/randomIdMixin.js';
import Tooltip from "@/components/common/layout/Tooltip.vue";

export default {
    components: {
        Tooltip,
    },
    mixins: [
        randomIdMixin,
    ],
    computed: {
        id() {
            return 'input-' + this.type + '-' + this.randomId;
        },
        autocompleteAttr() {
            if (this.autocomplete &&
                this.autocomplete.toLowerCase() !== 'off' &&
                this.autocomplete.toLowerCase() !== 'false' &&
                this.autocomplete.toLowerCase() !== '0') {
                return this.autocomplete;
            }

            return 'off' + this.id;
        },
    },
    methods: {
        getId() {
            return this.id;
        },
    },
    emits: [
        'reset',
        'blur',
        'focus',
    ],
    props: {
        cssClass: {
            type: String,
            default: '',
        },
        tooltip: {
            type: String,
            default: '',
        },
        label: {
            type: String,
            default: '',
        },
        required: {
            type: Boolean,
            default: false,
        },
        pseudoRequired: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        readonly: {
            type: Boolean,
            default: false,
        },
        errorMessage: {
            type: String,
            default: '',
        },
        customAutofocus: {
            type: Boolean,
            default: false,
        },
        placeholder: {
            type: String,
            default: '',
        },
        autocomplete: {
            type: String,
            default: '',
        },
        format: {
            type: String,
            default: '',
        },
        formatClass: {
            type: [String, Function],
        },
        title: {
            type: String,
            default: '',
        },
        translate: {
            type: Boolean,
            default: false,
        },
    },
};