export function calculateSelectedCell(currentColumn: number, currentRow: number, keyCode: number): [number, number] {
    let newCol = currentColumn
    let newRow = currentRow
    switch (keyCode) {
        case 37:
            newRow = currentRow - 1 < 0 ? 14 : currentRow - 1
            break
        case 38:
            newCol = currentColumn - 1 < 0 ? 14 : currentColumn - 1
            break
        case 39:
            newRow = currentRow + 1 > 14 ? 0 : currentRow + 1
            break
        case 40:
            newCol = currentColumn + 1 > 14 ? 0 : currentColumn + 1
            break
    }

    return [newCol, newRow]
};