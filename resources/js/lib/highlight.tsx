import { Fragment, type ReactNode } from 'react';

/**
 * Tiny token highlighter.
 *
 * The site ships a handful of short snippets, so a full syntax-highlighting
 * library would cost far more bytes than it earns. Each language gets an
 * ordered rule list; the first rule that matches at a position wins.
 */

export type Language = 'bash' | 'json' | 'javascript' | 'php';

type Rule = { pattern: RegExp; className: string };

const TOKEN_COLORS = {
    comment: 'text-text-muted',
    string: 'text-brand/85',
    number: 'text-info',
    keyword: 'text-danger/90',
    property: 'text-text-primary',
    punctuation: 'text-text-muted',
    variable: 'text-info',
    flag: 'text-warning/90',
    boolean: 'text-info',
} as const;

const COMMON: Rule[] = [
    { pattern: /^"(?:\\.|[^"\\])*"/, className: TOKEN_COLORS.string },
    { pattern: /^'(?:\\.|[^'\\])*'/, className: TOKEN_COLORS.string },
    { pattern: /^`(?:\\.|[^`\\])*`/, className: TOKEN_COLORS.string },
];

const RULES: Record<Language, Rule[]> = {
    bash: [
        { pattern: /^#[^\n]*/, className: TOKEN_COLORS.comment },
        ...COMMON,
        { pattern: /^\s-{1,2}[A-Za-z][\w-]*/, className: TOKEN_COLORS.flag },
        { pattern: /^\b(curl|echo|export|cd)\b/, className: TOKEN_COLORS.keyword },
        { pattern: /^\\$/m, className: TOKEN_COLORS.punctuation },
    ],
    json: [
        { pattern: /^"(?:\\.|[^"\\])*"(?=\s*:)/, className: TOKEN_COLORS.property },
        ...COMMON,
        { pattern: /^\b(true|false|null)\b/, className: TOKEN_COLORS.boolean },
        { pattern: /^-?\d+(?:\.\d+)?/, className: TOKEN_COLORS.number },
        { pattern: /^[{}[\],:]/, className: TOKEN_COLORS.punctuation },
    ],
    javascript: [
        { pattern: /^\/\/[^\n]*/, className: TOKEN_COLORS.comment },
        ...COMMON,
        {
            pattern: /^\b(const|let|var|await|async|function|return|new|if|else|export|import|from)\b/,
            className: TOKEN_COLORS.keyword,
        },
        { pattern: /^\b(true|false|null|undefined)\b/, className: TOKEN_COLORS.boolean },
        { pattern: /^-?\d+(?:\.\d+)?/, className: TOKEN_COLORS.number },
        { pattern: /^[A-Za-z_$][\w$]*(?=\s*:)/, className: TOKEN_COLORS.property },
        { pattern: /^[{}[\](),;:]/, className: TOKEN_COLORS.punctuation },
    ],
    php: [
        { pattern: /^\/\/[^\n]*/, className: TOKEN_COLORS.comment },
        ...COMMON,
        { pattern: /^\$[A-Za-z_]\w*/, className: TOKEN_COLORS.variable },
        {
            pattern: /^\b(function|return|new|use|class|public|private|null|true|false)\b/,
            className: TOKEN_COLORS.keyword,
        },
        { pattern: /^-?\d+(?:\.\d+)?/, className: TOKEN_COLORS.number },
        { pattern: /^(->|=>|::)/, className: TOKEN_COLORS.punctuation },
        { pattern: /^[{}[\](),;]/, className: TOKEN_COLORS.punctuation },
    ],
};

export function highlight(code: string, language: Language): ReactNode {
    const rules = RULES[language];
    const nodes: ReactNode[] = [];

    let buffer = '';
    let index = 0;
    let key = 0;

    const flush = () => {
        if (buffer) {
            nodes.push(<Fragment key={key++}>{buffer}</Fragment>);
            buffer = '';
        }
    };

    while (index < code.length) {
        const rest = code.slice(index);
        const rule = rules.find((candidate) => candidate.pattern.test(rest));
        const match = rule ? rest.match(rule.pattern) : null;

        if (rule && match) {
            flush();
            nodes.push(
                <span key={key++} className={rule.className}>
                    {match[0]}
                </span>,
            );
            index += match[0].length;
            continue;
        }

        buffer += code[index];
        index += 1;
    }

    flush();
    return nodes;
}
