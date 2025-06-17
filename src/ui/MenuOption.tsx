import React from 'react';
import clsx from 'clsx';

export interface MenuOptionProps {
    label: string;
    onSelect: () => void;
    selected: boolean;
    buttonRef: (el: HTMLButtonElement | null) => void;
}

const MenuOption: React.FC<MenuOptionProps> = ({
    label,
    onSelect,
    selected,
    buttonRef,
}) => {
    const className = clsx(
        'w-full',
        'px-4 py-2 font-mono border border-red-600 rounded mb-2 focus:outline-none',
        'hover:bg-red-600 hover:text-black',
        {
            'bg-red-600 text-black': selected,
            'text-red-600': !selected,
        }
    );
    return (
        <button ref={buttonRef} onClick={onSelect} className={className}>
            {label}
        </button>
    );
};

export default MenuOption;
