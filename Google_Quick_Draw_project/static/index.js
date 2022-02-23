$(document).ready(function () {

    classes = ['The Eiffel Tower', 'Airplane', 'Apple', 'Axe', 'Backpack', 'Banana', 'Bench', 'Bicycle', 'Birthday Cake', 'Book', 'Bucket', 'Calendar', 'Lollipop', 'Camera', 'Candle', 'Car', 'Clock', 'Donut', 'Eye', 'Face']

    
    const colorPicker = document.querySelector( '.js-color-picker');
    const lineWidthRange = document.querySelector( '.js-line-range' );
    const lineWidthLabel = document.querySelector( '.js-range-value' );
    const board = document.getElementsByTagName("canvas")[0];
    const ctx = board.getContext("2d");
    const clear = document.querySelector(".clear-btn")

    
    ctx.lineCap = "round";
    board.width = 812;
    board.height = 550;
    ctx.lineWidth = "5"
    lineWidthLabel.innerHTML = "5";

    var outputStrokes = []
    var x = [];
    var y = [];

    var brush = false;

    board.addEventListener("mousedown",start);
    board.addEventListener("mousemove", draw);
    board.addEventListener("mouseup", endall);
    board.addEventListener("mouseout", end);
    lineWidthRange.addEventListener('input',penSize);
    colorPicker.addEventListener( 'change',color);
    clear.addEventListener("click",clearBoard)

    function penSize(event){
        const width = event.target.value;
        lineWidthLabel.innerHTML = width;
        ctx.lineWidth = width;
    }

    function color(event){
        ctx.strokeStyle = event.target.value;
    }
    function start(event) {
        brush = true;
        ctx.beginPath();
        ctx.moveTo(event.x - board.offsetLeft, event.y - board.offsetTop);
    }

    function endall(event) {
        brush = false;
        outputStrokes.push([x, y]);
        x = [];
        y = [];

    }

    function end(event) {
        brush = false;
    }


    function draw(event) {
        if (brush) {
            ctx.lineTo(event.x - board.offsetLeft, event.y - board.offsetTop)
            x.push(event.x * 1.1 - board.offsetLeft * 1.1) 
            y.push(event.y * 1.1 - board.offsetTop * 1.1)
            ctx.stroke()
        }
        else return;
    }

    function clearBoard(){
        ctx.clearRect(0, 0, board.width, board.height)
        outputStrokes = []
    }

    
    var t = document.getElementById("time")
    var label = "Welcome";
    var sec;
    
    var genrerat_question = function () {
        label = classes[Math.floor(Math.random() * 20)]
        document.getElementsByTagName("h2")[0].innerText = label
    }
    genrerat_question();

    var timer;
    function startTime(){
        sec=15;
        timer = setInterval(update, 1000)
        t.style.visibility = "visible";
        
    }
    startTime();
    
    function update() {
        t.innerHTML = `${sec}`;
        sec--;
        if (sec == 0) {
            clearInterval(timer);
        }
    }
    var sub;

    function manage(){  
        sub = setInterval(submit,3000)
    }
    manage();



    var finalResult;
    function submit() {
    
        $.ajax({
            method: "POST",
            url: "/guess",
            data: {
                name: "Drawing"
                , stroke: JSON.stringify(outputStrokes)
            }

        }).done((res) => {
            console.log("model value is ", res)
            finalResult = res;
            out = label.localeCompare(String(res));
            if (out == 0) {
                result = true;
                manageWindow();
            }
            else {
                result = false;
                manageWindow();
            }

        }).fail((err) => {
            console.log(err)
        })

        
    }

    function manageWindow(){

        if(result){
            
            outputStrokes = []
            clearInterval(timer)

            t.style.visibility = "hidden";
            document.getElementsByTagName("h2")[0].innerText = `I know It's ${finalResult}`
            t.innerHTML = ""
            setTimeout(()=>{ctx.clearRect(0, 0, board.width, board.height);},2800)
            setTimeout(startTime,2000)
            setTimeout(genrerat_question,3000)
            clearInterval(sub)
            setTimeout(manage,3000)
        }
        else if(result == false){
            if(sec == 0){
                
                outputStrokes = []
                t.style.visibility = "hidden"
                document.getElementsByTagName("h2")[0].innerText = `I Couldn't Guess it  !!`
                t.innerHTML = ""
                setTimeout(()=>{ctx.clearRect(0, 0, board.width, board.height);},2800)
                setTimeout(startTime,2000)
                setTimeout(genrerat_question,3000)
                clearInterval(sub)
                setTimeout(manage,3000)
            }
        }

    }

});