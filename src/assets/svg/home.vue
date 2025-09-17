<template>
  <i :class="{
    'custom-icon': !inline,
    'custom-icon__big': big,
    'custom-icon__inline': inline,
  }">
    <svg :id="`svg-${randomId}`" version="1.1" width="16px" height="16px" viewBox="0 0 16.0 16.0"
      xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <clipPath :id="`i0-${randomId}`">
          <path d="M16,0 L16,16 L0,16 L0,0 L16,0 Z"></path>
        </clipPath>
        <clipPath :id="`i1-${randomId}`">
          <path
            d="M6.39946108,1.40616982 L12.7989222,7.93131977 L12.7989222,12.5065374 C12.7989222,13.4074726 12.0826381,14.1378249 11.1990569,14.1378249 L1.59986526,14.1378249 C0.716284079,14.1378249 0,13.4074726 0,12.5065374 L0,7.93131977 L6.39946108,1.40616982 Z M11.1990569,0 C11.4935839,0 11.7323453,0.243450762 11.7323453,0.543762496 L11.7323453,4.35009998 L9.59919161,2.17504998 L9.59919161,0.543762496 C9.59919161,0.243450762 9.83795298,0 10.1324801,0 L11.1990569,0 Z">
          </path>
        </clipPath>
        <clipPath :id="`i2-${randomId}`">
          <path
            d="M8.75406984,0.318412586 L15.8436061,7.54610368 C16.0521313,7.75872441 16.0521313,8.10345069 15.8436061,8.31607139 C15.635081,8.5286921 15.2969949,8.5286921 15.0884697,8.31607139 L8,1.08729276 L0.91153028,8.31607139 C0.703005117,8.5286921 0.364919032,8.5286921 0.156393871,8.31607139 C-0.0521312902,8.10345069 -0.0521312902,7.75872441 0.156393871,7.54610368 L7.24593016,0.318412586 C7.66242827,-0.106137529 8.33757174,-0.106137529 8.75406984,0.318412586 Z">
          </path>
        </clipPath>
      </defs>
      <g :clip-path="`url(#i0-${randomId})`">
        <g transform="translate(0.0 0.9999999999999947)">
          <g transform="translate(1.6005389227441364 0.8621750826243897)">
            <g :clip-path="`url(#i1-${randomId})`">
              <polygon points="0,0 12.7989222,0 12.7989222,14.1378249 0,14.1378249 0,0" stroke="none"
                fill="currentColor">
              </polygon>
            </g>
          </g>
          <g :clip-path="`url(#i2-${randomId})`">
            <polygon points="0,0 16,0 16,8.47553692 0,8.47553692 0,0" stroke="none" fill="currentColor"></polygon>
          </g>
        </g>
      </g>
    </svg>
  </i>
</template>
<script>
import randomIdMixin from '@/mixins/common/randomIdMixin';

export default {
  mixins: [randomIdMixin],
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