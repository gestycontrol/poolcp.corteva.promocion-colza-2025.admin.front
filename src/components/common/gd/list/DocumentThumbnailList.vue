<template>
    <div class="row g-3">
        <template v-if="documents && documents.length == 0">
            <div class="col-12">
                <div class="border p-2 text-center">
                    {{ i18n('No items.') }}
                </div>
            </div>
        </template>
        <DocumentThumbnailListItem :itemClass="itemClass" :write="write" v-for="document in documents"
            :document="document" :key="document.id" @deleted="$emit('deleted', $event)" @edit="$emit('edit', $event)"
            @opened="opened" @move="$emit('move', $event)" :sortMetadata="sortMetadata" :sortable="sortable"
            :customActions="customActions" />
    </div>
    <VideoModal :video="selectedDocument" @hidden="selectedDocument = null" ref="VideoModal"
        v-if="selectedDocument && selectedDocument.is_video" :navigation="hasMoreThanOneModal" @next="next"
        @prev="prev" />
    <ImageModal :image="selectedDocument" @hidden="selectedDocument = null" ref="ImageModal"
        v-if="selectedDocument && selectedDocument.is_image" :navigation="hasMoreThanOneModal" @next="next"
        @prev="prev" />
</template>

<script>
import DocumentThumbnailListItem from "@/components/common/gd/list/DocumentThumbnailListItem.vue";
import EmptyListItem from "@/components/common/list/EmptyListItem.vue";
import VideoModal from "@/components/common/multimedia/VideoModal.vue";
import ImageModal from "@/components/common/multimedia/ImageModal.vue";

export default {
    components: {
        DocumentThumbnailListItem,
        EmptyListItem,
        VideoModal,
        ImageModal,
    },
    data() {
        return {
            selectedDocument: null,
        };
    },
    emits: [
        'deleted',
        'edit',
        'move',
    ],
    props: {
        documents: {
            type: Array,
            default() {
                return [];
            },
        },
        write: Boolean,
        sortMetadata: String,
        sortable: Boolean,
        itemClass: String,
        customActions: [Function, Array],
    },
    computed: {
        hasMoreThanOneModal() {
            return this.documents.filter(d =>
                (d.is_image || d.is_video) && !d.name.toLowerCase().endsWith('.mov')
            ).length > 1;
        },
    },
    methods: {
        next() {
            if (!this.selectedDocument) return;
            let index = this.documents.map(d => d.id).indexOf(this.selectedDocument.id),
                new_index = null;

            this.documents.forEach((d, i) => {
                if ((!d.is_image && !d.is_video) || d.name.toLowerCase().endsWith('.mov')) return;

                if (new_index === null) {
                    new_index = i;
                }

                if (i > index && new_index <= index) {
                    new_index = i;
                }
            });

            if (this.$refs['VideoModal']) this.$refs['VideoModal'].hide();
            if (this.$refs['ImageModal']) this.$refs['ImageModal'].hide();

            this.$nextTick(() => {
                this.opened(this.documents[new_index]);
            });
        },
        prev() {
            if (!this.selectedDocument) return;
            let reversedDocuments = this.documents.slice().reverse(),
                index = reversedDocuments.map(d => d.id).indexOf(this.selectedDocument.id),
                new_index = null;

            reversedDocuments.forEach((d, i) => {
                if ((!d.is_image && !d.is_video) || d.name.toLowerCase().endsWith('.mov')) return;

                if (new_index === null) {
                    new_index = i;
                }

                if (i > index && new_index <= index) {
                    new_index = i;
                }
            });

            if (this.$refs['VideoModal']) this.$refs['VideoModal'].hide();
            if (this.$refs['ImageModal']) this.$refs['ImageModal'].hide();

            this.$nextTick(() => {
                this.opened(reversedDocuments[new_index]);
            });
        },
        opened(document) {
            if (document.is_video &&
                !document.name.toLowerCase().endsWith('.mov')) {
                this.selectedDocument = document;

                this.$nextTick(() => {
                    if (!this.$refs['VideoModal']) return;
                    this.$refs['VideoModal'].show();
                });

                return;
            } else if (document.is_image) {
                this.selectedDocument = document;

                this.$nextTick(() => {
                    if (!this.$refs['ImageModal']) return;
                    this.$refs['ImageModal'].show();
                });

                return;
            }

            window.open(document.url);
        },
    },
};
</script>

<style lang="scss" scoped>
.img-thumbnail {
    aspect-ratio: 1/1;
    width: 100%;
    object-fit: cover;
}
</style>