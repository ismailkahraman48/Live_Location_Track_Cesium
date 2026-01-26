export const getApiUrl = (path: string) => {
    const protocol = window.location.protocol;
    const host = window.location.hostname;
    const port = '8080';
    return `${protocol}//${host}:${port}${path}`;
};