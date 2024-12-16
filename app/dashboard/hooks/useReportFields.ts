import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Field } from '../types/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useReportFields = (reportId: string) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [alphabetFilter, setAlphabetFilter] = useState<string | null>(null);

    const fetchReportFields = async () => {
        const response = await fetch(`${API_URL}/reports/${reportId}/fields`);
        if (!response.ok) throw new Error('Failed to fetch report fields');
        return response.json();
    };

    const { data: fields, isLoading } = useQuery<Field[]>({
        queryKey: ['reportFields', reportId],
        queryFn: fetchReportFields,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const filterFields = useCallback((fields: Field[] = []) => {
        return fields.filter(field =>
            field.filtered &&
            (!searchTerm || field.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (!alphabetFilter || field.name.toLowerCase().startsWith(alphabetFilter.toLowerCase()))
        );
    }, [searchTerm, alphabetFilter]);

    return {
        fields: filterFields(fields),
        isLoading,
        setSearchTerm,
        setAlphabetFilter,
        searchTerm,
        alphabetFilter
    };
};