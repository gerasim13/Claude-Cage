import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// Minimal i18n for the workbench UI.
//
// Strings stay in the source as Simplified Chinese (the project's default
// language). A translation is looked up by the source string itself, so a
// string that is not yet translated simply keeps rendering in Chinese and the
// default locale never changes. New languages are added by appending a
// `{ "<zh source>": "<translation>" }` map; no string IDs or catalog files.
const STORAGE_KEY = "cage-language";

export const supportedLocales = ["zh", "en"];
export const localeNames = { zh: "中文", en: "English" };

const en = {
  // Appearance settings.
  "外观": "Appearance",
  "更改自动保存并即时生效，无需重启项目。":
    "Changes save automatically and apply instantly — no restart needed.",
  "语言": "Language",
  "界面语言，切换后立即生效。": "Interface language; applies immediately.",
  "主题": "Theme",
  "跟随系统，或固定使用浅色、深色外观。":
    "Follow the system, or stay on light or dark.",
  "浅色": "Light",
  "深色": "Dark",
  "跟随系统": "System",
  "浅色主题": "Light theme",
  "深色主题": "Dark theme",
  "当前使用": "In use",
  "自定义": "Custom",
  "自定义配色，可另存为主题以便下次使用。":
    "Custom colors — save as a theme to reuse later.",
  "成功": "Success",
  "警告": "Warning",
  "错误": "Error",
  "强调色": "Accent",
  "背景": "Background",
  "文字": "Text",
  "未单独设置的颜色随基础配色自动调整。":
    "Colors left unset follow the base colors automatically.",
  "恢复自动颜色": "Restore automatic colors",
  "恢复全部自动颜色": "Restore all automatic colors",
  "请输入 # 加六位十六进制颜色":
    "Enter a six-digit hex color, e.g. #fdf6e3",
  "对比度": "Contrast",
  "界面字体": "UI font",
  "代码字体": "Code font",
  "系统默认": "System default",
  "系统等宽字体": "System monospace",
  "半透明侧栏": "Translucent sidebar",
  "我的主题": "My themes",
  "保存浅色、深色两套配色与字体，随时切换或分享。":
    "Save light and dark color schemes and fonts to switch or share anytime.",
  "导入主题": "Import theme",
  "导出主题": "Export theme",
  "选择主题文件": "Choose a theme file",
  "主题文件不能超过 256 KB": "Theme files must be under 256 KB",
  "已保存的主题": "Saved themes",
  "选择已保存的主题": "Choose a saved theme",
  "尚无自定义主题": "No custom themes yet",
  " · 已修改": " · Modified",
  "主题名称": "Theme name",
  "为当前配色命名": "Name the current scheme",
  "另存为主题": "Save as theme",
  "当前配色有未存入主题的修改": "Current scheme has unsaved changes",
  "当前配色与已保存主题一致": "Current scheme matches a saved theme",
  "恢复已保存配色": "Restore saved scheme",
  "更新此主题": "Update this theme",
  "删除": "Delete",
  "主题已保存": "Theme saved",
  "主题已导入并应用": "Theme imported and applied",
  "主题已导出": "Theme exported",
  "已开始下载主题文件": "Started downloading the theme file",
  "主题已删除，当前配色已保留": "Theme deleted; current scheme kept",
  "字体": "Fonts",
  "界面字号": "UI font size",
  "调整导航、标签和设置中的文字大小。":
    "Text size for navigation, tabs, and settings.",
  "代码字号": "Code font size",
  "调整内置终端与代码预览的文字大小。":
    "Text size for the terminal and code previews.",
  "在熟悉的工作区，专注下一步。":
    "Stay focused on what's next, in a familiar workspace.",
  "显示与交互": "Display & interaction",
  "使用指针光标": "Pointer cursors",
  "悬停在按钮等可交互元素上时显示手形。":
    "Show a hand cursor over buttons and other interactive elements.",
  "字体平滑": "Font smoothing",
  "减少动态效果": "Reduce motion",
  "开启": "On",
  "关闭": "Off",
  "沿用 Codex 的外观": "Adopt Codex appearance",
  "导入本机 Codex 当前的主题、配色与字体偏好。":
    "Import the current theme, colors, and font preferences from Codex on this machine.",
  "从本机 Codex 同步": "Sync from Codex",
  "正在保存…": "Saving…",
  "未保存": "Not saved",
  "重试保存": "Retry save",
  "已同步 Codex 外观": "Synced Codex appearance",
  "更改自动保存，即时生效": "Changes save automatically and apply instantly",

  // Main chrome and environment status.
  "正在启动 Cage 环境…": "Starting Cage environment…",
  "Windows 云端": "Windows Cloud",
  "外网状态待确认": "Network status unknown",
  "连接中断": "Connection lost",
  "检查中": "Checking",
  "停止中": "Stopping",
  "应用中": "Applying",
  "启动中": "Starting",
  "运行中": "Running",
  "离线可用": "Available offline",
  "环境待更新": "Environment update needed",
  "浏览器待恢复": "Browser recovery pending",
  "已停止": "Stopped",
  "项目文件已刷新": "Project files refreshed",
  "新账号登录": "New account sign-in",
  "Claude 账号": "Claude account",

  // Confirm dialogs.
  "归档这段会话？": "Archive this session?",
  "归档会关闭关联终端。历史将保留，可从设置中的已归档会话恢复。":
    "Archiving closes the linked terminal. History is kept and can be restored from the archived sessions in settings.",
  "归档会话": "Archive session",
  "正在归档…": "Archiving…",
  "关闭这个终端会话？": "Close this terminal session?",
  "该终端中的交互命令可能被中断。网页和其他终端不受影响。":
    "Interactive commands in this terminal may be interrupted. Web pages and other terminals are unaffected.",
  "关闭终端": "Close terminal",
  "关闭文件编辑器？": "Close the file editor?",
  "请先保存未完成的修改。文件仍保留在共享项目中。":
    "Save any unfinished changes first. Files remain in the shared project.",
  "关闭编辑器": "Close editor",
  "停止安装环境？": "Stop installing the environment?",
  "停止当前环境？": "Stop the current environment?",
  "当前安装任务会停止。下次启动环境时可以继续安装。":
    "The current installation will stop. You can continue it next time you start the environment.",
  "请先保存文件。当前终端会话会结束，浏览器登录和项目文件会保留。":
    "Save files first. Current terminal sessions will end; browser logins and project files are kept.",
  "停止安装": "Stop installation",
  "停止环境": "Stop environment",
  "退出 Cage": "Quit Cage",
  "仅退出桌面应用": "Quit desktop app only",
  "停止环境并退出": "Stop environment and quit",
  "保留运行并退出": "Keep running and quit",
  "工作台连接已中断，暂时无法确认环境状态。仍在运行的后台任务会继续。":
    "The workbench connection was lost and the environment state can't be confirmed right now. Running background tasks will continue.",
  "退出前请保存文件和设置。可以保留环境，让后台任务继续运行；下次打开会重新连接。":
    "Save files and settings before quitting. You can keep the environment so background tasks continue; reopening will reconnect.",
};

const translations = { zh: {}, en };

function readLocale() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (supportedLocales.includes(saved)) return saved;
  } catch {
    // Storage may be unavailable; fall back to the default locale.
  }
  return "zh";
}

const I18nContext = createContext({
  locale: "zh",
  setLocale: () => {},
  t: (text) => text,
});

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(readLocale);
  const setLocale = useCallback((next) => {
    const value = supportedLocales.includes(next) ? next : "zh";
    setLocaleState(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Storage may be unavailable; the in-memory locale still applies.
    }
  }, []);
  const t = useCallback(
    (text) => {
      if (typeof text !== "string" || locale === "zh") return text;
      return translations[locale]?.[text] ?? text;
    },
    [locale],
  );
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
