import React from 'react';
import clsx from 'clsx';

export interface MenuOptionProps {
    label: string;
    onSelect: () => void;
    buttonRef: (el: HTMLButtonElement | null) => void;
    isTop: boolean;
}

const MenuOption: React.FC<MenuOptionProps> = ({
    label,
    onSelect,
    buttonRef,
    isTop,
}) => {
    const className = clsx(
        'w-full',
        'px-4 py-2 font-mono border border-red-600 rounded mb-2 focus:outline-none',
        'hover:bg-red-600 hover:text-black',
        'focus:bg-red-600 focus:text-black',
        'text-red-600',
    );
    return (
        <button ref={buttonRef} onClick={onSelect} className={className} tabIndex={isTop ? 0 : -1}>
            {label}
        </button>
    );
};

export default MenuOption;
