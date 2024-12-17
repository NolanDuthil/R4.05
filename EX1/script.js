/*
VIDEO PIXELS
Video input is basically just a like an image! We can get it's width and height and access the pixels array.

BASED ON
https://p5js.org/examples/dom-video-pixels.html

*/

let video;

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Webcam capture (at the size of the window)
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();
}

function draw() {
    background(255);
 
    let gridSize = 10;

    video.loadPixels();
    for(let y = 0; y < height; y += gridSize) {
        for(let x = 0; x < width; x += gridSize) {
            let index = (y * video.width + x) * 4;
            let r = video.pixels[index];
            let g = video.pixels[index + 1];
            let b = video.pixels[index + 2];
            let lum = (r + g + b) / 3;
            let dia = map(lum, 0, 255, gridSize, 0);

            fill(r, g, b);
            noStroke();
            circle(x + gridSize / 2, y + gridSize / 2, dia);
        }
    }
}