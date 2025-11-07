import React from 'react';

/**
 * Option cho Select component
 */
interface SelectOption {
    value: string;
    label: string;
}

/**
 * Props cho component Select
 */
interface SelectProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: SelectOption[];
    required?: boolean;
    placeholder?: string;
    hint?: string;
    disabled?: boolean;
}

/**
 * Component Select dropdown
 * Hiển thị danh sách options để người dùng chọn
 */
export const Select: React.FC<SelectProps> = ({
                                                  label,
                                                  value,
                                                  onChange,
                                                  options,
                                                  required = false,
                                                  placeholder = '',
                                                  hint = '',
                                                  disabled = false
                                              }) => {
    return (
        <div className="field">
            <label className={`field-label ${required ? 'required' : ''}`}>
                {label}
            </label>
            <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="field-select"
            >
                {placeholder && (
                    <option value="">{placeholder}</option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {hint && <div className="field-hint">{hint}</div>}
        </div>
    );
};