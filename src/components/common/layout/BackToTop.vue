<template>
    <div @click="scrollToTop()" :class="['back-to-top-btn', { 'go-top': isTop }]">
        <ChevronUpIcon />
    </div>
</template>

<script>
import ChevronUpIcon from "@/assets/svg/chevron-up.vue";
export default {
    components: {
        ChevronUpIcon,
    },
    name: 'BackToTop',
    data() {
        return {
            isTop: false
        }
    },
    methods: {
        scrollToTop() {
            window.scrollTo(0, 0);
        },
    },
    mounted() {
        const that = this
        window.addEventListener('scroll', () => {
            let scrollPos = window.scrollY
            if (scrollPos >= 100) {
                that.isTop = true
            } else {
                that.isTop = false
            }
        })
    }
}
</script>

<style lang="scss" scoped>
.back-to-top-btn {
    position: fixed;
    cursor: pointer;
    bottom: -100px;
    right: 14px;
    color: var(--bs-white);
    background-color: var(--bs-primary);
    z-index: 10000;
    width: 32px;
    text-align: center;
    height: 32px;
    opacity: 0;
    visibility: hidden;
    border-radius: 3px;
    font-size: 22px;
    transition: .6s;
    overflow: hidden;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);

    &.go-top {
        opacity: 0.75;
        visibility: visible;
        bottom: 58px;
    }

    &:hover {
        color: var(--bs-white);
        opacity: 1;
        transition: .6s;
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
        transform: translateY(-5px);
    }
}
</style>