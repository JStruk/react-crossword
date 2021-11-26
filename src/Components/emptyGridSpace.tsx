interface EmptyGridSpaceProps {
    isSelectedCell: boolean
}

const EmptyGridSpace = ({ isSelectedCell }: EmptyGridSpaceProps): JSX.Element => {
    return (
        <div
            className={`border border-red-200 bg-gray-400 ${isSelectedCell ? 'bg-red-200' : ''}`}>
        </div>
    )
}

export default EmptyGridSpace