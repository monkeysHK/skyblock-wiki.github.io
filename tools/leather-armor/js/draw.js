import { state, colorHash, assets, allCanvas, ITEM_SCALE } from './index.js';

export function draw() {
    if (state != "active") {
        return;
    }

    const color = colorHash;

    _drawPiece(allCanvas.$h, "helmet", color);
    _drawPiece(allCanvas.$c, "chestplate", color);
    _drawPiece(allCanvas.$l, "leggings", color);
    _drawPiece(allCanvas.$b, "boots", color);
}

function _drawPiece(canvas, name, color) {
    let $canvas = $(canvas)
    let {
        file,
        x,
        y,
        scale
    } = {
        file: assets.files[name],
        x: 0,
        y: 0,
        scale: ITEM_SCALE,
    };
    let {
        asset,
        width,
        height
    } = file;

    $canvas.clearCanvas();
    $canvas.get(0).getContext("2d").imageSmoothingEnabled = false;

    // https://stackoverflow.com/a/45201094/1411473
    // step 1: draw in original image
    // step 2: multiply color
    $canvas.addLayer({
        type: "image",
        compositing: "source-over",
        imageSmoothing: false,
        source: asset,
        x: x, y: y,
        width: width * scale,
        height: height * scale,
        fromCenter: false
      }).addLayer({
        type: "rectangle",
        compositing: "multiply",
        imageSmoothing: false,
        fillStyle: color,
        x: x, y: y,
        width: width * scale,
        height: height * scale,
        fromCenter: false
      });;

    // step 4: in our case, we need to clip as we filled the entire area
    // step 5: reset comp mode to default
    let {
        file2,
        x2,
        y2,
        scale2
    } = {
        x2: 0,
        y2: 0,
        scale2: ITEM_SCALE,
        file2: assets.files[name + "_overlay"]
    };
    let {
        asset: asset2,
        width: width2,
        height: height2
    } = file2;
    $canvas.addLayer({
        type: "image",
        compositing: "destination-in",
        imageSmoothing: false,
        source: asset,
        x: x, y: y,
        width: width * scale,
        height: height * scale,
        fromCenter: false
      }).addLayer({
        type: "image",
        compositing: "source-over",
        imageSmoothing: false,
        source: asset2,
        x: x2, y: y2,
        width: width2 * scale2,
        height: height2 * scale2,
        fromCenter: false
      })
      .drawLayers();

    $(`#${name}_img`).attr('src', $canvas.getCanvasImage('png'));
    $(`#${name}_lnk`).attr('href', $canvas.getCanvasImage('png'));
    $(`#${name}_lnk`).attr('download', "Dyed " + name + " " + color + ".png");
}