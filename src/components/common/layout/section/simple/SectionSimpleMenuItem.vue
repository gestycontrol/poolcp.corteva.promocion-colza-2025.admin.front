<script>
import { defineComponent, h, toRefs } from 'vue';

export default defineComponent({
    props: {
        selected: {
            type: Boolean,
            default: false,
        },
        sectionType: {
            type: String,
            default: 'top',
        },
    },
    emits: ['click'],
    setup(props, { emit, slots }) {
        const { selected, sectionType, } = toRefs(props);

        const emitClick = () => {
            emit('click');
        };

        return () => {
            const cssClasses = [
                'nav-item',
            ];

            if (sectionType.value === 'aside') {
                cssClasses.push('border-bottom');
            }

            return h('li', { class: cssClasses.join(' ') }, [
                h('a', {
                    class: {
                        'nav-link px-2': true,
                        active: selected.value,
                    },
                    href: 'javascript:void(0)',
                    onClick: emitClick,
                }, slots.default && slots.default())
            ]);
        };
    },
});
</script>