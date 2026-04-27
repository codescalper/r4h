"use client"

import { useEditor, EditorContent, Extension } from "@tiptap/react"
import { Plugin } from "@tiptap/pm/state"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import CharacterCount from "@tiptap/extension-character-count"
import Link from "@tiptap/extension-link"
import Underline from "@tiptap/extension-underline"
import { TextStyle } from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import TextAlign from "@tiptap/extension-text-align"
import Highlight from "@tiptap/extension-highlight"
import { marked } from "marked"
import axios from "axios"
import { useCallback, useEffect, useRef } from "react"
import {
  Bold, Italic, UnderlineIcon, Strikethrough, Code, Code2, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus, Link2, Image as ImageIcon, AlignLeft,
  AlignCenter, AlignRight, AlignJustify, Highlighter, Undo, Redo, Palette,
} from "lucide-react"

// ─── Markdown paste extension ──────────────────────────────────────────────
function looksLikeMarkdown(text: string) {
  return /^#{1,6}\s|^\s*[-*+]\s|\*\*.+\*\*|__.*__|^\s*>\s|\[.+\]\(https?:\/\/|^```/.test(text)
}

const MarkdownPaste = Extension.create({
  name: "markdownPaste",
  addProseMirrorPlugins() {
    const editor = this.editor
    return [
      new Plugin({
        props: {
          handlePaste(_view, event) {
            const text = event.clipboardData?.getData("text/plain")
            if (!text || !looksLikeMarkdown(text)) return false
            const html = marked.parse(text, { async: false }) as string
            editor.commands.insertContent(html)
            return true
          },
        },
      }),
    ]
  },
})

interface TipTapEditorProps {
  content: string
  onChange: (val: string) => void
  onImageUpload?: (path: string) => void
  folder?: string
  maxChars?: number
  placeholder?: string
  onUploadProgress?: (pct: number) => void
}

/** Treat an empty TipTap paragraph as an empty string */
function normalizeHTML(html: string): string {
  if (!html || html === "<p></p>") return ""
  return html
}

