import { Cell } from '../types/Cell'

interface GridSpaceProps {
    cell: Cell
}

const GridSpace = ({ cell }: GridSpaceProps): JSX.Element => {
    return (
        <div
            className={`border border-red-200 ${cell.isSelectedCell ? 'bg-blue-100' : ''}`}>
            <div className="text-sm text-left">
                {cell.cellNumber === 0 ? '' : cell.cellNumber}
            </div>
            <div className="text-center text-xl h-12">
                {cell.typedLetter}
            </div>
        </div>
    )
}

export default GridSpace