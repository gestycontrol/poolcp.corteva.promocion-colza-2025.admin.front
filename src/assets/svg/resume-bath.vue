<template>
  <i :class="{ 'custom-icon': !inline, 'custom-icon__big': big, 'custom-icon__inline': inline }">
    <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g>
          <g stroke-linecap="round" stroke-linejoin="round" transform="translate(2.775000, 3.000000)" stroke="#171C47"
            stroke-width="1.5">
            <path
              d="M6.225,5 L6.225,5 C6.225,2.239 8.464,0 11.225,0 L11.225,0 C13.986,0 16.225,2.239 16.225,5 L16.225,18">
            </path>
            <path
              d="M8.641,9.748 L3.809,9.748 C2.729,9.748 1.966,8.69 2.308,7.665 L2.308,7.665 C2.838,6.073 4.327,5 6.005,5 L6.445,5 C8.122,5 9.612,6.073 10.142,7.665 L10.142,7.665 C10.484,8.69 9.721,9.748 8.641,9.748 L8.641,9.748 Z">
            </path>
            <line x1="6.225" y1="17" x2="6.225" y2="18"></line>
            <line x1="6.225" y1="14" x2="6.225" y2="13"></line>
            <line x1="12.225" y1="16.65" x2="11.675" y2="15.82"></line>
            <line x1="9.465" y1="12.5" x2="10.015" y2="13.33"></line>
            <line x1="2.985" y1="12.5" x2="2.435" y2="13.33"></line>
            <line x1="0.775" y1="15.82" x2="0.225" y2="16.65"></line>
          </g>
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