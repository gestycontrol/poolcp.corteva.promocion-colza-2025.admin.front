<template>
    <SummarizedModalItem v-if="summarized" @detailShown="detailShown" @detailHidden="detailHidden"
        ref="summarizedModalItem" @detailSubmitted="detailSubmitted" tag="div"
        class="form-outline form-outline-multiselect">
        <template #summary>
            <Field :smallLabel="true" :format="format" type="text" :label="label" :required="required"
                :resettable="resettable && this.value && this.value.length > 0" @reset="resetInput" :tooltip="tooltip"
                :pseudoRequired="pseudoRequired" :disabled="disabled" :readonly="true" :errorMessage="errorMessage"
                :customAutofocus="customAutofocus" :autocomplete="autocomplete" :modelValue="displayValue">
            </Field>
        </template>

        <template #title>
            {{ label }}
        </template>
        <div class="row g-2 mb-2">
            <div class="col-12 pb-2 mb-2 border-bottom" v-if="!disabled && options.length > optionLimit">
                <div class="d-flex gap-2">
                    <input type="text" class="w-100 form-control" v-model="filterText" :placeholder="i18n('Search')"
                        ref="filterInput" v-if="!showAll">
                    <button type="button" class="btn btn-outline-secondary btn-sm" @click="toggleShowAll">
                        {{ showAll ? i18n('Search') : i18n('All') }}
                    </button>
                </div>
            </div>
            <div class="col-12" v-for="option in filteredOptions" :key="option.id">
                <Field type="checkbox" :label="option.name" v-model="selectedIds[option.id]" :disabled="disabled" />
            </div>
            <div class="col-12 pt-2" v-if="!disabled && (options.length - filteredOptions.length) > 0">
                <small>
                    <em>
                        {{ i18n('Displaying %items% items, %hiddenItems% items hidden').replace('%items%',
                            filteredOptions.length).replace('%hiddenItems%', options.length - filteredOptions.length) }}
                    </em>
                </small>
            </div>
        </div>

        <template #footer>
            <div class="row g-2 w-100">
                <div class="col-12 p-0 mt-0 text-end">
                    <button @click="hideDetail" type="button" class="btn btn-outline-dark btn-sm">
                        {{ i18n('Close') }}
                    </button>
                </div>
            </div>
        </template>
    </SummarizedModalItem>
    <div v-else :class="{ 'inline-multiple': true, 'disabled': disabled }">
        <span class="label">
            <Tooltip :title="tooltip" v-if="tooltip">
                {{ label + (required || pseudoRequired ? '*' : '') }}
            </Tooltip>
            <template v-else>
                {{ label + (required || pseudoRequired ? '*' : '') }}
            </template>
        </span>
        <div class="row g-2 mb-2">
            <div class="col-12" v-for="option in options" :key="option.id">
                <Field type="checkbox" :label="option.name" v-model="selectedIds[option.id]" :disabled="disabled" />
            </div>
        </div>
    </div>
</template>
<script>
import api from "@/api.js";
import arrayVModelMixin from "@/mixins/common/arrayVModelMixin.js";
import fieldMixin from "@/mixins/common/fieldMixin.js";
import summarizedFormMixin from "@/mixins/common/summarizedFormMixin.js";
import Field from "@/components/common/form/Field.vue";
import SummarizedModalItem from "@/components/common/layout/SummarizedModalItem.vue";
import {
    extractKeyFromObject,
    extractLabelFromObject,
} from "@/tools/object.js";
import { removeAccents, } from "@/tools/string.js";

