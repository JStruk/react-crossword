interface GridSpaceProps {
    cellNumber: string
    cellLetter: string
}

const GridSpace = ({ cellNumber, cellLetter }: GridSpaceProps): JSX.Element => {
    return (
        <div
            className="border border-red-200">
            <div className="text-sm text-left">
                {cellNumber}
            </div>
            <div className="text-center text-xl h-12">
                {/* {cellLetter} */}
            </div>
        </div>
    )
}

export default GridSpace