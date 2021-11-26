interface EmptyGridSpaceProps {
    key: number
}

const EmptyGridSpace = ({ key }: EmptyGridSpaceProps): JSX.Element => {
    return (
        <div
            key={key}
            className="border border-red-200 bg-gray-400">
        </div>
    )
}

export default EmptyGridSpace