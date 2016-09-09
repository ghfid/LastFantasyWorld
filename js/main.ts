

function mainWarning() : void {

    swal({
        title: 'Face Check Required',
        text: 'Hello, Please upload your face pic for checking your age',
        type: 'warning'
    });
}

function VerifyingWarning() : void{
    swal({
        title: 'Your age has been verified',
        text: 'Thank you. Just a reminder, we do not keep your image',
        type: 'success'
    }); 

}

var gameRecommended : Game;
var imgSelecter : HTMLInputElement = <HTMLInputElement> $("#fileLoader")[0];
var ageComment = $("#age_checking_msg")[0];
var gameRecommendedMsg = $("#game_recommended_msg")[0];
var age: any;
var verdict: any;

mainWarning();


imgSelecter.addEventListener("change", function () {
    ageComment.innerHTML = "Verifying...";
    processImage(function (file) {
        
        sendFaceRequest(file, function (faceAttributes) {
            
            age = Math.floor(getAge(faceAttributes)); 
          
            verdict = getVerdict(age);
            VerifyingWarning();
            gameRecommended = getGameRecommendation(age);
            changeUI(verdict,gameRecommended,age);
            
            
        });
    });
});


function processImage(callback) {
    var file = imgSelecter.files[0]; 
    var reader = new FileReader();
    if (file) {
        reader.readAsDataURL(file); 
    }
    else {
        console.log("Invalid file");
    }
    reader.onloadend = function () {
       
        if (!file.name.match(/\.(jpg|jpeg|png)$/)) {
            ageComment.innerHTML = "Please upload correct image file (jpg or png)";
        }
        else {
           
            callback(file);
        }
    };
}


function changeUI(verdict, gameRecommended, age) : void {
  
    ageComment.innerHTML = verdict;
    var img: HTMLImageElement = <HTMLImageElement> $("#img_Link")[0]; 
    img.src = gameRecommended.imgLink; 
    
    
    if(age <= 13)
    {
        gameRecommendedMsg.innerHTML = "Sorry, there is no game recommendation matching your age."
    }
    else
    {
        gameRecommendedMsg.innerHTML = gameRecommended.gameName + " has been recommended for you based on your age";
    }
    
}



function sendFaceRequest(file, callback) : void {
    $.ajax({
        url: "https://api.projectoxford.ai/face/v1.0/detect?returnFaceAttributes=age",
        beforeSend: function (xhrObj) {
            // Request headers
            xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "38ed2601c29042188bab1a380904bd0d");
        },
        type: "POST",
        data: file,
        processData: false
    })
        .done(function (data) 
        {
        if (data.length != 0) {
            // Get the face attributes: {"age": 23.9}
            var faceAttributes : any = data[0].faceAttributes;
            callback(faceAttributes);
        }
        else {
            ageComment.innerHTML = "No human detected. Please try again";
        }
    })
        .fail(function (error) 
        {
        ageComment.innerHTML = "An error occured. Try later please.";
        console.log(error.getAllResponseHeaders());
    });
}


function getAge(faceAttributes : any) 
{
    return faceAttributes.age;
}

function getVerdict(age : any) : any
{
    var verdict = "";
    if(age <= 13){
        verdict = "You look " + age + " years old! No sorry You can't play LFW";
    }
    else if(age > 13 && age <= 35){
        verdict = "You look " + age + " years old. Yes you can play LFW";
    }
    else if(age > 35){
        verdict = "You look " + age + " years old. Good to go but Don't spend too much on cash item though!"
    }

    return verdict;
}

function getGameRecommendation(age :any) : Game
{
    
    var randHigh = Math.floor(Math.random() * 15 + 8);
    var randLow = Math.floor(Math.random() * 7 + 1);
    randLow = randLow - 1;
    randHigh = randHigh - 1;
    

    if (age > 25)
    {
        gameRecommended = gameList[randHigh];
        
    }

    else if(age > 13 && age <= 25)
    {
        gameRecommended = gameList[randLow];
    }

    else if(age <= 13)
    {
        gameRecommended = gameList[15];
    }

    return gameRecommended;
    
}

/* Games Class and constructors */

class Game 
{
    gameName: string; 
    imgLink: string;
    constructor(public name: string, public link: string) 
    {
        this.gameName = name;
        this.imgLink = link;
    }
       
}

/* Game recommended for lower age band */
var game1 : Game = new Game("OverWatch","./img/overwatchsc.jpg");
var game2 : Game = new Game("League of Legends","./img/lolsc.jpg");
var game3 : Game = new Game("Pokemon' GO!","./img/pokemonsc.jpg");
var game4 : Game = new Game("DOTA 2","./img/dota2sc.jpg");
var game5 : Game = new Game("Blade and Soul","./img/bssc.jpg");
var game6 : Game = new Game("Lost Ark","./img/lostarksc.jpg");
var game7 : Game = new Game("Star Wars BATTLEFRONT","./img/swsc.jpg");

/* Game recommended for higher age band */
var game8 : Game = new Game("DOOM 4K","./img/doom4ksc.jpg");
var game9 : Game = new Game("SuperHot","./img/superhotsc.jpg");
var game10 : Game = new Game("Dishonored 2","./img/dhsc.jpg");
var game11: Game = new Game("Alien Isolation","./img/aliensc.jpg");
var game12 : Game = new Game("The Swapper","./img/swappersc.jpg");
var game13 : Game = new Game("Dark Souls 3","./img/ds3sc2.jpg");
var game14 : Game = new Game("Dark Souls 3 Expension","./img/ds3exsc.jpg");
var game15 : Game = new Game("Bejeweled 3","./img/bjwsc.jpeg");
var game16 : Game = new Game("No","./img/sorrysc.jpg")

/* Game recommendation list */
var gameList = [game1,game2,game3,game4,game5,game6,
game7,game8,game9,game10,game11,game12,game13,game14,game15,game16];


