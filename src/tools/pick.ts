
export function pick<T extends Record<string, any>, Keys extends readonly string[]>(
    obj: T,
    keys: Keys
): { [key in Keys[number]]: T[key]; } {

    const out: any = {};

    keys.forEach(key => out[key] = obj[key]);

    return out;
}