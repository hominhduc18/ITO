// hooks/useAbbreviation.js
import { useState, useCallback } from 'react';
import { ABBREVIATIONS, SMART_REPLACEMENTS } from '../config/abbreviationConfig';

export const useAbbreviation = () => {
    const [suggestion, setSuggestion] = useState('');

    const expandAbbreviation = useCallback((text) => {
        if (!text) return text;

        let expandedText = text;

        // Xử lý viết tắt đơn giản
        Object.entries(ABBREVIATIONS).forEach(([abbr, full]) => {
            const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
            expandedText = expandedText.replace(regex, full);
        });

        // Xử lý pattern matching
        SMART_REPLACEMENTS.patterns.forEach(({ pattern, replacement }) => {
            expandedText = expandedText.replace(pattern, replacement);
        });

        return expandedText;
    }, []);

    const getSuggestion = useCallback((currentText, cursorPosition) => {
        if (!currentText || cursorPosition === 0) {
            setSuggestion('');
            return;
        }

        const textBeforeCursor = currentText.substring(0, cursorPosition);
        const lastWord = textBeforeCursor.split(/\s+/).pop().toLowerCase();

        // Tìm gợi ý dựa trên từ cuối cùng
        const matchedAbbr = Object.entries(ABBREVIATIONS).find(([abbr]) =>
            abbr.startsWith(lastWord) && abbr !== lastWord
        );

        if (matchedAbbr && lastWord.length >= 2) {
            setSuggestion(`↳ ${matchedAbbr[1]} (${matchedAbbr[0]})`);
        } else {
            setSuggestion('');
        }
    }, []);

    const applySuggestion = useCallback((currentText, cursorPosition) => {
        if (!suggestion) return currentText;

        const textBeforeCursor = currentText.substring(0, cursorPosition);
        const textAfterCursor = currentText.substring(cursorPosition);
        const lastSpaceIndex = textBeforeCursor.lastIndexOf(' ');
        const baseText = lastSpaceIndex >= 0 ? textBeforeCursor.substring(0, lastSpaceIndex + 1) : '';

        const abbrMatch = suggestion.match(/\(([^)]+)\)/);
        if (abbrMatch) {
            const fullText = suggestion.split(' (')[0].replace('↳ ', '');
            return baseText + fullText + textAfterCursor;
        }

        return currentText;
    }, [suggestion]);

    return {
        expandAbbreviation,
        getSuggestion,
        applySuggestion,
        suggestion
    };
};