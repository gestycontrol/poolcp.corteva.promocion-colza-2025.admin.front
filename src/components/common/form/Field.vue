<template>
    <component :is="fieldComponent" v-bind="{ ...$props, ...$attrs }" v-model="value" ref="input">
        <slot />
    </component>
</template>


<script>
import { computed as vueComputed } from 'vue'
import vModelMixin from '@/mixins/common/vModelMixin.js'
import fieldMixin from '@/mixins/common/fieldMixin.js'

/** <Static custom field imports> */
import TextField from './TextField.vue'
import CheckboxField from './CheckboxField.vue'
import RadioField from './RadioField.vue'
import LongTextField from './LongTextField.vue'
import WysiwygField from './WysiwygField.vue'
import ImageUrlField from './ImageUrlField.vue'
import FieldReadonly from './FieldReadonly.vue'
import DictionaryField from './DictionaryField.vue'
import DropDownField from './DropDownField.vue'

const componentMap = {
    dictionary: DictionaryField,
    combo: DictionaryField,
    select: DictionaryField,
    dropdown: DropDownField,
    checkbox: CheckboxField,
    radio: RadioField,
    longtext: LongTextField,
    textarea: LongTextField,
    wysiwyg: WysiwygField,
    html: WysiwygField,
    imageurl: ImageUrlField,
    readonly: FieldReadonly,
    text: TextField,
}
/** </Static custom field imports> */

export default {
    inheritAttrs: false,
    emits: ['update:modelValue', 'blur', 'focus', 'reset'],
    mixins: [vModelMixin, fieldMixin],
    props: {
        formFloating: { type: Boolean, default: true, },
        allowZero: { type: Boolean, default: false },
        resettable: { type: Boolean, default: false },
        type: { type: String, default: 'text' },
        step: { type: String, default: '' },
        smallLabel: { type: Boolean, default: false },
        list: { type: Array, default: () => null },
        hash: { type: Object, default: () => null },
        pattern: { type: String, default: '' },
        maxlength: { type: Number },
        min: { type: [Number, String] },
        max: { type: [Number, String] },
        title: { type: String, default: '' },
        rest: { type: String, default: null },
        filter: { type: Function },
        sort: { type: Function },
        valueIfSelected: {},
        maxImageSideSize: Number,
        preview: { type: Boolean, default: false },
        searchable: { type: Boolean, default: false },
        searchableThreshold: { type: Number, default: 10 },
        translate: { type: Boolean, default: false },
        autoSelectSingleOption: { type: Boolean, default: false },
    },
    setup(props) {
        const fieldComponent = vueComputed(() => {
            const key = props.type.toLowerCase()
            return componentMap[key] || TextField
        })
        return { fieldComponent }
    },
    computed: {
        placeholderValue() {
            const inp = this.$refs.input
            return inp ? inp.placeholderValue : undefined
        },
    },
    methods: {
        blur() {
            const inp = this.$refs.input?.blur
                ? this.$refs.input
                : this.$refs.input?.$refs?.input
            inp?.blur()
        },
        focus() {
            const inp = this.$refs.input?.focus
                ? this.$refs.input
                : this.$refs.input?.$refs?.input
            inp?.focus()
        },
        resetInput() {
            this.$refs.input?.resetInput?.()
        },
    },
}
</script>