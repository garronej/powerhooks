
export const chromeFontSizesFactors = {
    "Very small": 0.5625,
    "Small": 0.75,
    "Medium (Recommended)": 1,
    "Large": 1.25,
    "Very Large": 1.5,
} as const;

export type ChromeFontSize = keyof typeof chromeFontSizesFactors;