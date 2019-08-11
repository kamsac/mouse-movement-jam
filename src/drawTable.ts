import Point from './Point';

interface DrawTableParameters {
    context: CanvasRenderingContext2D;
    rows: TableRowData[];
    topLeftPosition: Point;
    fontSize: number;
    lineHeight: number;
    color: string;
}

export default function drawTable(
    {context, rows, topLeftPosition, fontSize, lineHeight, color}: DrawTableParameters,
): void {
    context.fillStyle = color;
    context.strokeStyle = color;
    context.font = `bold ${fontSize}px monospace`;

    const longestRowCombination: TableRowData = rows.reduce((acc, row) => {
        return {
            key: acc.key.length > row.key.length ? acc.key : row.key,
            value: acc.value.length > row.value.length ? acc.value : row.value,
        };
    }, {key: '', value: ''});

    const longestKeyWidth: number = context.measureText(longestRowCombination.key).width;
    const longestValueWidth: number = context.measureText(longestRowCombination.value).width;
    const colonWidth: number = context.measureText(':').width;

    const colonPadding: number = colonWidth * 0.5;

    const keyPosition: Point = new Point(
        topLeftPosition.x + longestKeyWidth - colonWidth,
        topLeftPosition.y,
    );
    const colonPosition: Point = new Point(
        topLeftPosition.x + longestKeyWidth + colonPadding,
        keyPosition.y,
    );
    const valuePosition: Point = new Point(
        colonPosition.x + colonPadding,
        keyPosition.y,
    );

    rows.forEach((row, index) => {
        context.textAlign = 'right';
        drawText(context, row.key, keyPosition.x, keyPosition.y + lineHeight * index);

        if (row.skipSemicolon) {
            context.fillStyle = '#0000';
            context.strokeStyle = '#0000';
            drawText(context, ':', colonPosition.x, colonPosition.y + lineHeight * index);
            context.fillStyle = color;
            context.strokeStyle = color;
        } else {
            drawText(context, ':', colonPosition.x, colonPosition.y + lineHeight * index);
        }

        context.textAlign = 'left';
        drawText(context, row.value, valuePosition.x, valuePosition.y + lineHeight * index);
    });
}

function drawText(context: CanvasRenderingContext2D, text: string, x: number, y: number): void {
    context.fillText(text, x, y);
    context.strokeText(text, x, y);
}

export interface TableRowData {
    key: string;
    value: string;
    skipSemicolon?: boolean;
}