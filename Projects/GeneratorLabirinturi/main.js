// Executam cod dupa ce fereastra incarca toate elementele
window.onload = init;

//initializam programul
function init() {

//obtinem elementul canvas
var canvasElement = document.getElementById("mazeCanvas"); // Identificam elementul Canvas
var context = canvasElement.getContext("2d"); // Ne ofera posibilitatea de a utiliza instrumentele 2D pe elementul Canvas

//obtinem butonul de start
var startBtn = document.getElementById("startBtn");

//obtinem butonul de reset
var resetBtn = document.getElementById("resetBtn");

// Obtinem elementul ce genereaza meniul de optiuni grafice din dreapta
var graphOptions = document.getElementById("graphMenuBtn");

// Obtinem meniul grafic din sectiunea dreapta
var rightGraphMenu = document.getElementById("right-optionalMenu");

//functie ce executa jocul - labirint
function execute () {
    //afisam containerul pentru labirint
    document.getElementById("mazeContainer").style.visibility = "visible";

    // variabile folosite pentru a seta dimensiunea labirintului si viteza 
    // de parcurgere cat si culoarea de fundal aleasa de utilizator

    var selectedFps;
    var selectedSize;
    var selectedWidth;
    var selectedHeight;
    var selectedCellSize;
    var selectedBgColor;
    var selectedGridColor;
    var fpsOptions = 4;
    var sizeOptions = 3;
    var getGridCl = document.getElementById("grid-color");
    var getBgCl = document.getElementById("bg-color");
    var getFps = document.getElementsByName("speed");
    var getSize = document.getElementsByName("dim");

    // setam valori implicite pentru dimensiunea labirintului
    // [width, height, cellsize] pentru large, medium, small

    var large = [600, 600, 20];
    var medium = [500, 500, 20];
    var small = [400, 400, 40];

    // setam valori implicite pentru culoarea de fundal a labirintului
    var initialBgColor = "#F2AA4C";
    var blue = "#6C59C4";
    var green = "#2BAE66";
    var beige = "#F9E4B7";
    var transparent = "#efefef";
    
    var initialGridColor = "#616247";
    var black = "#000";
    var red = "red";
    var white = "#fff";
    var brown = "brown";

    // Obtinem valoarea setata de utilizator pentru
    // dimensiunea labirintului

    for(let i = 0; i < sizeOptions; i++) {
        if(getSize[i].checked) {
            selectedSize = getSize[i].value;
        }
    }

    // In functie de optiunea selectata de utilizator pentru dimensiunea labirintului
    // alegem valorile din tabloul predefinit

    if(selectedSize == "small") {
        selectedWidth = small[0];
        selectedHeight = small[1];
        selectedCellSize = small[2]
    } else if(selectedSize == "medium") {
        selectedWidth = medium[0];
        selectedHeight = medium[1];
        selectedCellSize = medium[2];
    } else if(selectedSize == "large") {
        selectedWidth = large[0];
        selectedHeight = large[1];
        selectedCellSize = large[2];
    }

    // Setam dimensiunea elementului canvas in functie de optiunea utilizatorului

    canvasElement.width = selectedWidth;
    canvasElement.height = selectedHeight;

    // Setam viteza de rulare a algoritmului in functie de valoarea 
    // precizata de utilizator (functia setInterval(f, fps))

    for(let i = 0; i < fpsOptions; i++) {
        if(getFps[i].checked) {
            selectedFps = getFps[i].value;
        }
    }

    // Obtinem valoarea setata de utilizator pentru culoarea fundalului

    var getBgColor = getBgCl.options[getBgCl.selectedIndex].value;

    switch(getBgColor) {
        case "initial":
            selectedBgColor = initialBgColor;
            break;
        case "albastru":
            selectedBgColor = blue;
            break;
        case "verde":
            selectedBgColor = green;
            break;
        case "bej":
            selectedBgColor = beige;
            break;
        case "transparent":
            selectedBgColor = transparent;
            break;
    }

    // Obtinem valoarea setata de utilizator pentru culoarea gridului

    var getGridColor = getGridCl.options[getGridCl.selectedIndex].value;

    switch(getGridColor) {
        case "initial":
            selectedGridColor = initialGridColor;
            break;
        case "negru":
            selectedGridColor = black;
            break;
        case "rosu":
            selectedGridColor = red;
            break;
        case "alb":
            selectedGridColor = white;
            break;
        case "maro":
            selectedGridColor = brown;
            break;
    }

    // Initializam Labirintul cu valorile setate de utilizator

    runMaze(context, selectedFps, selectedWidth, selectedHeight, selectedCellSize, selectedBgColor, selectedGridColor);

    canvasElement.style.borderColor = selectedGridColor;
}

// Initializam Labirintul pe eventul "click" asupra butonului de start
// si dezactivam evenimentul de "click"
startBtn.addEventListener("click", handler);

function handler(e) {
    // Sterge handler -> click event
    e.target.removeEventListener(e.type, arguments.callee);
    // Rulam labirintul
    execute();
}

// Resetam Pagina pe evenimentul de click asupra butonului "reseteaza"
resetBtn.onclick = function() {
    location.reload();
}

// Afisam si ascundem meniul corespunzator butonului de grafica
graphOptions.onclick = function() {
    rightGraphMenu.style.visibility = "visible";
}

rightGraphMenu.onmouseleave = function() {
    this.style.visibility = "hidden";
}

function runMaze(context, fps, selectedWidth, selectedHeight, selectedCellSize, selectedBgColor, selectedGridColor) {

    //dimensiunea unei celule
    var cellSize = selectedCellSize;
    
    //numarul de randuri si de coloane
    var rows, columns;
    
    //array ce contine obiectele Celula
    var cellList = [];
    
    //celula curenta
    var currentCell;
    
    //stiva pt celule
    var stack = [];
    
    function setMaze() {
    
        rows = selectedHeight / cellSize;
        columns = selectedWidth / cellSize;
    
        // adaugam toate celulele ca obiecte intr-o lista
        // identificam celulele prin coordonatele x si y
        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < columns; j++) {
                let cell = new makeCell(context, "green", cellSize, j * cellSize, i * cellSize);
                cellList.push(cell);
            }
        }
    
        //celula 0,0 va fi celula initiala
        currentCell = cellList[0];
    }
    
    setMaze();
    
    function run() {
        //generam toate celulele grafic
        for(var i = 0; i < cellList.length; i++) {
            cellList[i].show();
        }
    
        //setam celula curenta ca fiind marcata (0, 0)
        currentCell.marked = true;
    
        //desenam grafic celula curenta
        currentCell.highlightCurrentCell("red");
        
        //verificam vecinii celulei curente si setam urmatoarea celula
        var nextCell = currentCell.verifyNeighbors();
    
        //DACA am o celula vecina nemarcata, o selectez, o marchez si o
        //transform in celula curenta
        if(nextCell) {
            nextCell.marked = true;
            //adaugam celula curenta pe stiva
            stack.push(currentCell);
            //stergem marginile dintre celula curenta si celula urmatoare
            deleteWallBetweenCells(currentCell, nextCell, cellSize);
            //setam celula urmatoare ca celula curenta
            currentCell = nextCell;
        } else if(stack.length > 0) { //DACA nu am o celula vecina pe care o pot marcata; De asemenea verific ca stiva sa nu fie goala
            //Backtracking
            //Scoatem o celula de pe stiva
            //Transforma celula scoasa de pe stiva in celula curenta
            currentCell = stack.pop();
        }
    }

    setInterval(run, fps);
    
    // Functie ce construieste o dreapta
    function drawLine(fromX, fromY, toX, toY, strokeColor, lineSize) {
        context.lineWidth = lineSize;
        context.beginPath();
        context.moveTo(fromX, fromY);
        context.lineTo(toX, toY);
        context.strokeStyle = strokeColor;
        context.stroke();
    }
    
    // Functie ce construieste un patrat
    function drawSquare(xAxis, yAxis, size, fillColor) {
        context.beginPath();
        context.fillStyle = fillColor;
        context.fillRect(xAxis, yAxis, size, size);
    }
    
    // Functie ce intoarce indexul celulei vecine
    function getIndex(j, i) {
        // Toate acestea sunt valori invalide
        // Intoarcem o valoare ce genereaza undefined
        if(j < 0 || i < 0 || j > columns - 1 || i > rows - 1) {
            return -1;  
        }
        
        // Intoarcem indexul celulei vecine
        return j + i * columns;
    }
    
    //functie pentru a sterge marginile dintre celule
    //1 0 -1 pe randuri si 	1 pe coloane
    //						0
    //         			   -1
    //Row -> 1 = se deplaseaza la stanga; -1 se deplaseaza la drepta
    //Col -> 1 = se deplaseaza deasupra; -1 se deplaseaza dedesubt
    function deleteWallBetweenCells(currentCell, nextCell, cellSize) {
        var rowCoord = (currentCell.x / cellSize) - (nextCell.x / cellSize);
            
        if(rowCoord == 1) {
            currentCell.leftCellBorder = false;
            nextCell.leftCellBorder = false;
        } else if(rowCoord == -1) {
            currentCell.rightCellBorder = false;
            nextCell.leftCellBorder = false;
        }
    
        var colCoord = (currentCell.y / cellSize) - (nextCell.y / cellSize);
        
        if(colCoord == 1) {
            currentCell.topCellBorder = false;
            nextCell.bottomCellBorder = false;
        } else if(colCoord == -1) {
            currentCell.bottomCellBorder = false;
            nextCell.topCellBorder = false;
        }
    }
    
    // Constructor ce realizeaza o celula
    function makeCell(context, fillColor, size, x, y) {
        // Coordonatele x si y
        this.x = x;
        this.y = y;
        
        // Setam variabilele booleene ce marcheaza cele 4 margini 
        // corespunzatoare fiecarei celule
        this.topCellBorder = true;
        this.rightCellBorder = true;
        this.bottomCellBorder = true;
        this.leftCellBorder = true;
        
        // Variabila ce tine cont daca celula a fost vizaitata
        this.marked = false;
    
        // Functie pentru afisarea celulei
        this.show = function() {
            let xAxis = this.x;
            let yAxis = this.y;
        
            // Construim marginile celulei daca acestea exista
            // Nu exista doar atunci cand le eliminam in urma rularii algo
            if(this.topCellBorder) {
                drawLine(x, y, x + size, y, selectedGridColor, 4);
            }
    
            if(this.rightCellBorder) {
                drawLine(x + size, y, x + size, y + size, selectedGridColor, 4);
            }
    
            if(this.bottomCellBorder) {
                drawLine(x + size, y + size, x, y + size, selectedGridColor, 4);
            }
    
            if(this.leftCellBorder) {
                drawLine(x, y + size, x, y, selectedGridColor, 4);
            }
    
            // daca celula a fost vizitata, ii schimbam culoarea
            if(this.marked) {
                drawSquare(xAxis, yAxis, size, selectedBgColor);
            }
        }
        
        // Functie ce schimba culoarea celulei curente -> pentru animatie
        this.highlightCurrentCell = function(color) {
            var xAxis = this.x;
            var yAxis = this.y;
    
            drawSquare(xAxis, yAxis, size, color);
        }

        // Functie ce verifica daca celula are vecini
        this.verifyNeighbors = function() {
            // Lista vecinilor celulei
            var neighbors = [];
    
            // analog x = j si y = i
            // formula pt indexul curent j + i * columns
            let j = this.x / size;
            let i = this.y / size;
            
            // Setam celulele vecine pentru cele 4 pozitii
            var top = cellList[getIndex(j, i - 1)];
            var right = cellList[getIndex(j + 1, i)];
            var bottom = cellList[getIndex(j, i + 1)];
            var left = cellList[getIndex(j - 1, i)];
            
            // Adaugam vecinii celulei in tabloul "neighbors"
            // doar daca exista si nu au fost marcati
            if(top && !top.marked) {
                neighbors.push(top); // deasupra
            }
    
            if(right && !right.marked) {
                neighbors.push(right); // dreapta
            }
    
            if(bottom && !bottom.marked) {
                neighbors.push(bottom); // dedesubt
            }
    
            if(left && !left.marked) {
                neighbors.push(left); // stanga
            }
            
            // Intoarcem un vecin in mod aleator din lista de vecini
            // Daca Exista vecini -> executam operatia
            // Altfel intoarcem undefined
            if(neighbors.length > 0) {
                var max = neighbors.length - 1;
                var min = 0;
                var randomNeighborIndex = Math.floor(Math.random() * (max - 0 + 1)) + 0;
                return neighbors[randomNeighborIndex];
            } else {
                return undefined;
            }
        }
    }

}


}
