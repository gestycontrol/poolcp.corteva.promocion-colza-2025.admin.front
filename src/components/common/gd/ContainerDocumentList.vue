<template>
  <template v-if="loaded && ((documents && documents.length > 0) || (container && (!readonly && container.can_write)))">
    <div class="row align-items-center" :class="panelClass">
      <div class="col" v-if="label">
        <h3 :class="labelClass">
          {{ label }}{{ pseudoRequired || required ? '*' : '' }}
          <template v-if="labelCounter">
            <span class="small text-muted">({{ documents.length }})</span>
          </template>
        </h3>
      </div>
      <div class="col">
        <div class="text-end">
          <slot name="buttons"></slot>
          <template v-if="actions == null">
            <DocumentCreateAction :container="container" @added="added" :documentTypeCodes="documentTypeCodes"
              :defaultMetadata="matchingMetadata" :title="title" :maxImageSideSize="maxImageSideSize"
              v-if="container && (!readonly && container.can_write) && (!maxDocumentCount || (!documents || documents.length < maxDocumentCount))"
              :multiple="multiple" :sortMetadata="!sort ? sortMetadata : null" />
          </template>
          <template v-else>
            <template v-for="(action, actionIndex) in actions">
              <DocumentCreateAction :container="container" @added="added" :key="actionIndex"
                :documentTypeCodes="action.documentTypeCodes ? action.documentTypeCodes : documentTypeCodes"
                :defaultMetadata="action.matchingMetadata ? action.matchingMetadata : matchingMetadata"
                :title="action.title ? action.title : title"
                :maxImageSideSize="action.maxImageSideSize ? actions.maxImageSideSize : maxImageSideSize"
                v-if="container && (!readonly && container.can_write) && (!maxDocumentCount || (!documents || documents.length < maxDocumentCount))"
                :multiple="action.multiple != undefined ? action.multiple : multiple"
                :sortMetadata="!sort ? sortMetadata : null" />
            </template>
          </template>
        </div>
      </div>
    </div>
    <div :class="documentListClass">
      <DocumentList :itemClass="itemClass" :documents="orderedDocuments" @deleted="deleted"
        :write="(!readonly && container.can_write)" @move="moveDocument" :sortMetadata="!sort ? sortMetadata : null"
        :sortable="!sort && sortable" v-if="container && !thumbnails" :minimal="minimal" @edit="edit"
        :customActions="customActions" />
      <DocumentThumbnailList :itemClass="itemClass" :documents="orderedDocuments" @deleted="deleted"
        :write="(!readonly && container.can_write)" @move="moveDocument" :sortMetadata="!sort ? sortMetadata : null"
        :sortable="!sort && sortable" v-if="container && thumbnails" @edit="edit" :customActions="customActions" />
      <DocumentEditModal :container="container" ref="DocumentEditModal" :documentTypeCodes="documentTypeCodes"
        v-if="container && selectedDocument" :document="selectedDocument" />
    </div>
  </template>
  <template v-else-if="withLoader && !loaded">
    <h3 :class="labelClass" v-if="label">
      {{ label }}
      <template v-if="labelCounter">
        <span class="small text-muted">(...)</span>
      </template>
    </h3>
    <div class="p-3 text-center w-100">
      <span class="spinner-border spinner-border-sm" role="status">
        <span class="visually-hidden">{{ i18n('Loading...') }}</span>
      </span>
    </div>
  </template>
  <template v-else-if="loaded && displayNoElements">
    <h3 :class="labelClass" v-if="label">
      {{ label }}
      <template v-if="labelCounter">
        <span class="small text-muted">(0)</span>
      </template>
    </h3>
    <p class="mb-0">
      <span class="small">{{ i18n('No results.') }}</span>
    </p>
  </template>
</template>

<script>
import api from "@/api.js";
import DocumentCreateAction from "@/components/common/gd/create/DocumentCreateAction.vue";
import DocumentList from "@/components/common/gd/list/DocumentList.vue";
import DocumentThumbnailList from "@/components/common/gd/list/DocumentThumbnailList.vue";
import DocumentEditModal from "@/components/common/gd/create/DocumentEditModal.vue";

