"use client";

/*
 * Fivora visual-editing glue (see https://deneb.fivora.site/docs/setup-fivora).
 *
 * - <SiteData> serves src/data/site-data.json to the app. Inside the Fivora editor (the site is in an
 *   iframe) it lazy-loads DENEB's official SiteDataProvider (site-data-bridge.tsx) so live edits show
 *   up instantly. Public visitors never download DENEB's runtime (~120 KB gz) and make no extra requests.
 * - <Field> renders one editable value with the `data-preview-field-path` marker. It adds no styling:
 *   pass the element's own className exactly as before, so the page looks identical.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ComponentPropsWithoutRef,
  type ComponentType,
  type ElementType,
  type ReactNode,
} from "react";
import siteData from "@/data/site-data.json";
import { useApp, type Lang } from "@/store";

export { withBasePath } from "./base-path";
export { fill } from "./fill";
import { fill } from "./fill";

const ContentContext = createContext<unknown>(siteData.content);

type BridgeType = ComponentType<{ onData: (content: unknown) => void; children: ReactNode }>;

export function SiteData({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<unknown>(siteData.content);
  const [Bridge, setBridge] = useState<BridgeType | null>(null);
  const onData = useCallback((c: unknown) => {
    if (c && typeof c === "object") setContent(c);
  }, []);

  useEffect(() => {
    if (window.parent === window) return; // public site: static content only
    import("./site-data-bridge").then((m) => setBridge(() => m.default));
  }, []);

  const tree = <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
  return Bridge ? <Bridge onData={onData}>{tree}</Bridge> : tree;
}

/** Reads `a.b[0].c` from content. */
export function readContent(content: unknown, path: string): unknown {
  let cur: unknown = content;
  for (const key of path.replace(/\[(\d+)\]/g, ".$1").split(".")) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[key];
  }
  return cur;
}

/** The whole live content object (editor) or the bundled one (public site). */
export function useContent(): Record<string, unknown> {
  const content = useContext(ContentContext);
  return (content && typeof content === "object" ? content : siteData.content) as Record<string, unknown>;
}

/**
 * Text lookup for the active language. English lives at `path`; a Sinhala/Tamil version, if the
 * dealer added one, lives at `translations.<lang>.<path>` (edited in the Fivora side panel).
 */
function lookup(content: unknown, lang: Lang, path: string): unknown {
  if (lang !== "en") {
    const translated = readContent(content, `translations.${lang}.${path}`);
    if (translated != null && translated !== "") return translated;
  }
  const value = readContent(content, path);
  return value === undefined ? readContent(siteData.content, path) : value;
}

/** Live value (editor) or bundled site-data.json value (public site), in the active language. */
export function useContentValue(path: string): string {
  const content = useContext(ContentContext);
  const lang = useApp((s) => s.lang);
  const value = lookup(content, lang, path);
  return value == null ? "" : String(value);
}

/** Returns a `text(path)` function, for attributes (aria-label, alt, placeholder, title). */
export function useText(): (path: string) => string {
  const content = useContext(ContentContext);
  const lang = useApp((s) => s.lang);
  return useCallback(
    (path: string) => {
      const value = lookup(content, lang, path);
      return value == null ? "" : String(value);
    },
    [content, lang],
  );
}

/** A list from the live content (empty array if missing), e.g. useList<Faq>("faqs"). */
export function useList<T = Record<string, unknown>>(path: string): T[] {
  const value = readContent(useContext(ContentContext), path);
  return (Array.isArray(value) ? value : []) as T[];
}

type FieldProps<T extends ElementType> = {
  /** Field path inside site-data.json `content`, written literally so DENEB's scanners can see it. */
  "data-preview-field-path": string;
  as?: T;
  /** Optional formatter for the raw value. */
  format?: (value: string) => ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "children" | "as">;

/**
 * One editable value. The marker attribute is forwarded untouched in `rest`: call sites write the
 * path literally (or as a `${index}` template), which is what DENEB's source scanner reads.
 */
export function Field<T extends ElementType = "span">(props: FieldProps<T>) {
  const { as, format, ...rest } = props;
  const Tag = (as ?? "span") as ElementType;
  const value = useContentValue(props["data-preview-field-path"]);
  return <Tag {...rest}>{format ? format(value) : value}</Tag>;
}

/**
 * A category name from `labels.<group>.<value>` (e.g. labels.fuel.hybrid), editable in Fivora.
 * The concrete path is written into the page, e.g. data-preview-field-path="labels.fuel.hybrid".
 */
export function LabelField({ group, value, className }: { group: string; value: string; className?: string }) {
  const path = `labels.${group}.${value}`;
  const label = useContentValue(path);
  return (
    <span className={className} {...{ "data-preview-field-path": path }}>
      {label || value}
    </span>
  );
}

/**
 * An editable template with `{placeholders}` filled in, usable from server components (which cannot
 * pass a `format` function), e.g. <FillField data-preview-field-path="cars.header.eyebrow" vars={{ count: 23 }} />.
 */
export function FillField<T extends ElementType = "span">(
  props: Omit<FieldProps<T>, "format"> & { vars: Record<string, string | number> },
) {
  const { vars, ...rest } = props;
  const fieldProps = { ...rest, format: (t: string) => fill(t, vars) } as unknown as FieldProps<T>;
  return <Field {...fieldProps} />;
}
