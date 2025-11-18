import { searchStocks } from "@/services/instrument.api";
import { SearchItemType } from "@/types/SearchItemType";
import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "./useDebounce";

export const useSearchItem = () => {
    const [searchInput, setSearchInput] = useState<string>("");
    const [searchResults, setSearchResults] = useState<SearchItemType[]>([]);

    const { debounce } = useDebounce();

    const onInputChange = (input: string) => {
        setSearchInput(input);
    };

    const getSearchItems = async (query: string) => {
        if (!query || query.trim() === "") {
            return;
        }
        try {
            const res = await searchStocks(query);
            setSearchResults(res?.data?.results || []);
        } catch (error) {
            console.error("Error searching stocks:", error);
        }
    };

    const getDebouncedSearchItems = useCallback(debounce(getSearchItems, 300),[]);

    useEffect(() => {
        getDebouncedSearchItems(searchInput);
    }, [searchInput, getDebouncedSearchItems]);

    return {
        searchInput,
        searchResults,
        onInputChange,
    };
};
