/*
	Photon by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function ($) {

	var $window = $(window),
		$body = $('body');

	// Breakpoints.
	breakpoints({
		xlarge: ['1141px', '1680px'],
		large: ['981px', '1140px'],
		medium: ['737px', '980px'],
		small: ['481px', '736px'],
		xsmall: ['321px', '480px'],
		xxsmall: [null, '320px']
	});

	// Play initial animations on page load.
	$window.on('load', function () {
		window.setTimeout(function () {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Scrolly.
	$('.scrolly').scrolly();

})(jQuery);

//_______________________________________________________________
//                     MY CODE
//_______________________________________________________________

//Global variables

var numeroN, numeroD, numeroE;
numeroN = numeroD = numeroE = 0;

// var text_input = document.querySelector("#text_input");
// text_input.addEventListener("change", function(){var reader = new FileReader();
// 	reader.addEventListener("load", function(){alert(reader.result)})
// } );

document.getElementById('text_input').addEventListener('change', function () {

	var fr = new FileReader();
	fr.onload = function () {
		document.getElementById("txt_mensajeParaEncriptar").textContent = fr.result;
	}

	fr.readAsText(this.files[0]);
})

document.getElementById('text_input_encriptado').addEventListener('change', function () {

	var fr = new FileReader();
	fr.onload = function () {
		document.getElementById("txt_mensajeParaDesencriptar").textContent = fr.result;
	}

	fr.readAsText(this.files[0]);
})

function mcd(a, b) {
	if (b == 0) return a;
	return mcd(b, a % b);
}

function encontrar_d(num_z) {
	var primos = [];
	var cont = 1, a = 2;
	while (a < num_z) {
		if (mcd(a, num_z) == 1) {
			primos.push(a);
			cont++;
		}
		a++;
	}

	//Math.floor(Math.random() * (max - min + 1)) + min

	var pos = Math.floor(Math.random() * (cont + 1));
	while (pos > 1) {
		primos.pop();
		pos--;
	}

	return primos.pop();
}

function modulo(resto, multiplo) {
	var parte_entera, numero_cercano, nuevo_resto;

	parte_entera = Math.floor(resto / multiplo);
	numero_cercano = parte_entera * multiplo;
	nuevo_resto = resto - numero_cercano;

	return nuevo_resto;
}

function encontrar_e(d, z) {
	var e = 2;
	var resultado;
	while (1) {
		resultado = e * d - 1;
		if (modulo(resultado, z) == 0) {
			return e;
		}
		e++;
	}
}

function generarClaves() {

	var num_p = parseInt(document.getElementById("txt_numero_p").value);
	var num_q = parseInt(document.getElementById("txt_numero_q").value);
	if (num_p + num_q < 27) {
		alert("Porfavor ingrese numeros mas alto");
	}
	else {
		var num_n = num_p * num_q;
		var num_z = (num_p - 1) * (num_q - 1);
		var num_d = encontrar_d(num_z);
		var num_e = encontrar_e(num_d, num_z);

		document.getElementById("txt_clave_privada").innerText = "Clave Privada = ( " + num_n + " ; " + num_d + " )";
		document.getElementById("txt_clave_publica").innerText = "Clave Publica = ( " + num_n + " ; " + num_e + " )";

		numeroD = num_d;
		numeroE = num_e;
		numeroN = num_n;

	}
}

function multiply(x, res, res_size) {
	var carry = 0;

	for (var i = 0; i < res_size; i++) {
		var prod = Math.floor(res[i] * x + carry);

		res[i] = Math.floor(prod % 10);

		carry = Math.floor(prod / 10);
	}

	while (carry) {
		res[res_size] = Math.floor(carry % 10);
		carry = Math.floor(carry / 10);
		res_size++;
	}

	return res_size;
}

function power(x, n) {
	var result = new String("");
	var res = [];
	var res_size = 0;
	var temp = x;

	while (temp != 0) {
		res[res_size++] = Math.floor(temp % 10);
		temp = Math.floor(temp / 10);
	}

	for (var i = 2; i <= n; i++) {
		res_size = multiply(x, res, res_size);
	}

	for (var i = res_size - 1; i >= 0; i--) {
		result += Math.floor(res[i]);
	}

	return result;

}

function mod(num, a) {
	var res = 0;

	for (let i = 0; i < num.length; i++) {
		res = (res * 10 + parseInt(num[i]) - '0') % a;
	}

	return res;
}

function encriptarMensaje() {
	
	n = document.getElementById("txt_clavePriv_n").value;
	d = document.getElementById("txt_clavePriv_d").value;
	var mensajeParaEncriptar = new String(document.getElementById("txt_mensajeParaEncriptar").value);

	if (mensajeParaEncriptar <= 0) {
		alert("Ingrese un mensaje para continuar");
	}
	else if (numeroN == 0 || numeroE == 0) {
		alert("Genere una clave");
	}
	else {
		var arregloNum = [];
		var longMen = mensajeParaEncriptar.length;
		var mensajeEncriptado = new String("");
		var mensajeaux = new String("");
		for (let i = 0; i < longMen; i++) {
			arregloNum.push(mensajeParaEncriptar.charCodeAt(i))
		}
		for (let i = 0; i < arregloNum.length; i++) {
			mensajeaux = power(arregloNum[i], numeroE);
			mensajeEncriptado += mod(mensajeaux, numeroN);
			if (i < arregloNum.length - 1) mensajeEncriptado += " ";
		}
		numeroN = numeroD = numeroE = 0;
		document.getElementById("txt_mensajeEncriptado").textContent = mensajeEncriptado;

	}
}

function actualizarClave() {
	n = document.getElementById("txt_clavePriv_n").value;
	d = document.getElementById("txt_clavePriv_d").value;
	if (n > 5 && d > 5) {
		document.getElementById("txt_claveParaDesencriptar").textContent = "Clave Privada = ( " + n + " ; " + d + " )";
	}
}

function dividirCadena(cadenaADividir, separador = " ") {
	var arrayDeCadenas = cadenaADividir.split(separador);
	return arrayDeCadenas;
}

function containsAnyLetter(str) {
	return /[a-zA-Z]/.test(str);
}

function desencriptarMensaje() {
	n = document.getElementById("txt_clavePriv_n").value;
	d = document.getElementById("txt_clavePriv_d").value;
	if (n < 5 || d < 5) {
		alert("Ingrese una clave valida");
	}
	else if (String(document.getElementById("txt_mensajeParaDesencriptar").value).length <= 0) {
		alert("Ingrese mensaje para desencriptar");
	}
	else {
		var menDesencriptar = new String(document.getElementById("txt_mensajeParaDesencriptar").value);

		if (containsAnyLetter(menDesencriptar)) {
			alert("No pueden haber letras");
		}
		else if (menDesencriptar.length > 0) {
			var arrayDeCadenas = [];
			var mensajeaux = new String("");
			var mensajeDesencriptado = new String("");
			arrayDeCadenas = dividirCadena(menDesencriptar);

			for (let i = 0; i < arrayDeCadenas.length; i++) {
				mensajeaux = power(arrayDeCadenas[i], d);
				mensajeDesencriptado += String.fromCharCode(mod(mensajeaux, n));
			}
			document.getElementById("txt_mensajeDesencriptado").textContent = mensajeDesencriptado;
		}
	}

}


function download(filename, text) {
	var element = document.createElement("a");
	element.style.display = "none";
	element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
	element.setAttribute("download", filename);
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}

function descargarArchivo() {
	var text = document.getElementById("txt_mensajeEncriptado").value;
	var filename = document.getElementById("downloadfilename").value;
	if (text.length == 0) {
		alert("No hay codificacion para descargar");
	}
	else {
		download(filename, text);
	}
}

function descargarArchivoDesencriptado() {
	var text = document.getElementById("txt_mensajeDesencriptado").value;
	var filename = document.getElementById("downloadfilenameDesencriptado").value;
	if (text.length == 0) {
		alert("No hay mensaje para descargar");
	}
	else {
		download(filename, text);
	}
}
