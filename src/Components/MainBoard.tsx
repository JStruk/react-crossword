import axios from 'axios'
import { useEffect, useState } from 'react'
import { JsxEmit } from 'typescript'
import EmptyGridSpace from './emptyGridSpace'
import GridSpace from './GridSpace'


const MainBoard = (): JSX.Element => {
    const [puzzle, setPuzzle] = useState<any>()
    const [cols, setCols] = useState<number>(10)
    const [rows, setRows] = useState<number>(0)
    const [columnDivs, setColumnDivs] = useState<Array<any>>([])
    const [gridRows, setGridRows] = useState<Array<any>>([])
    const [cellNums, setCellNums] = useState<Array<Array<number>>>([])

    let skrunky: any = []

    useEffect(() => {
        (async () => {
            const { data: puzzleData } = await axios.get('https://raw.githubusercontent.com/doshea/nyt_crosswords/master/2010/01/01.json')
            setPuzzle(puzzleData)
            setCols(puzzleData.size.cols)
            setRows(puzzleData.size.rows)

            await calculateCellNum(puzzleData.gridnums)
        })()
    }, [])

    const calculateCellNum = async (gridNums: Array<number>) => {
        console.log('hi', gridNums)
        const copyGrid = JSON.parse(JSON.stringify(gridNums))
        const tmpCellNums: Array<Array<number>> = []

        for (let i = 0; i < copyGrid.length; i++) {
            const nextChunk = copyGrid.splice(0, 15)
            tmpCellNums.push(nextChunk)
        }
        // console.log(tmpCellNums)
        setCellNums(tmpCellNums)
    }

    useEffect(() => {
        if (!puzzle) return
        // console.log(puzzle)
        const copyGrid = JSON.parse(JSON.stringify(puzzle.grid))
        const tmpGridRows: Array<Array<string>> = []

        for (let i = 0; i < copyGrid.length; i++) {
            const nextChunk = copyGrid.splice(0, 15)
            tmpGridRows.push(nextChunk)
        }
        // console.log(tmpGridRows)
        setGridRows(tmpGridRows)
    }, [puzzle])

    const getCellNum = (col: number, row: number): string => {
        const cellNum = cellNums?.[col]?.[row]
        return cellNum ? String(cellNum) : ''
        // return cellNums[col][row] === 0 ? '' : String(cellNums[col][row])
    }

    return (
        <>
            Puzzle:
            {puzzle && gridRows && cellNums &&
                <div className={`grid grid-flow-col grid-cols-${cols} grid-rows-${rows} gap-4>`}>
                    {
                        (new Array(rows)).fill(undefined).map((_, row) => {
                            return gridRows.map((_, col) => {
                                return gridRows[col][row] === '.' ?
                                    <EmptyGridSpace key={`cell-${col}-${row}-empty`} />
                                    : <GridSpace key={`cell-${col}-${row}-letter`} cellNumber={getCellNum(col, row)} cellLetter={gridRows[col][row]}></GridSpace>

                            })
                        })
                    }
                </div>
            }
        </>
    )
}

export default MainBoard
