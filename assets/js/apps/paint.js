function initPaint(appId) {

    // init variabili
    var mousePressed = false;
    var lastX, lastY;
    var canvas = $(`#canvas-${appId.split('#')[1]}`);
    var context = canvas.get(0).getContext("2d");
    var color = "black";
    // init canvas di supporto per salvare i dati durante il resize del main canvas
    var resizeVirtualCanvas = document.createElement("canvas");;
    var resizeVirtualContext = resizeVirtualCanvas.getContext('2d');

    // Salva gli elementi disegnati nel canvas di supporto,
    // effettua l'aggiornamento della dimensione del canvas,
    // stampa nel main canvas i dati del canvas di supporto.
    function outputsize() {
        resizeVirtualCanvas.width = context.canvas.width;
        resizeVirtualCanvas.height = context.canvas.height;
        resizeVirtualContext.drawImage(context.canvas, 0, 0);
        context.canvas.width = canvas.parent().width();
        context.canvas.height = canvas.parent().height();
        fill("white");
        context.drawImage(resizeVirtualCanvas, 0, 0);
        resizeVirtualCanvas.width = 0;
        resizeVirtualCanvas.height = 0;
    }
    outputsize();
    // Oggetto interessante, permette di lanciare funzioni attancando un observer al div resizable interessato
    // dovrebbe funzionare su browser chromium based      
    new ResizeObserver(outputsize).observe(canvas.parent().get(0));

    // init colore e sfondo canvas
    changeColorSelected();
    pencil();
    $(`${appId} .select-tool-btn`).prop('disabled', true);

    // attach degli eventi del mouse sull'canvas, molto simili al drag and drop, 
    // posizione sullo schermo - offset dato dal canvas e il lato considerato
    canvas.on('mousedown', function (e) {
        mousePressed = true;
        draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
    });

    canvas.on('mousemove', function (e) {
        if (mousePressed)
            draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
    });

    canvas.bind('mouseup mouseleave', function (e) {
        mousePressed = false;
    });

    // seleziona colore con cui disegnare
    $(`${appId} .color-btn`).on('click', function () {
        color = $(this).data('color');
        changeColorSelected();
    });

    function changeColorSelected() {
        $(`${appId} .color-selected`).removeClass().addClass("color-selected " + color);
    }

    // seleziona tool da utilizzare per disegnare e le varie operazioni
    $(`${appId} .tool-btn`).on('click', function () {
        let type = $(this).data('type');
        switch (type) {
            case "pencil": pencil();
                break;
            case "brush": brush();
                break;
            case "eraser": eraser();
                break;
            case "fill": fill(color);
                break;
            case "clear": fill("white");
                break;
            case "save": save(this);
                break;
            default:
                break;
        }
    })

    // funzioni di supporto al listener onClick sui tool e le operazioni
    function pencil() {
        canvas.removeClass().addClass("canvas cursor-pencil");
        context.globalCompositeOperation = "source-over";
        $(`${appId} .select-tool-btn`).val('1');
        $(`${appId} .select-tool-btn`).prop('disabled', true);
    }

    function eraser() {
        canvas.removeClass().addClass("canvas cursor-eraser");
        $(`${appId} .select-tool-btn`).prop('disabled', false);
        context.globalCompositeOperation = "destination-out";
        context.strokeStyle = "white";
    }

    function brush() {
        canvas.removeClass().addClass("canvas cursor-brush");
        context.globalCompositeOperation = "source-over";
        $(`${appId} .select-tool-btn`).prop('disabled', false);
    }

    function fill(color) {        
        context.canvas.width = context.canvas.width;               
        context.beginPath();
        context.rect(0, 0, context.canvas.width, context.canvas.height);
        context.fillStyle = color;
        //context.globalCompositeOperation = "destination-out";
        context.fill();
    }

    // funzione che disegna sul canvas tramite il puntatore del mouse
    function draw(x, y, mouseDown) {
        if (mouseDown) {
            context.beginPath();
            context.strokeStyle = color;
            context.lineWidth = $(`${appId} .select-tool-btn`).val();
            context.lineJoin = "round";
            context.moveTo(lastX, lastY);
            context.lineTo(x, y);
            context.closePath();
            context.stroke();
        }
        lastX = x; lastY = y;
    }

    //permette di salvare la pagina creata, funziona su chromium based
    function save() {
        var a = document.createElement("a");
        a.href = context.canvas.toDataURL('image/png');
        a.download = "Image.png";
        a.click();
    }
}