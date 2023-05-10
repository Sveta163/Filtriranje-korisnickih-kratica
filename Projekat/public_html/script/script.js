let omotacRezultata = document.getElementById("OmotacRezultata");
let inputImePrez = document.getElementById("ImePrez");
let inputGodOd = document.getElementById("GodOd");
let inputGodDo = document.getElementById("GodDo");
let inputVazKart = document.getElementById("VazKart");
let inputDug = document.getElementById("Dug");
let inputBrend = document.getElementById("BrendKartice");
let cbKlijentBezduga = document.getElementById("cbBezDuga");
let cbKlijentDugujeIzn = document.getElementById("cbDug");
let cbVazenjeKart = document.getElementById("cbVazenjeKart");
let btnSnimiFilt = document.getElementById("btnSnimiFilt");

document.getElementById("btnPretrazi").addEventListener("click", () => {
    /*popuniKlijente();*/
    postaviURL();

});
document.getElementById("btnBrisiFilt").addEventListener("click", () => {
    brisiFiltere();
   // postaviURL();

});
//popuniKlijente();
window.addEventListener("load", () => {
    pokupiURL();
});

//azurirajBtnDetalji();
function popuniKlijente() {
    let podaci = filtriraj(); //Moze da vrati false(pa se koristi i kao indikator) ukoliko nesto nije ispravno popunjeno
   /* console.log(podaci);*/
    if (podaci) {
        document.getElementById("OmotacRezultata").innerHTML = "";
        //  console.log("usao");
        for (let klijent of podaci) {
            let stanjeRacuna = izracunajStanjeRacuna(klijent);
            let klasaStatusRac = vratiKlasuStatusaRac(klijent);
            let noviEl = document.createElement("div");
            noviEl.className = "Kartica";
            // noviEl.classList.add(klasaStatusRac);
            noviEl.innerHTML = ` <div>
                         <div> 
                             <img src="resource/071- man-icon .svg" alt="alt" width="100" height="80"/>
                         </div>
                         <div class="Podaci">
                             <span>ID klijenta: ${klijent.idKlijenta}</span>
                             <span>${klijent.ImeKlijenta} ${klijent.PrezimeKlijenta}</span>
                             <span>${klijent.DatRodjKlijenta}</span>
                             <div><span>Status računa</span><div class="${klasaStatusRac}"></div> </div>
                         </div>
                     </div>
                     <div> 
                         <span class="StanjeRac">Stanje na računu:${stanjeRacuna}</span>
                         <div class="btnDetaljnije"> 
                             <img src="resource/034-archive.svg" alt="alt" width="20" height="20"/>
                             Detaljnije</div>
                     </div>`;
            omotacRezultata.appendChild(noviEl);
        }
        if (proveriPopunjenostPolja()) {
            snimiPrivFilt();
        }
        azurirajBtnDetalji();
    }
}

function izracunajStanjeRacuna(klijent) {
    let stanjeRacuna = 0;
    if (klijent.racuniKlijenta.length !== 0) {
        for (let racun of klijent.racuniKlijenta) {
            stanjeRacuna += racun.Stanje;
        }
        stanjeRacuna = Math.round((stanjeRacuna + Number.EPSILON) * 100) / 100;
        return stanjeRacuna;
    } else {
        return "Bez računa";
    }
}
function vratiKlasuStatusaRac(klijent) {
    let stanjeRac = izracunajStanjeRacuna(klijent);
    for (let racun of klijent.racuniKlijenta) {
        if (racun.Blokada) {
            return "Blokiran";
        }
    }
    if (stanjeRac >= 0) {
        return "Pozitivan";
    } else if (stanjeRac === "Bez računa") {
        return "BezRacuna";
    } else {
        return "Negativan";
    }
}


