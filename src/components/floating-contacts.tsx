"use client";

import { waLink, tgLink } from "@/lib/links";
import { WhatsAppIcon, TelegramIcon } from "./icons";

export function FloatingContacts({ whatsapp, telegram }: { whatsapp: string; telegram: string }) {
  return (
    <div className="fixed bottom-5 right-5 z-30 flex flex-col gap-3">
      <a
        href={tgLink(telegram)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Написать в Telegram"
        className="grid h-14 w-14 place-items-center rounded-full bg-[#2d8fd6] text-cream shadow-lift transition hover:scale-105"
      >
        <TelegramIcon className="h-7 w-7" />
      </a>
      <a
        href={waLink(whatsapp, "Здравствуйте! Пишу с сайта.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Написать в WhatsApp"
        className="group relative grid h-14 w-14 place-items-center rounded-full bg-pine text-cream shadow-lift transition hover:scale-105"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-pine/40" />
        <WhatsAppIcon className="relative h-7 w-7" />
      </a>
    </div>
  );
}
