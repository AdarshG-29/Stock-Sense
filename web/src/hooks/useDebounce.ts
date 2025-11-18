export const useDebounce = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const debounce = <T extends (...args: any[]) => void>(callback: T, delay: number) => {
        let timer: NodeJS.Timeout;
        return (...args: Parameters<T>) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                callback(...args);
            }, delay);
        };
    };

    return { debounce };
};