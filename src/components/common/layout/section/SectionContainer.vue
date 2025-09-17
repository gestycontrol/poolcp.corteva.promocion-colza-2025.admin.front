<template>
    <template v-if="false">
        <!-- Avoid typos! -->
    </template>
    <SectionAccordeonContainer v-else-if="sectionType == 'accordeon'">
        <slot></slot>
    </SectionAccordeonContainer>
    <SectionAsideContainer v-else-if="sectionType == 'aside'">
        <slot></slot>
    </SectionAsideContainer>
    <SectionTopContainer v-else-if="sectionType == 'top'">
        <slot></slot>
    </SectionTopContainer>
    <template v-else>
        <slot></slot>
    </template>
</template>

<script>
import SectionAccordeonContainer from "@/components/common/layout/section/accordeon/SectionAccordeonContainer.vue";
import SectionAsideContainer from "@/components/common/layout/section/aside/SectionAsideContainer.vue";
import SectionTopContainer from "@/components/common/layout/section/top/SectionTopContainer.vue";

export default {
    components: {
        SectionAccordeonContainer,
        SectionAsideContainer,
        SectionTopContainer,
    },
    props: {
        sectionType: {
            type: String,
            default: 'aside',
        },
    },
};
</script>