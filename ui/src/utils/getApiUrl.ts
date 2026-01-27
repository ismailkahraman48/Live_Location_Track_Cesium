export const getApiUrl = (path: string) => {
    const envUrl = import.meta.env.VITE_API_URL;
    let baseUrl = envUrl || "http://127.0.0.1:8080";
    if (baseUrl.endsWith('/')) {
        baseUrl = baseUrl.slice(0, -1);
    }

    if (!path.startsWith('/')) {
        path = `/${path}`;
    }

    return `${baseUrl}${path}`;
};