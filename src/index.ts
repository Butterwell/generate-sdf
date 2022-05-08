
import { parse } from 'opentype.js'

function distanceSquared(x: number, y: number, p: {x: number, y: number}) {
  const dx = p.x - x
  const dy = p.y - y
  return dx * dx + dy * dy
}

export function distanceToPath(x : number, y: number, path: SVGPathElement): number {
  // point: {x, y}
  // path: svg Path
  const pathLength = path.getTotalLength()
  var chunk = pathLength / 8.0
  const chunks = [0, chunk, chunk*2, chunk*3, chunk*4, chunk*5, chunk*6, chunk*7, pathLength]
  var best = chunks.reduce((previous, current) => {
    let point = path.getPointAtLength(current)
    let distance2 = distanceSquared(x, y, point)
    let result = distance2 < previous.distance ? {length: current, distance: distance2} : previous
    return result
  }, {length: 0, distance: Infinity})

  chunk *= 0.51
  let i = 0
  while (chunk > 0.0000001) {
    let aLength = best.length - chunk
    let bLength = best.length + chunk
    let aDistance = aLength > 0 ? distanceSquared(x, y, path.getPointAtLength(aLength)) : Infinity
    let bDistance = bLength < pathLength ? distanceSquared(x, y, path.getPointAtLength(bLength)) : Infinity
    console.log(aLength, aDistance)
    console.log(bLength, bDistance)
    if (aDistance < best.distance) {
      best = {length: aLength, distance: aDistance}
    } else if (bDistance < best.distance) {
      best = {length: bLength, distance: bDistance}
    } else {
      chunk *= 0.51
    }
    i++
    console.log(chunk, best, i)
  }
  return Math.sqrt(best.distance)
}

const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");

export function generateArrayforChar(char: string, font: any, size: number) : Array<number> {
  const aGlyph = font.charToGlyph(char)
  const aPath = aGlyph.getPath(0, 0, 72) // x, y, font size in pixels
  const aPathData = aPath.toPathData(14) // decimal places
  pathElement.setAttribute('d', aPathData)

  return [distanceToPath(0, 0, pathElement)]
}
var font = "https://fonts.gstatic.com/s/roboto/v29/KFOlCnqEu92Fr1MmEU9fChc9.ttf"

export function sdfForRoboto(callback: (a: Array<number>) => any) {
  fetch(font)
  .then(response => response.blob())
  .then((data) => data.arrayBuffer())
  .then((ttf) => {
    const font = parse(ttf)
    const sdfArray = generateArrayforChar('a', font, 1)
    callback(sdfArray)
  });
}