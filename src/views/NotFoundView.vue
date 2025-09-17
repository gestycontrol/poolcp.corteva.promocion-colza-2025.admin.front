<template>
  <ApiViewWrapper :allowAnonymous="false" :notFound="true" />
</template>

<script>
import ApiViewWrapper from "@/components/common/view/ApiViewWrapper.vue";

export default {
  components: {
    ApiViewWrapper,
  },
  data() {
    return {}
  },
  watch: {},
  methods: {}
};
</script>

<style lang="scss"></style>