<template>
    <div class="form-outline">
        <div class="input-group">
            <div :class="{ 'form-floating': true, 'focus': smallLabel, 'position-relative': true }">
                <div class="toolbar-container" v-if="!disabled">
                    <div class="toolbar">
                        <button type="button" @click="applyStyle('bold')"><b>B</b></button>
                        <button type="button" @click="applyStyle('italic')"><i>I</i></button>
                        <button type="button" @click="applyStyle('underline')"><u>U</u></button>
                    </div>
                </div>

                <div :contenteditable="!disabled" ref="editable"
                    :class="['form-control', 'editable-content', { disabled }]" @input="onInput" @paste="onPaste"
                    @blur="onBlur" @focus="$emit('focus')"></div>

                <label :for="id" v-if="label">
                    <Tooltip :title="tooltip" v-if="tooltip">
                        {{ label + (required || pseudoRequired ? '*' : '') }}
                    </Tooltip>
                    <template v-else>
                        {{ label + (required || pseudoRequired ? '*' : '') }}
                    </template>
                </label>

                <div class="bg"></div>

                <div class="text-danger small ms-1 mt-1" v-if="customErrorMessage">
                    {{ customErrorMessage }}
                </div>
            </div>

            <slot></slot>
        </div>
    </div>
</template>

<script>
import vModelMixin from '@/mixins/common/vModelMixin.js'
import fieldMixin from '@/mixins/common/fieldMixin.js'

