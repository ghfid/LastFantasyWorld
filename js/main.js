function mainWarning() {
    swal({
        title: 'Face Check Required',
        text: 'Hello, Please upload your face pic for checking your age',
        type: 'warning'
    });
}

function VerifyingWarning() {
    swal({
        title: 'Your age has been verified',
        text: 'Thank you. Just a reminder, we do not keep your image',
        type: 'success'
    });
}

var imgSelecter = $("#fileLoader")[0];
var ageComment = $("#age_checking_msg")[0];
var gameRecommendedMsg = $("#game_recommended_msg")[0];
var age;
var verdict;
var gameRecommended;

mainWarning();

imgSelecter.addEventListener("change", function () {
    ageComment.innerHTML = "Verifying...";
    processImage(function (file) {
        sendFaceRequest(file, function (faceAttributes) {
            age = Math.floor(getAge(faceAttributes));

            verdict = getVerdict(age);
            VerifyingWarning();
            gameRecommended = getGameRecommendation(age);
            changeUI(verdict, gameRecommended);
        });
    });
});

function processImage(callback) {
    var file = imgSelecter.files[0];
    var reader = new FileReader();
    if (file) {
        reader.readAsDataURL(file);
    } else {
        console.log("Invalid file");
    }
    reader.onloadend = function () {
        if (!file.name.match(/\.(jpg|jpeg|png)$/)) {
            ageComment.innerHTML = "Please upload correct image file (jpg or png)";
        } else {
            callback(file);
        }
    };
}

function sendFaceRequest(file, callback) {
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
    }).done(function (data) {
        if (data.length != 0) {
            // Get the face attributes: {"gender": "female", "age": 23.9}
            var faceAttributes = data[0].faceAttributes;
            callback(faceAttributes);
        } else {
            ageComment.innerHTML = "No human detected. Please try again";
        }
    }).fail(function (error) {
        ageComment.innerHTML = "An error occured. Try later please.";
        console.log(error.getAllResponseHeaders());
    });
}

function getAge(faceAttributes) {
    return faceAttributes.age;
}

function getVerdict(age) {
    var verdict = "";
    if (age <= 13) {
        verdict = "You look " + age + " years old! No sorry You can't play LFW";
    } else if (age > 13 && age <= 35) {
        verdict = "You look " + age + " years old. Yes you can play LFW";
    } else if (age > 35) {
        verdict = "You look " + age + " years old. Good to go but Don't spend too much on cash item though!";
    }

    return verdict;
}

function getGameRecommendation(age) {
    var randHigh = Math.floor(Math.random() * 15 + 8);
    var randLow = Math.floor(Math.random() * 7 + 1);
    var gameRecommendation;

    /** To avoid returning 0 */
    randLow = randLow - 1;
    randHigh = randHigh - 1;

    if (age > 25) {
        gameRecommendation = gameList[randHigh];
    } else if (age > 13 && age <= 25) {
        gameRecommendation = gameList[randLow];
    }

    return gameRecommendation;
}

/* Games Class and constructors */
var Games = (function () {
    function Games(name, link) {
        this.name = name;
        this.link = link;
        this.gameName = name;
        this.videoLink = link;
    }
    return Games;
})();

function changeUI(verdict, gameRecommended) {
    ageComment.innerHTML = verdict;
    var url = $("#video_link")[0];
    url.src = gameRecommended.videoLink;

    gameRecommendedMsg.innerHTML = gameRecommended.gameName + " has been recommended for you based on your age";
}

/* Game recommended for lower age band */
var game1 = new Games("OverWatch", "https://www.youtube.com/embed/RJxpa6H1050");
var game2 = new Games("League of Legends", "https://www.youtube.com/embed/L-YWi6Kmp-g");
var game3 = new Games("Pokemon' GO!", "https://www.youtube.com/embed/oD-KCkpcsvA");
var game4 = new Games("DOTA 2", "https://www.youtube.com/embed/IowT-0oQtLM");
var game5 = new Games("Blade and Soul", "https://www.youtube.com/embed/gCGqFiFu7QQ");
var game6 = new Games("Lost Ark", "https://www.youtube.com/embed/R8MPRzTONUE");
var game7 = new Games("Bejeweled 3", "https://www.youtube.com/embed/3PGpFyRbKEs");

/* Game recommended for higher age band */
var game8 = new Games("FootBall Manager", "https://www.youtube.com/embed/bwz98athxQ8");
var game9 = new Games("SuperHot", "https://www.youtube.com/embed/vrS86l_CtAY");
var game10 = new Games("Dishonored 2", "https://www.youtube.com/embed/l1jyUAtxh-8");
var game11 = new Games("Alien Isolation", "https://www.youtube.com/embed/7h0cgmvIrZw");
var game12 = new Games("The Swapper", "https://www.youtube.com/embed/I3EyhIM9k_k");
var game13 = new Games("Dark Souls 3", "https://www.youtube.com/watch?v=_zDZYrIUgKE");
var game14 = new Games("Dark Souls 3 Expension", "https://www.youtube.com/embed/iu1NCPMC7D0");
var game15 = new Games("Star Wars BATTLEFRONT", "https://www.youtube.com/embed/V2xp-qtUlsQ");

/* Game recommendation list */
var gameList = [
    game1, game2, game3, game4, game5, game6,
    game7, game8, game9, game10, game11, game12, game13, game14, game15];
