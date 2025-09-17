<template>
  <i :class="{ 'custom-icon': !inline, 'custom-icon__big': big, 'custom-icon__inline': inline }">
    <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink">
      <path
        d="M15.7,4 C18.87,4 21,6.98 21,9.76 C21,15.39 12.16,20 12,20 C11.84,20 3,15.39 3,9.76 C3,6.98 5.13,4 8.3,4 C10.12,4 11.31,4.91 12,5.71 C12.69,4.91 13.88,4 15.7,4 Z"
        stroke="#007685" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
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
    }
  }
}
</script>