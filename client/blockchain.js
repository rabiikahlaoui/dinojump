function loadImagesOfMintedNfts() {
    for (let i = 1; i <= 10; i++) {
        if (localStorage.getItem(i.toString())) {
            console.log(`element with id ${i} is minted`)
            const nft1 = document.getElementById(i)
            const att = document.createAttribute("style");
            att.value = `content:url(./skins/${i}.png)`
            nft1.setAttributeNode(att);
        }
    }
}

async function mintOrSelect(element) {
    if (signer == undefined) {
        alert("Connect your metamask")
    }
    if (window.nftScore < 1) {
        alert("you need score to mint nft")
        return
    }
    const skinsContractAddress = "0x14e2d4ba3b2505d3a9a1D0Cd78448b76b576665e"
    const skinsCollectionAbi = [
        "function mint(string memory tokenURI) public returns (uint256)"
    ]
    const skinsContract = new ethers.Contract(skinsContractAddress, skinsCollectionAbi, provider);

    if (localStorage.getItem(element.id) == null) {
        const cidOfJsonFiles = "QmX4riPEcdNYDbcaSwdCQZtBpr4V6g7nyR11J7SYZLEzvm"
        const tokenURI = `https://ipfs.io/ipfs/${cidOfJsonFiles}/` + element.id + ".json"
        const tx = await skinsContract.connect(signer).mint(tokenURI)
        await tx.wait()

        localStorage.setItem(element.id, 1)
        // minted an NFT...

        loadImagesOfMintedNfts()
    } else {
        //  selected an NFT as a skin...
        localStorage.setItem("currentSkin", `./skins/${element.id}.png`)
    }
}


let provider = new ethers.providers.Web3Provider(window.ethereum)
let signer

async function connectMetamask() {
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    console.log("Account address s:", await signer.getAddress());
}