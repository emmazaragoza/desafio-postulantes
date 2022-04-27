const puppeteer = require('puppeteer');
const fs = require('fs');


(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });

    const page = await browser.newPage();
    await pup(page, "https://www.sii.cl/servicios_online/1047-nomina_inst_financieras-1714.html", browser)
})();



const pup =  async (page, url, browser) => {
    await page.goto(url);
    
    //! Busco y me guardo los datos de la tabla que voy a ausar como clave.
    let claves = []
    const clave = await page.$eval("tr", el => el.innerHTML)
    claves.push(clave)
    claves = claves[0].split("<th>").map(e => e.replace("</th>", "")).filter(e => e.length > 1)
    //console.log(claves)


    //! Busco y me guardo los datos de la tabla que voy a ausar como valor.
    let datos = []
    const valorEncontrado = await page.$eval("tbody", el => el.innerHTML)
    datos.push(valorEncontrado)
    datos = datos[0].split("<tr>")
    for (let i = 0; i < datos.length; i++) {
        datos[i] = datos[i].split("</tr>")[0].split("<td>").filter(e => e != "").map(e => e.replace("</td>", ""))
    }
    datos.shift()
    
    //! Hago un array de objetos con los datos de la en forma de clave y valor.
    for (let i = 0; i < datos.length; i++) {
        let obj = {}
        for (let j = 0; j < datos[i].length; j++) {
            obj[claves[j]] = datos[i][j]
        }
        datos[i] = obj
    }
    // console.log(datos)
    //! Creo el archivo json con los datos.
    fs.writeFileSync(`./resultado/datos.json`, JSON.stringify(datos))
    
    
    //! cierro el navegador.
    await browser.close();
}