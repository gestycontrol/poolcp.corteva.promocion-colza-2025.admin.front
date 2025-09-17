<template>
    <template v-if="false">
        <!-- Avoid typos! -->
    </template>
    <SectionAccordeonItem v-else-if="sectionType == 'accordeon'" :open="selected" :hideInnerClose="hideInnerClose">
        <template #title>
            <slot name="title"></slot>
        </template>
        <slot></slot>
    </SectionAccordeonItem>
    <SectionAsideItem v-else-if="sectionType == 'aside'" :selected="selected">
        <slot></slot>
    </SectionAsideItem>
    <SectionTopItem v-else-if="sectionType == 'top'" :selected="selected">
        <slot></slot>
    </SectionTopItem>
    <template v-else>
        <div class="mb-2">
            <slot></slot>
        </div>
    </template>
</template>

<script>
import SectionAccordeonItem from "@/components/common/layout/section/accordeon/SectionAccordeonItem.vue";
import SectionAsideItem from "@/components/common/layout/section/aside/SectionAsideItem.vue";
import SectionTopItem from "@/components/common/layout/section/top/SectionTopItem.vue";

export default {
    components: {
        SectionAccordeonItem,
        SectionAsideItem,
        SectionTopItem,
    },
    methods: {
        isSectionItem() {
            return true;
        },
    },
    props: {
        clickAction: {
            type: Function,
            default: null,
        },
        sectionType: {
            type: String,
            default: 'aside',
        },
        selected: {
            type: Boolean,
            default: false,
        },
        hideInnerClose: {
            type: Boolean,
            default: false,
        },
    },
};
</script>