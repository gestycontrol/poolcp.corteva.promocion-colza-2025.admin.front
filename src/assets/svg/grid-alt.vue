<template>
  <i :class="{
    'custom-icon': !inline,
    'custom-icon__big': big,
    'custom-icon__inline': inline,
  }">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
        fill="none"></rect>
      <line x1="9" y1="21" x2="9" y2="3" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
      </line>
      <line x1="15" y1="21" x2="15" y2="3" fill="none" stroke-linecap="round" stroke-linejoin="round"
        stroke-width="1.5">
      </line>
      <line x1="3" y1="9" x2="21" y2="9" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
      </line>
      <line x1="3" y1="15" x2="21" y2="15" fill="none" stroke-linecap="round" stroke-linejoin="round"
        stroke-width="1.5">
      </line>
    </svg>
  </i>
</template>
<script>
export default {
  props: {
    big: {
      type: Boolean,
      default: false,
    },
    inline: {
      type: Boolean,
      default: false,
    },
  },
};
</script>