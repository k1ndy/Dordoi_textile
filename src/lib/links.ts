// Хелперы для построения ссылок на мессенджеры.
export function waLink(number: string, text?: string) {
  const clean = number.replace(/[^\d]/g, "");
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${clean}${q}`;
}

export function tgLink(username: string, text?: string) {
  const handle = username.replace(/^@/, "");
  // t.me не поддерживает предзаполненный текст для прямых чатов, но оставим username.
  return `https://t.me/${handle}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function igLink(username: string) {
  return `https://instagram.com/${username.replace(/^@/, "")}`;
}
