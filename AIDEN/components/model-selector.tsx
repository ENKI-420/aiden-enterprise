"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const models = [
  {
    value: "luuna-70b",
    label: "Luuna-70B",
    category: "Text",
  },
  {
    value: "luuna-vision",
    label: "Luuna Vision",
    category: "Multimodal",
  },
  {
    value: "luuna-code",
    label: "Luuna Code",
    category: "Code",
  },
  {
    value: "luuna-7b",
    label: "Luuna-7B",
    category: "Text",
  },
  {
    value: "gpt-4o",
    label: "GPT-4o",
    category: "Multimodal",
  },
  {
    value: "claude-3.5",
    label: "Claude-3.5",
    category: "Text",
  },
  {
    value: "llama-3",
    label: "Llama-3",
    category: "Text",
  },
  {
    value: "mistral-large",
    label: "Mistral Large",
    category: "Text",
  },
]

export function ModelSelector() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("luuna-70b")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between border-slate-700 bg-slate-800/50 hover:bg-slate-700/50"
        >
          {value ? models.find((model) => model.value === value)?.label : "Select model..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-slate-900 border-slate-700">
        <Command>
          <CommandInput placeholder="Search models..." className="h-9" />
          <CommandList>
            <CommandEmpty>No model found.</CommandEmpty>
            <CommandGroup>
              {models.map((model) => (
                <CommandItem
                  key={model.value}
                  value={model.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <Check className={cn("mr-2 h-4 w-4", value === model.value ? "opacity-100" : "opacity-0")} />
                      {model.label}
                    </div>
                    <span className="text-xs text-slate-500">{model.category}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
