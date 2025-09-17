<template>
    <template v-if="false">
        <!-- Avoid typos! -->
    </template>
    <SectionAccordeonItemContainer v-else-if="sectionType == 'accordeon'">
        <slot></slot>
    </SectionAccordeonItemContainer>
    <SectionAsideItemContainer :small="small" v-else-if="sectionType == 'aside'">
        <slot></slot>
    </SectionAsideItemContainer>
    <SectionTopItemContainer v-else-if="sectionType == 'top'">
        <slot></slot>
    </SectionTopItemContainer>
    <template v-else>
        <slot></slot>
    </template>
</template>

<script>
import SectionAccordeonItemContainer from "@/components/common/layout/section/accordeon/SectionAccordeonItemContainer.vue";
import SectionAsideItemContainer from "@/components/common/layout/section/aside/SectionAsideItemContainer.vue";
import SectionTopItemContainer from "@/components/common/layout/section/top/SectionTopItemContainer.vue";

export default {
    components: {
        SectionAccordeonItemContainer,
        SectionAsideItemContainer,
        SectionTopItemContainer,
    },
    props: {
        small: Boolean,
        sectionType: {
            type: String,
            default: 'aside',
        },
    },
};
</script>