export default {
    components: {
        Field,
        SummarizedModalItem,
    },
    mixins: [
        arrayVModelMixin,
        fieldMixin,
        summarizedFormMixin,
    ],
    props: {
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
        numericKeys: {
            type: Boolean,
            default: true,
        },
        summarized: {
            type: Boolean,
            default: true,
        },
        sort: Function,
        filter: Function,
        optionLimit: {
            type: Number,
            default: 15,
        },
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
        modelValue() {
            this.sanitizeValue();
        },
        selectedIds: {
            handler() {
                let selectedKeys = Object.keys(this.selectedIds).filter((k) => this.selectedIds[k]).sort(),
                    expectedValue;

                if (this.numericKeys) {
                    selectedKeys = selectedKeys.map(k => parseInt(k));
                }

                if (this.expectsObject) {
                    expectedValue = this.options.filter(o => selectedKeys.indexOf(o.id) != -1).map(o => o
                        ._originalObject);
                } else {
                    expectedValue = selectedKeys;
                }

                if (JSON.stringify(selectedKeys) != JSON.stringify(this.valueKeys)) {
                    this.value = expectedValue;
                }
            },
            deep: true,
        },
        modelValue: {
            handler() {
                this.setSelectedIds();
            },
            deep: true,
        },
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
    data() {
        return {
            type: 'multiselect',
            placeholderValue: '',
            selectedIds: {},
            options: [],
            filterText: '',
            showAll: false,
        };
    },
    created() {
        this.setSelectedIds();
    },
    computed: {
        expectsObject() {
            return this.format == 'object';
        },
        valueKeys() {
            if (!this.modelValue || !Array.isArray(this.modelValue)) return null;

            let valueKeys;

            if (this.expectsObject) {
                valueKeys = this.modelValue.map(v => {
                    if (typeof v === 'object') {
                        return v.id || v.code || v;
                    } else {
                        return v;
                    }
                }).sort();
            } else {
                valueKeys = this.modelValue.sort()
            }

            return valueKeys;
        },
        filteredOptions() {
            if (this.options.length <= this.optionLimit && !this.disabled && !this.showAll && !this.filterText.trim()) {
                return this.options;
            }

            const isDisabled = this.disabled;
            const selected = new Set(Object.keys(this.selectedIds).filter(k => this.selectedIds[k]));
            const query = this.normalize(this.filterText).trim();
            const terms = query.split(/[\s,;]+/).filter(Boolean);

            const matches = (opt) => {
                if (terms.length === 0) return true;
                const haystack = opt.nameNormalized || this.normalize(opt.name);
                return terms.every(t => haystack.includes(t));
            };

            if (isDisabled) {
                return this.options.filter(o => selected.has(String(o.id)) || selected.has(Number(o.id)));
            }

            let shown = 0;
            const limit = this.showAll ? Number.POSITIVE_INFINITY : this.optionLimit;
            const result = [];

            for (const o of this.options) {
                if (selected.has(String(o.id)) || selected.has(Number(o.id))) {
                    result.push(o);
                    continue;
                }
                if (!matches(o)) continue;
                if (shown < limit) {
                    result.push(o);
                    shown++;
                }
            }

            return result;
        },
        fallbackPlaceholder() {
            return this.placeholder ? this.placeholder : this.i18n('Select...');
        },
        displayValue() {
            if (!this.value || !Array.isArray(this.value) ||
                this.value.length == 0) return this.fallbackPlaceholder;
            return this.options.filter(o => !!this.selectedIds[o.id]).map(o => o.name).join(', ');
        },
    },
    methods: {
        normalize(text) {
            return removeAccents(String(text || '')).toLowerCase();
        },
        toggleShowAll() {
            this.showAll = !this.showAll;
            this.filterText = '';

            this.$nextTick(() => {
                if (this.$refs['filterInput']) this.$refs['filterInput'].focus();
            });
        },
        detailShown() {
            this.showAll = false;
            this.$emit('focus');
            this.$nextTick(() => {
                if (this.$refs['filterInput']) this.$refs['filterInput'].focus();
            });
        },
        detailHidden() {
            this.$emit('blur');
        },
        resetInput() {
            this.selectedIds = [];
            this.value = [];
            if (this.$refs['summarizedModalItem']) this.$refs['summarizedModalItem'].hideDetail();
        },
        setSelectedIds() {
            if (!this.modelValue || !Array.isArray(this.modelValue)) return;
            let selectedKeys = Object.keys(this.selectedIds).filter((k) => this.selectedIds[k]).sort();

            if (JSON.stringify(selectedKeys) != JSON.stringify(this.valueKeys)) {
                let selectedIds = {};
                this.valueKeys.forEach(k => {
                    selectedIds[k] = true;
                });

                this.selectedIds = selectedIds;
            }
        },
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

            if (this.filter) {
                options = options.filter(this.filter);
            }

            if (this.sort) {
                options = options.sort(this.sort);
            }

            options = options.map(o => ({
                ...o,
                nameNormalized: this.normalize(o.name),
            }));

            this.options = options;
            this.sanitizeValue();
        },
        sanitizeValue() {
            this.sanitizeObjectValue();
            this.sanitizeBooleanValue();
            this.sanitizeNullValue();
        },
        sanitizeObjectValue() {
            if (!this.modelValue?.length) return;
            if (!this.expectsObject) return;

            for (let i = 0; i < this.modelValue.length; i++) {
                if (typeof (this.modelValue[i]) !== 'string' && typeof (this.modelValue[i]) !== 'number') continue;
                if (this.options.length == 0) continue;
                if (isNaN(this.modelValue[i] * 1)) continue;

                const selectedOption = this.options.filter(o => o.id == this.modelValue[i] * 1)[0];

                if (!selectedOption) continue;
                this.value[i] = selectedOption._originalObject;
            }
        },
        sanitizeBooleanValue() {
            if (!this.modelValue?.length) return;
            if (this.format !== 'boolean') return;

            for (let i = 0; i < this.modelValue.length; i++) {
                if (this.modelValue[i] === undefined || this.modelValue[i] === null || this.modelValue[i] === '') continue;
                if (typeof (this.modelValue[i]) !== 'string' && typeof (this.modelValue[i]) !== 'number') continue;
                if (this.options.length == 0) continue;
                if (isNaN(this.modelValue[i] * 1)) continue;

                this.value[i] = this.modelValue[i] * 1 === 1;
            }
        },
        sanitizeNullValue() {
            if (!this.modelValue?.length) return;

            for (let i = 0; i < this.modelValue.length; i++) {
                if (this.modelValue[i] === '' || this.modelValue[i] === undefined) {
                    this.value[i] = null;
                }
            }
        },
    },
};
</script>
<style>
.form-outline-multiselect input[type=text] {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 16px 12px;
}

.inline-multiple {
    display: block;
    width: 100%;
    padding: 0.375rem 2.25rem 0.375rem 0.75rem;
    -moz-padding-start: calc(0.75rem - 3px);
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #181E4B;
    background-color: #fff;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 16px 12px;
    border: 1px solid #ced4da;
    border-radius: 0;
    box-shadow: inset 0 1px 2px rgb(0 0 0 / 8%);
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    appearance: none;
    position: relative;
    padding-top: 2.3rem;
    padding-bottom: 0.625rem;
}

.inline-multiple span.label {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 1rem 0.75rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    pointer-events: none;
    border: 1px solid transparent;
    transform-origin: 0 0;
    transition: opacity 0.1s ease-in-out, transform 0.1s ease-in-out;
    transform: scale(0.85) translateY(-0.5rem) translateX(0.15rem);
    opacity: 1;
    font-style: normal;
}

.inline-multiple.disabled {
    background-color: #e9ecef;
    opacity: 1;
}
</style>