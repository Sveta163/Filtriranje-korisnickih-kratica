let body = document.querySelector("body");
let snackText = document.querySelector("#SnackBar > p");
let snackContainer = document.getElementById("SnackBarContainer");
let snack = document.getElementById("SnackBar");
//------------CheckBox------------//
{
    let cbovi = document.getElementsByClassName("Cb");
    for (let cb of cbovi) {
        cb.addEventListener("click", (e) => {
            e.target.classList.toggle("Cekirano");
        });
    }
}
//------------Harmonika komponenta------------//
{
    let summs = document.getElementsByClassName("HarmonikaRezime");
    for (let sum of summs) {
        /*let simbol = document.querySelector(".AccSumary>div");*/
        let tekst = sum.firstElementChild;
        tekst.addEventListener("click", (e) => {
            let summary = e.currentTarget.parentNode;
            let details = summary.nextElementSibling;
            if (details.style.maxHeight) {
                tekst.innerHTML = `<img src="resource/043-add.svg" width="17" height="17" alt="alt"/>
                                    Prikazi dodatne filtere`;
                details.style.maxHeight = null;
            } else {
                tekst.innerHTML = `<img src="resource/043-add.svg" width="17" height="17" alt="alt"/>
                                    Sakrij dodatne filtere`;
                details.style.maxHeight = details.scrollHeight + "px";
            }
        });
    }
}
//------------Modalni prozor------------//
{
    let modalniProzorOmotac = document.getElementById("ModalniProzorOmotac");
    modalniProzorOmotac.addEventListener("click", (e) => {
        if (e.target.className === "btnX" || e.target.id === "btnOK" || e.target.id === "ModalniProzorOmotac" || e.target.id === "btnOdustani" || e.target.id === "btnOdustaniSetFilt") {
            modalniProzorOmotac.classList.add("Sakrij");
            document.getElementById("ModalniProzor").classList.add("Sakrij");
            document.getElementById("ModalniProzorSetFiltera").classList.add("Sakrij");
            document.getElementById("ModalniProzorRaspSetFilt").classList.add("Sakrij");
            /*console.log("usao");*/
            nazivFilt.value = "";
            body.removeAttribute("class");
        }
    });
    let btnoviDetalnjnije = document.getElementsByClassName("btnDetaljnije");
    function azurirajBtnDetalji() {
        for (let btnDetaljnije of btnoviDetalnjnije) {
            btnDetaljnije.addEventListener("click", (e) => {
                let idKlijenta = Number(e.currentTarget.parentNode.previousElementSibling.lastElementChild.firstElementChild.innerText.split(":").slice(-1));
                popuniModalniProzor(idKlijenta);
                let modalniProzor = document.getElementById("ModalniProzor");
                modalniProzorOmotac.classList.remove("Sakrij");
                modalniProzor.classList.remove("Sakrij");
                body.classList.add("OtvorenModalni");
            });
        }
    }


    function popuniModalniProzor(idKlijenta) {
        let idImePrezKlijenta = document.getElementById("Traka").firstElementChild;
        let idIAdresaKlijenta = document.getElementById("PodaciModalniProzor").firstElementChild.firstElementChild;
        let datumRodjKlijenta = document.getElementById("PodaciModalniProzor").children[1].firstElementChild;
        let idDrzavljanstva = document.getElementById("PodaciModalniProzor").lastElementChild.firstElementChild;
        //let zaposljenjeTab = document.getElementById("Tabovi").firstElementChild;
        let racuniTab = document.getElementById("Tabovi").children[1];
        let karticeTab = document.getElementById("Tabovi").lastElementChild;
        let zaposljenjeSadr = document.getElementById("SadrzajTabova").firstElementChild;
        let racuniSadr = document.getElementById("SadrzajTabova").children[1];
        let karticeSadr = document.getElementById("SadrzajTabova").lastElementChild;
       /* console.log(zaposljenjeSadr);
        console.log(racuniSadr);
        console.log(karticeSadr);*/
        for (let klijent of klijenti) {
            if (idKlijenta === klijent.idKlijenta) {
                idImePrezKlijenta.innerText = `${klijent.idKlijenta}, ${klijent.ImeKlijenta + " " + klijent.PrezimeKlijenta}`;
                idIAdresaKlijenta.innerText = `${klijent.idMesta}, ${klijent.AdresaKlijenta}`;
                datumRodjKlijenta.innerText = `${klijent.DatRodjKlijenta}`;
                idDrzavljanstva.innerText = `${klijent.idDrzavljanin}`;
                if (klijent.Zaposlen) {
                    zaposljenjeSadr.innerHTML = `<span>Status: <span>Zaposlen</span></span>
                                                   <span>Poslodavac: <span>${klijent.Poslodavac}</span></span>
                                                    <span>Sediste poslodavca: <span>${klijent.SedistePoslodavca}</span></span>`;
                } else {
                    zaposljenjeSadr.innerHTML = `<span>Status: <span>Nezaposlen</span></span>`;
                }
                (klijent.racuniKlijenta.length !== 0) ? racuniSadr.innerText = "" : racuniSadr.innerText = "Klijent nema račun";
                (klijent.karticeKlijenta.length !== 0) ? karticeSadr.innerText = "" : karticeSadr.innerText = "Klijent nema karticu";
                let brojRacuna = klijent.racuniKlijenta.length;
                let brojKartica = klijent.karticeKlijenta.length;
                racuniTab.innerText = `Računi(${brojRacuna})`;
                karticeTab.innerText = `Kartice(${brojKartica})`;
                let brojac = 1;
                for (let racun of klijent.racuniKlijenta) {
                    let blokada;
                    racun.Blokada ? blokada = "Blokiran" : blokada = "Nema";
                    racuniSadr.innerHTML += `<span class="Centrirano">Račun: <span>${brojac}</span></span>
                                        <span>Broj računa: <span>${racun.BrojRacuna}</span></span>
                                        <span>Kontrolni broj: <span>${racun.KontrolniBroj}</span></span>
                                        <span>Broj računa pun: <span>${racun.BrojRacunaPun}</span></span>
                                        <span>Datum otvaranja: <span>${racun.DatumOtv}</span></span>
                                        <span>Datum poslednje promene: <span>${racun.DatPoslPromene}</span></span>
                                        <span>Stanje računa: <span>${racun.Stanje}</span></span>
                                        <span>Blokada računa: <span>${blokada}</span></span>
                                        <span>Id vrste računa: <span>${racun.idVrsteRacuna}</span></span>
                                        <span>Šifra valute: <span>${racun.SifraValute}</span></span>`;
                    brojac++;
                }
                brojac = 1; //Reset brojaca
                for (let kartica of klijent.karticeKlijenta) {
                    karticeSadr.innerHTML += `<span class="Centrirano">Kartica: <span>${brojac}</span></span>
                                        <span>Broj kartice: <span>${kartica.BrojKartice}</span></span>
                                        <span>Brend Kartice: <span>${kartica.BrendKartice}</span></span>
                                        <span>Vazi do: <span>${kartica.VaziDo}</span></span>
                                        <span>Datum izrade: <span>${kartica.DatumIzrade}</span></span>
                                        <span>Datum uručivanja: <span>${kartica.DatumUrucenja}</span></span>
                                        <span>Vrsta kartice: <span>${kartica.VrstaKartice}</span></span>`;
                    if (kartica.Limit) { ///Neke kartice nemaju limit pa ih proveravam
                        karticeSadr.innerHTML += `<span>Limit kartice: <span>${kartica.Limit}</span></span>`;
                    }

                    brojac++;
                }

            }
        }

    }
    //-------Modalni prozori potvrde-------//
    /*Za brisanje*/
    let omotacProzoraPotvrd = document.getElementById("ProzorPotvrdeOmotac");
    omotacProzoraPotvrd.addEventListener("click", (e) => {
        if (e.target.id === "BtnDa") {
            /*Pozivam popunjavanje i jedne i druge kako mi se ne bi duplirali EventListeneri*/
            if (indexZaBrisanje === 0) {
                /*Brisanje iz localStorage*/
                window.localStorage.removeItem(keyName);
                /*Popunjavanje preostalim predfinisanim filtera*/
                popuniSadrzajPredFilt();
                popuniSadrPoslFilt();
            } else {
                /*Brisanje iz sessionStorage*/
                window.sessionStorage.removeItem(keyName);
                /*Popunjavanje preostalim prethodnim filtera*/
                popuniSadrPoslFilt();
                popuniSadrzajPredFilt();
            }
            snack.classList.add("SnackOK");
            snackText.innerText = "Uspešno ste obrisali filter";
            snackContainer.removeAttribute("class");
            azurirajBtnPrimeniFilt();
            azurirajBtnObrisiFilt();
            /*Zatvaranje prozora*/
            omotacProzoraPotvrd.classList.add("Sakrij");
        } else if (e.target.id === "BtnNe" || e.target.className === "btnX" || e.target.id === "ProzorPotvrdeOmotac") {
            omotacProzoraPotvrd.classList.add("Sakrij");
        }
    });
    /*Za isto ime filtera*/
    let omotacProzoraPotvrdFilt = document.getElementById("ProzorPotvrdeOmotacFilt");
    omotacProzoraPotvrdFilt.addEventListener("click", (e) => {
        if (e.target.id === "BtnDaFilt") {
            snack.classList.add("SnackOK");
            snackText.innerText = "Uspešno ste snimili filter";
            snackContainer.removeAttribute("class");
            let podaciOPopFIltera = vratiPopunjenaPolja();
            localStorage.setItem(nazivFilt.value, JSON.stringify(podaciOPopFIltera));
            omotacProzoraPotvrdFilt.classList.add("Sakrij");
        } else if (e.target.id === "BtnNeFilt" || e.target.id === "ProzorPotvrdeOmotacFilt" || e.target.className === "btnX") {
            omotacProzoraPotvrdFilt.classList.add("Sakrij");
        }

    });
    //-------Modalni predefinisani filteri-------//
    document.getElementById("btnPredFilt").addEventListener("click", () => {
        popuniSadrPoslFilt();
        popuniSadrzajPredFilt();
        azurirajBtnPrimeniFilt();
        azurirajBtnObrisiFilt();
        document.getElementById("ModalniProzorRaspSetFilt").classList.remove("Sakrij");
        modalniProzorOmotac.classList.remove("Sakrij");
        body.classList.add("OtvorenModalni");
    });
    function popuniSadrzajPredFilt() {
        let sadrzajRaspSetFilt = document.querySelector("#SadrzajTabovaSetFilt").firstElementChild;
        sadrzajRaspSetFilt.innerHTML = "";
        for (let indeks = 0; indeks < localStorage.length; indeks++) {
            sadrzajRaspSetFilt.innerHTML += `<div>
     <span>${localStorage.key(indeks)}</span>
     <div><div class="Primeni"><div></div>Primeni</div> <div class="Obrisi"><div></div> Obriši</div></div>
     </div>`;
            /*console.log(localStorage.key(indeks));*/
        }


    }
    function popuniSadrPoslFilt() {
        let sadrzajPoslFilt = document.querySelector("#SadrzajTabovaSetFilt").lastElementChild;
        sadrzajPoslFilt.innerHTML = "";
        for (let indeks = 0; indeks < sessionStorage.length; indeks++) {
            sadrzajPoslFilt.innerHTML += `<div>
                                           <span>${sessionStorage.key(indeks)}</span>
                                           <div><div class="Primeni"><div></div>Primeni</div> <div class="Obrisi"><div></div> Obriši</div></div>
                                           </div>`;
        }
    }
    function azurirajBtnObrisiFilt() {
        let btnsObrisiFIilt = document.getElementsByClassName("Obrisi");
        for (let btnObrisiFIlt of btnsObrisiFIilt) {
            btnObrisiFIlt.addEventListener("click", (e) => {
                /*Pamtim kao globalnu da bih mogao da obrisem*/
                indexZaBrisanje = Array.from(e.currentTarget.parentNode.parentNode.parentNode.parentNode.children).indexOf(e.currentTarget.parentNode.parentNode.parentNode);
                keyName = e.currentTarget.parentNode.parentNode.firstElementChild.innerText;
                /*Prikazujem prozor potvrde*/
                let txtTraka = document.getElementById("TrakaProzoraPotvrde").firstElementChild;
                txtTraka.innerText = `Da li ste sigurni da zelite da obrisete filter ${keyName}?`;
                omotacProzoraPotvrd.removeAttribute("class");

            });
        }
    }
    function azurirajBtnPrimeniFilt() {
        let btnsPrimeniFilt = document.getElementsByClassName("Primeni");
        for (let btnPrimeniFIlt of btnsPrimeniFilt) {
            btnPrimeniFIlt.addEventListener("click", (e) => {
                let keyName = e.currentTarget.parentNode.parentNode.firstElementChild.innerText;
                let podaci;
                //*Pomocu ovog znam da li gledam da li sam u tabu sacuvani ili poslednji filt pa tako brisem ili iz session ili locala*//
                let index = Array.from(e.currentTarget.parentNode.parentNode.parentNode.parentNode.children).indexOf(e.currentTarget.parentNode.parentNode.parentNode);
                if (index === 0) {
                    podaci = JSON.parse(localStorage.getItem(keyName));
                } else {
                    podaci = JSON.parse(sessionStorage.getItem(Number(keyName)));
                }
                primeniFilt(podaci);
            });
        }
    }
    function primeniFilt(podaci) {
        let imePrez = document.getElementById("ImePrez");
        let godOd = document.getElementById("GodOd");
        let godDo = document.getElementById("GodDo");
        let vazKart = document.getElementById("VazKart");
        let dug = document.getElementById("Dug");
        let brend = document.getElementById("BrendKartice");
        let cbBezduga = document.getElementById("cbBezDuga");
        let cbDuga = document.getElementById("cbDug");
        let cbVazenjeKart = document.getElementById("cbVazenjeKart");
        /*console.log(podaci);*/
        (podaci.ImePrez[0] !== "") ? imePrez.value = podaci.ImePrez : imePrez.value = "";
        (podaci.BrendKart) ? brend.value = podaci.BrendKart : brend.value = "";
        (podaci.GodOd) ? godOd.value = podaci.GodOd : godOd.value = "";
        (podaci.GodDo) ? godDo.value = podaci.GodDo : godDo.value = "";
        (podaci.KlijentBezDuga) ? cbBezduga.classList.add("Cekirano") : cbBezduga.classList.remove("Cekirano");
        if (podaci.KlijentDugujeIznVeci) {
            dug.value = podaci.KlijentDugujeIznVeci;
            cbDuga.classList.add("Cekirano");
        } else {
            dug.value = "";
            cbDuga.classList.remove("Cekirano");
        }
        if (podaci.KarticaVaziJos) {
            vazKart.value = podaci.KarticaVaziJos;
            cbVazenjeKart.classList.add("Cekirano");
        } else {
            vazKart.value = "";
            cbVazenjeKart.classList.remove("Cekirano");
        }
    }
    //-------Modalni snimanje filt-------//
    document.getElementById("btnSnimiFilt").addEventListener("click", () => {
        let sadrzajKriterijuma = document.querySelector("#PodaciModalnogSetaFIlt > div:last-of-type");
        let podaci = vratiPopunjenaPolja();
        sadrzajKriterijuma.innerHTML = "<span>Kriterijumi:</span>";
        if (podaci.ImePrez[0] !== "" && podaci.ImePrez.length >= 1)
            sadrzajKriterijuma.innerHTML += `<span>Ime,prezime: <span>${podaci.ImePrez}</span></span>`;
        if (podaci.BrendKart)
            sadrzajKriterijuma.innerHTML += `<span>Brend kartice: <span>${podaci.BrendKart}</span></span>`;
        if (podaci.GodOd && podaci.GodDo) {
            sadrzajKriterijuma.innerHTML += `<span>Godina rođenja: <span>Od ${podaci.GodOd} do ${podaci.GodDo}</span></span>`;
        } else if (podaci.GodOd) {
            sadrzajKriterijuma.innerHTML += `<span>Godina rođenja: <span>Od ${podaci.GodOd}</span></span>`;
        } else if (podaci.GodDo) {
            sadrzajKriterijuma.innerHTML += `<span>Godina rođenja: <span>do ${podaci.GodDo}</span></span>`;
        }
        if (podaci.KlijentBezDuga)
            sadrzajKriterijuma.innerHTML += `<span>Klijent bez duga: <span>Bez duga</span></span>`;
        if (podaci.KlijentDugujeIznVeci)
            sadrzajKriterijuma.innerHTML += `<span>Klijent sa dugom vecim od: <span>${podaci.KlijentDugujeIznVeci}</span></span>`;
        if (podaci.KarticaVaziJos)
            sadrzajKriterijuma.innerHTML += `<span>Kartica vazi jos: <span>${podaci.KarticaVaziJos}</span></span>`;
        document.getElementById("ModalniProzorSetFiltera").classList.remove("Sakrij");
        modalniProzorOmotac.classList.remove("Sakrij");
        body.classList.add("OtvorenModalni");
    });

    let nazivFilt = document.getElementById("SetFilt");
    document.getElementById("btnSnimi").addEventListener("click", snimiFilter);
    function snimiFilter() {
        let podaciOPopFIltera = vratiPopunjenaPolja();
        if (nazivFilt.value) {
            if (localStorage.hasOwnProperty(nazivFilt.value)) {
                omotacProzoraPotvrdFilt.removeAttribute("class");
            } else {
                snackContainer.removeAttribute("class");
                snack.classList.add("SnackOK");
                snackText.innerText = "Uspešno ste snimili filter";
                localStorage.setItem(nazivFilt.value, JSON.stringify(podaciOPopFIltera));
                nazivFilt.removeAttribute("class");
            }
        } else {
            nazivFilt.classList.add("Greska");
        }
    }
    function snimiPrivFilt() {
        let podaciOPopFIltera = vratiPopunjenaPolja();
        let br = sessionStorage.length;
        let vrednosti = [];
        for (let i = 0; i < sessionStorage.length; i++) {
            vrednosti.push(sessionStorage.key(i));
        }
        if (br < 10) {
            let maxRb = 0;
            if (sessionStorage.length) {
                maxRb = Math.max.apply(Math, vrednosti);
            }
            sessionStorage.setItem(maxRb + 1, JSON.stringify(podaciOPopFIltera));
        } else {
            maxRb = Math.max.apply(Math, vrednosti);
            let minRb = Math.min.apply(Math, vrednosti);
            window.sessionStorage.removeItem(minRb);
            sessionStorage.setItem(maxRb + 1, JSON.stringify(podaciOPopFIltera));
        }
    }
}
//------------Tabovi------------//
{
    let tabovi = document.querySelectorAll("#Tabovi > div");
    let sadrzaj = document.querySelectorAll("#SadrzajTabova > div");

    for (let tab of tabovi) {
        tab.addEventListener("click", (e) => {
            let index = Array.from(e.target.parentNode.children).indexOf(e.target);
            oznaciTab(e.target, tabovi);
            prikaziSadrzaj(index, sadrzaj);
        });
    }
    function prikaziSadrzaj(index, sadrzaj) {
        for (let podatak of sadrzaj) {
            podatak.classList.add("Sakrij");
        }
        sadrzaj[index].classList.remove("Sakrij");
    }
    function oznaciTab(tab, tabovi) {
        for (let jezicak of tabovi) {
            jezicak.classList.remove("Oznaceno");
        }
        tab.classList.add("Oznaceno");
    }
    /*Za rasp filter*/
    let taboviRaspFilt = document.querySelectorAll("#TaboviSetFilt > div");
    let sadrzajRaspFilt = document.querySelectorAll("#SadrzajTabovaSetFilt > div");
    for (let tab of taboviRaspFilt) {
        tab.addEventListener("click", (e) => {
            let index = Array.from(e.target.parentNode.children).indexOf(e.target);
            oznaciTab(e.target, taboviRaspFilt);
            prikaziSadrzaj(index, sadrzajRaspFilt);
        });
    }
}

