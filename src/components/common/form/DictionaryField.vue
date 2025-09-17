<template>
    <div class="form-outline">
        <div class="input-group">
            <div :class="{ 'form-floating': formFloating, [cssClass]: true }">
                <template v-if="searchModeActive">
                    <input type="text" ref="searchInput" :id="id" :aria-label="label" v-model="searchQuery"
                        class="form-control" :placeholder="fallbackPlaceholder" @focus="showDropdown = true"
                        @keydown="handleKeydown" @input="handleInput" @blur="onBlurAutocomplete" autocomplete="off"
                        :required="required" :disabled="disabled || readonly" />
                    <label v-if="label && formFloating" :for="id">{{ label + (required || pseudoRequired ? '*' : '')
                        }}</label>
                    <teleport to="body">
                        <ul v-if="showDropdown && filteredOptions.length" class="dropdown-menu show"
                            :style="computedDropdownPosition">
                            <li v-for="(option, index) in filteredOptions" :key="option.id" :ref="'option-' + index"
                                :class="{ 'highlighted': index === highlightedIndex }"
                                @mousedown.prevent="selectOption(option)">
                                {{ option.name }}
                            </li>
                        </ul>
                    </teleport>
                </template>
                <template v-else>
                    <select :class="{ 'form-select': true, 'no-label': !label }" :id="id" :aria-label="label"
                        v-model="value" ref="input" :required="required"
                        :data-pseudo-required="(pseudoRequired ? 'true' : 'false')" :autocomplete="autocompleteAttr"
                        :disabled="disabled || readonly" :data-custom-autofocus="(customAutofocus ? 'on' : false)"
                        @blur="$emit('blur')" @focus="$emit('focus')">
                        <option v-if="fallbackPlaceholder" value="">{{ fallbackPlaceholder }}</option>
                        <template v-if="expectsObject">
                            <template v-for="(option, index) in options">
                                <template
                                    v-if="valueId && (option._originalObject ? option._originalObject : option)?.id == valueId">
                                    <option :value="value" :key="index">
                                        {{ option.name }}
                                    </option>
                                </template>
                                <template v-else>
                                    <option :value="(option._originalObject ? option._originalObject : option)"
                                        :key="index">
                                        {{ option.name }}
                                    </option>
                                </template>
                            </template>
                        </template>
                        <template v-else>
                            <option :value="option.id" v-for="option in options" :key="option.id">
                                {{ option.name }}
                            </option>
                        </template>
                    </select>
                    <label v-if="label && formFloating" :for="id">{{ label + (required || pseudoRequired ? '*' : '')
                        }}</label>
                </template>
                <div class="text-danger small ms-1 mt-1" v-if="errorMessage">
                    {{ errorMessage }}
                </div>
                <Transition v-if="resettable">
                    <span v-if="value && (typeof (value) != 'object' || Object.keys(value).length > 0)"
                        class="clean-field" @click.stop="resetInput">
                        <i>{{ i18n('Cleanup') }}</i>
                        <CleanIcon />
                    </span>
                </Transition>
            </div>
            <slot></slot>
        </div>
    </div>
</template>
<script>
import api from "@/api.js";
import vModelMixin from "@/mixins/common/vModelMixin.js";
import fieldMixin from "@/mixins/common/fieldMixin.js";
import CleanIcon from "@/assets/svg/clean.vue";
import {
    extractKeyFromObject,
    extractLabelFromObject,
} from "@/tools/object.js";

