import axiosInstance from "@/lib/axiosInstance";

export const searchStocks = (query: string) => {
    if (!query || query.trim() === '') {
        return;
    }
    const url = `/instruments/search?q=${query}&limit=10`;
    return axiosInstance.get(url);
};