<template>
  <i :class="{ 'custom-icon': !inline, 'custom-icon__big': big, 'custom-icon__inline': inline }">
    <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g>
          <g stroke-linecap="round" stroke-linejoin="round" transform="translate(2.000000, 4.000000)" stroke="#171C47"
            stroke-width="1.5">
            <path
              d="M18,8.067 L2,8.067 C0.895,8.067 0,8.962 0,10.067 L0,13 C0,13.552 0.448,14 1,14 L19,14 C19.552,14 20,13.552 20,13 L20,10.067 C20,8.962 19.105,8.067 18,8.067 Z">
            </path>
            <path
              d="M1.5,8.13 L1.5,8.067 L1.5,8.067 C1.5,6.373 2.873,5 4.567,5 L6.9,5 C8.336,5 9.5,6.164 9.5,7.6 L9.5,8.067">
            </path>
            <path
              d="M9.5,8.067 L9.5,8.067 C9.5,6.373 10.873,5 12.567,5 L15.434,5 C17.128,5 18.501,6.373 18.501,8.067 L18.501,8.067 L18.501,8.13">
            </path>
            <path d="M2,6.39 L2,3 C2,1.343 3.343,0 5,0 L15,0 C16.657,0 18,1.343 18,3 L18,6.39"></path>
            <line x1="19" y1="14" x2="19" y2="16"></line>
            <line x1="1" y1="14" x2="1" y2="16"></line>
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