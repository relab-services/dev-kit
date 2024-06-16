export type Metadata = Record<string, string>
export type Theme = 'Blue' | 'Cyan' | 'Emerald' | 'Gray' | 'Green' | 'Indigo' | 'Lime' | 'Orange' | 'Pink' | 'Purple' | 'Zinc'

type CssResolver = (theme: Theme, dark: boolean) => string

const resolveAccentColor = (theme: Theme, dark: boolean) => accentColors[theme][dark ? 'dark' : 'light']

const headerCss: CssResolver = (theme, dark) => `
    margin: 16px 0 24px;
    padding: 32px 32px 32px 24px;
    font-family: Tahoma, sans-serif;
    font-size: 24px;
    font-weight: 300;
    color: ${resolveAccentColor(theme, dark)[1]};
    background-color: ${resolveAccentColor(theme, dark)[0]};
    border-radius: 5px;
`

const itemsTitleCss: CssResolver = (theme, dark) => `
    padding: 0 12px 4px 12px;
    font-family: monospace;
    font-size: 12px;
    font-weight: bold;
    color: ${dark ? '#a1a1aa' : '#a1a1aa'};
    text-transform: uppercase;
`

const itemsValueCss: CssResolver = (theme, dark) => `
    font-family: monospace;
    font-size: 12px;
    font-weight: bold;
    color: ${dark ? '#f4f4f5' : '#3f3f46'};
`

const subItemsTitleCss: CssResolver = (theme, dark) => `
    padding: 0 0 4px 12px;
    font-family: monospace;
    font-size: 10px;
    color: ${dark ? '#71717a' : '#a1a1aa'};
    text-transform: uppercase;
`

const subItemsValueCss: CssResolver = (theme, dark) => `
    font-family: monospace;
    font-size: 10px;
    color: ${dark ? '#71717a' : '#a1a1aa'};
    text-decoration: underline;    
`

export const displayAppInfo = (
    appName: string,
    metadata: Metadata,
    options?: {
        theme?: Theme
        printStartTime?: boolean
    }
) => {
    if (!window.console) return

    const theme: Theme = options?.theme ?? 'Zinc'
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

    const maxLength = Object.keys(metadata).reduce<number>((result, current) => Math.max(result, metadata[current]?.trim() ? current.length : 0), 0)

    const items = Object.entries(metadata).reduce<string[]>(
        (result, [title, value]) => (title?.trim() && value?.trim() ? [...result, `%c${`${title}:`.padEnd(maxLength + 1)} %c${value}`] : result),
        []
    )
    const itemsCss = Array.from({ length: items.length }).reduce<string[]>(
        result => [...result, itemsTitleCss(theme, isDark), itemsValueCss(theme, isDark)],
        []
    )

    console.log(
        `%c${appName}%c\n${items.join('\n')}%c${
            options?.printStartTime !== false ? `\n\n%cFrontend started at %c ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}` : ''
        }%c\n\n`,
        headerCss(theme, isDark),
        '',
        ...itemsCss,
        '',
        ...(options?.printStartTime !== false ? [subItemsTitleCss(theme, isDark), subItemsValueCss(theme, isDark)] : []),
        ''
    )
}

const accentColors: Record<Theme, Record<'dark' | 'light', [string, string]>> = {
    Blue: {
        dark: ['#1e40af', '#eff6ff'],
        light: ['#60a5fa', '#eff6ff'],
    },
    Cyan: {
        dark: ['#155e75', '#ecfeff'],
        light: ['#06b6d4', '#ecfeff'],
    },
    Emerald: {
        dark: ['#065f46', '#ecfdf5'],
        light: ['#10b981', '#ecfdf5'],
    },
    Gray: {
        dark: ['#374151', '#f9fafb'],
        light: ['#6b7280', '#f9fafb'],
    },
    Green: {
        dark: ['#166534', '#f0fdf4'],
        light: ['#22c55e', '#f0fdf4'],
    },
    Indigo: {
        dark: ['#3730a3', '#eef2ff'],
        light: ['#6366f1', '#eef2ff'],
    },
    Lime: {
        dark: ['#3f6212', '#f7fee7'],
        light: ['#84cc16', '#f7fee7'],
    },
    Orange: {
        dark: ['#9a3412', '#fff7ed'],
        light: ['#f97316', '#fff7ed'],
    },
    Pink: {
        dark: ['#9d174d', '#fdf2f8'],
        light: ['#ec4899', '#fdf2f8'],
    },
    Purple: {
        dark: ['#6b21a8', '#faf5ff'],
        light: ['#a855f7', '#faf5ff'],
    },
    Zinc: {
        dark: ['#52525b', '#fafafa'],
        light: ['#71717a', '#fafafa'],
    },
}
