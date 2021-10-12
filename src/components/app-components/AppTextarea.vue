<template>
  <div>
    <div
      class="editor"
      :id="elementId"
      :ref="elementId"
      contenteditable
      @input="(e) => textValue = e.srcElement.innerText"
      :placeholder="placeholder || $t('default_content.textarea_placeholder')"
      @keypress="onKeyPress"
    />
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    {{addingTagWordData}}
    <br>
    <br>
    <br>
    {{addingTag}}
    <v-menu v-if="loading || tags.length" v-model="show" :position-x="positionX" :nudge-bottom="nudgeBottom">
      <v-list class="pt-1 pb-0" :class="{ 'full-width': xsOnly, 'min-width-300px': smAndUp, 'min-height-100px': loading }">
        <v-list-item v-for="tag in tags" :key="tag.id" @click="(e) => addTag(tag, e)" :class="{ 'active-tag': addingTag && addingTag.text === tag.text }">
          <v-list-item-title>#{{ tag.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import { getChangedWordOnInputData } from '@/lib/Text'
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
    addingTagWordData: {
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
    addTag (tag, event) {
      let newTextValue = this.textValue.split('')
      newTextValue.splice(this.addingTagWordData.startIndex, this.addingTagWordData.text.split('').length, '#' + tag.text)
      this.textValue = newTextValue.join('')
      this.getInnerHTML()
      this.moveCaret()
      this.show = false
    },
    onKeyPress (e) {
      if (['Enter', ' '].includes(e.key) && this.show && this.addingTag) {
        e.preventDefault()
        this.addTag(this.addingTag, e)
      }
    },
    checkChangeAddingTagByArrows (e) {
      if (this.show && ['ArrowDown', 'ArrowUp'].includes(e.key)) e.preventDefault()
      if (!this.show || this.loading) return
      const nextTag = this.tags[this.addingTagIndex + 1]
      const prevTag = this.tags[this.addingTagIndex - 1]
      if (e.key === 'ArrowDown') this.addingTag = nextTag || prevTag
      else if (e.key === 'ArrowUp') this.addingTag = prevTag || nextTag
    },
    getInnerHTML () {
      const html = this.textValue.split('\n').map((p) => 
        p.split(' ').map((w, i) => 
          w.startsWith('#') && w !== '#'
            ? `<span class="active-tag">${w}</span>${ i === p.split(' ').length - 1 ? '<span class="show-spaces"> </span>' : ''}`
            : w
        ).join(' ')
      ).join('<br>')
      this.$refs[this.elementId].innerHTML = html
    },
    moveCaret () {
      let editedTagElementIndex
      this.$refs[this.elementId].childNodes.forEach((node, i) => {
        if (node.textContent === `#${this.addingTag.text}`) {
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
      this.addingTagWordData = getChangedWordOnInputData({ newValue, oldValue })
      if (this.addingTagWordData.text.startsWith('#') && this.addingTagWordData.text !== '#') {
        if (!this.show) this.show = true
        this.positionX = this.$refs[this.elementId].offsetLeft
        this.nudgeBottom = this.$refs[this.elementId].offsetTop + this.$refs[this.elementId].clientHeight

        this.loading = true
        this.$store.dispatch('tags/list', { search: this.addingTagWordData.text.replace('#', ''), save: true })
          .then(tags => {
            this.addingTag = tags[0]
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        this.show = false
      }
    },
    show (v) {
      if (!v) {
        this.addingTag = null
        this.addingTagWordData = {
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
    window.addEventListener('keydown', this.checkChangeAddingTagByArrows)
  },
  mixins: [vuetifyMixins],
  beforeDestroy () {
    window.removeEventListener('keydown', this.checkChangeAddingTagByArrows)
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