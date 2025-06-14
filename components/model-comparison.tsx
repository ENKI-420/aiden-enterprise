"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function ModelComparison() {
  return (
    <div className="rounded-md border border-slate-700 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-800/50">
          <TableRow className="hover:bg-slate-800/70 border-slate-700">
            <TableHead className="text-slate-400">Model</TableHead>
            <TableHead className="text-slate-400">Parameters</TableHead>
            <TableHead className="text-slate-400">Context</TableHead>
            <TableHead className="text-slate-400">MMLU</TableHead>
            <TableHead className="text-slate-400">HumanEval</TableHead>
            <TableHead className="text-slate-400">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="hover:bg-slate-800/30 border-slate-700">
            <TableCell className="font-medium text-slate-300">Luuna-70B</TableCell>
            <TableCell>70B</TableCell>
            <TableCell>128K</TableCell>
            <TableCell className="text-cyan-400">89.2%</TableCell>
            <TableCell className="text-cyan-400">76.5%</TableCell>
            <TableCell>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Available</Badge>
            </TableCell>
          </TableRow>
          <TableRow className="hover:bg-slate-800/30 border-slate-700">
            <TableCell className="font-medium text-slate-300">GPT-4o</TableCell>
            <TableCell>~1.8T</TableCell>
            <TableCell>128K</TableCell>
            <TableCell className="text-cyan-400">90.1%</TableCell>
            <TableCell className="text-cyan-400">78.3%</TableCell>
            <TableCell>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Available</Badge>
            </TableCell>
          </TableRow>
          <TableRow className="hover:bg-slate-800/30 border-slate-700">
            <TableCell className="font-medium text-slate-300">Claude-3.5</TableCell>
            <TableCell>~1.5T</TableCell>
            <TableCell>200K</TableCell>
            <TableCell className="text-cyan-400">88.7%</TableCell>
            <TableCell className="text-cyan-400">75.8%</TableCell>
            <TableCell>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Available</Badge>
            </TableCell>
          </TableRow>
          <TableRow className="hover:bg-slate-800/30 border-slate-700">
            <TableCell className="font-medium text-slate-300">Llama-3</TableCell>
            <TableCell>70B</TableCell>
            <TableCell>128K</TableCell>
            <TableCell className="text-cyan-400">86.4%</TableCell>
            <TableCell className="text-cyan-400">74.2%</TableCell>
            <TableCell>
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Limited</Badge>
            </TableCell>
          </TableRow>
          <TableRow className="hover:bg-slate-800/30 border-slate-700">
            <TableCell className="font-medium text-slate-300">Mistral-Large</TableCell>
            <TableCell>32B</TableCell>
            <TableCell>32K</TableCell>
            <TableCell className="text-cyan-400">85.9%</TableCell>
            <TableCell className="text-cyan-400">73.1%</TableCell>
            <TableCell>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Available</Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
