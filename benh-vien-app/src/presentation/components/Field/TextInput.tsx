import React from 'react';

/**
 * Props cho component TextInput
 */
interface TextInputProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: 'text' | 'date' | 'email' | 'tel' | 'number';
    required?: boolean;
    placeholder?: string;
    hint?: string;
    disabled?: boolean;
    readOnly?: boolean;
}

/**
 * Component Input text cơ bản
 * Hỗ trợ nhiều loại input: text, date, email, tel, number
 */
export const TextInput: React.FC<TextInputProps> = ({
                                                        label,
                                                        value,
                                                        onChange,
                                                        type = 'text',
                                                        required = false,
                                                        placeholder = '',
                                                        hint = '',
                                                        disabled = false,
                                                        readOnly = false
                                                    }) => {
    return (
        <div className="field">
            <label className={`field-label ${required ? 'required' : ''}`}>
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                className="field-input"
            />
            {hint && <div className="field-hint">{hint}</div>}
        </div>
    );
};