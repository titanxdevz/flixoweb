"use client";

import React, { useState } from "react";
import { GuildSettings } from "@/types/dashboard";
import { Settings, X, Save, ShieldAlert } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GuildSettings;
  onSave: (newSettings: GuildSettings) => void;
  accessRole: string;
}

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSave,
  accessRole,
}: SettingsModalProps) {
  const [prefix, setPrefix] = useState(settings.prefix || "!");
  const [defaultVolume, setDefaultVolume] = useState(settings.defaultVolume || 100);
  const [djRole, setDjRole] = useState(settings.djRole || "");
  const [stay247, setStay247] = useState(!!settings.stay247);

  if (!isOpen) return null;

  const canEdit = accessRole === "admin" || accessRole === "manager";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    onSave({
      prefix,
      defaultVolume,
      djRole: djRole.trim() || null,
      stay247,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#15111C] border-[3px] border-black rounded-3xl p-5 sm:p-6 shadow-[8px_8px_0px_#000000]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#261E33] mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#20182C] border border-black rounded-lg text-[#FFB020]">
              <Settings className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-mono font-bold tracking-widest text-[#DDD4EC] uppercase">
              GUILD DSP CONFIGURATION
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-xl bg-[#221B2F] hover:bg-[#322744] text-[#DDD4EC] border border-black"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!canEdit && (
          <div className="mb-4 p-2.5 bg-[#2D1620] border border-[#522134] rounded-xl flex items-center gap-2 text-xs text-[#FF85A1] font-mono">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Read-only: You need Manage Server or Admin role to edit settings.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Prefix */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#A89CB8] font-bold mb-1">
              Bot Command Prefix
            </label>
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              disabled={!canEdit}
              maxLength={5}
              className="w-full px-3 py-2 bg-[#0E0C12] border-2 border-black rounded-xl text-sm font-mono text-white focus:outline-none focus:border-[#FFB020] disabled:opacity-50"
            />
          </div>

          {/* Default Volume */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-mono uppercase text-[#A89CB8] font-bold">
                Default Master Volume
              </label>
              <span className="text-xs font-mono font-bold text-[#FFB020] tabular-nums">
                {defaultVolume}%
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="200"
              value={defaultVolume}
              onChange={(e) => setDefaultVolume(parseInt(e.target.value, 10))}
              disabled={!canEdit}
              className="w-full accent-[#FFB020] cursor-pointer"
            />
          </div>

          {/* DJ Role Name */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#A89CB8] font-bold mb-1">
              DJ Role Identifier
            </label>
            <input
              type="text"
              value={djRole}
              onChange={(e) => setDjRole(e.target.value)}
              disabled={!canEdit}
              placeholder="e.g. DJ Master"
              className="w-full px-3 py-2 bg-[#0E0C12] border-2 border-black rounded-xl text-sm font-mono text-white placeholder:text-[#584F66] focus:outline-none focus:border-[#FFB020] disabled:opacity-50"
            />
          </div>

          {/* 24/7 Mode Toggle */}
          <div className="flex items-center justify-between p-3 bg-[#191424] rounded-xl border-2 border-black">
            <div>
              <p className="text-xs font-bold text-white font-mono">24/7 Permanent Voice Stay</p>
              <p className="text-[10px] text-[#8E849E] font-mono">
                Prevents bot auto-disconnecting when channel is empty.
              </p>
            </div>
            <input
              type="checkbox"
              checked={stay247}
              onChange={(e) => setStay247(e.target.checked)}
              disabled={!canEdit}
              className="w-5 h-5 accent-[#7CE38B] rounded border border-black cursor-pointer"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="brutal-btn px-4 py-2 bg-[#231A33] text-white text-xs font-mono font-bold rounded-xl"
            >
              Cancel
            </button>
            {canEdit && (
              <button
                type="submit"
                className="brutal-btn px-5 py-2 bg-[#FFB020] text-black text-xs font-mono font-bold rounded-xl flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Config</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