export default {
  components: {
    DocumentCreateAction,
    DocumentList,
    DocumentThumbnailList,
    DocumentEditModal,
  },
  props: {
    minimal: {
      type: Boolean,
      default: true,
    },
    withLoader: {
      type: Boolean,
      default: true,
    },
    displayNoElements: {
      type: Boolean,
      default: false,
    },
    panelClass: {
      type: String,
      default: 'mb-2 mt-4',
    },
    documentListClass: {
      type: String,
      default: '',
    },
    multiple: Boolean,
    actions: Array,
    thumbnails: Boolean,
    label: {
      type: String,
    },
    labelClass: {
      type: String,
      default: 'h6',
    },
    labelCounter: {
      type: Boolean,
      default: false,
    },
    pseudoRequired: Boolean,
    required: Boolean,
    title: {
      type: String,
    },
    documentTypeCodes: Array,
    matchingMetadata: Object,
    maxImageSideSize: {
      type: Number,
    },
    maxDocumentCount: {
      type: Number,
    },
    containerType: String,
    containerReference: [String, Number],
    readonly: Boolean,
    sort: Function,
    sortMetadata: String,
    sortable: Boolean,
    itemClass: String,
    customActions: [Function, Array],
    onlyShowLatestVersion: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      documents: [],
      container: null,
      selectedDocument: null,
      loaded: false,
    };
  },
  emits: [
    'added',
    'countChanged',
  ],
  mounted() {
    this.setContainer();
  },
  watch: {
    containerType() {
      this.setContainer();
    },
    containerReference() {
      this.setContainer();
    },
  },
  computed: {
    labelOrDefault() {
      if (this.label === undefined) {
        return this.i18n('Documents');
      }

      return this.label;
    },
    titleOrDefault() {
      if (this.title === undefined) {
        return this.i18n('Add Document');
      }

      return this.title;
    },
    filteredDocuments() {
      if (!this.onlyShowLatestVersion) return this.documents;

      let result = this.documents.reduce((acc, document) => {
        if (!acc[document.documentType.code] || new Date(document.uploaded) > new Date(acc[document.documentType.code].uploaded)) {
          acc[document.documentType.code] = document;
        }
        return acc;
      }, {});

      return Object.values(result);
    },
    orderedDocuments() {
      let sortFunction = this.sort;

      if (!sortFunction && this.sortMetadata) {
        sortFunction = (a, b) => {
          if (!a.metadata[this.sortMetadata]) a.metadata[this.sortMetadata] = a.id;
          if (!b.metadata[this.sortMetadata]) b.metadata[this.sortMetadata] = b.id;

          let a_value = a.metadata[this.sortMetadata],
            b_value = b.metadata[this.sortMetadata];

          if ((a_value === null || a_value === undefined || !isNaN(a_value * 1)) &&
            (b_value === null || b_value === undefined || !isNaN(b_value * 1))) {
            a_value = a_value ? a_value * 1 : 0;
            b_value = b_value ? b_value * 1 : 0;
          }

          return a_value > b_value ? 1 : -1;
        };
      }

      if (!sortFunction) return this.filteredDocuments;

      return this.filteredDocuments.sort(sortFunction);
    },
  },
  methods: {
    getDocuments() {
      return this.documents;
    },
    count() {
      return this.documents.length;
    },
    edit(document) {
      this.selectedDocument = document;

      this.$nextTick(() => {
        if (!this.$refs['DocumentEditModal']) return;
        this.$refs['DocumentEditModal'].show();
      });
    },
    added(data) {
      this.documents.push(data);
      this.$emit('added', data);
      this.$emit('countChanged', this.documents.length);
    },
    deleted(id) {
      let index = this.documents.map(e => e.id).indexOf(id);

      if (index !== -1) {
        this.documents.splice(index, 1);
      }

      this.$emit('countChanged', this.documents.length);
    },
    moveDocument(event) {
      let document = event.document,
        position = event.position,
        orderedDocumentIds = this.orderedDocuments.map(d => d.id);

      if (position > orderedDocumentIds.length) position = orderedDocumentIds.length;
      orderedDocumentIds.splice(orderedDocumentIds.indexOf(document.id), 1);
      orderedDocumentIds.splice(position - 1, 0, document.id);

      orderedDocumentIds.forEach((id, index) => {
        this.documents.filter(d => d.id == id).forEach(d => {
          d.metadata[this.sortMetadata] = '' + (index + 1);

          api.put(
            `${api.urls.gd}containers/${this.container.code}/documents/${d.id}/metadata/${this.sortMetadata}`, {
            value: d.metadata[this.sortMetadata]
          });
        });
      });
    },
    filterDocument(d) {
      if (this.matchingMetadata) {
        let missing_metadata = false;

        Object.keys(this.matchingMetadata).forEach(key => {
          if (!d.metadata ||
            d.metadata[key] != this.matchingMetadata[key])
            missing_metadata = true;
        });

        if (missing_metadata) {
          return false;
        }
      }

      return !this.documentTypeCodes
        || this.documentTypeCodes.indexOf(d.documentType.code) != -1;
    },
    setContainer() {
      api.post(api.urls.gd + 'containers', {
        'container_type_code': this.containerType,
        'reference': this.containerReference,
      }).then(container => {
        this.container = container;

        api.get(api.urls.gd + 'containers/' + container.code + '/documents').then(documents => {
          this.documents = documents.filter(d => {
            return this.filterDocument(d);
          });

          this.$nextTick(() => {
            this.$emit('countChanged', this.documents.length);
            this.loaded = true;
          });
        }).catch(() => {
          this.loaded = true;
        });
      }).catch(() => {
        this.loaded = true;
      });
    },
  }
};
</script>