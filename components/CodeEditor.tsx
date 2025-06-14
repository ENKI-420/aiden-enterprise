"use client"

import type React from "react"
import { useState, useEffect, useCallback, useReducer } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Undo, Redo, Upload, Download, SettingsIcon, Save, Menu, X, ChevronLeft, Trash2 } from "lucide-react"

import { SettingsProvider, useSettings } from "@/contexts/settings-context"
import SyntaxHighlighter from "@/components/syntax-highlighter"
import FileExplorer from "@/components/file-explorer"
import SettingsPanel from "@/components/settings-panel"
import PreviewPanel from "@/components/preview-panel"
import {
  type FileSystemState,
  initialFileSystem,
  getFileById,
  createFile,
  updateFile,
  deleteFile,
} from "@/utils/file-system"

const getLanguageFromFileName = (fileName) => {
  const extension = fileName.split(".").pop()?.toLowerCase()
  switch (extension) {
    case "html":
      return {
        name: "HTML",
        template: "<!-- Write your HTML here -->\n<div>\n  <h1>Hello World!</h1>\n</div>",
      }
    case "css":
      return {
        name: "CSS",
        template: "/* Write your CSS here */\nbody {\n  color: blue;\n}",
      }
    case "js":
      return {
        name: "JavaScript",
        template: '// Write your JavaScript here\nconsole.log("Hello World!");',
      }
    default:
      return null
  }
}

// Reducer for file system operations
function fileSystemReducer(state: FileSystemState, action) {
  switch (action.type) {
    case "CREATE_FILE":
      return createFile(
        state,
        action.name,
        action.fileType,
        action.content || getLanguageFromFileName(action.name)?.template || "",
        action.parentId,
      )

    case "UPDATE_FILE":
      return updateFile(state, action.id, action.updates)

    case "DELETE_FILE":
      return deleteFile(state, action.id)

    case "SET_STATE":
      return action.state

    default:
      return state
  }
}

