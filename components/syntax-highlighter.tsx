"use client"

import type React from "react"
import { useEffect, useRef } from "react"

interface SyntaxHighlighterProps {
  code: string
  language: string
  onChange: (code: string) => void
  fontSize: number
  lineNumbers: boolean
  wordWrap: boolean
  className?: string
  theme: string
}

export default function SyntaxHighlighter({
  code,
  language,
  onChange,
  fontSize,
  lineNumbers,
  wordWrap,
  className = "",
  theme = "light",
}: SyntaxHighlighterProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const highlighterRef = useRef<HTMLPreElement>(null)

  // Enhanced syntax highlighting with modern colors
  const highlightCode = (code: string, language: string): string => {
    if (!code) return ""

    let highlighted = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

    // Color schemes based on theme
    const colors =
      theme === "dark"
        ? {
            tag: "text-blue-400",
            attr: "text-yellow-400",
            value: "text-green-400",
            comment: "text-gray-500",
            selector: "text-purple-400",
            property: "text-cyan-400",
            cssValue: "text-pink-400",
            unit: "text-orange-400",
            keyword: "text-purple-400",
            string: "text-green-400",
            number: "text-orange-400",
            boolean: "text-red-400",
            function: "text-yellow-400",
          }
        : {
            tag: "text-blue-600",
            attr: "text-amber-600",
            value: "text-green-600",
            comment: "text-gray-500",
            selector: "text-purple-600",
            property: "text-cyan-600",
            cssValue: "text-pink-600",
            unit: "text-orange-600",
            keyword: "text-purple-600",
            string: "text-green-600",
            number: "text-orange-600",
            boolean: "text-red-600",
            function: "text-yellow-600",
          }

    if (language === "html") {
      highlighted = highlighted.replace(/(&lt;[/]?[a-zA-Z0-9]+)/g, `<span class="${colors.tag} font-medium">$1</span>`)
      highlighted = highlighted.replace(/([a-zA-Z0-9-]+)=/g, `<span class="${colors.attr}">$1</span>=`)
      highlighted = highlighted.replace(/="([^"]*?)"/g, `="<span class="${colors.value}">$1</span>"`)
      highlighted = highlighted.replace(/(&lt;!--[\s\S]*?--&gt;)/g, `<span class="${colors.comment} italic">$1</span>`)
    } else if (language === "css") {
      highlighted = highlighted.replace(
        /([a-zA-Z0-9\-.#:]+)\s*\{/g,
        `<span class="${colors.selector} font-medium">$1</span> {`,
      )
      highlighted = highlighted.replace(/([a-zA-Z0-9-]+):/g, `<span class="${colors.property}">$1</span>:`)
      highlighted = highlighted.replace(/:\s*([^;]+);/g, `: <span class="${colors.cssValue}">$1</span>;`)
      highlighted = highlighted.replace(
        /(\d+(?:\.\d+)?(?:px|em|rem|%|vh|vw|deg))/g,
        `<span class="${colors.unit}">$1</span>`,
      )
      highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, `<span class="${colors.comment} italic">$1</span>`)
    } else if (language === "js") {
      highlighted = highlighted.replace(
        /\b(var|let|const|function|return|if|else|for|while|class|import|export|from|default|async|await|try|catch|finally|throw|new|this|super|extends|static|public|private|protected)\b/g,
        `<span class="${colors.keyword} font-medium">$1</span>`,
      )
      highlighted = highlighted.replace(/(".*?"|'.*?'|`[\s\S]*?`)/g, `<span class="${colors.string}">$1</span>`)
      highlighted = highlighted.replace(/\b(\d+(?:\.\d+)?)\b/g, `<span class="${colors.number}">$1</span>`)
      highlighted = highlighted.replace(/\b(true|false|null|undefined)\b/g, `<span class="${colors.boolean}">$1</span>`)
      highlighted = highlighted.replace(
        /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g,
        `<span class="${colors.function}">$1</span>(`,
      )
      highlighted = highlighted.replace(
        /(\/\/.*|\/\*[\s\S]*?\*\/)/g,
        `<span class="${colors.comment} italic">$1</span>`,
      )
    }

    return highlighted
  }

  // Sync scroll between textarea and highlighter
  useEffect(() => {
    const syncScroll = () => {
      if (highlighterRef.current && editorRef.current) {
        highlighterRef.current.scrollTop = editorRef.current.scrollTop
        highlighterRef.current.scrollLeft = editorRef.current.scrollLeft
      }
    }

    const editor = editorRef.current
    if (editor) {
      editor.addEventListener("scroll", syncScroll)
      return () => editor.removeEventListener("scroll", syncScroll)
    }
  }, [])

  // Update highlighted code
  useEffect(() => {
    if (highlighterRef.current) {
      const lineNumbersHtml = lineNumbers
        ? Array.from({ length: (code.match(/\n/g) || []).length + 1 })
            .map(
              (_, i) =>
                `<span class="${theme === "dark" ? "text-gray-500" : "text-gray-400"} select-none text-right block leading-6" style="min-width: 2rem;">${i + 1}</span>`,
            )
            .join("")
        : ""

      highlighterRef.current.innerHTML = lineNumbers
        ? `<div class="line-numbers pr-3 border-r ${theme === "dark" ? "border-gray-700" : "border-gray-300"} mr-3 flex flex-col">${lineNumbersHtml}</div>
           <div class="code-content flex-1 leading-6">${highlightCode(code, language)}</div>`
        : `<div class="leading-6">${highlightCode(code, language)}</div>`
    }
  }, [code, language, lineNumbers, theme])

  // Handle tab key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const target = e.target as HTMLTextAreaElement
      const start = target.selectionStart
      const end = target.selectionEnd

      const newText = code.substring(0, start) + "  " + code.substring(end)
      onChange(newText)

      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2
      }, 0)
    }
  }

  return (
    <div className={`relative font-mono ${className} overflow-hidden`}>
      {/* Syntax highlighting layer - behind textarea */}
      <pre
        ref={highlighterRef}
        className={`absolute inset-0 m-0 p-4 overflow-auto pointer-events-none
                   ${wordWrap ? "whitespace-pre-wrap" : "whitespace-pre"} 
                   flex ${lineNumbers ? "flex-row" : ""} leading-6`}
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: "1.5",
          zIndex: 1,
        }}
      ></pre>

      {/* Actual textarea - on top for interaction */}
      <textarea
        ref={editorRef}
        value={code}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`relative w-full h-full p-4 bg-transparent resize-none 
                   focus:outline-none focus:ring-2 focus:ring-red-500/50
                   ${wordWrap ? "whitespace-pre-wrap" : "whitespace-pre"} 
                   leading-6 font-mono caret-red-500
                   ${theme === "dark" ? "text-white" : "text-gray-900"}`}
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: "1.5",
          zIndex: 2,
          color: "transparent",
          WebkitTextFillColor: "transparent",
        }}
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  )
}
