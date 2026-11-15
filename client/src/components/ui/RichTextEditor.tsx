import React, { useCallback, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code, Highlighter,
  Heading1, Heading2, Heading3, List, ListOrdered, Quote, Minus, Undo2, Redo2,
  Link as LinkIcon, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Subscript as SubIcon, Superscript as SupIcon, Table as TableIcon, Eraser, Pilcrow, Palette,
  RemoveFormatting,
} from 'lucide-react'
import { cn } from '@/utils/cn'

type Props = {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: number
  className?: string
}

const Btn: React.FC<{
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title?: string
  children: React.ReactNode
}> = ({ onClick, active, disabled, title, children }) => (
  <button
    type="button"
    title={title}
    disabled={disabled}
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    className={cn(
      'inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-300 transition-colors hover:bg-slate-700 hover:text-white disabled:opacity-40',
      active && 'bg-amber-900/40 text-amber-200',
    )}
  >
    {children}
  </button>
)

const Sep = () => <span className="mx-0.5 h-6 w-px bg-slate-700" />

export const RichTextEditor: React.FC<Props> = ({ value, onChange, placeholder, minHeight = 220, className }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4, 5, 6] } }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: true }),
      Image.configure({ inline: false, allowBase64: true }),
      Placeholder.configure({ placeholder: placeholder || 'Write content...' }),
      TextStyle,
      Color,
      Subscript,
      Superscript,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'rte-prose outline-none bg-slate-900 px-3 py-2 text-slate-100',
        style: `min-height:${minHeight}px`,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html === '<p></p>' ? '' : html)
    },
  })

  useEffect(() => {
    if (!editor) return
    if (editor.isFocused) return
    const normalize = (html: string) => {
      const h = (html || '').trim()
      return h === '<p></p>' || h === '<p><br></p>' || h === '<p><br /></p>' ? '' : h
    }
    const current = normalize(editor.getHTML())
    const incoming = normalize(value || '')
    if (incoming !== current) {
      editor.commands.setContent(value || '', { emitUpdate: false })
    }
  }, [value, editor])

  const setLink = useCallback(() => {
    if (!editor) return
    const prev = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Enter URL', prev || 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const addImage = useCallback(() => {
    if (!editor) return
    const url = window.prompt('Image URL')
    if (!url) return
    editor.chain().focus().setImage({ src: url }).run()
  }, [editor])

  const setColor = useCallback(() => {
    if (!editor) return
    const color = window.prompt('Text color (e.g. #b45309 or red)', (editor.getAttributes('textStyle').color as string) || '#000000')
    if (color === null) return
    if (color === '') editor.chain().focus().unsetColor().run()
    else editor.chain().focus().setColor(color).run()
  }, [editor])

  if (!editor) return <div className="rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm text-slate-400" style={{ minHeight }}>Loading editor...</div>

  return (
    <div className={cn('overflow-hidden rounded-lg border border-slate-700 bg-slate-900', className)}>
      <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-700 bg-slate-800 p-1.5">
        <Btn title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}><Undo2 className="h-4 w-4" /></Btn>
        <Btn title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}><Redo2 className="h-4 w-4" /></Btn>
        <Sep />
        <Btn title="Paragraph" onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive('paragraph')}><Pilcrow className="h-4 w-4" /></Btn>
        <Btn title="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })}><Heading1 className="h-4 w-4" /></Btn>
        <Btn title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}><Heading2 className="h-4 w-4" /></Btn>
        <Btn title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })}><Heading3 className="h-4 w-4" /></Btn>
        <Sep />
        <Btn title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}><Bold className="h-4 w-4" /></Btn>
        <Btn title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}><Italic className="h-4 w-4" /></Btn>
        <Btn title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')}><UnderlineIcon className="h-4 w-4" /></Btn>
        <Btn title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')}><Strikethrough className="h-4 w-4" /></Btn>
        <Btn title="Highlight" onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')}><Highlighter className="h-4 w-4" /></Btn>
        <Btn title="Text color" onClick={setColor}><Palette className="h-4 w-4" /></Btn>
        <Btn title="Subscript" onClick={() => editor.chain().focus().toggleSubscript().run()} active={editor.isActive('subscript')}><SubIcon className="h-4 w-4" /></Btn>
        <Btn title="Superscript" onClick={() => editor.chain().focus().toggleSuperscript().run()} active={editor.isActive('superscript')}><SupIcon className="h-4 w-4" /></Btn>
        <Btn title="Inline code" onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')}><Code className="h-4 w-4" /></Btn>
        <Sep />
        <Btn title="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}><List className="h-4 w-4" /></Btn>
        <Btn title="Ordered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}><ListOrdered className="h-4 w-4" /></Btn>
        <Btn title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')}><Quote className="h-4 w-4" /></Btn>
        <Btn title="Code block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')}><Code className="h-4 w-4" /></Btn>
        <Btn title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus className="h-4 w-4" /></Btn>
        <Sep />
        <Btn title="Align left" onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })}><AlignLeft className="h-4 w-4" /></Btn>
        <Btn title="Align center" onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })}><AlignCenter className="h-4 w-4" /></Btn>
        <Btn title="Align right" onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })}><AlignRight className="h-4 w-4" /></Btn>
        <Btn title="Justify" onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })}><AlignJustify className="h-4 w-4" /></Btn>
        <Sep />
        <Btn title="Add/edit link" onClick={setLink} active={editor.isActive('link')}><LinkIcon className="h-4 w-4" /></Btn>
        <Btn title="Insert image (URL)" onClick={addImage}><ImageIcon className="h-4 w-4" /></Btn>
        <Btn title="Insert table" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><TableIcon className="h-4 w-4" /></Btn>
        <Sep />
        <Btn title="Clear formatting" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}><RemoveFormatting className="h-4 w-4" /></Btn>
        <Btn title="Clear content" onClick={() => editor.chain().focus().clearContent().run()}><Eraser className="h-4 w-4" /></Btn>
      </div>
      <EditorContent editor={editor} onClick={() => editor.chain().focus().run()} />
      <style>{`
        .rte-prose { background: #0f172a; color: #e2e8f0; font-size: 0.875rem; line-height: 1.7; }
        .rte-prose p { margin: 0.5em 0; }
        .rte-prose h1 { font-size: 1.5em; font-weight: 700; margin: 0.8em 0 0.4em; }
        .rte-prose h2 { font-size: 1.3em; font-weight: 700; margin: 0.7em 0 0.35em; }
        .rte-prose h3 { font-size: 1.15em; font-weight: 700; margin: 0.6em 0 0.3em; }
        .rte-prose h4,.rte-prose h5,.rte-prose h6 { font-weight: 700; margin: 0.5em 0 0.25em; }
        .rte-prose ul { list-style: disc; padding-left: 1.5em; margin: 0.5em 0; }
        .rte-prose ol { list-style: decimal; padding-left: 1.5em; margin: 0.5em 0; }
        .rte-prose blockquote { border-left: 3px solid #475569; padding-left: 0.9em; color: #94a3b8; margin: 0.6em 0; }
        .rte-prose pre { background: #020617; color: #e2e8f0; border-radius: 0.5rem; padding: 0.75em 1em; overflow-x: auto; margin: 0.6em 0; }
        .rte-prose code { background: #334155; color: #e2e8f0; border-radius: 0.25rem; padding: 0.1em 0.35em; font-size: 0.9em; }
        .rte-prose pre code { background: transparent; padding: 0; }
        .rte-prose hr { border: 0; border-top: 1px solid #334155; margin: 1em 0; }
        .rte-prose a { color: #93c5fd; text-decoration: underline; }
        .rte-prose img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 0.5em 0; }
        .rte-prose mark { background: #854d0e; color: #fef9c3; padding: 0.05em 0.15em; border-radius: 0.15rem; }
        .rte-prose table { border-collapse: collapse; width: 100%; margin: 0.6em 0; overflow: hidden; }
        .rte-prose th, .rte-prose td { border: 1px solid #475569; padding: 0.4em 0.6em; vertical-align: top; }
        .rte-prose th { background: #1e293b; font-weight: 600; text-align: left; }
        .rte-prose .is-editor-empty:first-child::before { content: attr(data-placeholder); color: #64748b; float: left; height: 0; pointer-events: none; }
        .rte-prose p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: #64748b; float: left; height: 0; pointer-events: none; }
      `}</style>
    </div>
  )
}
