const DANGEROUS_TAGS = /<\s*\/?\s*(script|iframe|object|embed|form|input|textarea|button|link|meta|base|applet)\b[^>]*>/gi;
const EVENT_HANDLERS = /\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/gi;
const JAVASCRIPT_URLS = /(href|src|action)\s*=\s*["']?\s*javascript\s*:/gi;
const DATA_URLS = /(href|src|action)\s*=\s*["']?\s*data\s*:/gi;

export const sanitizeHtml = (html) => {
  if (typeof html !== "string") return html;
  return html
    .replace(DANGEROUS_TAGS, "")
    .replace(EVENT_HANDLERS, "")
    .replace(JAVASCRIPT_URLS, '$1="')
    .replace(DATA_URLS, '$1="');
};