export default {
    mixins: [vModelMixin, fieldMixin],
    props: {
        resettable: { type: Boolean, default: false },
        type: { type: String, default: 'text' },
        step: { type: String, default: '1' },
        smallLabel: { type: Boolean, default: false },
        pattern: { type: String, default: '' },
        maxlength: { type: Number },
        rows: { type: Number, default: 10 },
        disabled: { type: Boolean, default: false },
    },
    data() {
        return {
            overrideErrorMessage: '',
            lastEmittedValue: null,
            pendingExternalHtml: null,
        }
    },
    mounted() {
        if (!this.$refs.editable) return

        const initial = this.sanitizeHtml(this.modelValue || '')

        this.$refs.editable.innerHTML = initial
        this.lastEmittedValue = initial

        if (initial !== this.modelValue) this.$emit('update:modelValue', initial)
    },
    computed: {
        customErrorMessage() {
            return this.overrideErrorMessage ? this.overrideErrorMessage : this.errorMessage
        },
    },
    watch: {
        modelValue(newVal) {
            const incoming = this.sanitizeHtml(newVal || '')

            if (incoming === this.lastEmittedValue) return

            const editable = this.$refs.editable

            if (!editable) return
            if (document.activeElement === editable) {
                this.pendingExternalHtml = incoming
                return
            }

            if (editable.innerHTML !== incoming) {
                editable.innerHTML = incoming
            }

            this.lastEmittedValue = incoming
        },
    },
    methods: {
        applyStyle(cmd) {
            if (this.disabled) return

            this.$refs.editable?.focus()
            document.execCommand(cmd, false, null)
            this.onInput()
        },
        resetInput() {
            if (this.$refs.editable) this.$refs.editable.innerHTML = ''

            this.lastEmittedValue = ''
            this.$emit('reset')
            this.$emit('update:modelValue', '')
        },
        onInput() {
            if (!this.$refs.editable) return

            const current = this.$refs.editable.innerHTML
            const normalized = this.sanitizeHtml(current)

            if (normalized !== this.lastEmittedValue) {
                this.lastEmittedValue = normalized
                this.$emit('update:modelValue', normalized)
            }
        },
        onBlur() {
            if (this.pendingExternalHtml && this.$refs.editable) {
                this.$refs.editable.innerHTML = this.pendingExternalHtml
                this.lastEmittedValue = this.pendingExternalHtml
                this.pendingExternalHtml = null
            }

            if (!this.$refs.editable) {
                this.$emit('blur')
                return
            }

            const current = this.$refs.editable.innerHTML
            const cleaned = this.sanitizeHtml(current)

            if (cleaned !== this.lastEmittedValue) {
                this.lastEmittedValue = cleaned
                this.$emit('update:modelValue', cleaned)
            }

            this.$emit('blur')
        },
        onPaste(e) {
            if (this.disabled) return

            e.preventDefault()

            const html = this.getClipboardHtml(e)
            const text = e.clipboardData.getData('text/plain')
            const fragment = html ? this.extractCfHtmlFragment(html) : null
            const cleaned = this.sanitizeHtml(fragment || this.escapeText(text))

            this.insertHtmlAtCaret(cleaned)

            const after = this.sanitizeHtml(this.$refs.editable.innerHTML)

            this.lastEmittedValue = after
            this.$emit('update:modelValue', after)
        },
        getClipboardHtml(e) {
            const types = e.clipboardData?.types || []
            if (types.includes('text/html')) return e.clipboardData.getData('text/html')
            return null
        },
        extractCfHtmlFragment(html) {
            const start = html.indexOf('<!--StartFragment-->')
            const end = html.indexOf('<!--EndFragment-->')
            if (start !== -1 && end !== -1 && end > start) {
                return html.slice(start + '<!--StartFragment-->'.length, end)
            }
            return html
        },
        insertHtmlAtCaret(html) {
            const el = this.$refs.editable

            el.focus()

            const sel = window.getSelection()

            if (!sel || sel.rangeCount === 0) {
                el.innerHTML += html
                return
            }

            const range = sel.getRangeAt(0)

            range.deleteContents()

            const temp = document.createElement('div')

            temp.innerHTML = html

            const frag = document.createDocumentFragment()
            let node, lastNode = null

            while ((node = temp.firstChild)) {
                lastNode = frag.appendChild(node)
            }

            range.insertNode(frag)

            if (lastNode) {
                const newRange = document.createRange()
                newRange.setStartAfter(lastNode)
                newRange.collapse(true)
                sel.removeAllRanges()
                sel.addRange(newRange)
            }
        },
        escapeText(s) {
            if (!s) return ''
            return s
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/\u00a0/g, ' ')
                .replace(/\r?\n/g, '<br>')
        },
        sanitizeHtml(input) {
            if (!input) return ''

            let html = String(input).replace(/&nbsp;/g, ' ')
                .replace(/[\r?\n]+/g, ' ')
                .replace(/<!--[\s\S]*?-->/g, '');

            const container = document.createElement('div')

            container.innerHTML = html

            const allowed = new Set(['B', 'I', 'U', 'A', 'BR'])
            const unwrapTags = new Set(['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI', 'TABLE', 'TBODY', 'TR', 'TD', 'TH', 'BLOCKQUOTE'])

            const cleanse = node => {
                if (node.nodeType === Node.TEXT_NODE) return
                if (node.nodeType !== Node.ELEMENT_NODE) {
                    node.remove()
                    return
                }
                const el = node
                const tag = el.tagName

                if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'META' || tag === 'LINK') {
                    el.remove()
                    return
                }

                if (tag === 'STRONG') {
                    const b = document.createElement('b')
                    b.innerHTML = el.innerHTML
                    el.replaceWith(b)
                    cleanse(b)
                    return
                }

                if (tag === 'EM') {
                    const i = document.createElement('i')
                    i.innerHTML = el.innerHTML
                    el.replaceWith(i)
                    cleanse(i)
                    return
                }

                if (tag === 'SPAN') {
                    const underline = (el.style.textDecoration || '').includes('underline')
                    const repl = underline ? document.createElement('u') : document.createDocumentFragment()
                    if (underline) repl.innerHTML = el.innerHTML
                    else while (el.firstChild) repl.appendChild(el.firstChild)
                    el.replaceWith(repl)
                    if (underline) cleanse(repl)
                    return
                }

                if (unwrapTags.has(tag)) {
                    if (tag === 'LI' || tag === 'P' || tag === 'DIV' || tag.startsWith('H')) {
                        // Añadir un <br> antes de extraer el contenido
                        const br = document.createElement('br')
                        el.insertBefore(br, el.firstChild)
                    }
                    const frag = document.createDocumentFragment()
                    while (el.firstChild) frag.appendChild(el.firstChild)
                    el.replaceWith(frag)
                    return
                }

                if (tag === 'A') {
                    const href = (el.getAttribute('href') || '').trim()
                    const safe = href && !/^javascript:/i.test(href) ? href : '#'
                    const a = document.createElement('a')
                    a.setAttribute('href', safe)
                    a.textContent = el.textContent || ''
                    el.replaceWith(a)
                    return
                }

                if (!allowed.has(tag)) {
                    const frag = document.createDocumentFragment()
                    while (el.firstChild) frag.appendChild(el.firstChild)
                    el.replaceWith(frag)
                    return
                }

                Array.from(el.attributes).forEach(attr => {
                    if (!(tag === 'A' && attr.name.toLowerCase() === 'href')) el.removeAttribute(attr.name)
                })

                Array.from(el.childNodes).forEach(cleanse)
            }

            Array.from(container.childNodes).forEach(cleanse)

            let out = container.innerHTML
            out = out.replace(/(\s*<br>\s*){3,}/gi, '<br><br>')
            // Eliminar <br> al inicio y al final del contenido
            out = out.replace(/^(<br\s*\/?>\s*)+/i, '')
            out = out.replace(/(\s*<br\s*\/?>\s*)+$/i, '')

            return out
        },
    },
}
</script>

<style scoped>
.toolbar-container {
    z-index: 10;
    position: absolute;
    top: 0.3rem;
    right: 0;
}

.toolbar button {
    margin-right: 5px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    padding: 5px;
    cursor: pointer;
}

.toolbar button:hover {
    background-color: #e0e0e0;
}

.editable-content {
    min-height: 10rem !important;
    border: 1px solid #ced4da;
    padding: 0.5rem;
    border-radius: 0.25rem;
    overflow: auto;
}

.editable-content.disabled {
    background-color: var(--bs-secondary-bg);
    pointer-events: none;
    opacity: 1;
}

.form-floating>[contenteditable="false"].disabled.form-control:not(:placeholder-shown)~label::after {
    background-color: transparent;
}
</style>