export type Shape = 
    { type: "rect", x: number, y: number, w: number, h: number } |
    { type: "ellipse", x: number, y: number, rx: number, ry: number } |
    { type: "arrow", x: number, y: number, endX: number, endY: number } |
    { type: "text", x: number, y: number, content: string } | 
    { type : "freehand" , points: { x: number, y: number }[] }