import React from 'react';

type StickProps = {
    index: number;
    type: "selected" | "default" | "disabled" | "last";
    onClick: (index: number) => void;

};

const Stick: React.FC<StickProps> = ({ index,  onClick, type}) => {
    const handleClick = () => {
        if (type == "selected" || type == "default") {
            onClick(index)
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`cursor-pointer w-10 select-none mx-1 h-3/4 rounded-sm
        ${type == 'selected' ? 'bg-blue-500' : ''} 
        ${type == 'disabled' ? 'bg-gray-400  opacity-30 cursor-not-allowed' : ''}
        ${type == 'last' ? 'bg-gray-400  opacity-30 border-2 cursor-not-allowed' : ''}
        ${type == 'default' ? 'bg-gray-400 hover:bg-blue-500' : ''}
        `}
        />
    );
};

export default Stick;
