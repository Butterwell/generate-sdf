import { parse, Font, Glyph, Path } from 'opentype.js'
import { generateArrayFromPath } from '@butterwell/svg-sdf'

export function generateArrayFromChar(char: string, font: Font, size: number) : Array<number> {
  const aGlyph: Glyph = font.charToGlyph(char)
  const aPath: Path = aGlyph.getPath(0, 0, 72) // x, y, font size in pixels
  const aPathData = aPath.toPathData(14) // decimal places
  var data = generateArrayFromPath(aPathData, size, 72, 0.1)
  return data
}

// TODO move to a lookup service
const roboto_regular = "https://fonts.gstatic.com/s/roboto/v29/KFOlCnqEu92Fr1MmEU9fChc9.ttf"
const knownFonts: { [key: string]: string; } = {
  "Roboto" : roboto_regular,
  "Roboto-Regular": roboto_regular
}

export function getFont(fontName: string) : Promise<ArrayBuffer> {
  const url = knownFonts[fontName]
  return fetch(url)
    .then(response => response.blob())
    .then((data) => data.arrayBuffer())
}

export function sdfForRoboto(callback: (a: Array<number>) => any) {
  getFont('Roboto')
    .then((ttf) => {
        const font: Font = parse(ttf)
        console.log(font)
        const sdfArray = generateArrayFromChar('a', font, 16)
        callback(sdfArray)  
  });
}
