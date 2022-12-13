const puppeteer=require('puppeteer');
const fs = require('fs');

async function scrapeProduct(url){
    const browser = await puppeteer.launch({ headless: false });
    const page =  await browser.newPage();
    await page.goto(url);    
    console.log(url);  
   var res = await extractedEvaluateCall(page);
   for (let index = 0; index < res.length; index++) {
    var obj = res[index].prodname + ','+res[index].prodprice.replaceAll(',','') +','+res[index].prodrate +','+res[index].prodimg +'\n'
    await writeCSV(obj);
   }
   console.log(res);  

}

//Loop Method
async function extractedEvaluateCall(page) {
    return await page.evaluate(() => {
        let data = [];
        let elements = document.querySelector("#root > div > div.ant-row.main--pIV2h > div > div > div.ant-col-20.ant-col-push-4.side-right--Tyehf > div.box--ujueT").childNodes; 
        elements.forEach(async (element,index)=>{
            console.log(element);
            var name = element.childNodes[0].childNodes[0].childNodes[1].childNodes[1].innerText;
            var price = element.childNodes[0].childNodes[0].childNodes[1].childNodes[2].innerText;
            var rating = element.childNodes[0].childNodes[0].childNodes[1].childNodes[4].innerText.replaceAll("\nPakistan","");
            var available = element.childNodes[0].childNodes[0].childNodes[1].childNodes[3].innerText;
            var image = element.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].getAttribute('SRC')
            var obj={
                prodname : name,
                prodprice : price,
                prodrate : rating,
                prodavail : available,
                prodimg: image
            }
            data.push(obj);
    
        });
       return data;
    });
}
async function writeCSV(obj){
    await fs.appendFile('data/Product.csv', obj, function (err) {
         if (err) throw err;
       });
 }

scrapeProduct('https://www.daraz.pk/dawlance1621855818/?q=All-Products&langFlag=en&from=wangpu&lang=en&pageTypeId=2')