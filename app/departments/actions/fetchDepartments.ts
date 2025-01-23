const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchDepartments = async () => {
    const res = await fetch(`${API_URL}/departments`, {
        cache: "no-store", // To avoid caching during development
    });
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    return res.json();
};