export default {
    components: {
        CleanIcon,
    },
    mixins: [
        vModelMixin,
        fieldMixin,
    ],
    props: {
        formFloating: {
            type: Boolean,
            default: true,
        },
        filter: {
            type: Function,
        },
        sort: {
            type: Function,
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
        searchableThreshold: {
            type: [Number, Boolean],
            default: 10,
        },
        autoSelectSingleOption: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            options: [],
            type: 'select',
            placeholderValue: '',
            searchQuery: '',
            showDropdown: false,
            highlightedIndex: -1,
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
        modelValue() {
            this.sanitizeValue();
        },
        value() {
            if (this.searchModeActive) {
                this.searchQuery = this.text;
            }
        },
        searchModeActive() {
            if (!this.searchModeActive) {
                this.searchQuery = '';
                this.showDropdown = false;
            } else {
                this.searchQuery = this.text;
            }
        },
    },
    computed: {
        expectsObject() {
            return this.format == 'object';
        },
        valueId() {
            if (this.expectsObject) {
                if (!this.value) {
                    return null;
                } else if (this.value.id) {
                    return this.value.id;
                } else if (this.value.code) {
                    return this.value.code;
                } else {
                    return null;
                }
            }

            return this.value;
        },
        fallbackPlaceholder() {
            return this.placeholder || this.placeholder === null ? this.placeholder : this.i18n('Select...');
        },
        text() {
            let selectedOption = null;

            if (this.valueId) {
                selectedOption = this.options.filter(o => o.id == this.valueId)[0];
            }

            return (selectedOption ? selectedOption.name : '');
        },
        isMobile() {
            return /Mobi|Android/i.test(navigator.userAgent);
        },
        searchModeActive() {
            const optionCount = (this.options?.length || 0);

            return !this.isMobile
                && this.searchableThreshold !== false
                && optionCount > 0
                && optionCount >= this.searchableThreshold;
        },
        filteredOptions() {
            if (!this.searchQuery) return this.options;

            const normalize = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const originalQuery = normalize(this.searchQuery.trim());
            const removeSpaces = !this.searchQuery.includes(" ");
            const query = removeSpaces ? originalQuery.replace(/\s+/g, "") : originalQuery;
            return this.options
                .map(option => {
                    let name = normalize(option.name);

                    if (removeSpaces) {
                        name = name.replace(/\s+/g, "");
                    }

                    let category = 4;

                    if (name.startsWith(query)) {
                        category = 1;
                    } else if (name.includes(query)) {
                        category = 2;
                    } else {
                        const words = originalQuery.split(/\s+/);
                        const allWordsExist = words.every(word => name.includes(word));

                        if (allWordsExist) {
                            category = 3;
                        }
                    }

                    return { option, category };
                })
                .filter(item => item.category < 4)
                .sort((a, b) => {
                    if (a.category === b.category) {
                        return a.option.name.localeCompare(b.option.name);
                    }

                    return a.category - b.category;
                })
                .map(item => item.option);
        },
        computedDropdownPosition() {
            const inputEl = this.$refs.searchInput
            if (!inputEl) return {}

            const rect = inputEl.getBoundingClientRect()
            return {
                position: 'absolute',
                top: `${rect.bottom + window.scrollY}px`,
                left: `${rect.left + window.scrollX}px`,
                width: `${rect.width}px`,
                'z-index': 1053,
            }
        },
    },
    methods: {
        translateOption(item) {
            if (item &&
                typeof (item) == 'object') {
                let label = extractLabelFromObject(item);

                if (this.translate && item?.translation_key) {
                    label = this.i18n(item.translation_key);
                }

                return {
                    id: extractKeyFromObject(item),
                    name: label,
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

                if (!Array.isArray(list)) {
                    list = [];
                }

                list.forEach(item => {
                    options.push(this.translateOption(item));
                });
            }

            if (this.filter) {
                options = options.filter(this.filter);
            }

            if (this.sort) {
                options = options.sort(this.sort);
            }

            this.options = options;

            if (this.autoSelectSingleOption && options.length === 1 && !this.value) {
                const singleOption = options[0];
                this.value = this.expectsObject ? singleOption._originalObject : singleOption.id;
                this.$emit('update:modelValue', this.value);
            }

            if (this.searchModeActive) {
                this.searchQuery = this.text;
            }

            this.sanitizeValue();
        },
        sanitizeValue() {
            this.sanitizeObjectValue();
            this.sanitizeBooleanValue();
            this.sanitizeNullValue();
        },
        sanitizeObjectValue() {
            if (!this.expectsObject) return;
            if (!this.modelValue) return;
            if (typeof (this.modelValue) !== 'string' && typeof (this.modelValue) !== 'number') return;
            if (this.options.length == 0) return;
            if (isNaN(this.modelValue * 1)) return;

            const selectedOption = this.options.filter(o => o.id == this.modelValue * 1)[0];

            if (!selectedOption) return;
            this.value = selectedOption._originalObject;
        },
        sanitizeBooleanValue() {
            if (this.format !== 'boolean') return;
            if (this.modelValue === undefined || this.modelValue === null || this.modelValue === '') return;
            if (typeof (this.modelValue) !== 'string' && typeof (this.modelValue) !== 'number') return;
            if (this.options.length === 0) return;
            if (isNaN(this.modelValue * 1)) return;
            this.value = this.modelValue * 1 === 1;
        },
        sanitizeNullValue() {
            if (this.modelValue !== '' && this.modelValue !== undefined) return;

            const selectedOption = this.options.filter(o => o.id == this.modelValue)[0];

            if (!selectedOption && this.value !== this.placeholderValue) {
                this.value = this.placeholderValue;
            }
        },
        resetInput() {
            this.value = this.placeholderValue;
            this.searchQuery = '';
            this.$emit('reset');
        },
        scrollHighlightedOptionIntoView() {
            this.$nextTick(() => {
                const optionRef = this.$refs['option-' + this.highlightedIndex];
                if (optionRef) {
                    const el = Array.isArray(optionRef) ? optionRef[0] : optionRef;
                    if (el && el.scrollIntoView) {
                        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                    }
                }
            });
        },
        handleInput() {
            if (document.activeElement === this.$refs.searchInput) {
                this.showDropdown = true;
                this.highlightedIndex = -1;
            }
        },
        handleKeydown(event) {
            if (!this.searchModeActive) return;

            const key = event.key;

            if (key === 'ArrowDown') {
                event.preventDefault();

                if (!this.showDropdown) {
                    this.showDropdown = true;
                    this.highlightedIndex = 0;
                } else if (this.highlightedIndex < this.filteredOptions.length - 1) {
                    this.highlightedIndex++;
                }

                this.scrollHighlightedOptionIntoView();
            } else if (key === 'ArrowUp') {
                event.preventDefault();

                if (this.showDropdown && this.highlightedIndex > 0) {
                    this.highlightedIndex--;
                }

                this.scrollHighlightedOptionIntoView();
            } else if (key === 'Enter') {
                if (this.showDropdown && this.filteredOptions.length > 0) {
                    event.preventDefault();

                    let index = this.highlightedIndex;

                    if (index === -1) {
                        index = 0;
                    }

                    this.selectOption(this.filteredOptions[index]);
                    this.highlightedIndex = -1;
                }
            }
        },
        selectOption(option) {
            this.searchQuery = option.name;
            this.value = this.expectsObject ? option._originalObject : option.id;
            this.showDropdown = false;
            this.$emit('update:modelValue', this.value);
        },
        onBlurAutocomplete() {
            setTimeout(() => {
                if (!this.searchModeActive) return;

                if (!(this.searchQuery || '').trim()) {
                    this.value = null;
                    this.showDropdown = false;
                    this.$emit('update:modelValue', this.value);
                    return;
                }

                const filtered = this.filteredOptions;

                if (filtered.length === 1) {
                    this.selectOption(filtered[0]);
                } else if (filtered.length === 0) {
                    this.value = null;
                    this.searchQuery = '';
                    this.$emit('update:modelValue', this.value);
                } else {
                    const selected = this.options.find(opt =>
                        opt.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") ===
                        this.text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                    );

                    if (selected) {
                        this.selectOption(selected);
                    } else {
                        this.searchQuery = this.text;
                    }
                }

                this.showDropdown = false;
                this.highlightedIndex = -1;
            }, 100);
        },
    },
};
</script>

<style lang="scss" scoped>
.clean-field {
    .custom-icon {
        max-width: 12px;
        max-height: 12px;
    }
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

.dropdown-menu {
    max-height: 200px;
    overflow-y: auto;
    margin-top: 0.25rem;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    padding: 0;
    list-style: none;
    position: absolute;
    z-index: 1000;
    background-color: white;
    width: 100%;
}

.dropdown-menu li {
    padding: 0.5rem 1rem;
    cursor: pointer;
}

.dropdown-menu li:hover,
.dropdown-menu li.highlighted {
    background-color: #f8f9fa;
}
</style>
