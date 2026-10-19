"use client";

import React from "react";
import { VoiceChannel } from "@/types/dashboard";
import { Radio, Users, Power, ShieldCheck } from "lucide-react";

interface VoiceControllerProps {
  voiceChannels: VoiceChannel[];
  activeChannelName?: string | null;
  listeners: number;
  stay247: boolean;
  onToggle247: (enabled: boolean) => void;
  onDisconnect: () => void;
  onSelectChannel?: (channelId: string) => void;
  accessRole: string;
}

export default function VoiceController({
  voiceChannels,
  activeChannelName,
  listeners,
  stay247,
  onToggle247,
  onDisconnect,
  onSelectChannel,
  accessRole,
}: VoiceControllerProps) {
  const canManage = accessRole === "admin" || accessRole === "manager";

  return (
    <div className="bg-[#14101A] border-[3px] border-[#000000] rounded-3xl p-4 sm:p-5 shadow-[6px_6px_0px_#000000] flex flex-col gap-3.5">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#261E33]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#20182C] border border-black rounded-lg text-[#7CE38B]">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold tracking-wider text-[#A89CB8] uppercase">
              VOICE LINK // DISCORD GATEWAY
            </h3>
            <p className="text-[11px] font-mono text-[#DDD4EC]">
              Status:{" "}
              <span className="text-[#7CE38B] font-bold">
                {activeChannelName ? `CONNECTED TO #${activeChannelName}` : "STANDBY"}
              </span>
            </p>
          </div>
        </div>

        {/* Live Listener Counter Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#19221C] border border-[#2D4533] rounded-lg">
          <span className="w-2 h-2 rounded-full bg-[#7CE38B] animate-pulse" />
          <Users className="w-3.5 h-3.5 text-[#7CE38B]" />
          <span className="text-xs font-mono font-bold text-[#7CE38B] tabular-nums">
            {listeners} {listeners === 1 ? "listener" : "listeners"}
          </span>
        </div>
      </div>

      {/* Channel Selector / Switcher */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="flex-1">
          <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8E849E] mb-1">
            Voice Channel Switcher
          </label>
          <select
            value={voiceChannels.find((vc) => vc.isCurrent)?.id || ""}
            onChange={(e) => onSelectChannel?.(e.target.value)}
            disabled={!canManage}
            className="w-full px-3 py-2 bg-[#0E0C12] border-2 border-black rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#FFB020] disabled:opacity-50"
          >
            {voiceChannels.length === 0 ? (
              <option value="">{activeChannelName || "No voice channels found"}</option>
            ) : (
              voiceChannels.map((vc) => (
                <option key={vc.id} value={vc.id}>
                  #{vc.name} {vc.membersCount ? `(${vc.membersCount} in channel)` : ""}
                </option>
              ))
            )}
          </select>
        </div>

        {/* 24/7 Mode Toggle Switch */}
        <div className="sm:w-44 flex flex-col justify-between bg-[#191424] p-2.5 rounded-xl border-2 border-black">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold">
            <span className="text-[#DDD4EC] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#FFB020]" />
              24/7 MODE
            </span>
            <span
              className={`text-[10px] font-mono font-bold ${
                stay247 ? "text-[#7CE38B]" : "text-[#8E849E]"
              }`}
            >
              {stay247 ? "ENABLED" : "OFF"}
            </span>
          </div>
          <button
            onClick={() => onToggle247(!stay247)}
            disabled={!canManage}
            className={`brutal-btn mt-1.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-colors ${
              stay247
                ? "bg-[#7CE38B] text-black"
                : "bg-[#271E36] text-[#A89CB8] hover:text-white"
            } disabled:opacity-40`}
          >
            {stay247 ? "DISABLE 24/7" : "KEEP BOT IN VOICE"}
          </button>
        </div>

        {/* Disconnect button */}
        <button
          onClick={onDisconnect}
          disabled={!canManage}
          className="brutal-btn px-4 py-2 bg-[#3A1422] text-[#FF5CAA] hover:bg-[#4E192E] rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 self-end disabled:opacity-40"
        >
          <Power className="w-3.5 h-3.5" />
          <span>LEAVE VC</span>
        </button>
      </div>
    </div>
  );
}
