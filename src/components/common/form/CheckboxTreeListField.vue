<template>
    <div class="checkbox-tree-item">
        <div class="d-flex align-items-center mb-2">
            <div class="me-2" v-if="checkable">
                <Field type="checkbox" v-model="itemData.selected" :partial="selectionStatus === 'partial'"
                    @update:modelValue="onCheckboxChange" :disabled="disabled" />
            </div>
            <div class="flex-grow-1">
                <slot :item="item" :itemData="itemData" />
            </div>
            <div v-if="hasChildren" class="ms-2">
                <button type="button" class="btn btn-sm btn-outline-secondary collapse-btn" @click="toggleCollapsed"
                    :aria-expanded="!isCollapsed" :aria-label="isCollapsed ? 'Expandir' : 'Contraer'">
                    <span v-if="isCollapsed">+</span>
                    <span v-else>-</span>
                </button>
            </div>
        </div>

        <div v-if="hasChildren && !isCollapsed" class="ms-4">
            <CheckboxTreeListField v-for="childItem in childrenItems" :key="childItem.id" :item="childItem"
                :allItems="allItems" :disabled="disabled" :selections="selections" :parentField="parentField"
                :checkable="checkable">
                <template #default="{ item, itemData }">
                    <slot :item="item" :itemData="itemData" />
                </template>
            </CheckboxTreeListField>
        </div>
    </div>
</template>

<script>
import Field from "@/components/common/form/Field.vue";
import { extractKeyFromObject } from "@/tools/object.js";

export default {
    components: {
        Field,
    },
    props: {
        item: {
            type: Object,
            required: true,
        },
        allItems: {
            type: Array,
            required: true,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        selections: {
            type: Object,
            default: () => ({}),
        },
        parentField: {
            type: String,
            default: 'parent',
        },
        checkable: {
            type: Boolean,
            default: true,
        },
        getItemKey: {
            type: Function,
            default: extractKeyFromObject,
        },
        startCollapsed: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:item'],
    data() {
        return {
            isCollapsed: false,
        };
    },
    created() {
        this.isCollapsed = this.startCollapsed;
    },
    computed: {
        itemKey() {
            return this.getItemKey(this.item);
        },
        hasChildren() {
            return this.childrenItems.length > 0;
        },
        childrenItems() {
            return this.allItems.filter(childItem => {
                const parent = childItem[this.parentField];
                return parent && parent.id === this.item.id;
            });
        },
        itemData: {
            get() {
                if (!this.selections[this.itemKey]) {
                    this.selections[this.itemKey] = {
                        selected: false,
                        count: 1,
                    };
                }
                return this.selections[this.itemKey];
            },
            set(value) {
                this.selections[this.itemKey] = value;
            }
        },
        selectionStatus() {
            if (!this.hasChildren) return this.itemData.selected ? 'selected' : 'unselected';

            // Check if any descendants (children, grandchildren, etc.) are selected
            const hasSelectedDescendants = this.hasSelectedDescendants(this.item.id);

            // Check if all immediate children are selected
            const selectedChildrenCount = this.childrenItems.filter(childItem => {
                const childItemKey = this.getItemKey(childItem);
                const childItemData = this.selections[childItemKey];
                return childItemData && childItemData.selected;
            }).length;

            if (selectedChildrenCount === this.childrenItems.length) {
                return 'selected';
            } else if (hasSelectedDescendants) {
                return 'partial';
            }

            return 'unselected';
        },
    },
    watch: {
        selectionStatus() {
            this.updateParentState();
        },
    },
    methods: {
        toggleCollapsed() {
            this.isCollapsed = !this.isCollapsed;
        },
        onCheckboxChange(selected) {
            this.itemData.selected = selected;

            if (selected && this.hasChildren) {
                this.checkAllChildren();
            }

            if (!selected && this.hasChildren) {
                // Only uncheck all children if they were all checked before
                const allChildrenSelected = this.childrenItems.every(childItem => {
                    const childKey = this.getItemKey(childItem);
                    const childData = this.selections[childKey];
                    return childData && childData.selected;
                });

                if (allChildrenSelected) {
                    this.uncheckAllChildren();
                }
            }

            this.$emit('update:item', this.item);
        },

        checkAllChildren() {
            this.updateAllDescendants(this.item.id, true);
        },

        uncheckAllChildren() {
            this.updateAllDescendants(this.item.id, false);
        },

        updateAllDescendants(parentId, selected) {
            const children = this.allItems.filter(childItem => {
                const parent = childItem[this.parentField];
                return parent && parent.id === parentId;
            });

            children.forEach(childItem => {
                const childKey = this.getItemKey(childItem);

                if (!this.selections[childKey]) {
                    this.selections[childKey] = {
                        selected: false,
                        count: 1,
                    };
                }

                this.selections[childKey].selected = selected;
                this.updateAllDescendants(childItem.id, selected);
            });
        },

        hasSelectedDescendants(parentId) {
            const children = this.allItems.filter(childItem => {
                const parent = childItem[this.parentField];
                return parent && parent.id === parentId;
            });

            for (const child of children) {
                const childKey = this.getItemKey(child);
                const childData = this.selections[childKey];

                // Check if this child is selected
                if (childData && childData.selected) {
                    return true;
                }

                // Recursively check if any descendants of this child are selected
                if (this.hasSelectedDescendants(child.id)) {
                    return true;
                }
            }

            return false;
        },

        updateParentState() {
            const parent = this.allItems.find(item =>
                item.id === this.item[this.parentField]?.id
            );

            if (!parent) return;

            // Check if all immediate siblings are selected
            const siblings = this.allItems.filter(siblingItem => {
                const siblingParent = siblingItem[this.parentField];
                return siblingParent && siblingParent.id === parent.id;
            });

            const selectedSiblings = siblings.filter(sibling => {
                const siblingKey = this.getItemKey(sibling);
                const siblingData = this.selections[siblingKey];
                return siblingData && siblingData.selected;
            }).length;

            const totalSiblings = siblings.length;

            const parentKey = this.getItemKey(parent);

            if (!this.selections[parentKey]) {
                this.selections[parentKey] = {
                    selected: false,
                    count: 1,
                };
            }

            // Only set parent to selected if ALL immediate siblings are selected
            if (selectedSiblings === totalSiblings) {
                this.selections[parentKey].selected = true;
            } else {
                this.selections[parentKey].selected = false;
            }
        },
    },
};
</script>

<style scoped>
.checkbox-tree-item {
    border-left: 1px solid #e9ecef;
    padding-left: 1rem;
}

.checkbox-tree-item:last-child {
    border-left: none;
}

.collapse-btn {
    width: 24px;
    height: 24px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
    line-height: 1;
    border-radius: 4px;
}

.collapse-btn:hover {
    background-color: #e9ecef;
    border-color: #adb5bd;
}
</style>