<template>
  <i :class="{ 'custom-icon': !inline, 'custom-icon__big': big, 'custom-icon__inline': inline }">
    <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id>
          <polyline stroke="#171C47" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
            points="16 14 18 12 16 10"></polyline>
          <path
            d="M18,21 L6,21 C4.34314575,21 3,19.6568542 3,18 L3,6 C3,4.34314575 4.34314575,3 6,3 L18,3 C19.6568542,3 21,4.34314575 21,6 L21,18 C21,19.6568542 19.6568542,21 18,21 Z"
            stroke="#171C47" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          <line x1="18" y1="12" x2="6" y2="12" stroke="#171C47" stroke-width="1.5" stroke-linecap="round"
            stroke-linejoin="round"></line>
          <polyline stroke="#171C47" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
            points="8 10 6 12 8 14"></polyline>
        </g>
      </g>
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