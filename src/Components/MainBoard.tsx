import axios from 'axios'
import { useEffect, useState } from 'react'
import { Cell } from '../types/Cell'
import { calculateSelectedCell } from '../utils/calculateSelectedCell'

import EmptyGridSpace from './emptyGridSpace'
import GridSpace from './GridSpace'

const MainBoard = (): JSX.Element => {
    const ARROW_KEY_CODES = [37, 38, 39, 40]

    const [puzzle, setPuzzle] = useState<any>()
    const [cols, setCols] = useState<number>(10)
    const [rows, setRows] = useState<number>(0)
    const [gridRows, setGridRows] = useState<Array<any>>([])
    const [cellNums, setCellNums] = useState<Array<Array<number>>>([])
    const [selectedColumn, setSelectedColumn] = useState<number>(0)
    const [selectedRow, setSelectedRow] = useState<number>(0)
    const [typedLetter, setTypedLetter] = useState<string>()
    const [direction, setDirection] = useState<number>(0) // 0 is across, 1 is down 

    const [cells, setCells] = useState<Array<Array<Cell>>>()

    const keyDownHandler = (event: { keyCode: any, code: any, key: any }) => {
        const [col, row] = calculateSelectedCell(selectedColumn, selectedRow, event.keyCode)
        const currentCell = cells?.[col]?.[row]

        const newCells = cells?.map(rowOfCells => {
            return rowOfCells.map((cell: Cell) => {
                cell.isSelectedCell = cell === currentCell
                return cell
            })
        })

        if (currentCell) {
            currentCell.isSelectedCell = true
            setCells(cells)
        }

        if (currentCell && !ARROW_KEY_CODES.includes(event.keyCode)) {
            currentCell.typedLetter = event.key
        }
        //     if (direction === 0) {
        //         const [nextRow, nextCol] = calculateSelectedCell(col, row + 1, event.keyCode)
        //     } else {
        //         const [nextRow, nextCol] = calculateSelectedCell(col + 1, row, event.keyCode)
        //     }
        //     direction === 0
        //         ? setSelectedRow(row + 1)
        //         : setSelectedColumn(col + 1)
        // } else {
        //     setSelectedColumn(col)
        //     setSelectedRow(row)
        // }

        setSelectedColumn(col)
        setSelectedRow(row)
        setCells(newCells)

        setTypedLetter(event.key)
        // console.log(typedLetter)
    }
    useEffect(() => {
        window.addEventListener('keydown', keyDownHandler);

        return () => {
            window.removeEventListener('keydown', keyDownHandler);
        };
    });


    useEffect(() => {
        (async () => {
            const { data: puzzleData } = await axios.get('https://raw.githubusercontent.com/doshea/nyt_crosswords/master/2010/01/01.json')
            setPuzzle(puzzleData)
            setCols(puzzleData.size.cols)
            setRows(puzzleData.size.rows)

            await calculateCellNums(puzzleData.gridnums)
        })()
    }, [])

    const calculateCellNums = async (gridNums: Array<number>) => {
        const copyGrid = JSON.parse(JSON.stringify(gridNums))
        const tmpCellNums: Array<Array<number>> = []

        for (let i = 0; i < copyGrid.length; i++) {
            const nextChunk = copyGrid.splice(0, 15)
            tmpCellNums.push(nextChunk)
        }
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
        setGridRows(tmpGridRows)
    }, [puzzle])

    useEffect(() => {
        if (cellNums.length === 0 || gridRows.length === 0) return

        const newCells = gridRows.map((_, col) => {
            return gridRows.map((_, row) => {
                const newCell: Cell = {
                    cellNumber: Number(getCellNum(col, row)),
                    cellLetter: gridRows[col][row],
                    isSelectedCell: isCellSelected(col, row),
                    row,
                    col,
                    typedLetter: ''
                }
                return newCell
            })
        })

        setCells(newCells)
        console.log(newCells)
    }, [cellNums, gridRows])

    const getCellNum = (col: number, row: number): string => {
        const cellNum = cellNums?.[col]?.[row]
        return cellNum ? String(cellNum) : ''
    }

    const isCellSelected = (col: number, row: number): boolean => {
        return (col === selectedColumn && row === selectedRow)
    }

    const getCell = (col: number, row: number): Cell => {
        return cells?.[col]?.[row] || {} as unknown as Cell
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
                                    <EmptyGridSpace key={`cell-${col}-${row}-empty`} isSelectedCell={isCellSelected(col, row)} />
                                    : <GridSpace
                                        key={`cell-${col}-${row}-letter`}
                                        cell={getCell(col, row)}
                                    // cellNumber={getCellNum(col, row)}
                                    // cellLetter={typedLetter || 'd'}
                                    // isSelectedCell={isCellSelected(col, row)}
                                    ></GridSpace>

                            })
                        })
                    }
                </div>
            }
        </>
    )
}

export default MainBoard
