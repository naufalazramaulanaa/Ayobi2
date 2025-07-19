"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Link,
  ImageIcon,
  Type,
  Minus,
  Plus,
} from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start typing...",
  className = "",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const isUpdatingRef = useRef(false)
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())

  // Update editor content when value prop changes (external updates)
  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      const selection = window.getSelection()
      const range = selection?.rangeCount ? selection.getRangeAt(0) : null
      const startOffset = range?.startOffset || 0
      const endOffset = range?.endOffset || 0
      const startContainer = range?.startContainer

      editorRef.current.innerHTML = value || ""

      // Restore cursor position if possible
      try {
        if (startContainer && editorRef.current.contains(startContainer)) {
          const newRange = document.createRange()
          newRange.setStart(startContainer, Math.min(startOffset, startContainer.textContent?.length || 0))
          newRange.setEnd(startContainer, Math.min(endOffset, startContainer.textContent?.length || 0))
          selection?.removeAllRanges()
          selection?.addRange(newRange)
        }
      } catch (e) {
        // Ignore cursor restoration errors
      }
    }
  }, [value])

  // Handle input changes
  const handleInput = () => {
    if (editorRef.current) {
      isUpdatingRef.current = true
      const content = editorRef.current.innerHTML
      onChange(content)
      setTimeout(() => {
        isUpdatingRef.current = false
      }, 0)
    }
    updateActiveFormats()
  }

  // Update active format states
  const updateActiveFormats = () => {
    const formats = new Set<string>()

    try {
      if (document.queryCommandState("bold")) formats.add("bold")
      if (document.queryCommandState("italic")) formats.add("italic")
      if (document.queryCommandState("underline")) formats.add("underline")
      if (document.queryCommandState("justifyLeft")) formats.add("alignLeft")
      if (document.queryCommandState("justifyCenter")) formats.add("alignCenter")
      if (document.queryCommandState("justifyRight")) formats.add("alignRight")
      if (document.queryCommandState("justifyFull")) formats.add("alignJustify")
      if (document.queryCommandState("insertUnorderedList")) formats.add("bulletList")
      if (document.queryCommandState("insertOrderedList")) formats.add("orderedList")
    } catch (e) {
      // Ignore query command errors
    }

    setActiveFormats(formats)
  }

  // Execute formatting command
  const executeCommand = (command: string, value?: string) => {
    if (editorRef.current) {
      editorRef.current.focus()
      document.execCommand(command, false, value)
      handleInput()
    }
  }

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "b":
          e.preventDefault()
          executeCommand("bold")
          break
        case "i":
          e.preventDefault()
          executeCommand("italic")
          break
        case "u":
          e.preventDefault()
          executeCommand("underline")
          break
      }
    }

    // Auto-numbering on Enter
    if (e.key === "Enter") {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const textNode = range.startContainer
        const text = textNode.textContent || ""
        const lineStart = text.lastIndexOf("\n", range.startOffset - 1) + 1
        const lineText = text.substring(lineStart, range.startOffset)

        // Check if current line has numbering
        const numberMatch = lineText.match(/^(\d+)\.\s*/)
        if (numberMatch) {
          e.preventDefault()
          const currentNumber = Number.parseInt(numberMatch[1])
          const nextNumber = currentNumber + 1
          document.execCommand("insertText", false, `\n${nextNumber}. `)
        }
      }
    }
  }

  // Handle paste to clean up formatting
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData("text/plain")
    document.execCommand("insertText", false, text)
  }

  // Toolbar buttons configuration
  const toolbarButtons = [
    {
      icon: Type,
      command: "formatBlock",
      value: "h1",
      title: "Heading 1",
      active: false,
    },
    {
      icon: Type,
      command: "formatBlock",
      value: "h2",
      title: "Heading 2",
      active: false,
    },
    {
      icon: Type,
      command: "formatBlock",
      value: "h3",
      title: "Heading 3",
      active: false,
    },
    {
      icon: Bold,
      command: "bold",
      title: "Bold (Ctrl+B)",
      active: activeFormats.has("bold"),
    },
    {
      icon: Italic,
      command: "italic",
      title: "Italic (Ctrl+I)",
      active: activeFormats.has("italic"),
    },
    {
      icon: Underline,
      command: "underline",
      title: "Underline (Ctrl+U)",
      active: activeFormats.has("underline"),
    },
    {
      icon: AlignLeft,
      command: "justifyLeft",
      title: "Align Left",
      active: activeFormats.has("alignLeft"),
    },
    {
      icon: AlignCenter,
      command: "justifyCenter",
      title: "Align Center",
      active: activeFormats.has("alignCenter"),
    },
    {
      icon: AlignRight,
      command: "justifyRight",
      title: "Align Right",
      active: activeFormats.has("alignRight"),
    },
    {
      icon: AlignJustify,
      command: "justifyFull",
      title: "Justify",
      active: activeFormats.has("alignJustify"),
    },
    {
      icon: List,
      command: "insertUnorderedList",
      title: "Bullet List",
      active: activeFormats.has("bulletList"),
    },
    {
      icon: ListOrdered,
      command: "insertOrderedList",
      title: "Numbered List",
      active: activeFormats.has("orderedList"),
    },
    {
      icon: Quote,
      command: "formatBlock",
      value: "blockquote",
      title: "Quote",
      active: false,
    },
  ]

  return (
    <div className={`border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
        {toolbarButtons.map((button, index) => (
          <Button
            key={index}
            variant={button.active ? "default" : "ghost"}
            size="sm"
            onClick={() => executeCommand(button.command, button.value)}
            title={button.title}
            className="h-8 w-8 p-0"
          >
            <button.icon className="h-4 w-4" />
          </Button>
        ))}

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Line Spacing Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => executeCommand("formatBlock", "div")}
            title="Single Line Spacing"
            className="h-8 px-2 text-xs"
          >
            1.0
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const selection = window.getSelection()
              if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0)
                const parentElement =
                  range.commonAncestorContainer.nodeType === Node.TEXT_NODE
                    ? range.commonAncestorContainer.parentElement
                    : (range.commonAncestorContainer as HTMLElement)

                if (parentElement && parentElement.style) {
                  parentElement.style.lineHeight = "1.5"
                }
              }
            }}
            title="1.5 Line Spacing"
            className="h-8 px-2 text-xs"
          >
            1.5
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const selection = window.getSelection()
              if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0)
                const parentElement =
                  range.commonAncestorContainer.nodeType === Node.TEXT_NODE
                    ? range.commonAncestorContainer.parentElement
                    : (range.commonAncestorContainer as HTMLElement)

                if (parentElement && parentElement.style) {
                  parentElement.style.lineHeight = "2.0"
                }
              }
            }}
            title="Double Line Spacing"
            className="h-8 px-2 text-xs"
          >
            2.0
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Manual Numbering Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const selection = window.getSelection()
              if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0)
                const textNode = range.startContainer
                const text = textNode.textContent || ""
                const lineStart = text.lastIndexOf("\n", range.startOffset - 1) + 1
                const lineText = text.substring(lineStart, range.startOffset)

                // Check if line already has numbering
                const numberMatch = lineText.match(/^(\d+)\.\s*/)
                if (numberMatch) {
                  const currentNumber = Number.parseInt(numberMatch[1])
                  const newNumber = currentNumber + 1
                  const newText =
                    text.substring(0, lineStart) + text.substring(lineStart).replace(/^\d+\./, `${newNumber}.`)
                  textNode.textContent = newText
                } else {
                  // Add numbering to current line
                  const newText = text.substring(0, lineStart) + "1. " + text.substring(lineStart)
                  textNode.textContent = newText
                }
              }
            }}
            title="Add/Increment Number"
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const selection = window.getSelection()
              if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0)
                const textNode = range.startContainer
                const text = textNode.textContent || ""
                const lineStart = text.lastIndexOf("\n", range.startOffset - 1) + 1
                const lineText = text.substring(lineStart, range.startOffset)

                // Remove numbering from current line
                const newText = text.substring(0, lineStart) + text.substring(lineStart).replace(/^\d+\.\s*/, "")
                textNode.textContent = newText
              }
            }}
            title="Remove Number"
            className="h-8 w-8 p-0"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const url = prompt("Enter URL:")
            if (url) executeCommand("createLink", url)
          }}
          title="Insert Link"
          className="h-8 w-8 p-0"
        >
          <Link className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const url = prompt("Enter image URL:")
            if (url) executeCommand("insertImage", url)
          }}
          title="Insert Image"
          className="h-8 w-8 p-0"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onMouseUp={updateActiveFormats}
        onKeyUp={updateActiveFormats}
        className="min-h-[200px] p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        style={{
          lineHeight: "1.6",
          fontSize: "14px",
        }}
        data-placeholder={placeholder}
      />

      <style jsx>{`
        [contenteditable] {
          line-height: 1.6;
        }

        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        
        [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }
        
        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
        }
        
        [contenteditable] h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.83em 0;
        }
        
        [contenteditable] blockquote {
          margin: 1em 0;
          padding: 0.5em 1em;
          border-left: 4px solid #e5e7eb;
          background-color: #f9fafb;
          font-style: italic;
        }
        
        .dark [contenteditable] blockquote {
          border-left-color: #4b5563;
          background-color: #1f2937;
        }
        
        [contenteditable] ul, [contenteditable] ol {
          margin: 1em 0;
          padding-left: 2em;
        }
        
        [contenteditable] li {
          margin: 0.5em 0;
        }

        [contenteditable] p {
          margin: 0.5em 0;
          line-height: inherit;
        }

        [contenteditable] .line-spacing-1 {
          line-height: 1.0;
        }

        [contenteditable] .line-spacing-1-5 {
          line-height: 1.5;
        }

        [contenteditable] .line-spacing-2 {
          line-height: 2.0;
        }

        [contenteditable] .text-justify {
          text-align: justify;
        }
      `}</style>
    </div>
  )
}