/** Auto-prefix https:// if no protocol present */
function ensureUrl(raw: string): string {
  if (!raw) return raw
  if (/^https?:\/\//i.test(raw) || raw.startsWith("/")) return raw
  return `https://${raw}`
}

export default function TipTapEditor({
  content,
  onChange,
  onImageUpload,
  folder = "news",
  maxChars = 20000,
  placeholder = "Write your story here…",
  onUploadProgress,
}: TipTapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const colorInputRef = useRef<HTMLInputElement>(null)
  // Prevent feedback loop: skip external sync when we just fired onChange ourselves
  const skipSyncRef = useRef(false)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      TextStyle,      // required peer for Color
      Color,
      Image.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder }),
      CharacterCount.configure({ limit: maxChars }),
      Link.configure({ openOnClick: false, autolink: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: false }),
      MarkdownPaste,
    ],
    content,
    onUpdate({ editor }) {
      skipSyncRef.current = true
      onChange(normalizeHTML(editor.getHTML()))
      requestAnimationFrame(() => { skipSyncRef.current = false })
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose dark:prose-invert max-w-none min-h-[220px] px-4 py-3 focus:outline-none",
      },
    },
  })

  // Sync external resets (e.g. parent clears content after submit)
  useEffect(() => {
    if (!editor || skipSyncRef.current) return
    const isEmpty = !content || content === "<p></p>"
    if (isEmpty && !editor.isEmpty) {
      editor.commands.clearContent(true)
    }
  }, [content, editor])

  const handleImageUpload = useCallback(
    async (file: File) => {
      const formData = new FormData()
      formData.append("files", file)
      try {
        const res = await axios.post<{ paths: string[] }>(
          `/api/upload?folder=${folder}`,
          formData,
          {
            onUploadProgress(e) {
              if (e.total) onUploadProgress?.(Math.round((e.loaded * 100) / e.total))
            },
          },
        )
        const path = res.data.paths[0]
        editor?.chain().focus().setImage({ src: path, alt: file.name }).run()
        onImageUpload?.(path)
        onUploadProgress?.(0)
      } catch {
        alert("Image upload failed. Please try again.")
      }
    },
    [editor, folder, onImageUpload, onUploadProgress],
  )

  const setLink = useCallback(() => {
    const prev = editor?.getAttributes("link").href as string | undefined
    const raw = window.prompt("URL", prev ?? "")
    if (raw === null) return                // cancelled
    if (raw.trim() === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }
    editor?.chain().focus().extendMarkRange("link").setLink({ href: ensureUrl(raw.trim()) }).run()
  }, [editor])

  if (!editor) return null

  const canUndo = editor.can().undo()
  const canRedo = editor.can().redo()

  const btn = (
    active: boolean,
    title: string,
    onClick: () => void,
    children: React.ReactNode,
    disabled = false,
  ) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-foreground/70 hover:bg-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  )

  const chars = editor.storage.characterCount.characters()
  const pct = Math.round((chars / maxChars) * 100)

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card">
      {/* ── Toolbar ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-border bg-muted/30">

        {/* Inline marks */}
        {btn(editor.isActive("bold"),      "Bold (Ctrl+B)",      () => editor.chain().focus().toggleBold().run(),      <Bold      className="w-3.5 h-3.5" />)}
        {btn(editor.isActive("italic"),    "Italic (Ctrl+I)",    () => editor.chain().focus().toggleItalic().run(),    <Italic    className="w-3.5 h-3.5" />)}
        {btn(editor.isActive("underline"), "Underline (Ctrl+U)", () => editor.chain().focus().toggleUnderline().run(), <UnderlineIcon className="w-3.5 h-3.5" />)}
        {btn(editor.isActive("strike"),    "Strikethrough",      () => editor.chain().focus().toggleStrike().run(),    <Strikethrough className="w-3.5 h-3.5" />)}
        {btn(editor.isActive("highlight"), "Highlight",          () => editor.chain().focus().toggleHighlight().run(), <Highlighter   className="w-3.5 h-3.5" />)}
        {btn(editor.isActive("code"),      "Inline Code",        () => editor.chain().focus().toggleCode().run(),      <Code          className="w-3.5 h-3.5" />)}

        {/* Text color */}
        <button type="button" title="Text Color" onClick={() => colorInputRef.current?.click()}
          className="p-1.5 rounded text-foreground/70 hover:bg-muted hover:text-foreground transition-colors">
          <Palette className="w-3.5 h-3.5" />
        </button>
        <input ref={colorInputRef} type="color" className="sr-only w-0 h-0"
          onChange={e => editor.chain().focus().setColor(e.target.value).run()} />
        <button type="button" title="Remove Color" onClick={() => editor.chain().focus().unsetColor().run()}
          className="text-[10px] font-mono leading-none px-1.5 py-0.5 rounded text-foreground/50 hover:bg-muted hover:text-foreground transition-colors">
          A
        </button>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Headings */}
        {btn(editor.isActive("heading", { level: 1 }), "Heading 1", () => editor.chain().focus().toggleHeading({ level: 1 }).run(), <Heading1 className="w-3.5 h-3.5" />)}
        {btn(editor.isActive("heading", { level: 2 }), "Heading 2", () => editor.chain().focus().toggleHeading({ level: 2 }).run(), <Heading2 className="w-3.5 h-3.5" />)}
        {btn(editor.isActive("heading", { level: 3 }), "Heading 3", () => editor.chain().focus().toggleHeading({ level: 3 }).run(), <Heading3 className="w-3.5 h-3.5" />)}

        <div className="w-px h-5 bg-border mx-1" />

        {/* Lists & blocks */}
        {btn(editor.isActive("bulletList"),  "Bullet List",   () => editor.chain().focus().toggleBulletList().run(),  <List        className="w-3.5 h-3.5" />)}
        {btn(editor.isActive("orderedList"), "Ordered List",  () => editor.chain().focus().toggleOrderedList().run(), <ListOrdered className="w-3.5 h-3.5" />)}
        {btn(editor.isActive("blockquote"),  "Blockquote",    () => editor.chain().focus().toggleBlockquote().run(),  <Quote       className="w-3.5 h-3.5" />)}
        {btn(editor.isActive("codeBlock"),   "Code Block",    () => editor.chain().focus().toggleCodeBlock().run(),   <Code2       className="w-3.5 h-3.5" />)}
        {btn(false,                          "Horizontal Rule", () => editor.chain().focus().setHorizontalRule().run(), <Minus      className="w-3.5 h-3.5" />)}

        <div className="w-px h-5 bg-border mx-1" />

        {/* Text alignment */}
        {btn(editor.isActive({ textAlign: "left" }),    "Align Left",    () => editor.chain().focus().setTextAlign("left").run(),    <AlignLeft    className="w-3.5 h-3.5" />)}
        {btn(editor.isActive({ textAlign: "center" }),  "Align Center",  () => editor.chain().focus().setTextAlign("center").run(),  <AlignCenter  className="w-3.5 h-3.5" />)}
        {btn(editor.isActive({ textAlign: "right" }),   "Align Right",   () => editor.chain().focus().setTextAlign("right").run(),   <AlignRight   className="w-3.5 h-3.5" />)}
        {btn(editor.isActive({ textAlign: "justify" }), "Justify",       () => editor.chain().focus().setTextAlign("justify").run(), <AlignJustify className="w-3.5 h-3.5" />)}

        <div className="w-px h-5 bg-border mx-1" />

        {/* Link & image */}
        {btn(editor.isActive("link"), "Link (Ctrl+K)", setLink, <Link2 className="w-3.5 h-3.5" />)}
        <button type="button" title="Insert Image" onClick={() => fileInputRef.current?.click()}
          className="p-1.5 rounded text-foreground/70 hover:bg-muted hover:text-foreground transition-colors">
          <ImageIcon className="w-3.5 h-3.5" />
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); e.target.value = "" }} />

        <div className="w-px h-5 bg-border mx-1" />

        {/* History */}
        {btn(false, "Undo (Ctrl+Z)",         () => editor.chain().focus().undo().run(), <Undo className="w-3.5 h-3.5" />, !canUndo)}
        {btn(false, "Redo (Ctrl+Shift+Z)",   () => editor.chain().focus().redo().run(), <Redo className="w-3.5 h-3.5" />, !canRedo)}
      </div>

      {/* ── Editor area ─────────────────────────────────────────── */}
      <EditorContent editor={editor} />

      {/* ── Footer: markdown hints + char count ─────────────────── */}
      <div className="flex items-center justify-between gap-2 px-3 py-1.5 border-t border-border bg-muted/20 text-xs text-muted-foreground">
        <span className="hidden sm:block opacity-60 space-x-1">
          <span>Shortcuts:</span>
          {["**bold**", "# H1", "- list", "> quote", "```code```"].map(s => (
            <kbd key={s} className="font-mono text-[10px] bg-border/60 px-1 rounded">{s}</kbd>
          ))}
        </span>
        <div className="flex items-center gap-2 ml-auto shrink-0">
          <span className={`font-mono ${pct > 90 ? "text-destructive" : ""}`}>
            {chars.toLocaleString()} / {maxChars.toLocaleString()}
          </span>
          <div className="w-20 h-1 bg-border rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${pct > 90 ? "bg-destructive" : "bg-primary"}`}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
