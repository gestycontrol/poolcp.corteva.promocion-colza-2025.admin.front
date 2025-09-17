<template>
    <template v-if="false">
        <!-- Avoid typos! -->
    </template>
    <SectionAccordeonMenuItemContainer v-else-if="sectionType == 'accordeon'">
        <slot></slot>
    </SectionAccordeonMenuItemContainer>
    <SectionAsideMenuItemContainer :stickyY="stickyY" :small="small" v-else-if="sectionType == 'aside'">
        <slot></slot>
    </SectionAsideMenuItemContainer>
    <SectionTopMenuItemContainer :stickyY="stickyY" v-else-if="sectionType == 'top'">
        <slot></slot>
    </SectionTopMenuItemContainer>
    <template v-else>
        <slot></slot>
    </template>
</template>

<script>
import SectionAccordeonMenuItemContainer from "@/components/common/layout/section/accordeon/SectionAccordeonMenuItemContainer.vue";
import SectionAsideMenuItemContainer from "@/components/common/layout/section/aside/SectionAsideMenuItemContainer.vue";
import SectionTopMenuItemContainer from "@/components/common/layout/section/top/SectionTopMenuItemContainer.vue";

export default {
    components: {
        SectionAccordeonMenuItemContainer,
        SectionAsideMenuItemContainer,
        SectionTopMenuItemContainer,
    },
    props: {
        stickyY: {
            type: String,
            default: "124px",
        },
        small: Boolean,
        sectionType: {
            type: String,
            default: 'aside',
        },
    },
    watch: {}
};
</script>