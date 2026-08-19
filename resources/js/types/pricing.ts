export type PricingLine = { label: string; value: string | null };

export type PricingPlan = {
    key: string;
    name: string;
    audience: string;
    available: boolean;
    lines: PricingLine[];
    includes: string[];
    cta: { label: string; href: string };
};

export type PricingResponse = {
    plans: PricingPlan[];
    note: string;
};
