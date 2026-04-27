"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Underline from "@tiptap/extension-underline"
import { TextStyle } from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import TextAlign from "@tiptap/extension-text-align"
import Highlight from "@tiptap/extension-highlight"
import { useEffect } from "react"

interface TipTapViewerProps {
  content: string
  className?: string
}

export default function TipTapViewer({ content, className = "" }: TipTapViewerProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Image.configure({ inline: false }),
      Link.configure({ openOnClick: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight,
    ],
    content,
    editable: false,
    editorProps: {
      attributes: {
        class: [
          "prose prose-sm sm:prose dark:prose-invert max-w-none focus:outline-none",
          "prose-headings:font-semibold prose-a:text-primary prose-img:rounded-xl",
          className,
        ].join(" "),
      },
    },
  })

  // Sync when content prop changes (e.g., switching between items in admin)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) return null
  return <EditorContent editor={editor} />
}