function filtriraj() {
    let ime = inputImePrez.value.toUpperCase().split(",");
    let brend = inputBrend.value.toUpperCase();
    let godOd = Number(inputGodOd.value);
    let godDo = Number(inputGodDo.value);
    let cbBezduga = cbKlijentBezduga.classList.contains("Cekirano");
    let cbduga = cbKlijentDugujeIzn.classList.contains("Cekirano");
    let cbVazKart = cbVazenjeKart.classList.contains("Cekirano");
    let vazKart = Number(inputVazKart.value);
    let dug = Number(inputDug.value) * (-1);

    let indikator = proveriPopunjenostPolja();
    if (proveriIspravnostPolja()) {

        let privremeni = klijenti.filter((klijent) => {
            let imePrez = klijent.ImeKlijenta.toUpperCase() + " " + klijent.PrezimeKlijenta.toUpperCase();
            for (let i = 0; i < ime.length; i++) {
                if (imePrez.includes(ime[i])) {
                    return true;
                }
            }
            return false;
        });

        if (brend) {
            privremeni = privremeni.filter((klijent) => {
                for (let kartica of klijent.karticeKlijenta) {
                    let karticaIVrsta = kartica.BrendKartice.toUpperCase() + " " + `(${kartica.VrstaKartice.toUpperCase()})`;
                    if (karticaIVrsta.includes(brend)) {
                        return true;
                    }
                }
                return false;
            });
        }

        if (godDo || godOd) {
            privremeni = privremeni.filter((klijent) => {
                let godinaRodjKlij = Number(klijent.DatRodjKlijenta.split("-", 1));
                //*Ukoliko je unet samo jedan input drugi ima vrednost 0, a ukoliko su uneta oba odradjuje se drugi deo(posle velike zagrede ||)**//
                return (((godinaRodjKlij >= godOd && godDo === 0) || (godinaRodjKlij <= godDo && godOd === 0)) || (godinaRodjKlij >= godOd && godinaRodjKlij <= godDo));
            });
        }

        if (cbBezduga || cbduga) {
            privremeni = privremeni.filter((klijent) => {
                let stanjeRacuna = izracunajStanjeRacuna(klijent);
                /*Vraca klijente bez duga kada je cekiran taj cb i kad su ispunjeni uslovi ili vraca dug veci od oznacenog kada je taj cb cekitan*/
                return ((((stanjeRacuna >= 0 || stanjeRacuna === "Bez računa") && cbBezduga)) || (stanjeRacuna <= dug && cbduga));
            });
        }
        if (cbVazKart) {
            privremeni = privremeni.filter((klijent) => {
                for (let kartica of klijent.karticeKlijenta) {
                    let trajanjeKart = vratiTrajanjeKartice(kartica.VaziDo);
                    if ((trajanjeKart >= vazKart)) {
                        return true;
                    }
                }
                return false;
            });
        }

        (indikator && privremeni.length !== 0) ? btnSnimiFilt.removeAttribute("class") : btnSnimiFilt.className = "Sakrij";
        return privremeni;
    } else {
        return false;
    }
}
function proveriPopunjenostPolja()
{
    let ime = inputImePrez.value.toUpperCase();
    let brend = inputBrend.value.toUpperCase();
    let godOd = Number(inputGodOd.value);
    let godDo = Number(inputGodDo.value);
    let cbBezduga = cbKlijentBezduga.classList.contains("Cekirano");
    let cbduga = cbKlijentDugujeIzn.classList.contains("Cekirano");
    let cbVazKart = cbVazenjeKart.classList.contains("Cekirano");
    let vazKart = Number(inputVazKart.value);
    let dug = Number(inputDug.value) * (-1);

    if (ime !== "" || brend || godDo || godOd || cbBezduga || (cbduga && dug) || (cbVazKart && vazKart)) {
        return true;
    }
    return false;
}
function proveriIspravnostPolja() {
    let cbKlijDugIzn = cbKlijentDugujeIzn.classList.contains("Cekirano");
    let cbVazKart = cbVazenjeKart.classList.contains("Cekirano");
    let indikator = false;

    if (inputDug.value || cbKlijDugIzn) {
        if ((!isNaN(inputDug.value) && Number(inputDug.value) > 0)) {
            inputDug.classList.remove("Greska");
        } else {
            inputDug.classList.add("Greska");
            indikator = true;
        }
        if (cbKlijDugIzn) {
            cbKlijentDugujeIzn.classList.remove("Greska");
        } else {
            cbKlijentDugujeIzn.classList.add("Greska");
            indikator = true;
        }
    }

    if (inputVazKart.value || cbVazKart) {
        if ((!isNaN(inputVazKart.value) && Number(inputVazKart.value) > 0)) {
            inputVazKart.classList.remove("Greska");
        } else {
            inputVazKart.classList.add("Greska");
            indikator = true;
        }
        if (cbVazKart) {
            cbVazenjeKart.classList.remove("Greska");
        } else {
            cbVazenjeKart.classList.add("Greska");
            indikator = true;
        }
    }
    if (inputGodOd.value) {
        if (!isNaN(inputGodOd.value) && Number(inputGodOd.value > 0)) {
            inputGodOd.classList.remove("Greska");
        } else {
            inputGodOd.classList.add("Greska");
            indikator = true;
        }
    } else {
        inputGodOd.classList.remove("Greska");
    }

    if (inputGodDo.value) {
        if (!isNaN(inputGodDo.value) && Number(inputGodDo.value > 0)) {
            inputGodDo.classList.remove("Greska");
        } else {
            inputGodDo.classList.add("Greska");
            indikator = true;
        }
    } else {
        inputGodDo.classList.remove("Greska");
    }
    if (inputImePrez.value) {
        let imePrez = inputImePrez.value.toUpperCase().split(",");
        for (let i = 0; i < imePrez.length; i++) {
            if (isNaN(imePrez[i]) && imePrez[i] !== "") {
                inputImePrez.classList.remove("Greska");
            } else {
                indikator = true;
                inputImePrez.classList.add("Greska");
                break;
            }
        }
    } else {
        inputImePrez.classList.remove("Greska");
    }

    if (inputBrend.value) {
        if (isNaN(inputBrend.value)) {
            inputBrend.classList.remove("Greska");
        } else {
            indikator = true;
            inputBrend.classList.add("Greska");
        }
    } else {
        inputBrend.classList.remove("Greska");
    }

    if (indikator) {
        /*vidim snack zbog drugog skripta*/
        snack.removeAttribute("class");
        snackContainer.removeAttribute("class"); 
        snackText.innerText = "Došlo je do greške!";
        btnSnimiFilt.className = "Sakrij";
        return false;
    } else {
        snackContainer.className = "Sakrij";
        return true;
    }


}

