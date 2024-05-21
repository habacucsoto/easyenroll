import $ from 'jquery';

export class OCR {
    constructor() {
        this.url = "https://complete-verve-417716.uc.r.appspot.com/Api/ines";
    }

    agregarINE() {
        const ineUrl = $('#ineUrl').val();
        if (ineUrl) {
            this.getOcrTextjQueryLocal(ineUrl);
        } else {
            console.error("Debe proporcionar una URL de INE.");
        }
    }

    postUser(user) {
        $.ajax({
            url: this.url,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            success: function(data){
                console.log(data);
                $("#result").html(JSON.stringify(data.user));
            },
            data: JSON.stringify(user)
        });
    }

    getOcrTextjQueryLocal(imageUrl, callback) {
        $.ajax({
            url: `https://ocr-extract-text.p.rapidapi.com/ocr?url=${encodeURIComponent(imageUrl)}`,
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '8daf878b9fmsh814409db082a5eep1e3fbfjsnd759a2fc4af4',
                'X-RapidAPI-Host': 'ocr-extract-text.p.rapidapi.com'
            },
            success: (data) => {
                console.log(data);
                const processedData = this.mostrarInformacion(data);
                if (processedData && callback) {
                    callback(processedData);
                }
            },
            error: (error) => {
                console.error('Error:', error);
            }
        });
    }
    

    mostrarInformacion(jsonData) {
        if (jsonData.status === true) {
            const text = jsonData.text;

            const nombreMatch = text.match(/NOMBRE\n([\s\S]+?)\nDOMICILIO/);
            const name = nombreMatch ? nombreMatch[1].replace(/\n/g, ' ').trim() : '';

            const domicilioMatch = text.match(/DOMICILIO\n([\s\S]+?)\n(?:CLAVE DE ELECTOR|CURP|FECHA DE NACIMIENTO)/);
            const domicilio = domicilioMatch ? domicilioMatch[1].trim() : '';

            const domicilioParts = domicilio.split('\n');
            const calle = domicilioParts[0];
            const addressPart = domicilioParts[domicilioParts.length - 2];
            const addressComponents = addressPart.split(' ');
            
        
            const cpIndex = addressComponents.findIndex(part => /^\d{5}$/.test(part)); // Buscar el componente que coincide con el formato de código postal
            const coloniaCiudadParts = addressComponents.slice(1, cpIndex).join(' ').split(',');

            const colonia = coloniaCiudadParts[0].trim();
            
            const ciudadMatches = domicilioParts[2].match(/(.+?),/);
            const ciudad = ciudadMatches ? ciudadMatches[1].trim() : '';

            const cp = addressComponents[cpIndex];
            
            const estadoMatch = domicilioParts[domicilioParts.length - 1].match(/,\s*(\w+)\.$/);
            const estado = estadoMatch ? estadoMatch[1] : '';

            const curpMatch = text.match(/CURP (.+?)\nESTADO/);
            const curp = curpMatch ? curpMatch[1].trim() : '';

            console.log(text)
            console.log('curp', curp);

            const fechaNacimientoMatch = text.match(/FECHA DE NACIMIENTO\n(.+?)\nSEXO/);
            const fechaNacimiento = fechaNacimientoMatch ? fechaNacimientoMatch[1].trim() : '';

            const sexoMatch = text.match(/SEXO\s*(\w)/);
            const sexo = sexoMatch ? sexoMatch[1]: ''; 

            return { name, calle, colonia, cp, ciudad, estado, curp, fechaNacimiento, sexo };
        
        } else {
            console.error("La respuesta del servidor indica un estado falso.");
            return null;
        }
    }

    agregarImagenURL(url) {
        return '<img src="' + url + '" style="width: 300px; height: 300px;">';
    }
}
