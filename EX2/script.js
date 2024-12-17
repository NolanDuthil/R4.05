let capture;
let targetColor = null; // La couleur cible sélectionnée
let tolerance = 30; // Tolérance de comparaison des couleurs
let positions = []; // Stocke les positions des cercles rouges

function setup() {
  createCanvas(displayWidth, displayHeight);
  var constraints = {
    audio: false,
    video: {
      facingMode: {
        exact: "environment"
      }
    }    
    //video: {
      //facingMode: "user"
    //} 
  };
  capture = createCapture(constraints);
  
  capture.hide();
}

function draw() {
  image(capture, 0, 0, width, height);

  positions = []; // Réinitialise les positions pour chaque image
  
  if (targetColor) {
    capture.loadPixels(); // Charger les pixels de la vidéo
    
    // Boucle pour vérifier tous les pixels
    for (let x = 0; x < capture.width; x += 10) { // Saut de 10 pixels pour optimiser
      for (let y = 0; y < capture.height; y += 10) {
        let index = (y * capture.width + x) * 4;        
        let r = capture.pixels[index];
        let g = capture.pixels[index + 1];
        let b = capture.pixels[index + 2];
        
        if (isSimilarColor([r, g, b], targetColor, tolerance)) {
          ellipse(x, y, 10, 10); // Dessiner un cercle autour des couleurs similaires
          fill(r, g, b);
          positions.push({ x, y }); // Enregistrer la position
        }
      }
    }
    
    drawCenterCircle(); // Dessiner le cercle blanc au centre des cercles rouges
  }
}

// Enregistre la couleur au clic de la souris
function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
    let clickedColor = capture.get(mouseX, mouseY);
    targetColor = clickedColor; // Mettre à jour la couleur cible
    console.log("Couleur sélectionnée:", targetColor);
  }
}

// Fonction pour comparer deux couleurs avec une tolérance
function isSimilarColor(c1, c2, tol) {
  return abs(c1[0] - c2[0]) < tol &&
    abs(c1[1] - c2[1]) < tol &&
    abs(c1[2] - c2[2]) < tol;
}

// Dessine un cercle blanc au centre moyen des positions enregistrées
function drawCenterCircle() {
  if (positions.length > 0) {
    let sumX = 0;
    let sumY = 0;

    // Somme des positions
    for (let pos of positions) {
      sumX += pos.x;
      sumY += pos.y;
    }

    // Moyenne des positions
    let avgX = sumX / positions.length;
    let avgY = sumY / positions.length;

    // Dessiner le cercle blanc
    noStroke();
    fill(255); // Blanc
    ellipse(avgX, avgY, 20, 20); // Cercle au centre moyen
  }
}