function CodeEditorContent() {
  const { theme: appTheme, editorSettings, isMobileView } = useSettings()
  const [fileSystem, dispatch] = useReducer(fileSystemReducer, initialFileSystem)
  const [activeFileId, setActiveFileId] = useState(1)
  const [preview, setPreview] = useState("")
  const [error, setError] = useState("")
  const [lastSaved, setLastSaved] = useState(new Date())
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobileView)

  const themes = {
    light: {
      bg: "bg-gradient-to-br from-white to-gray-100",
      text: "text-gray-800",
      primary: "bg-white shadow-md",
      secondary: "bg-gray-50",
      accent: "text-blue-600",
      border: "border-gray-200",
      editor: "bg-white text-gray-800",
      button: "bg-red-500 hover:bg-red-600 text-white",
      activeTab: "bg-white text-blue-600 border-blue-500 border-b-2",
      inactiveTab: "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
      preview: "bg-white text-gray-800",
      success: "text-green-600",
      warning: "text-amber-600",
      error: "text-red-600",
    },
    dark: {
      bg: "bg-gradient-to-br from-gray-900 to-gray-800",
      text: "text-gray-100",
      primary: "bg-gray-800 shadow-md",
      secondary: "bg-gray-700",
      accent: "text-blue-400",
      border: "border-gray-700",
      editor: "bg-gray-900 text-gray-100",
      button: "bg-red-500 hover:bg-red-600 text-white",
      activeTab: "bg-gray-900 text-blue-400 border-blue-500 border-b-2",
      inactiveTab: "text-gray-400 hover:text-gray-200 hover:bg-gray-700",
      preview: "bg-gray-900 text-gray-100",
      success: "text-green-400",
      warning: "text-amber-400",
      error: "text-red-400",
    },
  }

  const currentTheme = themes[appTheme] || themes.light

  // Load saved files from localStorage
  useEffect(() => {
    const savedFileSystem = localStorage.getItem("code-editor-files")
    if (savedFileSystem) {
      try {
        const parsedState = JSON.parse(savedFileSystem)
        dispatch({ type: "SET_STATE", state: parsedState })

        // Set active file to the first one if it exists
        if (parsedState.files.length > 0) {
          setActiveFileId(parsedState.files[0].id)
        }
      } catch (e) {
        console.error("Failed to parse saved file system")
      }
    }

    // Set up keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault()
        saveCurrentFile()
      }

      // Ctrl+Z to undo
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === "z") {
        e.preventDefault()
        undo()
      }

      // Ctrl+Y or Ctrl+Shift+Z to redo
      if (((e.ctrlKey || e.metaKey) && e.key === "y") || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "z")) {
        e.preventDefault()
        redo()
      }

      // Ctrl+Shift+D to clear all
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "d") {
        e.preventDefault()
        clearAll()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Auto-save functionality
  useEffect(() => {
    if (editorSettings.autoSave) {
      const saveTimer = setInterval(() => {
        saveCurrentFile()
      }, 30000)
      return () => clearInterval(saveTimer)
    }
  }, [editorSettings.autoSave, fileSystem])

  // Update preview when active file changes
  useEffect(() => {
    updatePreview()
  }, [activeFileId, fileSystem])

  // Save file system to localStorage
  useEffect(() => {
    localStorage.setItem("code-editor-files", JSON.stringify(fileSystem))
  }, [fileSystem])

  // Responsive sidebar
  useEffect(() => {
    setIsSidebarOpen(!isMobileView)
  }, [isMobileView])

  // Undo/Redo operations
  const undo = () => {
    const currentFile = getCurrentFile()
    if (!currentFile || !currentFile.historyIndex || currentFile.historyIndex <= 0) return

    dispatch({
      type: "UPDATE_FILE",
      id: activeFileId,
      updates: {
        content: currentFile.history[currentFile.historyIndex - 1],
        historyIndex: currentFile.historyIndex - 1,
      },
    })
  }

  const redo = () => {
    const currentFile = getCurrentFile()
    if (!currentFile || !currentFile.history || currentFile.historyIndex >= currentFile.history.length - 1) return

    dispatch({
      type: "UPDATE_FILE",
      id: activeFileId,
      updates: {
        content: currentFile.history[currentFile.historyIndex + 1],
        historyIndex: currentFile.historyIndex + 1,
      },
    })
  }

  // Clear all content
  const clearAll = () => {
    const currentFile = getCurrentFile()
    if (!currentFile) return

    if (confirm("Are you sure you want to clear all content? This action cannot be undone.")) {
      updateCurrentFile("")
    }
  }

  // File upload handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const content = e.target?.result as string
      if (content) {
        const languageInfo = getLanguageFromFileName(file.name)

        if (!languageInfo) {
          setError("Invalid file type. Please upload .html, .css, or .js files")
          return
        }

        const fileType = file.name.split(".").pop().toLowerCase()

        dispatch({
          type: "CREATE_FILE",
          name: file.name,
          fileType,
          content,
        })

        setActiveFileId(fileSystem.nextId)
        setError("")
      }
    }
    reader.readAsText(file)
  }

  // File operations
  const getCurrentFile = useCallback(() => {
    return getFileById(fileSystem.files, activeFileId)
  }, [fileSystem.files, activeFileId])

  const updateCurrentFile = (newContent: string, addToHistory = true) => {
    const currentFile = getCurrentFile()
    if (!currentFile) return

    const updates: any = { content: newContent }

    if (addToHistory) {
      const newHistory = currentFile.history
        ? [...currentFile.history.slice(0, currentFile.historyIndex + 1), newContent]
        : [newContent]

      updates.history = newHistory
      updates.historyIndex = newHistory.length - 1
    }

    dispatch({
      type: "UPDATE_FILE",
      id: activeFileId,
      updates,
    })

    updatePreview()
  }

  const updatePreview = () => {
    try {
      const currentFile = getCurrentFile()

      // If current file is HTML, show it directly
      if (currentFile && currentFile.type === "html") {
        setPreview(currentFile.content)
        return
      }

      // Otherwise, try to find an index.html file
      const htmlFile = fileSystem.files.find((f) => f.name === "index.html")
      if (htmlFile) {
        // Get all CSS and JS files
        const cssFiles = fileSystem.files.filter((f) => f.type === "css")
        const jsFiles = fileSystem.files.filter((f) => f.type === "js")

        // Inject CSS and JS into HTML
        let htmlContent = htmlFile.content

        // Add CSS
        if (cssFiles.length > 0) {
          const styleTag = cssFiles.map((file) => `<style>${file.content}</style>`).join("\n")

          // Insert before </head> if it exists, otherwise append
          if (htmlContent.includes("</head>")) {
            htmlContent = htmlContent.replace("</head>", `${styleTag}\n</head>`)
          } else {
            htmlContent = `${styleTag}\n${htmlContent}`
          }
        }

        // Add JS
        if (jsFiles.length > 0) {
          const scriptTag = jsFiles.map((file) => `<script>${file.content}</script>`).join("\n")

          // Insert before </body> if it exists, otherwise append
          if (htmlContent.includes("</body>")) {
            htmlContent = htmlContent.replace("</body>", `${scriptTag}\n</body>`)
          } else {
            htmlContent = `${htmlContent}\n${scriptTag}`
          }
        }

        setPreview(htmlContent)
      } else {
        const noFileMessage = `
          <div style="
            display: flex; 
            align-items: center; 
            justify-content: center; 
            height: 100vh; 
            font-family: system-ui, -apple-system, sans-serif;
            background: ${appTheme === "dark" ? "#1f2937" : "#f9fafb"};
            color: ${appTheme === "dark" ? "#f3f4f6" : "#374151"};
            margin: 0;
            padding: 20px;
            text-align: center;
          ">
            <div>
              <h3 style="margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">No HTML file found</h3>
              <p style="margin: 0; opacity: 0.7;">Create an index.html file to see the preview</p>
            </div>
          </div>
        `
        setPreview(noFileMessage)
      }

      setError("")
    } catch (err) {
      setError(err.message)
    }
  }

  // Save current file
  const saveCurrentFile = () => {
    try {
      localStorage.setItem("code-editor-files", JSON.stringify(fileSystem))
      setLastSaved(new Date())
      // Show a temporary success message
      const currentFile = getCurrentFile()
      if (currentFile) {
        setError(`File ${currentFile.name} saved successfully!`)
        setTimeout(() => setError(""), 2000)
      }
    } catch (e) {
      setError("Failed to save file")
      setTimeout(() => setError(""), 2000)
    }
  }

  // File management
  const createNewFile = (name: string, type: string, parentId: number | null = null) => {
    dispatch({
      type: "CREATE_FILE",
      name,
      fileType: type,
      parentId,
    })
  }

  const deleteFileById = (id: number) => {
    // Don't delete if it's the only file
    if (fileSystem.files.length <= 1) {
      setError("Cannot delete the only file")
      return
    }

    dispatch({
      type: "DELETE_FILE",
      id,
    })

    // If deleting active file, switch to another file
    if (activeFileId === id) {
      const remainingFiles = fileSystem.files.filter((f) => f.id !== id)
      if (remainingFiles.length > 0) {
        setActiveFileId(remainingFiles[0].id)
      }
    }
  }

  const renameFile = (id: number, newName: string) => {
    dispatch({
      type: "UPDATE_FILE",
      id,
      updates: { name: newName },
    })
  }

  // Enhanced export functionality
  const exportFiles = async () => {
    try {
      const files = fileSystem.files.filter((f) => f.type !== "folder")

      if (files.length === 0) {
        setError("No files to export")
        setTimeout(() => setError(""), 2000)
        return
      }

      if (files.length === 1) {
        // Single file - download directly
        const file = files[0]
        const blob = new Blob([file.content], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = file.name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        setError(`File ${file.name} exported successfully!`)
        setTimeout(() => setError(""), 2000)
      } else {
        // Multiple files - create zip (simplified version)
        // For a real implementation, you'd use JSZip library
        let zipContent = ""
        files.forEach((file) => {
          zipContent += `// File: ${file.name}\n${file.content}\n\n${"=".repeat(50)}\n\n`
        })

        const blob = new Blob([zipContent], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "project-files.txt"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        setError(`${files.length} files exported successfully!`)
        setTimeout(() => setError(""), 2000)
      }
    } catch (e) {
      setError("Failed to export files")
      setTimeout(() => setError(""), 2000)
    }
  }

  return (
    <div
      className={`min-h-screen p-2 sm:p-4 ${currentTheme.bg} ${currentTheme.text} transition-colors duration-300 relative overflow-hidden`}
    >
      {/* Main toolbar */}
      <div className="flex flex-wrap gap-2 sm:gap-4 mb-4">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button
            variant="outline"
            size="icon"
            className={`${currentTheme.button} h-8 w-8 sm:h-10 sm:w-10`}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>

          <Button
            variant="outline"
            className={`${currentTheme.button} text-xs sm:text-sm h-8 sm:h-10`}
            onClick={() => document.getElementById("file-upload").click()}
          >
            <Upload className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Upload</span>
          </Button>
          <input id="file-upload" type="file" accept=".html,.css,.js" className="hidden" onChange={handleFileUpload} />

          <Button
            variant="outline"
            className={`${currentTheme.button} text-xs sm:text-sm h-8 sm:h-10`}
            onClick={exportFiles}
          >
            <Download className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Download</span>
          </Button>

          <Button
            variant="outline"
            className={`${currentTheme.button} text-xs sm:text-sm h-8 sm:h-10`}
            onClick={saveCurrentFile}
          >
            <Save className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Save</span>
          </Button>
        </div>

        <div className="flex items-center ml-auto space-x-1 sm:space-x-2">
          <div className={`text-xs sm:text-sm opacity-70 mr-2 hidden sm:block ${currentTheme.success}`}>
            Last saved: {lastSaved.toLocaleTimeString()}
          </div>

          <Button
            variant="outline"
            size="icon"
            className={`${currentTheme.button} h-8 w-8 sm:h-10 sm:w-10`}
            onClick={() => setIsSettingsOpen(true)}
          >
            <SettingsIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {error && (
        <Alert
          variant={error.includes("successfully") ? "default" : "destructive"}
          className={`mb-2 sm:mb-4 ${
            error.includes("successfully")
              ? appTheme === "dark"
                ? "bg-green-900/20 border-green-500/50"
                : "bg-green-50 border-green-200"
              : appTheme === "dark"
                ? "bg-red-900/20 border-red-500/50"
                : "bg-red-50 border-red-200"
          }`}
        >
          <AlertDescription className={error.includes("successfully") ? currentTheme.success : currentTheme.error}>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Main content grid */}
      <div className="flex flex-col lg:flex-row gap-2 sm:gap-4 h-[calc(100vh-8rem)]">
        {/* File explorer sidebar */}
        {isSidebarOpen && (
          <Card
            className={`p-2 sm:p-4 ${currentTheme.primary} ${currentTheme.border} w-full lg:w-64 shrink-0 overflow-hidden`}
          >
            <FileExplorer
              files={fileSystem.files}
              activeFileId={activeFileId}
              onFileSelect={setActiveFileId}
              onCreateFile={createNewFile}
              onDeleteFile={deleteFileById}
              onRenameFile={renameFile}
              theme={currentTheme}
            />
          </Card>
        )}

        {/* Editor and Preview Grid */}
        <div className="flex flex-col lg:flex-row gap-2 sm:gap-4 flex-1 overflow-hidden">
          {/* Editor */}
          <Card
            className={`p-2 sm:p-4 ${currentTheme.primary} ${currentTheme.border} flex-1 min-w-0 ${isPreviewFullscreen ? "hidden" : ""}`}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Button variant="outline" size="icon" className={`${currentTheme.button} h-7 w-7`} onClick={undo}>
                  <Undo className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className={`${currentTheme.button} h-7 w-7`} onClick={redo}>
                  <Redo className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className={`${currentTheme.button} h-7 w-7`} onClick={clearAll}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className={`text-xs sm:text-sm font-medium truncate ${currentTheme.accent}`}>
                {getCurrentFile()?.name || "No file selected"}
              </div>
            </div>

            <div className={`w-full h-[calc(100%-2.5rem)] rounded-lg ${currentTheme.editor} overflow-hidden`}>
              {getCurrentFile() ? (
                <SyntaxHighlighter
                  code={getCurrentFile()?.content || ""}
                  language={getCurrentFile()?.type || "html"}
                  onChange={(newContent) => updateCurrentFile(newContent)}
                  fontSize={editorSettings.fontSize}
                  lineNumbers={editorSettings.lineNumbers}
                  wordWrap={editorSettings.wordWrap}
                  className="h-full"
                  theme={appTheme}
                />
              ) : (
                <div
                  className={`h-full flex items-center justify-center ${appTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                >
                  No file selected
                </div>
              )}
            </div>
          </Card>

          {/* Preview */}
          <Card
            className={`p-2 sm:p-4 ${currentTheme.primary} ${currentTheme.border}
            ${isPreviewFullscreen ? "fixed inset-2 sm:inset-4 z-50" : "flex-1 min-w-0"}`}
          >
            <PreviewPanel
              html={preview}
              isFullscreen={isPreviewFullscreen}
              onToggleFullscreen={() => setIsPreviewFullscreen(!isPreviewFullscreen)}
              theme={currentTheme}
            />
          </Card>
        </div>
      </div>

      {/* Settings Panel */}
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} theme={currentTheme} />

      {/* Mobile close button for fullscreen preview */}
      {isPreviewFullscreen && (
        <Button
          variant="outline"
          size="icon"
          className={`${currentTheme.button} fixed top-4 right-4 z-50 lg:hidden`}
          onClick={() => setIsPreviewFullscreen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

// Wrap the component with the settings provider
export default function CodeEditor() {
  return (
    <SettingsProvider>
      <CodeEditorContent />
    </SettingsProvider>
  )
}