//------------Padajuca lista------------//
{
//------------Popunjavanje padajuce liste------------//
    popuniBrendKartice();
    function popuniBrendKartice() {
        let brendovi = vratiBrendoveKartica();
        for (let brend of brendovi) {
            let noviEl = document.createElement("span");
            noviEl.innerText = brend;
            noviEl.addEventListener("click", odabirStavke);
            document.getElementById("Stavke").appendChild(noviEl);
        }
    }

    function vratiBrendoveKartica() {
        let brendoviKartica = [];
        for (let klijent of klijenti) {
            for (let kartica of klijent.karticeKlijenta) {
                if (!brendoviKartica.includes(kartica.BrendKartice + " " + `(${kartica.VrstaKartice})`)) {
                    brendoviKartica.push(kartica.BrendKartice + " " + `(${kartica.VrstaKartice})`);
                }
            }
        }
        return brendoviKartica;
    }
//------------Padajuca lista konfiguracija------------//
    document.getElementById("PadajucaLista").addEventListener("click", (e) => {
        document.getElementById("PadajucaLista").classList.toggle("SakrijStavke");
    });
    document.getElementById("BrendKartice").addEventListener("input", () => {
        filtrirajStavkeBredna();
    });
    let StavkeSpanovi = document.querySelectorAll("#Stavke span");
    function filtrirajStavkeBredna() {
        document.getElementById("PadajucaLista").classList.remove("SakrijStavke");
        let text = document.getElementById("BrendKartice").value.toUpperCase();
        let stavke = document.getElementById("Stavke");
        stavke.innerHTML = "";
        let priv = [];
        for (let span of StavkeSpanovi) {
            if (span.innerText.toUpperCase().includes(text)) {
                priv.push(span);
            }
        }
        if (priv.length) {
            for (let privSpan of priv) {
                stavke.appendChild(privSpan);
            }
        } else if (!text) {
            for (let span of StavkeSpanovi) {
                stavke.appendChild(span);
            }
        }
    }
    function odabirStavke(e) {
        document.getElementById("BrendKartice").value = e.target.innerText;
    }
}
/*Snack bar*/
document.getElementById("SnackZatvori").addEventListener("click",
        () => {
    document.getElementById("SnackBarContainer").className = "Sakrij";
});