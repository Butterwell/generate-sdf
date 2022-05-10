
import { parse, Font, Glyph, Path } from 'opentype.js'
import { generateArrayFromPath } from '@butterwell/svg-sdf'

export function generateArrayFromChar(char: string, font: Font, size: number) : Array<number> {
  const aGlyph: Glyph = font.charToGlyph(char)
  const aPath: Path = aGlyph.getPath(0, 0, 72) // x, y, font size in pixels
  const aPathData = aPath.toPathData(14) // decimal places
  var data = generateArrayFromPath(aPathData)
  return data
}

const fontName = "https://fonts.gstatic.com/s/roboto/v29/KFOlCnqEu92Fr1MmEU9fChc9.ttf"
//const opentype = "https://cdn.skypack.dev/opentype.js@1.3.3"

export function sdfForRoboto(callback: (a: Array<number>) => any) {
//  const opentypePromise = import(opentype)

  fetch(fontName)
    .then(response => response.blob())
    .then((data) => data.arrayBuffer())
    .then((ttf) => {
//      opentypePromise.then((opentype) => {
        const font: Font = parse(ttf)
        console.log(font)
        const sdfArray = generateArrayFromChar('a', font, 1)
        callback(sdfArray)  
//      })
  });
}