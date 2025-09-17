<script setup>
import {
    defineComponent,
    h,
    useSlots
} from 'vue';

const slots = useSlots();

const extractSectionItemComponent = (vNode) => {
    if (vNode && vNode.type &&
        vNode.type.methods && vNode.type.methods.isSectionItem &&
        vNode.type.methods.isSectionItem()) {
        return vNode;
    }

    return undefined;
};

const SectionItems = defineComponent({
    props: {
        selectedIndex: {
            type: Number,
            default: 0,
        },
        sectionType: {
            type: String,
            default: 'aside',
        },
    },
    render() {
        if (!slots.default) {
            return undefined;
        }

        return slots.default().map((vNode, index) => {
            let sectionItem = extractSectionItemComponent(vNode);
            if (!sectionItem) return undefined;

            if (!sectionItem.props) {
                sectionItem.props = {};
            }

            sectionItem.props.sectionType = this.sectionType;
            sectionItem.props.selected = (index == this.selectedIndex);

            return h(sectionItem);
        });
    },
});

const SectionMenuItems = defineComponent({
    props: {
        selectedIndex: {
            type: Number,
            default: 0,
        },
        sectionType: {
            type: String,
            default: 'aside',
        },
    },
    emits: ['selectItemChange'],
    render() {
        if (!slots.default) {
            return undefined;
        }

        return slots.default().map((vNode, index) => {
            let sectionItem = extractSectionItemComponent(vNode);
            if (!sectionItem) return undefined;

            return h(
                SectionMenuItem, {
                sectionType: this.sectionType,
                selected: (index == this.selectedIndex),
                onClick: () => {
                    if (!sectionItem.props ||
                        !sectionItem.props.clickAction ||
                        sectionItem.props.clickAction()) {
                        this.$emit('selectItemChange', index);
                    }
                },
            }, () => sectionItem.children.title(),
            )
        });
    },
});
</script>

<template>
    <SectionContainer :sectionType="sectionType">
        <SectionMenuItemContainer :stickyY="stickyY" :sectionType="sectionType" :small="small"
            v-if="sectionType !== 'none'">
            <SectionMenuItems :sectionType="sectionType" :selectedIndex="selectedIndex"
                @selectItemChange="selectItemChange" />
        </SectionMenuItemContainer>
        <SectionItemContainer :sectionType="sectionType" :small="small">
            <SectionItems :sectionType="sectionType" :selectedIndex="selectedIndex" />
        </SectionItemContainer>
    </SectionContainer>
</template>

<script>
import SectionContainer from "@/components/common/layout/section/SectionContainer.vue";
import SectionMenuItemContainer from "@/components/common/layout/section/SectionMenuItemContainer.vue";
import SectionItemContainer from "@/components/common/layout/section/SectionItemContainer.vue";
import SectionMenuItem from "@/components/common/layout/section/SectionMenuItem.vue";

export default {
    components: {
        SectionContainer,
        SectionItemContainer,
        SectionMenuItemContainer,
        SectionMenuItem,
    },
    data() {
        return {
            selectedIndex: 0,
        };
    },
    created() {
        this.selectedIndex = this.defaultSelectedIndex;
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
        defaultSelectedIndex: {
            type: Number,
            default: 0,
        },
    },
    methods: {
        selectItemChange(index) {
            this.selectedIndex = index;
        },
    }
};
</script>