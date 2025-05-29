<!-- CodeEditor.vue -->
<template>
  <div ref="editorRef" class="w-full h-full min-h-[300px] border border-gray-200 overflow-hidden" />
</template>

<script setup lang="ts">
import { EditorState } from '@codemirror/state'
import type { Extension } from '@codemirror/state'
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLineGutter,
  highlightActiveLine,
  rectangularSelection,
  highlightSpecialChars,
  drawSelection,
} from '@codemirror/view'
import { defaultKeymap, indentWithTab, history, historyKeymap } from '@codemirror/commands'
import { languages, getLanguageExtension } from './languages'
import { dracula } from 'thememirror'
import {
  foldGutter,
  foldKeymap,
  indentOnInput,
  bracketMatching,
  indentUnit,
} from '@codemirror/language'
import {
  autocompletion,
  completionKeymap,
  closeBrackets,
  closeBracketsKeymap,
} from '@codemirror/autocomplete'
import { searchKeymap, search, highlightSelectionMatches } from '@codemirror/search'

// 编辑器主题配置
const editorTheme = {
  // 基础颜色
  colors: {
    // background: 'rgba(0, 0, 0, 0.5)', // 主背景色
    background: '#21222C', // 主背景色
    // background: '#212121', // 主背景色
    border: '#333333', // 边框颜色
    text: '#d4d4d4', // 文本颜色
    tooltipBg: '#252525', // 提示框背景色
    tooltipBorder: '#454545', // 提示框边框颜色
  },

  // 高亮颜色
  highlights: {
    currentLine: 'rgba(255, 255, 255, 0.07)', // 当前行高亮
    selection: 'rgba(255, 255, 255, 0.1)', // 选中文本高亮
    matchingBracket: 'rgba(255, 255, 255, 0.1)', // 匹配括号高亮
    searchMatch: 'rgba(255, 255, 0, 0.2)', // 搜索匹配高亮
    searchMatchSelected: 'rgba(255, 150, 0, 0.3)', // 当前搜索匹配高亮
    indentGuide: 'rgba(255, 255, 255, 0.05)', // 缩进指示线颜色
  },
}

