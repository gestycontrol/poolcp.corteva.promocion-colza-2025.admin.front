<template>
    <div class="form-outline">
        <div class="form-check">
            <input type="radio" class="form-check-input" :id="id" @blur="$emit('blur')" @focus="$emit('focus')"
                :data-pseudo-required="(pseudoRequired ? 'true' : 'false')" v-model="value" :required="required"
                :value="valueIfSelected" :readonly="readonly" :disabled="disabled" :autocomplete="autocompleteAttr"
                :data-custom-autofocus="(customAutofocus ? 'on' : false)">
            <label class="form-check-label" :for="id" v-if="label">
                <Tooltip :title="tooltip" v-if="tooltip">
                    {{ label + (required || pseudoRequired ? '*' : '') }}
                </Tooltip>
                <template v-else>
                    {{ label + (required || pseudoRequired ? '*' : '') }}
                </template>
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
        valueIfSelected: {
            default: true,
        },
    },
    methods: {
        resetInput() {
            this.value = false;
            this.$emit('reset');
        },
    },
};
</script>