function vratiTrajanjeKartice(vazenjeKart)
{
    let poslataKartMesec = vazenjeKart.split("/", 1);
    let poslataKartGod = vazenjeKart.split("/").slice(-1);
    let trenDatum = new Date();
    let trenMesec = trenDatum.getMonth() + 1;
    let trenGod = Number(String(trenDatum.getFullYear()).slice(-2));
    let brMeseci = (poslataKartGod - trenGod) * 12;
    brMeseci += (poslataKartMesec - trenMesec);

    return brMeseci;
}

function brisiFiltere() {
    inputImePrez.value = "";
    inputGodOd.value = "";
    inputGodDo.value = "";
    inputVazKart.value = "";
    inputDug.value = "";
    inputBrend.value = "";
    cbKlijentBezduga.classList.remove("Cekirano");
    cbKlijentDugujeIzn.classList.remove("Cekirano");
    cbVazenjeKart.classList.remove("Cekirano");
    btnSnimiFilt.classList.add("Sakrij");
    //popuniKlijente();
}


function vratiPopunjenaPolja() {
    let polja = {
        "ImePrez": inputImePrez.value.split(","),
        "BrendKart": inputBrend.value,
        "GodOd": inputGodOd.value,
        "GodDo": inputGodDo.value,
        "KlijentBezDuga": cbKlijentBezduga.classList.contains("Cekirano"),
        "KlijentDugujeIznVeci": inputDug.value,
        "KarticaVaziJos": inputVazKart.value
    };
    return polja;
}

function pokupiURL() {
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);

    if (urlParams) {
        let polja = {
            "ip": "",
            "bk": "",
            "go": "",
            "gd": "",
            "kbd": "",
            "kdiv": "",
            "kvj": ""
        };
        if (urlParams.has("ip"))
            polja.ip = urlParams.get("ip");
        if (urlParams.has("bk"))
            polja.bk = urlParams.get("bk");
        if (urlParams.has("go"))
            polja.go = urlParams.get("go");
        if (urlParams.has("gd"))
            polja.gd = urlParams.get("gd");
        if (urlParams.has("kbd"))
            polja.kbd = urlParams.get("kbd");
        if (urlParams.has("kdiv"))
            polja.kdiv = urlParams.get("kdiv");
        if (urlParams.has("kvj"))
            polja.kvj = urlParams.get("kvj");
        popuniPolja(polja);
    }
}


function popuniPolja(podaci) {
    inputImePrez.value = podaci.ip;
    inputBrend.value = podaci.bk;
    inputGodOd.value = podaci.go;
    inputGodDo.value = podaci.gd;

    if (podaci.kdiv) {
        inputDug.value = podaci.kdiv;
        cbKlijentDugujeIzn.classList.add("Cekirano");
    } else {
        cbKlijentDugujeIzn.classList.remove("Cekirano");
    }
    if (podaci.kvj) {
        inputVazKart.value = podaci.kvj;
        cbVazenjeKart.classList.add("Cekirano");
    } else {
        cbVazenjeKart.classList.remove("Cekirano");
    }
    (podaci.kbd === "true") ? cbKlijentBezduga.classList.add("Cekirano") : cbKlijentBezduga.classList.remove("Cekirano");
    popuniKlijente();
}

function postaviURL() {
    let cbBezDuga = cbKlijentBezduga.classList.contains("Cekirano");
    if (proveriIspravnostPolja()) {
        let url = "";
        if (inputImePrez.value)
            url += "&ip=" + inputImePrez.value;
        if (inputBrend.value)
            url += "&bk=" + inputBrend.value;
        if (inputGodOd.value)
            url += "&go=" + inputGodOd.value;
        if (inputGodDo.value)
            url += "&gd=" + inputGodDo.value;
        if (cbBezDuga)
            url += "&kbd=" + cbBezDuga;
        if (inputDug.value)
            url += "&kdiv=" + inputDug.value;
        if (inputVazKart.value)
            url += "&kvj=" + inputVazKart.value;
        window.location.search = url.slice(1);
    }
}