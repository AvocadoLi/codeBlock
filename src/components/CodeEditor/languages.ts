import { javascript } from '@codemirror/lang-javascript'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { json } from '@codemirror/lang-json'
import { python } from '@codemirror/lang-python'
import { vue } from '@codemirror/lang-vue'
import { markdown } from '@codemirror/lang-markdown'
import { sql } from '@codemirror/lang-sql'
import { xml } from '@codemirror/lang-xml'
import { rust } from '@codemirror/lang-rust'
import { cpp } from '@codemirror/lang-cpp'
import { java } from '@codemirror/lang-java'
import { php } from '@codemirror/lang-php'
import { LanguageSupport } from '@codemirror/language'

export interface LanguageOption {
  name: string
  label: string
  extension: LanguageSupport
}

export const languages: LanguageOption[] = [
  { name: 'javascript', label: 'JavaScript', extension: javascript() },
  { name: 'typescript', label: 'TypeScript', extension: javascript({ typescript: true }) },
  { name: 'jsx', label: 'JSX', extension: javascript({ jsx: true }) },
  { name: 'tsx', label: 'TSX', extension: javascript({ jsx: true, typescript: true }) },
  { name: 'html', label: 'HTML', extension: html() },
  { name: 'css', label: 'CSS', extension: css() },
  { name: 'json', label: 'JSON', extension: json() },
  { name: 'python', label: 'Python', extension: python() },
  { name: 'vue', label: 'Vue', extension: vue() },
  { name: 'markdown', label: 'Markdown', extension: markdown() },
  { name: 'sql', label: 'SQL', extension: sql() },
  { name: 'xml', label: 'XML', extension: xml() },
  { name: 'rust', label: 'Rust', extension: rust() },
  { name: 'cpp', label: 'C++', extension: cpp() },
  { name: 'java', label: 'Java', extension: java() },
  { name: 'php', label: 'PHP', extension: php() },
]

export const getLanguageExtension = (language: string): LanguageSupport | null => {
  const lang = languages.find((l) => l.name === language)
  return lang ? lang.extension : null
}
