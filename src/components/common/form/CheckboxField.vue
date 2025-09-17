<template>
    <div class="form-outline">
        <div :class="`form-check ${cssClass}`">
            <input type="checkbox" class="form-check-input" :id="id" ref="checkbox"
                :data-pseudo-required="(pseudoRequired ? 'true' : 'false')" v-model="value" :required="required"
                :readonly="readonly" :disabled="disabled" :autocomplete="autocompleteAttr"
                :data-custom-autofocus="(customAutofocus ? 'on' : false)" @blur="$emit('blur')" @focus="$emit('focus')">
            <label class="form-check-label" :for="id" v-if="label">
                {{ label + (required || pseudoRequired ? '*' : '') }}
            </label>
            <div class="text-danger small ms-1 mt-1" v-if="errorMessage">
                {{ errorMessage }}
            </div>
        </div>
    </div>
</template>
<script>
import vModelMixin from "@/mixins/common/vModelMixin.js";
import fieldMixin from "@/mixins/common/fieldMixin.js";

export default {
    mixins: [
        vModelMixin,
        fieldMixin,
    ],
    props: {
        resettable: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            default: 'text',
        },
        step: {
            type: String,
            default: '1',
        },
        smallLabel: {
            type: Boolean,
            default: false,
        },
        partial: {
            type: Boolean,
            default: false,
        },
    },
    watch: {
        partial(newVal) {
            this.$nextTick(() => {
                if (this.$refs.checkbox) {
                    this.$refs.checkbox.indeterminate = newVal;
                }
            });
        },
        value() {
            this.$nextTick(() => {
                if (this.$refs.checkbox) {
                    this.$refs.checkbox.indeterminate = this.partial;
                }
            });
        }
    },
    mounted() {
        this.$nextTick(() => {
            if (this.$refs.checkbox) {
                this.$refs.checkbox.indeterminate = this.partial;
            }
        });
    },
    methods: {
        resetInput() {
            this.value = false;
            this.$emit('reset');
        },
    },
};
</script>