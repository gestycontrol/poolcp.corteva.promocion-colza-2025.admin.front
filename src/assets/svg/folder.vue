<template>
    <i :class="{ 'custom-icon': !inline, 'custom-icon__big': big, 'custom-icon__inline': inline }">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 22 22">
            <path fill="currentColor"
                d="M.79451734 3.01709682c-.21142856 0-.38164.17021144-.38164.38164v15.5728202l21.18102.0457968V5.65232102c0-.21142856-.17021144-.38164-.38164-.38164H9.73061794c-.38908198.0343476-.43907682-.0171738-.63123256-.2738267-.27268178-.36484784-.68428052-1.3471892-.95257344-1.70383178-.21543578-.31160906-.25035584-.27535326-.60757088-.27535326z" />
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