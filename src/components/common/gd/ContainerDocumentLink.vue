<template>
  <template v-for="document in documents" :key="document.id">
    <a class="text-start btn btn-link btn-sm ps-0 pe-0 text-decoration-underline" :href="document.url" target="_blank">
      {{ (label ? label : (byName ? document.name : document.documentType.name)) }}
    </a>
  </template>
</template>

<script>
import api from "@/api.js";

export default {
  components: {},
  props: {
    label: String,
    documentTypeCodes: Array,
    matchingMetadata: Object,
    containerType: String,
    containerReference: String,
    sort: Function,
    byName: Boolean,
    updateKey: [Number, String,],
  },
  data() {
    return {
      documents: [],
      container: null,
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
    updateKey() {
      this.setContainer();
    },
  },
  computed: {
    orderedDocuments() {
      if (!this.sort) return this.documents;
      return this.documents.sort(this.sort);
    },
  },
  methods: {
    count() {
      return this.documents.length;
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

      return !this.documentTypeCodes ||
        this.documentTypeCodes.indexOf(d.documentType.code) != -1;
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
          this.$emit('countChanged', this.documents.length);
        });
      });
    },
  }
};
</script>