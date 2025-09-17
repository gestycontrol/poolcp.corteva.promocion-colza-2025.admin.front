<template>
    <div class="table-responsive">
        <table class="table border">
            <caption class="sr-only" data-no-export>{{ i18n('Document list') }}</caption>
            <thead>
                <tr>
                    <th scope="col" v-if="!minimal">{{ i18n('ID') }}</th>
                    <th scope="col" v-if="!minimal">{{ i18n('Type') }}</th>
                    <th scope="col" v-if="!minimal">{{ i18n('Remarks') }}</th>
                    <th scope="col">{{ i18n('Registration Date') }}</th>
                    <th scope="col">{{ i18n('Name') }}</th>
                    <th scope="col">{{ i18n('User') }}</th>
                    <th scope="col">{{ i18n('File') }}</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                <EmptyListItem v-if="!documents || documents.length == 0" :colspan="5 + (minimal ? 0 : 3)" />
                <DocumentListItem :itemClass="itemClass" :write="write" v-for="document in documents"
                    :document="document" :key="document.id" @deleted="$emit('deleted', $event)" :minimal="minimal"
                    @edit="$emit('edit', $event)" @move="$emit('move', $event)" @click="$emit('click', $event)"
                    :customClick="customClick" :sortMetadata="sortMetadata" :sortable="sortable"
                    :customActions="customActions" />
            </tbody>
        </table>
    </div>
</template>

<script>
import DocumentListItem from "@/components/common/gd/list/DocumentListItem.vue";
import EmptyListItem from "@/components/common/list/EmptyListItem.vue";

export default {
    components: {
        DocumentListItem,
        EmptyListItem,
    },
    emits: [
        'deleted',
        'edit',
        'click',
        'move',
    ],
    props: {
        minimal: Boolean,
        documents: {
            type: Array,
            default() {
                return [];
            },
        },
        write: Boolean,
        customClick: Boolean,
        sortMetadata: String,
        sortable: Boolean,
        itemClass: String,
        customActions: [Function, Array],
    },
};
</script>