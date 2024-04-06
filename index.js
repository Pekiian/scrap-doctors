const express = require('express');
const app = express();
const PORT = process.env.PORT
const puppeteer = require('puppeteer')

async function openWebPage(dni) {
    const browser = await puppeteer.launch({
        headless: 'new'
    });
    const page = await browser.newPage();
    await page.goto("https://sisa.msal.gov.ar/sisa/");
    await page.click('.ico_mod_agenda')
    await page.click('.util_textsize32.icon-reg_refeps')
    await page.type('.gwt-TextBox:nth-child(2)', dni)
    await page.click('.GGGX03MKU>.util_rec_alcent>a>.boton')
    await page.waitForSelector('.texto3 > td.cell:nth-of-type(4)')
    let element = await page.$('.texto3 > td.cell:nth-of-type(4)')
    let value = await page.evaluate(el => el.textContent, element)
    await browser.close();

    return value
}

app.get('/getDoctor/:dni', async function (req, res) {
    const { dni } = req.params
    const value = await openWebPage(dni)

    if(!value){
        res.sendStatus(404)
    }

    res.sendStatus(204)
})
 
app.listen(PORT, function (err) {
    if (err) console.log(err)
    console.log("Server listening on PORT", PORT)
})
