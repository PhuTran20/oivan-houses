// Matches positions in a number where a comma should be inserted for formatting (e.g., 1000 -> 1,000)
export const formatPriceRegex = /\B(?=(\d{3})+(?!\d))/g;

// Matches dollar signs, optional whitespace, and commas for parsing formatted price strings (e.g., $1,000 -> 1000)
export const parsePriceRegex = /\$\s?|(,*)/g;