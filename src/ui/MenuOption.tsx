import React from 'react';
import clsx from 'clsx';

export interface MenuOptionProps {
    label: string;
    onSelect: () => void;
    buttonRef?: (el: HTMLButtonElement | null) => void;
    isTop?: boolean;
}

const MenuOption: React.FC<MenuOptionProps> = ({
    label,
    onSelect,
    buttonRef,
    isTop,
}) => {
    const className = clsx(
        'font-mono',
        'w-full px-4 py-2 mb-2',
        'rounded border',
        'text-red-600 border-red-600',
        'hover:bg-red-600 hover:text-black',
        'focus:outline-none',
        'focus:bg-red-600 focus:text-black'
    );
    return (
        <button
            ref={buttonRef}
            onClick={onSelect}
            className={className}
            tabIndex={isTop ? 0 : -1}
        >
            {label}
        </button>
    );
};

export default MenuOption;
