export const dateFormatter = (date: Date): string => {
return date.toISOString().split('T')[0]; //returns in YYYY-MM-DD format
}