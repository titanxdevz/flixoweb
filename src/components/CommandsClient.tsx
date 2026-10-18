"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  allCommands,
  commandCategories,
  PermissionRole,
} from "@/lib/data/commands";
import Link from "next/link";

export default function CommandsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const filteredCommands = useMemo(() => {
    return allCommands.filter((cmd) => {
      const matchCat =
        selectedCategory === "all" || cmd.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        cmd.name.toLowerCase().includes(q) ||
        cmd.description.toLowerCase().includes(q) ||
        cmd.usage.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const copyUsage = (syntax: string, name: string) => {
    navigator.clipboard.writeText(syntax);
    setCopiedCmd(name);
    setTimeout(() => setCopiedCmd(null), 1800);
  };

  const getPermissionBadge = (perm: PermissionRole) => {
    switch (perm) {
      case "admin":
        return <span className="px-2 py-0.5 rounded bg-[#FF5CAA] text-white text-[10px] font-bold border border-[#000000]">Admin only</span>;
      case "manager":
        return <span className="px-2 py-0.5 rounded bg-[#7C3AED] text-white text-[10px] font-bold border border-[#000000]">Manage server</span>;
      case "dj":
        return <span className="px-2 py-0.5 rounded bg-[#2A1B44] text-[#C4B5FD] text-[10px] font-bold border border-[#000000]">DJ role</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-[#1A1128] text-[#DDD4EC] text-[10px] font-bold border border-[#000000]">Listener</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0919] text-white">
      <Navbar />

      <main className="py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <Link
              href="/"
              className="inline-block text-xs font-bold text-[#FF5CAA] hover:underline mb-3"
            >
              ← Back to home
            </Link>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white font-[family-name:var(--font-fredoka)] tracking-tight">
              Bot commands directory.
            </h1>
            <p className="mt-4 text-base text-[#DDD4EC] font-medium leading-relaxed">
              Complete reference of all {allCommands.length} Discord slash commands, option parameters, and role permissions. Click any command to copy its syntax or share its anchor link.
            </p>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-10 pb-8 border-b-[3px] border-[#000000]">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`brutal-btn text-xs px-3.5 py-2 rounded-xl font-bold transition-all ${
                  selectedCategory === "all"
                    ? "bg-[#7C3AED] text-white shadow-[2px_2px_0px_#000000] translate-x-[2px] translate-y-[2px]"
                    : "bg-[#181026] text-[#DDD4EC] shadow-[4px_4px_0px_#000000] hover:bg-[#221636]"
                }`}
              >
                All ({allCommands.length})
              </button>
              {commandCategories.map((cat) => {
                const count = allCommands.filter((c) => c.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`brutal-btn text-xs px-3.5 py-2 rounded-xl font-bold transition-all ${
                      selectedCategory === cat.id
                        ? "bg-[#7C3AED] text-white shadow-[2px_2px_0px_#000000] translate-x-[2px] translate-y-[2px]"
                        : "bg-[#181026] text-[#DDD4EC] shadow-[4px_4px_0px_#000000] hover:bg-[#221636]"
                    }`}
                  >
                    {cat.label} ({count})
                  </button>
                );
              })}
            </div>

            <div className="w-full lg:w-80">
              <input
                type="text"
                placeholder="Search commands by name, option, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-bold px-4 py-3 rounded-xl bg-[#181026] border-[3px] border-[#000000] shadow-[4px_4px_0px_#000000] text-white placeholder-[#A692C6] focus-visible:outline-[3px] focus-visible:outline-[#FF5CAA]"
                aria-label="Search all commands"
              />
            </div>
          </div>

          {/* Commands List with Deep Link Anchors */}
          <div className="space-y-6">
            {filteredCommands.length > 0 ? (
              filteredCommands.map((cmd) => (
                <div
                  key={cmd.name}
                  id={cmd.name.replace(/\s+/g, "-")}
                  className="bg-[#181026] border-[3px] border-[#000000] shadow-[6px_6px_0px_#000000] rounded-2xl p-6 scroll-mt-28 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-[2px] border-[#000000]">
                    <div className="flex items-center gap-3">
                      <a
                        href={`#${cmd.name.replace(/\s+/g, "-")}`}
                        className="font-mono font-black text-xl text-white hover:text-[#FF5CAA] transition-colors"
                        title="Link to this command"
                      >
                        /{cmd.name}
                      </a>
                      {getPermissionBadge(cmd.permission)}
                    </div>

                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono font-bold text-[#C4B5FD] bg-[#0E0919] border border-[#000000] px-3 py-1.5 rounded-lg max-w-md truncate">
                        {cmd.usage}
                      </code>
                      <button
                        type="button"
                        onClick={() => copyUsage(cmd.usage, cmd.name)}
                        className="brutal-btn px-3 py-1.5 bg-[#221636] text-white rounded-lg text-xs font-black shadow-[3px_3px_0px_#000000] hover:bg-[#2A1B44] shrink-0"
                        aria-label={`Copy command ${cmd.name}`}
                      >
                        {copiedCmd === cmd.name ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-[#DDD4EC] font-medium leading-relaxed">
                    {cmd.description}
                  </p>

                  {/* Options Table if command has parameters */}
                  {cmd.options && cmd.options.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-[#221636]">
                      <div className="text-[11px] font-bold text-[#A692C6] uppercase tracking-wider mb-2">
                        Options &amp; Parameters
                      </div>
                      <div className="overflow-x-auto rounded-xl border border-[#000000] bg-[#120B1E]">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-[#1E1332] text-[#DDD4EC] border-b border-[#000000]">
                              <th className="py-2.5 px-3.5 font-bold">Name</th>
                              <th className="py-2.5 px-3.5 font-bold">Type</th>
                              <th className="py-2.5 px-3.5 font-bold">Required</th>
                              <th className="py-2.5 px-3.5 font-bold">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#1A1028]">
                            {cmd.options.map((opt) => (
                              <tr key={opt.name}>
                                <td className="py-2 px-3.5 font-mono font-bold text-white">
                                  {opt.name}
                                </td>
                                <td className="py-2 px-3.5 font-mono text-[#C4B5FD]">
                                  {opt.type}
                                </td>
                                <td className="py-2 px-3.5">
                                  {opt.required ? (
                                    <span className="text-[#FF5CAA] font-bold">Yes</span>
                                  ) : (
                                    <span className="text-[#A692C6]">No</span>
                                  )}
                                </td>
                                <td className="py-2 px-3.5 text-[#DDD4EC]">
                                  {opt.description}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-[#181026] border-[3px] border-[#000000] shadow-[6px_6px_0px_#000000] rounded-2xl p-12 text-center text-sm font-bold text-[#A692C6]">
                No commands found matching &quot;{searchQuery}&quot;.
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
