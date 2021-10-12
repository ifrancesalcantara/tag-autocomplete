<template>
  <div>
    <div
      class="editor show-spaces"
      :id="elementId"
      :ref="elementId"
      contenteditable
      @input="(e) => textValue = e.srcElement.innerText"
      :placeholder="placeholder || $t('default_content.textarea_placeholder')"
      @keypress="handleInputKeyPress"
      @click="handleMoveAttempt"
    />
    <v-menu v-if="loading || tags.length" v-model="show" :position-x="positionX" :nudge-bottom="nudgeBottom">
      <v-list class="pt-1 pb-0" :class="{ 'full-width': xsOnly, 'min-width-300px': smAndUp, 'min-height-100px': loading }">
        <v-list-item v-for="tag in tags" :key="tag.id" @click="addTag(tag.text)" :class="{ 'active-tag': addingTag && addingTag.text === tag.text }">
          <v-list-item-title>#{{ tag.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import { getChangedWordDataOnInput } from '@/lib/Text'
import { setCaretPosition } from '@/lib/Core'
import { generateUUID } from '@/lib/UUID'

import vuetifyMixins from '@/mixins/Vuetify'

export default {
  props: {
    placeholder: String,
    autoGrow: Boolean,
    autofocus: Boolean,
    rows: Number
  },
  data: () => ({
    elementId: null,
    addingTag: null,
    modifyingWord: {
      text: '',
      startIndex: null,
      endIndex: null
    },
    textValue: '',
    loading: false,
    nudgeBottom: 0,
    positionX: 0,
    show: false
  }),
  computed: {
    ...mapState({
      tags: ({ tags }) => tags.list
    }),
    addingTagIndex () {
      return this.tags.findIndex((tag) => this.addingTag === tag)
    }
  },
  methods: {
    addTag (tagText) {
      let newTextValue = this.textValue.split('')
      newTextValue.splice(this.modifyingWord.startIndex, this.modifyingWord.text.split('').length, '#' + tagText)
      this.textValue = newTextValue.join('')
      this.getInnerHTML()
      this.moveCaret(tagText)
      this.show = false
    },
    handleInputKeyPress (e) {
      if (['Enter', ' '].includes(e.key)) {
        if (this.show && this.addingTag) {
          e.preventDefault()
          this.addTag(this.addingTag.text)
        } else if (this.modifyingWord.text.startsWith('#')) {
          e.preventDefault()
          this.addTag(this.modifyingWord.text.replace('#', ''))
        }
      }
    },
    handleMoveAttempt (e) {
      if (this.show && ['ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault()
        if (!this.show || this.loading) return
        const nextTag = this.tags[this.addingTagIndex + 1]
        const prevTag = this.tags[this.addingTagIndex - 1]
        if (e.key === 'ArrowDown') this.addingTag = nextTag || prevTag
        else if (e.key === 'ArrowUp') this.addingTag = prevTag || nextTag
      }
      else if (['ArrowLeft', 'ArrowRight'].includes(e.key) || e.type === 'click') {
        if (this.modifyingWord.text.startsWith('#')) {
          this.addTag(this.modifyingWord.text.replace('#', ''))
          e.preventDefault()
        }
      }
    },
    getInnerHTML () {
      const html = this.textValue.split('\n').map((p) => 
        p.split(' ').map((w, i) => 
          w.startsWith('#') && w !== '#'
            ? `<span class="active-tag" contentEditable="false">${w.trim()}</span>${ i === p.split(' ').length - 1 ? ' ' : ''}`
            : w.trim()
        ).join(' ')
      ).join('\n')
      this.$refs[this.elementId].innerHTML = html
    },
    moveCaret (tagText) {
      let editedTagElementIndex
      this.$refs[this.elementId].childNodes.forEach((node, i) => {
        if (node.textContent === `#${tagText}`) {
          editedTagElementIndex = i
        }
      })
      this.$nextTick(() => {
        setCaretPosition({ el: this.$refs[this.elementId], childNum: editedTagElementIndex + 1, charNum: 1 })
      })
    }
  },
  watch: {
    textValue (newValue, oldValue) {
      this.$emit('change', newValue)
      if (oldValue && Math.abs(newValue.split('').length - oldValue.split('').length) > 1) {
        this.show = false
        return
      }
      this.modifyingWord = getChangedWordDataOnInput({ newValue, oldValue })
      if (this.modifyingWord.text.startsWith('#') && this.modifyingWord.text !== '#') {
        if (!this.show) this.show = true
      } else {
        this.show = false
      }
    },
    show (v) {
      if (v) {
        this.positionX = this.$refs[this.elementId].offsetLeft
        this.nudgeBottom = this.$refs[this.elementId].offsetTop + this.$refs[this.elementId].clientHeight

        this.loading = true
        this.$store.dispatch('tags/list', { search: this.modifyingWord.text.replace('#', ''), save: true })
          .then(tags => {
            this.addingTag = tags[0]
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        this.addingTag = null
        this.modifyingWord = {
          text: '',
          startIndex: null,
          endIndex: null
        }
        this.$store.commit('tags/resetList')
      }
    }
  },
  created () {
    this.elementId = generateUUID()
    window.addEventListener('keydown', this.handleMoveAttempt)
  },
  mixins: [vuetifyMixins],
  beforeDestroy () {
    window.removeEventListener('keydown', this.handleMoveAttempt)
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .active-tag {
    color: rgb(29, 155, 240);
  }
}
[contenteditable][placeholder]:empty:before {
  background-color: transparent;
  content: attr(placeholder);
  position: absolute;
  color: gray;
}
.editor {
  outline: 0px solid transparent;
  padding: 12px 0;
}
.v-menu__content {
  box-shadow: rgb(101 119 134 / 20%) 0px 0px 15px, rgb(101 119 134 / 15%) 0px 0px 3px 1px;
}
.v-list {
  z-index: 1;
  .v-list-item  {
    &.active-tag {
      background-color: rgb(247, 249, 249);
    }
  }
}
</style>