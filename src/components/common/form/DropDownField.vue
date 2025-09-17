<template>
    <div class="dropdown">
        <button :class="btnClass" type="button" :id="id" data-bs-toggle="dropdown" @click="$emit('focus')"
            aria-expanded="false">
            <slot name="icon"></slot>
            {{ displaySelectedValue }}
        </button>
        <ul class="dropdown-menu" :aria-labelledby="id">
            <li :value="option.id" v-for="option in options" :key="option.id">
                <a :class="{ active: value == option.id }" class="dropdown-item" href="javascript:void(0)"
                    @click="value = option.id; $emit('blur');">
                    {{ option.name }}
                </a>
            </li>
        </ul>
    </div>
</template>
<script>
import api from "@/api.js";
import vModelMixin from "@/mixins/common/vModelMixin.js";
import fieldMixin from "@/mixins/common/fieldMixin.js";
import randomIdMixin from "@/mixins/common/randomIdMixin.js";
import { extractKeyFromObject, extractLabelFromObject } from "@/tools/object.js";

export default {
    mixins: [
        randomIdMixin,
        vModelMixin,
        fieldMixin,
    ],
    props: {
        btnClass: {
            type: String,
            default: 'btn btn-sm btn-outline-dark dropdown-toggle',
        },
        lowerCase: {
            type: Boolean,
            default: true,
        },
        resettable: {
            type: Boolean,
            default: false,
        },
        list: {
            type: Array,
            default() {
                return null;
            },
        },
        hash: {
            type: Object,
            default() {
                return null;
            },
        },
        rest: {
            type: String,
            default: null,
        },
    },
    data() {
        return {
            options: [],
            type: 'select',
            placeholderValue: '',
        };
    },
    mounted() {
        this.setOptions();
    },
    watch: {
        hash: {
            handler() {
                this.setOptions();
            },
            deep: true,
        },
        list: {
            handler() {
                this.setOptions();
            },
            deep: true,
        },
        rest() {
            this.setOptions();
        },
    },
    computed: {
        labelWithPlaceholder() {
            let label = this.label || '';

            if (label.includes('%s')) {
                return label
            } else {
                return label + ' %s';
            }
        },
        displaySelectedValue() {
            return this.labelWithPlaceholder.replace('%s', this.lowerCase ? this.text.toLowerCase() : this.text);
        },
        id() {
            return 'dropdown-' + this.randomId;
        },
        fallbackPlaceholder() {
            return this.placeholder || this.i18n('Select...');
        },
        text() {
            const selectedOption = this.options.find(o => o.id === this.value);
            return selectedOption?.name || '';
        },
    },
    methods: {
        translateOption(item) {
            if (item &&
                typeof (item) == 'object') {
                return {
                    id: extractKeyFromObject(item),
                    name: extractLabelFromObject(item),
                    _originalObject: item,
                };
            } else {
                return {
                    id: item,
                    name: item,
                    _originalObject: item,
                };
            }
        },
        async setOptions() {
            let options = [];

            if (this.list !== null) {
                if (!Array.isArray(this.list)) this.list = [];

                this.list.forEach((item) => {
                    options.push(this.translateOption(item));
                });
            } else if (this.hash !== null) {
                Object.keys(this.hash).forEach(key => {
                    options.push({
                        id: key,
                        name: this.hash[key],
                    });
                });
            } else if (this.rest !== null) {
                let list = await api.cached(this.rest);
                options = [];
                if (!Array.isArray(list)) list = [];

                list.forEach((item) => {
                    options.push(this.translateOption(item));
                });
            }

            this.options = options;
        },
        resetInput() {
            this.value = '';
            this.$emit('reset');
        },
    },
};
</script>
