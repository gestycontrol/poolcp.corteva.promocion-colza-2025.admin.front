<template>
    <template v-if="false">
        <!-- Avoid typos! -->
    </template>
    <SectionAccordeonMenuItem v-else-if="sectionType == 'accordeon'" @click="click">
        <slot></slot>
    </SectionAccordeonMenuItem>
    <SectionSimpleMenuItem v-else-if="sectionType == 'aside' || sectionType == 'top'" :selected="selected"
        :sectionType="sectionType" @click="click">
        <slot></slot>
    </SectionSimpleMenuItem>
    <button v-else type="button" @click="click">
        <slot></slot>
    </button>
</template>

<script>
import SectionAccordeonMenuItem from "@/components/common/layout/section/accordeon/SectionAccordeonMenuItem.vue";
import SectionSimpleMenuItem from "@/components/common/layout/section/simple/SectionSimpleMenuItem.vue";

export default {
    components: {
        SectionAccordeonMenuItem,
        SectionSimpleMenuItem,
    },
    props: {
        sectionType: {
            type: String,
            default: 'aside',
        },
        selected: {
            type: Boolean,
            default: false,
        },
    },
    emits: [
        'click',
    ],
    methods: {
        click() {
            this.$emit('click');
        },
    }
};
</script>