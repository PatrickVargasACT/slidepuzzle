const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const gameDiv = document.getElementById('gameDiv');
const btnDiv = document.getElementById('btnDiv');

const img = new Image();


let sound = new Audio("sheesh.mp3");

const puzzleSize = 4;
let pieceIndex = [];
const correctIndex = [];

let ay = 0;
let low = false;

function patrick() {
	img.src = 'patrick.jpg';
	btnDiv.style.display = 'none';
	gameDiv.style.display = 'flex';
	
	
}
function aira() {
	img.src = 'aira.png';
	btnDiv.style.display = 'none';
	gameDiv.style.display = 'flex';
}

function addArray(arr) {
	arr.length = 0;

	for(let i = 1; i < puzzleSize * puzzleSize; i++){
		arr.push(i);
	}
	arr.push(0);
}

function shuffleByMoves(arr, puzzleSize, moves = 200){

		for(let i = 0; i < moves; i++){

			let zero = arr.indexOf(0);
			let possible = [];
			
			if(zero - puzzleSize >= 0)
				possible.push(zero - puzzleSize);

			if(zero + puzzleSize < puzzleSize * puzzleSize)
				possible.push(zero + puzzleSize);

			if(zero % puzzleSize !== 0)
				possible.push(zero - 1);

			if(zero % puzzleSize !== puzzleSize - 1)
				possible.push(zero + 1);

			let rand = possible[Math.floor(Math.random() * possible.length)];

			[arr[zero], arr[rand]] = [arr[rand], arr[zero]];
		}
	}


img.onload = function() {
	
	
	const pieceHeight = img.width / puzzleSize;
	const pieceWidth = img.width / puzzleSize;
	const canvasWidth = canvas.width = img.width;
	const canvasHeight = canvas.height = img.height;
	
	function updatePicture() {
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		for (let i = 0; i <	pieceIndex.length; i++) {
			drawPiece(pieceIndex[i], i + 1);
		} 
	}
	
	addArray(pieceIndex);
	addArray(correctIndex);
	shuffleByMoves(pieceIndex, puzzleSize);
	updatePicture();
	
	function arraysEqual(arr1, arr2){

		if(arr1.length !== arr2.length) return false;

		for(let i = 0; i < arr1.length; i++){
			if(arr1[i] !== arr2[i]){
				return false;
			}
		}

		return true;
	}
	
	
	function drawPiece(pieceNumber, piecePosition) {
		
		const pieceCol = pieceWidth * (Math.floor((pieceNumber - 1) / puzzleSize));
		const pieceRow = pieceHeight * ((pieceNumber - 1) % puzzleSize);
		const positCol = pieceWidth * (Math.floor((piecePosition - 1) / puzzleSize));
		const positRow = pieceHeight * ((piecePosition - 1) % puzzleSize);
		
		ctx.strokeRect(positRow, positCol, pieceWidth, pieceHeight);
		ctx.drawImage(img, 
		pieceRow, pieceCol, pieceWidth, pieceHeight,
		positRow, positCol, pieceWidth, pieceHeight);
	}
	
	function animate() {
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		ctx.drawImage(img, 0, ay);
		
		if (low === false) {
			ay--;
		} else if (low === true) {
			ay++;
		}
		
		if (ay === 10) {
			low = false;
		} else if (ay === -10) {
			low = true;
		}
		console.log('2');
		requestAnimationFrame(animate);
	}
	
	
	canvas.addEventListener('click', e => {
		const rect = canvas.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;
		
		const selectedPiece = (Math.floor(mouseY / pieceHeight)) * puzzleSize + (Math.floor(mouseX / pieceWidth));
		const zeroIndex = pieceIndex.indexOf(0);
		
		let x1 = selectedPiece % puzzleSize;
		let y1 = Math.floor(selectedPiece / puzzleSize);

		let x2 = zeroIndex % puzzleSize;
		let y2 = Math.floor(zeroIndex / puzzleSize);

		if (Math.abs(x1 - x2) + Math.abs(y1 - y2) === 1) {
			[pieceIndex[selectedPiece], pieceIndex[zeroIndex]] =  [pieceIndex[zeroIndex], pieceIndex[selectedPiece]];
			updatePicture();
		}
		
		if (arraysEqual(pieceIndex, correctIndex)) {
			sound.play();
			animate();
		}
	});
	
	document.getElementById("shuffleBtn").addEventListener("click", () => {
		addArray(pieceIndex);
		addArray(correctIndex);
		shuffleByMoves(pieceIndex, puzzleSize);
		updatePicture();
	});
	
}
	