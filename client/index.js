const container = document.querySelector(".container");

let playerLeftSpace = 50;
let startingPoint = 150;
let playerBottomSpace = startingPoint;

const player = document.getElementsByClassName("player")[0];

function createPlayer() {
    playerLeftSpace = grounds[0].left;
    player.style.left = `${playerLeftSpace}px`;
    player.style.bottom = `${playerBottomSpace}px`;
}

class Ground {
    constructor(newGroundBottom) {
        this.bottom = newGroundBottom;
        this.left = Math.random() * 425;
        this.visual = document.createElement("div");

        const visual = this.visual;
        visual.classList.add("ground");
        visual.style.left = `${this.left}px`;
        visual.style.bottom = `${this.bottom}px`;
        container.appendChild(visual);
    }
}

class NFT {
    constructor(newNftButtom) {
        this.bottom = newNftButtom;
        this.left = Math.random() * 325;
        this.visual = document.createElement("div");

        const visual = this.visual;
        visual.classList.add("nft");
        visual.style.left = `${this.left}px`;
    }
}

let groundCount = 5;
let grounds = [];

function createGround() {
    for(let i = 0; i < groundCount; i++) {
        let groundGap = 700 / groundCount;
        let groundBottom = 100 + i * groundGap;
        let ground = new Ground(groundBottom);
        grounds.push(ground);
    }
}


window.nftScore = 0;
let nfts = [new NFT(500)];

function moveNFTs() {
    if(playerBottomSpace > 200) {
        nfts.forEach(nft => {
            nft.bottom -= 4;
            let visual = nft.visual;
            visual.style.bottom = `${nft.bottom}px`;
            
            if(nft.bottom < 10) {
                let nftOne = nfts[0].visual;
                nftOne.classList.remove("nft");
                nfts.shift();

                let newNFT = new NFT(580);
                nfts.push(newNFT);
            }
        })
    } 
}

function checkIfCollectNft() {
    let nft = nfts[0];
    if (
        (playerLeftSpace >= nft.bottom) &&
        (playerLeftSpace <= nft.bottom + 50) &&
        ((playerLeftSpace + 50) >= nft.left) &&
        (playerLeftSpace <= (nft.left + 50))
    ) {
        console.log("colusion");
        window.nftScore += 1;
        let nftOne = nfts[0].visual;
        nftOne.classList.remove("nft");
        nfts.shift();

        let newNft = new NFT(580);
        nfts.push(newNft);
    }
}

let score = 0;
let grid = document.getElementsByClassName("grid-container")[0];
let scoreElement = document.getElementById("score");
let nftScoreElement = document.getElementById("nftScore");

function moveGrounds() {
    if (playerBottomSpace > 200) {
        grounds.forEach(ground => {
            ground.bottom -= 5;
            let visual = ground.visual;
            visual.style.bottom = `${ground.bottom}px`;

            if(ground.bottom < 10) {
                let groundOne = grounds[0].visual;
                groundOne.classList.remove("ground");
                grounds.shift();

                let newGround = new Ground(700);
                grounds.push(newGround);
            }
        });
    }
}

let upTimesId
let downTimerId
let isJumping

function jump() {
    clearInterval(downTimerId);
    isJumping = true;

    upTimesId = setInterval(() => {
        playerBottomSpace += 20;
        player.style.bottom = `${playerBottomSpace}px`;
        if(playerBottomSpace > startingPoint + 200) {
            fall();
        }
    }, 30);
}

function fall() {
    clearInterval(upTimesId);
    isJumping = false;

    downTimerId = setInterval(() => {
        playerBottomSpace -= 5;
        player.style.bottom = `${playerBottomSpace}px`;
    }, 30);

    if (playerBottomSpace <= 0) {
        endTheGame();
    }

    checkIfCollectNft()

    grounds.forEach(ground => {
        if (
            (playerLeftSpace >= ground.bottom) &&
            (playerLeftSpace <= ground.bottom + 15) &&
            ((playerLeftSpace + 50) >= ground.left) &&
            (playerLeftSpace <= (ground.left + 50)) &&
            !isJumping
        ) {
            jump();
            startingPoint = playerBottomSpace;
        }
    });
}

let isGameOver = false;
function startGame() {
    if (!isGameOver) {
        createGround();
        createPlayer();
        setInterval(moveGrounds(), 30);
        setInterval(moveNFTs(), 30);
        jump();
        document.addEventListener("keypress", onKeyPress);
    }
}

function loadImagesOfMintedNfts() {
    for(let i = 1; i <= 10; i++) {
        if(localStorage.getItem(i.toString())) {
            const nft1 = document.getElementById(i);
            const att = document.createAttribute("style");
            att.value = `content:url(./skin/${i}.png)`;
            nft1.setAttributeNode(att);
        }
    }
}

function endTheGame() {
    isGameOver = true;
    loadImagesOfMintedNfts();

    grounds.forEach(ground => {
        let groundOne = ground;
        groundOne.classList.remove("ground");
    });
    grounds = [];

    nfts.forEach(nft => {
        let nftOne = nft;
        nftOne.classList.remove("nft");
    });
    // nfts = [];

    player.classList.add("hide");
    grid.classList.remove("hide");
    scoreElement.innerText = `Score: ${score}`;
    nftScoreElement.innerText = `NFT Score: ${window.nftScore}`;


    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
    clearInterval(downTimerId);
    clearInterval(upTimesId);
}

function onKeyPress(event) {
    if(event.key === "ArrowLeft") {
        moveLeft();
    }else if(event.key === "ArrowRight") {
        moveRight();
    } else if(event.key === "ArrowUp") {
        stopMoving();
    }
}

let isGoingRight;
let isGoingLeft;
let leftTimerId;
let rightTimerId;

function stopMoving() {
    isGoingLeft = false;
    isGoingRight = false;
    clearInterval(rightTimerId);
    clearInterval(leftTimerId);
}

function moveLeft() {
    if(isGoingRight) {
        clearInterval(leftTimerId);
        isGoingRight = false;
    }

    isGoingLeft = true;
    leftTimerId = setInterval(() => {
        if(playerLeftSpace >= 0) {
            playerLeftSpace -= 5;
            player.style.left = `${playerLeftSpace}px`;
        }
    }, 30);
}

function moveRight() {
    if(isGoingLeft) {
        clearInterval(rightTimerId);
        isGoingLeft = false;
    }

    isGoingRight = true;
    rightTimerId = setInterval(() => {
        if(playerLeftSpace <= 450) {
            playerLeftSpace += 5;
            player.style.left = `${playerLeftSpace}px`;
        } else {
            moveLeft();
        }
    }, 30);
}

startGame();