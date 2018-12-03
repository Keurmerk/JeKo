
$(function () {
	//  Check authentication

	const dbRef = firebase.database().ref();

	var imgclick = $(".njmlogo")
	imgclick.on("click", function (e) {
		e.preventDefault();
		window.location.hash = '#home'

	});



	$(".menumask").on("click", function () {
		uncheckBox();

	});


	$("#checkbox").bind("change", function () {
		var checkboxActive = $("#checkbox").prop("checked");
		if (checkboxActive) {
			$('.menumask').addClass('active');
		} else {
			$('.menumask').removeClass('active');
		}

	});

	function uncheckBox() {
		var isChecked = $("#checkbox").prop("checked");
		if (isChecked) {

			$("#checkbox").prop("checked", false);
			$('.menumask').removeClass('active');
		}
	}




	// Single product page buttons
	var singleProductPage = $('.single-product');

	singleProductPage.on('click', function (e) {

		if (singleProductPage.hasClass('visible')) {

			var clicked = $(e.target);

			// If the close button or the background are clicked go to the previous page.
			if (clicked.hasClass('close') || clicked.hasClass('overlay')) {
				// Change the url hash with the last used filters.
				createQueryHash(filters);
			}

		}

	});



	// Call a function to create HTML for all the products.
	MenuButtons();

	// Manually trigger a hashchange to start the app.
	render(decodeURI(window.location.hash));

	$(window).trigger('hashchange');


	// An event handler with calls the render function on every hashchange.
	// The render function will show the appropriate content of out page.
	$(window).on('hashchange', function () {
		render(decodeURI(window.location.hash));
	});


	// Navigation

	function render(url) {
		AddInvoer();
		// Get the keyword from the url.
		var temp = url.split('/')[0];

		// Hide whatever page is currently shown.
		$('.main-content .page').removeClass('visible');

		var map = {

			'': function () {

				window.location.hash = '#home'
			},
			// The "Homepage".
			'#login': function () {


				Login();
			},
			'#home': function () {


				Home();
			},

			// Single Products page.
			'#Meisjes': function () {

				// Get the index of which product we want to show and call the appropriate function.
				var upset = url.split('/')[0];
				var first = upset.replace('#', '');
				var second = url.split('#Meisjes/')[1];

				getPoulesRender(first, second);

			},
			'#Jongens': function () {

				// Get the index of which product we want to show and call the appropriate function.
				var upset = url.split('/')[0];
				var first = upset.replace('#', '');
				var second = url.split('#Jongens/')[1];
				$('.product-list').removeClass('visible');
				GIFanimate()
				getPoulesRender(first, second);

				// renderSingleProductPage(first, second);
			},
			'#backend': function () {


				Backend();
			},



		};

		// Execute the needed function depending on the url keyword (stored in temp).
		if (map[temp]) {
			map[temp]();
		}
		// If the keyword isn't listed in the above - render the error page.
		else {
			renderErrorPage();
		}

	}

	function GIFanimate() {


	}

	function Login() {
		var page = $('.sign-product')



		var LoginBut = $('.LoginButton');
		LoginBut.on('click', function (e) {
			CheckLogin();
		})

		var LogOut = $('.LogOut');
		LogOut.on('click', function (e) {
			firebase.auth().signOut().then(function () {
				// Sign-out successful.

			}, function (error) {
				// An error happened.
			});
		})
		page.addClass('visible');
	}
	function Home() {
		var page = $('.home-product')
		page.addClass('visible');
	}


	// This function is called only once - on page load.
	// It fills up the products list via a handlebars template.
	// It recieves one parameter - the data we took from products.json.
	function MenuButtons() {

		var jongens = $('.Jongens');
		jongens.on('click', function (e) {
			e.preventDefault();

			var productIndex = e.target.getAttribute('data-target');
			$("#checkbox").prop("checked", false);
			$('.menumask').removeClass('active');

			window.location.hash = 'Jongens/' + productIndex;
		})

		var Meisjes = $('.Meisjes');
		Meisjes.on('click', function (e) {
			e.preventDefault();
			$("#checkbox").prop("checked", false);
			var productIndex = e.target.getAttribute('data-target');
			$('.menumask').removeClass('active');
			window.location.hash = 'Meisjes/' + productIndex;
		})

		var logbut = $('.Authentication');
		logbut.on('click', function (e) {
			e.preventDefault();
			$('.menumask').removeClass('active');
			$("#checkbox").prop("checked", false);
			var productIndex = e.target.getAttribute('data-target');


			window.location.hash = productIndex;
		})

		var back = $('.Invoer');
		back.on('click', function (e) {
			e.preventDefault();
			$('.menumask').removeClass('active');
			$("#checkbox").prop("checked", false);
			var productIndex = e.target.getAttribute('data-target');


			window.location.hash = productIndex;
		})


	}


	function getPoulesRender(first, second) {
		document.getElementById("tables").innerHTML = '';
		var Gen = first.charAt(0);
		var kla = second.charAt(0);
		dbRef.child('P').orderByChild('N').equalTo(Gen + '_' + kla)
			.once('value').then(function (snapshot) {
				// The Promise was "fulfilled" (it succeeded).
				getNamesRender(snapshot.val(), first, second)
			});
	}

	function sortArray(array, property, direction) {
		direction = direction || 1;
		array.sort(function compare(a, b) {
			let comparison = 0;
			if (a[property] > b[property]) {
				comparison = 1 * direction;
			} else if (a[property] < b[property]) {
				comparison = -1 * direction;
			}
			return comparison;
		});
		return array; // Chainable
	}

	function getNamesRender(PouleID, first, second) {
		var page = $('.single-product'),
			container = $('.preview-large');
			
		
			
		var OBpoules = (Object.keys(PouleID))
		var OBpoules = OBpoules.sort(function (a, b) {
			var a = a.split('_')[2].replace('G', "")
			var b = b.split('_')[2].replace('G', "")
			return a - b;
		});

		var StandenTable = "";
		for (v = 0; v < OBpoules.length; v++) {
			var poop = Object.values(PouleID)
			dbRef.child('S').orderByChild('IDpoule').equalTo(OBpoules[v])
				.once('value').then(function (snapshot) {
					// The Promise was "fulfilled" (it succeeded).
					renderSingleProductPageV2(PouleID, snapshot.val())

				});
		}
		var test = 0;
		var ListWithVifePoules = [];
		function renderSingleProductPageV2(Pouleses, naam) {

			test++
			var Thevals = Object.values(naam)
			var Pol = Thevals[0].IDpoule.split("_")[2];
			if (Thevals.length == 5) {
				var pushobj = {
					'IDplaats': "J_J_G1_6",
					'IDpoule': "J_J_G1",
					'Key': "-Bye",
					'Naam': "Bye",
					'Plaats': "6",
					'Vereniging': "Bye",
					'Wedstrijden': {
						1: "",
						2: "",
						3: "",
						4: "",
						5: "",
						6: "",
					}
				}

				Thevals.push(pushobj)
				ListWithVifePoules.push(Thevals[0].IDpoule)

			}



			sortArray(Thevals, "Plaats")
			StandenTable +=
				"<table id='customers'>" +
				"<div class='Titel'>"
				+ "<h1>" + Thevals[0].IDpoule.split('_')[2].replace('G', 'Groep ') + "</h1>"
				+ "</div>" +
				"<tr>" +
				"<th>nr</th>" +
				"<th>Speler</th>";
			var Lengte = Thevals.length;
			if (Lengte == 6) {
				var Len = 6;
			} else if (Lengte == 7) {
				var Len = 8;
			}

			for (nk = 1; nk < Len; nk++) {

				StandenTable += "<th>R" + nk + "</th>";
			}
			StandenTable += "</tr>";
			for (n = 0; n < Lengte; n++) {

				StandenTable +=
					"<tr>" +
					"<td id='" + Thevals[n].Key + "' class='key_" + Thevals[n].Plaats + "_" + Thevals[0].IDpoule + "'>" + Thevals[n].Plaats + "</td>" +
					"<td>" + Thevals[n].Naam + "<br>" + "<club>" + Thevals[n].Vereniging + "</club>" + "</td>";

				for (x = 0; x < Len - 1; x++) {
					if (Object.values(Thevals[n].Wedstrijden)[x] == '0') {
						StandenTable +=
							"<td id='" + Pol + "_S" + Thevals[n].Plaats + "_" + x + "' class='midden loss'>" + Object.values(Thevals[n].Wedstrijden)[x] + "</td>";
					} else if (Object.values(Thevals[n].Wedstrijden)[x] == '1') {
						StandenTable +=
							"<td id='" + Pol + "_S" + Thevals[n].Plaats + "_" + x + "' class='midden win'>" + Object.values(Thevals[n].Wedstrijden)[x] + "</td>";
					} else {
						StandenTable +=
							"<td id='" + Pol + "_S" + Thevals[n].Plaats + "_" + x + "' class='midden'>" + Object.values(Thevals[n].Wedstrijden)[x] + "</td>";
					}
				}
				StandenTable += "</tr>";
			}
			StandenTable += "</table>";
			StandenTable +=
				"<button class='collapsiblewhole'>Meer info</button>" +
				"<div class='content'>";
			var nr = 1;
			var Wnr = 1;
			var poop = Pouleses[Thevals[nr].IDpoule]
			var Wedstrijdnum = poop.R
			for (r = 0; r < Wedstrijdnum.length - 1; r++) {

				StandenTable +=
					"<button class='collapsible'>Ronde " + nr + "</button>" +
					"<div class='content'>" +
					"<table class='StandenTable'>" +
					"<tr>" +
					"<th></th>" +
					"<th>Spelers </th>" +
					"<th>G1 </th>" +
					"<th>G2 </th>" +
					"<th>G3 </th>" +
					"<th>G4 </th>" +
					"<th>G5 </th>" +
					"<th>Uitslag </th>" +
					"</tr>";
				var GamesThis = (Object.values(Wedstrijdnum)[r]);
				var gamevor = Pouleses[Thevals[r].IDpoule];
				var gamestanden = (gamevor.R)[r + 1];

				for (l = 0; l < 3; l++) {
					var thisgame = Object.values(gamestanden)[l]

					StandenTable +=
						"<tr>" +
						"<td><a>" + Wnr + "</a></td>" +
						"<td><asd>" + Object.keys(GamesThis)[l] + "</asd></td>" +
						"<td id='" + Pol + "_R" + nr + "_" + Object.keys(GamesThis)[l] + "_G1'><asd>" + thisgame.G1 + "</asd></td>" +
						"<td id='" + Pol + "_R" + nr + "_" + Object.keys(GamesThis)[l] + "_G2'><asd>" + thisgame.G2 + "</asd></td>" +
						"<td id='" + Pol + "_R" + nr + "_" + Object.keys(GamesThis)[l] + "_G3'><asd>" + thisgame.G3 + "</asd></td>" +
						"<td id='" + Pol + "_R" + nr + "_" + Object.keys(GamesThis)[l] + "_G4'><asd>" + thisgame.G4 + "</asd></td>" +
						"<td id='" + Pol + "_R" + nr + "_" + Object.keys(GamesThis)[l] + "_G5'><asd>" + thisgame.G5 + "</asd></td>" +
						"<td id='" + Pol + "_R" + nr + "_" + Object.keys(GamesThis)[l] + "_UI' class='UI'><asd></asd></td>" +
						"</tr>";
					Wnr++;
				}

				StandenTable += "</table></div>"
				nr++;
			}

			StandenTable += "</div>";

			if (OBpoules.length === test) {
				document.getElementById("tables").innerHTML = StandenTable;
				collap();
				ChangeEditText(ListWithVifePoules);
				WriteToDatabase();
			}

		}
		page.addClass('visible')
	}

	function ChangeEditText(ListWithVifePoules) {
		firebase.auth().onAuthStateChanged(function (user) {
			if (user) {
				$(".StandenTable td[id]:not([class])").each(function () {
					// Log the html content of each 'td'.
					this.setAttribute("contenteditable", true);
					this.setAttribute("type", "number");
				});
				vifePersons(ListWithVifePoules);
				OnlyCalcUitslag();

			} else {
				vifePersons(ListWithVifePoules);
				OnlyCalcUitslag();

			}
		});
	}


	function vifePersons(ListWithVifePoules) {
		var ListCancel = [];
		for (b = 0; b < ListWithVifePoules.length; b++) {
			var Groep = ListWithVifePoules[b].split('_')[2];
			$(".StandenTable td[id*='" + Groep + "_']").each(function () {
				if (this.id.indexOf('-6') !== -1) {
					this.removeAttribute("contenteditable", true);
					ListCancel.push(this.id)
				}
			});
			var nrlist = ListCancel.length / 6;
			for (ba = 0; ba < nrlist; ba++) {
				var ListCancelFilter = ListCancel.splice(0, 6)[0]
				$(".StandenTable td[id*='" + ListCancelFilter + "']").closest('tr').each(function () {
					$(this).addClass('strikeout')
				})


			}
		}


	}

	// Shows the error page.
	function renderErrorPage() {
		var page = $('.error');
		page.addClass('visible');
	}

	function createQueryHash(filters) {

		// Here we check if filters isn't empty.
		if (!$.isEmptyObject(filters)) {
			// Stringify the object via JSON.stringify and write it after the '#filter' keyword.
			window.location.hash = '#filter/' + JSON.stringify(filters);
		}
		else {
			// If it's empty change the hash to '#' (the homepage).
			window.location.hash = '#';
		}

	}
	//  Het inloggen
	function CheckLogin() {
		const email = document.getElementById('UserName').value;
		const password = document.getElementById('PassWord').value;
		firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
			// Sign-out successful.
			window.location.hash = 'Jongens/Welpen';

		}, function (error) {
			// An error happened.
			var errorCode = error.code;
			var errorMessage = error.message;
			if (errorCode === 'auth/wrong-password') {
				alert('Wrong password.');
			} else {
				alert(errorMessage);
			}

		});
	}

	function AddInvoer() {
		firebase.auth().onAuthStateChanged(function (user) {
			if (user) {
				// User is signed in.
				$('.Invoer').addClass('visible');
			} else {
				// No user is signed in.
				$('.Invoer').removeClass('visible');
			}
		});
	}

	// 	Opvouwen van de rondes
	function collap() {
		var coll = document.getElementsByClassName("collapsible");
		var collWhole = document.getElementsByClassName("collapsiblewhole");


		var i;

		for (i = 0; i < coll.length; i++) {
			coll[i].addEventListener("click", function () {
				var close = document.getElementsByClassName('collapsible');

				for (j = 0; j < coll.length; j++) {

					var almost = close[j].nextElementSibling;

					if (almost == this.nextElementSibling) {
						this.classList.toggle("active");
						var content = this.nextElementSibling;

						if (content.style.maxHeight) {
							content.style.maxHeight = null;

						} else {
							content.style.maxHeight = content.scrollHeight + "px";

						}

					} else {
						almost.style.maxHeight = null;
						close[j].classList.toggle("active", false);

					}

				}

			});
		}

		for (i = 0; i < collWhole.length; i++) {
			collWhole[i].addEventListener("click", function () {
				OnlyCalcUitslag();

				this.classList.toggle("active");
				var content = this.nextElementSibling;
				if (content.style.maxHeight) {
					content.style.maxHeight = null;

				} else {
					content.style.maxHeight = "100%";

				}
			});
		}
	}

	function WriteToDatabase() {
		firebase.auth().onAuthStateChanged(function (user) {
			if (user) {
				var tfales = [];
				var tablesstanden = $(".StandenTable").find("td[id]");

				[].forEach.call(tablesstanden, function (tablesstanden) {
					tablesstanden.addEventListener("blur", function () {
						var tr = $(this).attr('id');
						var Gamestand = document.getElementById(tr).innerText;
						var inner = document.getElementById(tr).firstChild;

						if (isEmpty(this)) {
							$(this).removeClass('fout')

							var url = decodeURI(window.location.hash);
							var url1 = url.replace('#', '')
							var Gender = url1.split('/')[0].charAt(0);
							var Klasse = url1.split('/')[1].charAt(0);
							SaveData(tr, Gender, Klasse)
						} else if (Gamestand.indexOf('-') <= 0) {
							$(this).addClass('fout')

						} else {
							$(this).removeClass('fout')
							var P1game = Gamestand.split("-")[0]
							var P2game = Gamestand.split("-")[1]
							if (!bestOfVifeCheck(P1game, P2game)) {
								$(this).addClass('fout')
							} else {
								$(this).removeClass('fout')
								var url = decodeURI(window.location.hash);
								var url1 = url.replace('#', '')
								var Gender = url1.split('/')[0].charAt(0);
								var Klasse = url1.split('/')[1].charAt(0);
								SaveData(tr, Gender, Klasse)

							}
						}
					});


				});

				function isEmpty(td) {
					if (td.innerText == '\t' || td.innerText == '\n\t' || td.innerText == '' || td.innerText == '\t\n' || td.innerText == '\n' || td.innerText == ' ' || td.innerText == '&nbsp;') {
						return true;
					}

					return false;
				}

				function SaveData(tfales, Gender, Klasse) {

					var AllCodes = tfales;

					var Poule = AllCodes.split('_')[0];

					var CodeChangeR = AllCodes.split('_')[1];
					var Ronde = CodeChangeR.replace('R', '');
					var NummersAgaints = AllCodes.split('_')[2];

					var Game = AllCodes.split('_')[3];

					const GUI = document.getElementById(tfales).innerText;

					const WriteRef = dbRef.child('P').child(Gender + '_' + Klasse + '_' + Poule).child('R').child(Ronde).child(NummersAgaints);
					WriteRef.update({
						[Game]: GUI,

					}).then(function () {
						// The Promise was "fulfilled" (it succeeded).
						CalcUitslag(Gender + '_' + Klasse, tfales)
					});




				};

			} else {
			}
		});




	}

	function Backend() {
		firebase.auth().onAuthStateChanged(function (user) {
			if (user) {
				var page = $('.backend-product');
				$(".NieuweSpeler").click();

				// Bovenste buttons
				$(".NieuweSpeler").on("click", function () {
					$(".WijzigPlayer").removeClass('visible')
					$(".CreeerPoule").removeClass('visible')
					$(".CreeerPlayer").addClass('visible')
					getPoules("keuzePoules", 'order', 1);
					setPoulesSpinnernr();

				});

				$(".WijzigSpeler").on("click", function () {
					$(".WijzigPlayer").addClass('visible')
					$(".CreeerPlayer").removeClass('visible')
					$(".CreeerPoule").removeClass('visible')
					getPoules("keuzePoulesWijzig", null, 1);
					fillPlayers();
				});

				$(".NieuwePoule").on("click", function () {
					$(".CreeerPoule").addClass('visible')
					$(".CreeerPlayer").removeClass('visible')
					$(".WijzigPlayer").removeClass('visible')
				});

				// Save buttons
				$(".SavePlayer").on("click", function () {
					var naam = document.getElementById('NaamSpeler').value
					var ver = document.getElementById('NaamVereniging').value
					var selPoule = document.getElementById('keuzePoules_0').value
					var selplaats = document.getElementById('plaatsPoules').value
					saveP(naam, ver, selPoule, selplaats)
				});
				$(".SavePoule").on("click", function () {
					var Poulename = document.getElementById('NaamPoule').value
					var choose = $('#chooche').find(":selected").text();
					setPoules(Poulename, choose);
				});

				function getPoules(NameDocID, selected, aantal) {
					dbRef.child('P').once('value').then(function (snapshot) {

						setPoulesSpinner(snapshot.val(), NameDocID, selected, aantal);


					});

				}

				function setPoulesSpinner(poules, NameDocID, selected, aantal) {
					var OBpoules = (Object.keys(poules))
					var optionValue = ""

					for (i = 0; i < OBpoules.length; i++) {
						if (OBpoules[i] == selected) {
							optionValue += "<option value=" + OBpoules[i] + " id=" + OBpoules[i] + " selected>" + OBpoules[i] + "</option>"
						} else {
							optionValue += "<option value=" + OBpoules[i] + " id=" + OBpoules[i] + ">" + OBpoules[i] + "</option>"
						}
					}
					for (io = 0; io < aantal; io++) {
						document.getElementById(NameDocID + "_" + io).innerHTML = optionValue;
					}
				}

				function setPoulesSpinnernr() {
					var plaatsValue = ""
					for (ip = 1; ip < 8; ip++) {
						plaatsValue += "<option value=" + [ip] + " id=" + [ip] + ">" + [ip] + "</option>"
					}

					document.getElementById("plaatsPoules").innerHTML = plaatsValue;
				}

				function saveP(naam, vereniging, poule, plaats) {
					var WedPlay = {
						'1': "",
						'2': "",
						'3': "",
						'4': "",
						'5': "",
						'6': "",
					}
					const pushSpeler = firebase.database().ref('S')
						.push();
					const key = pushSpeler.key;
					pushSpeler.set({
						'Naam': naam,
						'Vereniging': vereniging,
						'IDpoule': poule,
						'IDplaats': poule + '_' + plaats,
						'Plaats': plaats,
						'Wedstrijden': WedPlay,
						'Key': key,

					}, function (error) {
						if (error) {
							alert("Data could not be saved." + error);
						} else {
							location.reload();

						}
					});


				}

				function fillPlayers() {
					$("#keuzePoulesWijzig_0").on('change', function (e) {
						e.preventDefault();
						dbRef.child('S').orderByChild("IDpoule").equalTo($('#keuzePoulesWijzig_0').find(":selected").text()).once('value').then(function (snap) {
							// The Promise was "fulfilled" (it succeeded).
							setPlayers(snap.val());
						});
					})

				}

				function setPlayers(keys) {

					// Fumnctie van wijzigen van spelers (URGENT)
					var TheWijzigPlayer = Object.values(keys)
					sortArray(TheWijzigPlayer, "Plaats")
					var PlayersWijzig = "";
					getPoules("WijzigPlayerPouleID", TheWijzigPlayer[0].IDpoule, TheWijzigPlayer.length)
					for (po = 0; po < TheWijzigPlayer.length; po++) {
						PlayersWijzig += "<div id='" + TheWijzigPlayer[po].Key + "'>"
						PlayersWijzig += "<input style='padding:12px 20px; width:20px;' id='Plaats_" + po + "' value=" + TheWijzigPlayer[po].Plaats + "></input>"
						PlayersWijzig += "<input type='text' id='NaamSpelerWijzig_" + po + "' value='" + TheWijzigPlayer[po].Naam + "'></input>"
						PlayersWijzig += "<input type='text' id='NaamVerenigingWijzig_" + po + "' value='" + TheWijzigPlayer[po].Vereniging + "'></input>"
						PlayersWijzig += "<select style='padding:12px 5px; width:90px;' id='WijzigPlayerPouleID_" + po + "'></select>"
						PlayersWijzig += "<button id='key_"+TheWijzigPlayer[po].Key +"' >Verwijder</button><br></div>"
					}
					document.getElementById("WijzigPlayerPoules").innerHTML = PlayersWijzig;

					$("input[id*='NaamSpelerWijzig_']").on('blur', function (e) {
						var keyWijzigName = this.parentElement.id
						var nameWijzigName = this.value
						saveWijzigPlayer(keyWijzigName, nameWijzigName, "Naam")
					})

					$("input[id*='NaamVerenigingWijzig_']").on('blur', function (e) {
						var keyWijzigName = this.parentElement.id
						var nameWijzigName = this.value
						saveWijzigPlayer(keyWijzigName, nameWijzigName, "Vereniging")
					})

					$("input[id*='Plaats_']").on('blur', function (e) {
						var keyWijzigName = this.parentElement.id
						var nameWijzigName = this.value
						var setup = $("div[id='" + keyWijzigName + "'] option:selected")[0].id
						saveWijzigPlayer(keyWijzigName, nameWijzigName, "Plaats")
						saveWijzigPlayer(keyWijzigName, setup + '_' + nameWijzigName, "IDplaats")
					})

					$("select[id*='WijzigPlayerPouleID_']").on('change', function (e) {
						var keyWijzigName = this.parentElement.id
						var nameWijzigName = this.value
						var setup = $("div[id='" + keyWijzigName + "'] input[id*='Plaats_']")[0].value

						saveWijzigPlayer(keyWijzigName, nameWijzigName, "IDpoule")
						saveWijzigPlayer(keyWijzigName, nameWijzigName + '_' + setup, "IDplaats")
					})

					$("button[id*='key_']").on('click', function (e) {
						var keyWijzigName = this.parentElement.id
						firebase.database().ref('S').child(keyWijzigName)
						.remove().then(function(){
							location.reload();
						});
					})

				}

				function saveWijzigPlayer(key, value, IDvalue) {
					firebase.database().ref('S').child(key)
						.update({
							[IDvalue]: value,
						});
				}

				function setPoules(PoulID, AantalPlayers) {
					if (AantalPlayers == 6) {
						var objWed = {
							'1': {
								"1-6": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								},
								"2-5": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								},
								"3-4": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								}
							},
							'2': {
								"1-5": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								},
								"2-4": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								},
								"3-6": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								}
							},
							'3': {
								"1-4": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								},
								"2-3": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								},
								"5-6": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								}
							},
							'4': {
								"1-3": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								},
								"2-6": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								},
								"4-5": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								}
							},
							'5': {
								"1-2": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								},
								"3-5": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								},
								"4-6": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								}
							},

						}
					} else if (AantalPlayers == 7) {
						var objWed = {
							'1': {
								"2-7": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								},
								"3-6": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								},
								"4-5": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								}
							},
							'2': {
								"1-7": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								},
								"3-5": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								},
								"4-6": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								}
							},
							'3': {
								"2-5": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								},
								"1-6": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								},
								"4-7": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								}
							},
							'4': {
								"1-5": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								},
								"2-6": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								},
								"3-7": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								}
							},
							'5': {
								"1-4": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								},
								"6-7": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								},
								"2-3": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								}
							},
							'6': {
								"5-7": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								},
								"2-4": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								},
								"1-3": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								}
							},
							'7': {
								"5-6": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								},
								"3-4": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								},
								"1-2": {
									"G1": "",
									"G2": "",
									"G3": "",
									"G4": "",
									"G5": "",
								}
							},

						}
					}

					var NaamPouleId = PoulID.slice(0, -3)
					firebase.database().ref('P').child(PoulID)
						.set({
							'R': objWed,
							'N': NaamPouleId


						}, function (error) {
							if (error) {
								alert("Data could not be saved." + error);
							} else {
								location.reload();

							}
						});


				}


				page.addClass('visible')
			} else {
				window.location.hash = '#home'
			}
		});

	}

	function CalcUitslag(GenKla, tdCell) {
		var ListCells = new Array();
		var tds = $(".StandenTable td[id='" + tdCell + "']").closest('tr')
		$(tds).find('td[id]').each(function () {
			ListCells.push(this)
		});

		var AllGames = ListCells.splice(0, 6)
		var PlayerOneScore = 0;
		var PlayerTwoScore = 0;

		for (n = 0; n < 5; n++) {


			var game = AllGames[n];

			var gamescore = game.innerText;

			var P1 = gamescore.split("-")[0]
			var P2 = gamescore.split("-")[1]

			if (+P1 > +P2) {

				PlayerOneScore++
			}
			if (+P2 > +P1) {

				PlayerTwoScore++
			}

		}
		// Define players id's
		var IdDefine = $(AllGames[5]).attr('id')
		var PlayersDefine = IdDefine.split('_')[2]
		var P1Define = PlayersDefine.split('-')[0]
		var P2Define = PlayersDefine.split('-')[1]

		var AllCodes = IdDefine;
		var Poule = AllCodes.split('_')[0];
		var P1Key = $("#customers td[class='key_" + P1Define + "_" + GenKla + "_" + Poule + "']").attr('id')
		var P2Key = $("#customers td[class='key_" + P2Define + "_" + GenKla + "_" + Poule + "']").attr('id')
		var CodeChangeR = AllCodes.split('_')[1];
		var Ronde = CodeChangeR.replace('R', '');
		var UitslagCell = AllGames[5];


		var dbSetUIP1 = dbRef.child('S').child(P1Key).child('Wedstrijden');
		var dbSetUIP2 = dbRef.child('S').child(P2Key).child('Wedstrijden');
		if (+PlayerOneScore == 3) {
			UitslagCell.innerText = PlayerOneScore + "-" + PlayerTwoScore;
			// Player 1
			dbSetUIP1.update({
				[Ronde]: '1'
			})
			// Player 2

			dbSetUIP2.update({
				[Ronde]: '0'
			})


		} else if (+PlayerTwoScore == 3) {

			UitslagCell.innerText = PlayerOneScore + "-" + PlayerTwoScore;


			dbSetUIP1.update({

				[Ronde]: '0'
			})

			dbSetUIP2.update({

				[Ronde]: '1'
			})

		} else {
			UitslagCell.innerText = "";


			dbSetUIP1.update({

				[Ronde]: ''
			})

			dbSetUIP2.update({

				[Ronde]: ''
			})

		}





	}

	// function UIListener() {
	// 	$("#customers td[class='midden']").each(function () {
	// 		// Log the html content of each 'td'.

	// 		var cell = $(this).attr('id');
	// 		var CodeChangeP = cell;
	// 		var Poule = CodeChangeP.split('_')[0];

	// 		var Spelslid = CodeChangeP.split('_')[1];
	// 		var SpelerNum = Spelslid.replace('S', '');

	// 		var WedNum = CodeChangeP.split('_')[2];

	// 		var url = decodeURI(window.location.hash);
	// 		var url1 = url.replace('#', '')
	// 		var Gender = url1.charAt(0);
	// 		var Klasse = url1.split('/')[1].charAt(0);

	// 		const dbWedList = dbRef.child('S').orderByChild("IDplaats").equalTo(Gender + '_' + Klasse + '_' + Poule + '_' + SpelerNum);
	// 		dbWedList.on('value', snap => {
	// 			if (snap.exists()) {
	// 				var totaal = Object.values(snap.val())
	// 				var PerWedstrijd = totaal[0].Wedstrijden
	// 				var Gameuitslag = Object.values(PerWedstrijd)[WedNum - 1];
	// 				if (!Gameuitslag) {
	// 					this.innerText = ''
	// 					$(this).removeClass("loss")
	// 					$(this).removeClass("win")
	// 				} else if (Gameuitslag == '1') {
	// 					this.innerText = Gameuitslag;
	// 					$(this).addClass("win")
	// 				} else {
	// 					this.innerText = Gameuitslag;
	// 					$(this).addClass("loss")
	// 				}

	// 			}
	// 		})
	// 	});

	// 	$(".StandenTable td[id]:not([class])").each(function () {
	// 		var cell2 = $(this).attr('id');

	// 		var url = decodeURI(window.location.hash);
	// 		var url1 = url.replace('#', '')
	// 		var Gender = url1.charAt(0);
	// 		var Klasse = url1.split('/')[1].charAt(0);

	// 		var AllCodes = cell2;
	// 		var Poule = AllCodes.split('_')[0];

	// 		var CodeChangeR = AllCodes.split('_')[1];
	// 		var Ronde = CodeChangeR.replace('R', '');
	// 		var NummersAgaints = AllCodes.split('_')[2];
	// 		var Game = AllCodes.split('_')[3];

	// 		const dbWedList = dbRef.child('P').child(Gender + '_' + Klasse + '_' + Poule).child('R').child(Ronde).child(NummersAgaints).child(Game);
	// 		dbWedList.on('value', snap => {
	// 			if (snap.exists()) {
	// 				this.innerText = snap.val();

	// 			}
	// 		})
	// 	});


	// }

	function bestOfVifeCheck(P1Game, P2Game) {
		if (P1Game - P2Game < 2 && -2 < P1Game - P2Game) {
			return false;

		} else if (P1Game >= 11 || P2Game >= 11) {

			if (P1Game > 11 || P2Game > 11) {
				if (P1Game - P2Game == 2 || -2 == P1Game - P2Game) {

					return true;
				} else {
					return false;
				}

			} else {
				return true;
			}
		} else {
			return false;
		}
	}

	function OnlyCalcUitslag() {
		var ListCellsOnly = new Array();

		$(".StandenTable").find("td[id]").each(function () {
			// Log the html content of each 'td'.
			ListCellsOnly.push(this)


		});
		var lengteList = ListCellsOnly.length / 6;

		for (i = 0; i < lengteList; i++) {

			var AllGames = ListCellsOnly.splice(0, 6)
			var PlayerOneScore = 0;
			var PlayerTwoScore = 0;

			for (n = 0; n < 5; n++) {

				var game = AllGames[n].innerHTML;
				if (game.indexOf('<br>') >= 0) {
					var game = game.replace('<br>', '');
				}
				var game = game.replace('<asd>', '')
				var game = game.replace('</asd>', '')

				var P1 = game.split("-")[0]
				var P2 = game.split("-")[1]

				if (+P1 > +P2) {

					PlayerOneScore++
				}
				if (+P2 > +P1) {

					PlayerTwoScore++
				}


			}

			var UitslagCell = AllGames[5];
			if (PlayerOneScore == 3) {
				UitslagCell.innerText = PlayerOneScore + "-" + PlayerTwoScore;
			} else if (PlayerTwoScore == 3) {
				UitslagCell.innerText = PlayerOneScore + "-" + PlayerTwoScore;
			} else {
				UitslagCell.innerText = "";
			}

		}





	}


});