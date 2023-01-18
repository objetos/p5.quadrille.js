'use strict';

let i_quadrille;
let pg_quadrille;
let i;
let pg;
let mode = 0;

function preload() {
  //console.log(i.width, i.height); // 1024x512
  //i = loadImage('mahakala.jpg');
  i = loadImage('a6.png');
}

function setup() {
  createCanvas(400, 400);
  pg = createGraphics(i.width, i.height);
  //pg.image(i, 0, 0, 400, 200);
  pg.image(i, 0, 0);
  Quadrille.CELL_LENGTH = 8;
  Quadrille.OUTLINE_WEIGHT = 0.5;
  //Quadrille.SPATIAL_COHERENCE = false;
  i_quadrille = createQuadrille(50, i);
  //Quadrille.SPATIAL_COHERENCE = true;
  pg_quadrille = createQuadrille(50, pg, true);
}

function draw() {
  background('#060621');
  mode === 0 ? image(pg, 0, 0) : mode === 1 ? image(i, 0, 0) : mode === 2 ? drawQuadrille(i_quadrille, { outline: 'blue' }) : drawQuadrille(pg_quadrille, { outline: 'red' });
}

function keyPressed() {
  mode = parseInt(key);
}