const props = withDefaults(
  defineProps<{
    modelValue?: string
    language?: string
    readonly?: boolean
    tabSize?: number
    fontSize?: number
    enableAutocompletion?: boolean
  }>(),
  {
    modelValue: '',
    language: 'javascript',
    readonly: false,
    tabSize: 2,
    enableAutocompletion: true,
    fontSize: 14,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editorRef = ref<HTMLElement>()
// 字体配置
const fontConfig = {
  family: '"JetBrains Mono", "Fira Code", Menlo, Monaco, Consolas, "Courier New", monospace',
  size: `${props.fontSize}px`,
  lineHeight: '1.6',
}
let view: EditorView | undefined

// 获取主题样式配置
const getThemeStyles = () => {
  return EditorView.theme({
    '&': {
      height: '100%',
      backgroundColor: editorTheme.colors.background,
    },
    '.cm-scroller': {
      fontFamily: fontConfig.family,
      fontSize: fontConfig.size,
      lineHeight: fontConfig.lineHeight,
      backgroundColor: editorTheme.colors.background,
      backdropFilter: 'blur(7px)',
    },
    '.cm-gutters': {
      backdropFilter: 'blur(7px)',
      backgroundColor: editorTheme.colors.background,
      border: 'none',
      borderRight: `1px solid ${editorTheme.colors.border}`,
      fontFamily: fontConfig.family,
      fontSize: fontConfig.size,
    },
    '.cm-content': {
      padding: '0',
      '& > *': {
        padding: '0 4px',
        boxShadow: 'none',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          right: 0,
          background: `linear-gradient(90deg, ${editorTheme.highlights.indentGuide} 1px, transparent 1px) repeat-x`,
          backgroundSize: `${props.tabSize * 8}px 1px`,
          top: 0,
          bottom: 0,
          pointerEvents: 'none',
        },
      },
    },
    '.cm-line': {
      padding: '0 4px',
      position: 'relative',
      color: editorTheme.colors.text,
    },
    '&.cm-focused .cm-matchingBracket': {
      backgroundColor: editorTheme.highlights.matchingBracket,
    },
    '.cm-activeLine': {
      backgroundColor: editorTheme.highlights.currentLine,
    },
    '.cm-activeLineGutter': {
      backgroundColor: editorTheme.highlights.currentLine,
    },
    '.cm-selectionMatch': {
      backgroundColor: editorTheme.highlights.selection,
    },
    '.cm-foldGutter': {
      width: '1.2em',
    },
    '.cm-foldPlaceholder': {
      backgroundColor: editorTheme.highlights.selection,
      border: 'none',
      color: editorTheme.colors.text,
    },
    // 搜索样式
    '.cm-searchMatch': {
      backgroundColor: editorTheme.highlights.searchMatch,
    },
    '.cm-searchMatch-selected': {
      backgroundColor: editorTheme.highlights.searchMatchSelected,
    },
    // 自动完成样式
    '.cm-tooltip': {
      backgroundColor: editorTheme.colors.tooltipBg,
      border: `1px solid ${editorTheme.colors.tooltipBorder}`,
      borderRadius: '4px',
    },
    '.cm-tooltip.cm-tooltip-autocomplete': {
      '& > ul': {
        fontFamily: fontConfig.family,
        maxHeight: '200px',
        backgroundColor: editorTheme.colors.tooltipBg,
      },
      '& > ul > li': {
        padding: '2px 8px',
      },
      '& > ul > li[aria-selected]': {
        backgroundColor: editorTheme.highlights.selection,
        color: editorTheme.colors.text,
      },
    },
  })
}

// 基础扩展配置
const getBaseExtensions = (): Extension[] => {
  const extensions = [
    EditorView.lineWrapping,
    lineNumbers(),
    history(),
    // 代码折叠
    foldGutter(),
    // 缩进配置
    indentUnit.of(' '.repeat(props.tabSize)),
    indentOnInput(),
    // 括号匹配和自动闭合
    bracketMatching(),
    closeBrackets(),
    // 选择和高亮
    rectangularSelection(),
    drawSelection(),
    highlightActiveLine(),
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    highlightSelectionMatches(),
    // 搜索功能
    search({
      top: true,
    }),
    // 主题配置
    getThemeStyles(),
    dracula,
    EditorView.lineWrapping,
    keymap.of([indentWithTab, ...closeBracketsKeymap, ...foldKeymap, ...searchKeymap]),
    keymap.of(defaultKeymap),
    keymap.of(historyKeymap),
    EditorState.readOnly.of(props.readonly),
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        emit('update:modelValue', update.state.doc.toString())
      }
    }),
  ]

  // 根据配置添加自动完成功能
  if (props.enableAutocompletion) {
    extensions.push(autocompletion(), keymap.of(completionKeymap))
  }

  return extensions
}

// 创建编辑器
const createEditor = () => {
  if (!editorRef.value) return

  const extensions = [...getBaseExtensions()]
  const languageExtension = getLanguageExtension(props.language)
  if (languageExtension) {
    extensions.push(languageExtension)
  }

  view = new EditorView({
    state: EditorState.create({
      doc: props.modelValue,
      extensions,
    }),
    parent: editorRef.value,
  })
}

// 更新编辑器内容
const updateContent = (content: string) => {
  if (!view) return
  const currentContent = view.state.doc.toString()
  if (currentContent !== content) {
    view.dispatch({
      changes: {
        from: 0,
        to: currentContent.length,
        insert: content,
      },
    })
  }
}

// 更新编辑器语言
const updateLanguage = (language: string) => {
  if (!view) return
  const languageExtension = getLanguageExtension(language)
  if (!languageExtension) return

  const extensions = [...getBaseExtensions(), languageExtension]
  view.setState(
    EditorState.create({
      doc: view.state.doc,
      extensions,
    }),
  )
}

// 监听属性变化
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== view?.state.doc.toString()) {
      updateContent(newValue)
    }
  },
)

watch(
  () => props.language,
  (newValue) => {
    updateLanguage(newValue)
  },
)

// 生命周期钩子
onMounted(() => {
  createEditor()
})

onBeforeUnmount(() => {
  view?.destroy()
})

// 暴露语言列表
defineExpose({
  languages,
})
</script>
