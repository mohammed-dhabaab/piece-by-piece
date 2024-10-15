class BrickWall {
    constructor(rowNum, colNum, topOffSet, rowGap, colGap, bricksColors) {
        this.bricks = []
        this.rowNum = rowNum
        this.colNum = colNum
        this.topOffSet = topOffSet
        this.rowGap = rowGap
        this.colGap = colGap
        this.bricksColors = bricksColors
    }
}

export default BrickWall