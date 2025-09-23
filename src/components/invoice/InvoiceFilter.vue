<template>
  <div class="row mb-3 align-items-center">
    <div class="col-6 col-sm-8">
      <slot></slot>
    </div>
    <div class="col-6 col-sm-4 text-end">
      <button @click="showFilters = !showFilters" :class="btnClass">
        <span v-if="!showFilters">{{ i18n('Show filters') }}</span>
        <span v-if="showFilters">{{ i18n('Hide filters') }}</span>
      </button>
      <slot name="buttons"></slot>
    </div>
  </div>
  <Transition>
    <div class="filters" v-if="showFilters">
      <div class="p-2 border bg-white">
        <div class="row g-2">
            <div class="col-12 col-sm-6 col-lg-4">
                <Field type="text" v-model="filters.name" :label="i18n('Name')" />
            </div>
            <div class="col-12 col-sm-6 col-lg-4">
                <Field type="dictionary" v-model="filters.is_valid" :label="i18n('Is Valid')" format="boolean" :hash="{1: i18n('Yes'), 0: i18n('No'), [-1]: i18n('Pending')}" />
            </div>
            <div class="col-12 col-sm-6 col-lg-4">
                <Field type="date" v-model="filters.created_at" :label="i18n('Created')" format="datetime" />
            </div>
        </div>
      </div>
    </div>
  </Transition>
  <Transition>
    <FilterBadgeList v-if="!showFilters" :filters="filters" />
  </Transition>
</template>

<script>
import Field from "@/components/common/form/Field.vue";
import FilterBadgeList from "@/components/common/list/FilterBadgeList.vue";

export default {
  components: {
    Field,
    FilterBadgeList,
  },
  props: {
    btnClass: {
      type: String,
      default: 'btn btn-sm btn-outline-dark',
    },
    filters: {
      type: Object,
      default() {
        return {};
      },
    }
  },
  data() {
    return {
      showFilters: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: all 200ms ease-in-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  overflow: hidden;
  max-height: 0;
}

.v-enter-to,
.v-leave-from {
  opacity: 1;
  overflow: hidden;
  max-height: 900px;
}
</style>
