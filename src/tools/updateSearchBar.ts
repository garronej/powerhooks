export function updateSearchBarUrl(url: string) {
    window.history.replaceState("", "", url);
}
