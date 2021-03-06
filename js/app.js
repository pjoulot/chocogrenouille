window.addEventListener( "load", function() {
	
	/*
		Déclaration de variables
	*/
	var res = document.getElementById('resultat');
	var filter = document.getElementById('filter');

    var stream = null;
    var video = document.querySelector( 'video' );
    var canvas = document.querySelector( 'canvas' );
    var context = canvas.getContext( '2d' );
    var w, h, ratio, filterHeight, filterWidth;
	
	/*
		On applique l'API getUserMedia pour obtenir le flux vidéo de la camera
	*/
    if ( navigator.mediaDevices.getUserMedia ) {
	  var constraints = { video: true }; 
      navigator.mediaDevices.getUserMedia(constraints)
      .then(function(mediaStream) {
        video.srcObject = mediaStream;
        video.onloadedmetadata = function(e) {
          video.play();
        };
      })
      .catch(function(err) { console.log(err.name + ": " + err.message); });

    } else {
        console.log( "getUserMedia not supported" );
    }

	
	/*
		Fonction qui prend un snapshot du flux vidéo et applique le filtre choisi, le nom et le numéro
	*/
    takeScreenshot = function() {
		canvas.className = "";
		var queryfilter = document.querySelector( '#filter img' );
		
        w = queryfilter.width;
        h = queryfilter.height;
				
        canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		
		if(screen.width >= screen.height) {
			var height = video.videoHeight / (video.videoWidth/canvas.width);
			var offsetHeightCanvas = (canvas.height - height) / 2;
			context.drawImage(video, 0, offsetHeightCanvas, canvas.width, height);
		}
		else {
			var width = video.videoWidth / (video.videoHeight/canvas.height);
			var offsetWidthCanvas = (canvas.width - width) / 2;
			context.drawImage(video, offsetWidthCanvas, 0, width, canvas.height);
		}
		
		//Dessiner le filtre
        drawFilter();
		
		//Ecrire le nom
		drawName();
		
		//Ecrire le numero de la carte
		drawNumero();
		
		context.globalAlpha=1;
		buttonSeePreview.click();
    };
	
	/*
		Fonction qui dessine le nom choisi par l'utilisateur
	*/
	drawName = function() {
		if(screen.width >= screen.height) {
			var pourcentNom = 0.915;
			context.font = "20pt Harry Potter";
		}
		else {
			var pourcentNom = 0.935;
			context.font = "20pt Harry Potter";
		}
		context.textAlign = 'center';
		context.fillStyle = 'white';
		context.shadowOffsetX = 5;
		context.shadowOffsetY = 5;
		context.shadowBlur = 5;
		context.shadowColor = "black";
		context.globalAlpha=0.75;
		context.fillText(document.getElementById("nom").value, canvas.width / 2, pourcentNom * canvas.height);
		
		//Réinitialisation des ombres
		context.shadowColor = "transparent";
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 0;
		context.globalAlpha= 1;
	}
	
	/*
		Fonction qui dessine le numéro choisi par l'utilisateur
	*/
	drawNumero = function() {
		if(screen.width >= screen.height) {
			var pourcentNumeroHeight = 0.465;
			var pourcentNumeroWidth = 0.14;
			context.font = "bold 30pt Harry Potter";
		}
		else {
			var pourcentNumeroHeight = 0.475;
			var pourcentNumeroWidth = 0.13;
			context.font = "bold 25pt Harry Potter";
		}
		context.textAlign = 'left';
		context.fillStyle = 'white';
		context.shadowOffsetX = 5;
		context.shadowOffsetY = 5;
		context.shadowBlur = 5;
		context.shadowColor = "black";
		context.globalAlpha=0.75;
		var widthFilterPosition = getFilterPosition() + 84;
		// Reposionner le numéro selon le nombre de chiffre dans le numéro.
		var cipherCount = document.getElementById("numero").value.length;
		widthFilterPosition -= ((cipherCount * 13) / 2);
		context.fillText(document.getElementById("numero").value, widthFilterPosition, pourcentNumeroHeight * canvas.height);
		
		//Réinitialisation des ombres
		context.shadowColor = "transparent";
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 0;
		context.globalAlpha= 1;
	}
	
	/*
		Fonction qui dessine le filtre choisi par l'utilisateur
	*/
	drawFilter = function() {
		var filterimg = new Image();
		filterimg.src = document.getElementById("filterImage").src;
		
		var imgFilter = document.getElementById("filterImage");
		var imgFilterHeight = imgFilter.height;
		var imgFilterWidth = imgFilter.width;
		
		var imgWidth = Math.round(imgFilterWidth * (canvas.height /imgFilterHeight ));
		var imgHeight = canvas.height;

		var offsetCenterImg = getFilterPosition();
		
		context.drawImage( filterimg, offsetCenterImg, 0, imgWidth, imgHeight );
	}
	
	/*
	 * Get filter position.
	 */
	 getFilterPosition = function() {
		var imgFilter = document.getElementById("filterImage");
		var imgFilterHeight = imgFilter.height;
		var imgFilterWidth = imgFilter.width;
		
		//ratio par rapport à la hauteur
		var ratioHeigthResize = imgFilterHeight / video.videoHeight;
		var widthVideo = video.videoWidth * ratioHeigthResize;
		var heightVideo = imgFilterHeight;	
		
		var imgWidth = Math.round(imgFilterWidth * (canvas.height /imgFilterHeight ));
		var imgHeight = canvas.height;

		var offsetCenterImg = ((widthVideo - imgFilterWidth)/2) * (canvas.width / widthVideo);
		
		return offsetCenterImg;
	 }
	
	/*
		Fonction qui rafraichie l'image si on change le filtre, le nom ou le numéro
	*/
	refreshCard = function() {
		drawFilter();
		drawNumero();
		drawName();
	}
	
	/*
		Fonction qui rend visible une fonction de l'application (déclenché lors d'un clic dans le menu de l'app)
	*/
	makeVisible = function() {
		
		var buttons = document.querySelectorAll( '.menuList li' );
		for(var i=0;i<buttons.length;i++){
			buttons[i].style = "";
		}
		this.style = "background-color: #292929;";
		var myclass1 = document.getElementsByClassName("tileVisible");
		var myId;
		for(var j=0;j<myclass1.length;j++){
			myId = document.getElementById(myclass1[j].id);
			myId.className = "tileInvisible";
		}
		var myclass2 = document.getElementById(this.className);
		myclass2.className = "tileVisible";
	}
	
	/*
		Enregistrement des écouteurs sur les boutons
	*/
    var snap = document.getElementById("snap"); 
    snap.addEventListener( 'click', takeScreenshot );
	
	var argent = document.getElementById("argent"); 
    argent.addEventListener( 'click', setFilterArgent );
	var or = document.getElementById("or"); 
    or.addEventListener( 'click', setFilterOr );
	var bronze = document.getElementById("bronze"); 
    bronze.addEventListener( 'click', setFilterBronze );
	
	var buttonPutFilter = document.getElementById("buttonPutFilter");
	buttonPutFilter.addEventListener( 'click', makeVisible );
	
	var buttonTakePicture = document.getElementById("buttonTakePicture");
	buttonTakePicture.addEventListener( 'click', makeVisible );
	
	var buttonSeePreview = document.getElementById("buttonSeePreview");
	buttonSeePreview.addEventListener( 'click', makeVisible );
	
	var buttonOptionsName = document.getElementById("buttonOptionsName");
	buttonOptionsName.addEventListener( 'click', makeVisible );
	
	var buttonOptionsName = document.getElementById("buttonInfo");
	buttonOptionsName.addEventListener( 'click', makeVisible );
	
	var numeroInput = document.getElementById("numero");
	numeroInput.addEventListener( 'change', refreshCard );
	
	var nomInput = document.getElementById("nom");
	nomInput.addEventListener( 'change', refreshCard );
	
	/*
		Fonction qui applique un filtre par dessus le flux vidéo de la prise de photo
	*/
	function setFilter(imgFilterName) {
		var image=document.createElement('img');
		image.id="filterImage";
		image.src = imgFilterName;
		filter.innerHTML = "";
		filter.appendChild(image);
	}
	
	/*
		Fonction qui choisie le filtre Argent
	*/
	function setFilterArgent() {
		setFilter("images/filters/cadrechocogrenouille.png");
		refreshCard();
		buttonTakePicture.click();
	}
	/*
		Fonction qui choisie le filtre Or
	*/
	function setFilterOr() {
		setFilter("images/filters/cadrechocogrenouilleor.png");
		refreshCard();
		buttonTakePicture.click();
	}
	/*
		Fonction qui choisie le filtre Bronze
	*/
	function setFilterBronze() {
		setFilter("images/filters/cadrechocogrenouillebronze.png");
		refreshCard();
		buttonTakePicture.click();
	}
	
	//On enregistre un écouteur sur le bouton save pour proposer d'enregistrer notre image en js
	document.getElementById("formSave").addEventListener("submit", function(event) {
		var canvas_filename = document.getElementById("canvas-filename");
		event.preventDefault();
		canvas.toBlob(function(blob) {
			saveAs(
				  blob
				, (canvas_filename.value || canvas_filename.placeholder) + ".png"
			);
		}, "image/png");
	}, false);
	
	//Au démarrage de l'App on met un filtre par défaut
	setFilterArgent();

} );