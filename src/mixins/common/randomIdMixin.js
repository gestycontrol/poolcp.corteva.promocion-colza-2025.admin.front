export default {
    data() {
        return {
            randomId: this.generateRandomId(),
        };
    },
    methods: {
        generateRandomId() {
            const array = new Uint32Array(2);
            window.crypto.getRandomValues(array);
            const timestamp = Date.now();
            const randomPart = Array.from(array).map(num => num.toString(36)).join('');

            return `${randomPart}${timestamp}`;
        },
    },
};
