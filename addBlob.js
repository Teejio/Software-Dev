

let mouse = {
    x: 0,
    y: 0
}

var leBlob;
var video;
var scale;


var stream;

function glassExists() {
    var element = document.getElementById('#blobby-20080708');
    return (typeof (element) != 'undefined' && element != null)

}
// Event listener
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
    console.log(request.val, request.func)
    if (request.func === "w"){
        leBlob.style.width = `${request.val}px`
    }
    if (request.func === "h"){
        leBlob.style.height = `${request.val}px`
    }
    if (request.func === "s"){
        scale  = request.val;
        video.style.width = `${request.val * 100}vw` 
          video.style.height = `${request.val * 100}vh` 
        
        console.log(scale)
    }
    if (request.func === "main"){
        main(request.val);
    }

     movePic({clientX: leBlob.getBoundingClientRect().left + parseInt(leBlob.style.width) * 0.5, clientY: leBlob.getBoundingClientRect().top + parseInt(leBlob.style.height) * 0.5})
      sendResponse({status: "done"});
    }
);


const main =  async function (str) {

    if (leBlob != undefined){
         return
    }
    document.body.onmousemove = function (e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }
    
    document.body.addEventListener("keydown", function (e) {

        if (e.ctrlKey && e.code == "KeyQ") {
            console.log("let's move");
            goToMouse();
        }
    });
    let link = document.createElement('link');
    link.href = chrome.runtime.getURL('addBlob.css');
    link.rel = 'stylesheet';
    document.getElementsByTagName('head')[0].appendChild(link);


    //var so we can ascess it later
     leBlob = document.createElement("div");
     video = document.createElement("img");

    
await chrome.storage.local.get(["s"]).then((result) => {
    scale = result.s;
    console.log(scale);
  
    video.style.height = `${scale * 100}vh` 
    video.style.width = `${scale * 100}vw` 
        console.log( video.style.width , video.style.height);

//document.getElementById("abcdefghijklmnopqrstuvwxyz").setAttribute("scale", `${result.s}`) 
});


await chrome.storage.local.get(["h"]).then((result) => {
    leBlob.style.height =  `${result.h}px`;

});
await chrome.storage.local.get(["w"]).then((result) => {
    leBlob.style.width=  `${result.w}px`;

});



    leBlob.id = "blobby-20080708"; // name chosen to not conflict;
    
    video.id = "video-20080708"; // name chosen to not conflict;

    video.draggable = false;

    leBlob.onmousedown = dragStart;

    document.body.appendChild(leBlob);
    leBlob.appendChild(video);
    console.log("Glass Added");

    function goToMouse() {
        console.log(mouse);
            leBlob.style.top = `${mouse.y - parseInt(leBlob.style.height) * 0.5}px`;
            leBlob.style.left = `${mouse.x - parseInt(leBlob.style.width) * 0.5}px`;
        console.log(leBlob.style.top, leBlob.style.left);
        movePic({clientX: mouse.x, clientY: mouse.y})
    }

    function dragStart(e) {
        let startX = e.clientX;
        let startY = e.clientY;
        document.onmouseup = dragEnd;
        document.onmousemove = drag;



        function drag(e) {

            //do the calcs
            let X = startX - e.clientX;
            let Y = startY - e.clientY;
            startX = e.clientX;
            startY = e.clientY;


            leBlob.style.top = `${leBlob.offsetTop - Y}px`;
            leBlob.style.left = `${leBlob.offsetLeft - X}px`;
           movePic(e)
        }
    }




   console.log(str);
   video.src = str;

  movePic({clientX: leBlob.getBoundingClientRect().left + parseInt(leBlob.style.width) * 0.5, clientY: leBlob.getBoundingClientRect().top + parseInt(leBlob.style.height) * 0.5})
    window.addEventListener("scrollend", newScreenShot);
        window.addEventListener("resize", newScreenShot);
}

function movePic(e){
    console.log(e.clientX * scale, e.clientX, scale);
     video.style.transform = `translate(${(e.clientX) * -scale + parseInt(leBlob.style.width)*0.5}px, ${(e.clientY) * -scale + parseInt(leBlob.style.height)*0.5}px)`;

}

async function newScreenShot(){

        leBlob.style.display = "none";
        let response =  await chrome.runtime.sendMessage({action: "capture"});
leBlob.style.display = "block";
        
        console.log(response);
        video.src = response.data;
 movePic({clientX: leBlob.getBoundingClientRect().left + parseInt(leBlob.style.width) * 0.5, clientY: leBlob.getBoundingClientRect().top + parseInt(leBlob.style.height) * 0.5})
}


function removeGlass(){
    video.remove()
    leBlob.remove();
}
function dragEnd() {
    // im done stop dragging please
    document.onmouseup = null;
    document.onmousemove = null;
}



