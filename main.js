/*
<---------------->
main variables  
<---------------->
*/

const body = document.querySelector("body");
const form = document.getElementById("form");
const rows = document.querySelectorAll(".rows")
const errorElement = document.getElementById("error")
const currency = document.getElementById("currency");
const wifi = document.getElementById("wifibluetooth");
const returnButton = document.querySelector(".return-button");
const supportedCurrencys = ["SAR", "EGP", "EUR", "USD"];
let currencyPrice;
let parts;
let fullPrice;
let postion;
let CPUP;
let GPUP;
let MOBOP;
let WIFIP;
let PSUP;
let RAMP;
let StorageP;
let arrout = [];
let notCompatable = false;
let total;


/*
<---------------->
gets json file
<---------------->
*/

fetch("parts.json")
    .then(res => res.json())
    .then(json => {
        parts = json;
        form.onsubmit = function(event){
            currencyPrice = 0;
            errorElement.style.color = "red";
            event.preventDefault();
            fullPrice = form.price.value
            console.log(currency.value)
            fullPrice = priceConverter(currency.value, fullPrice, "in")
            main()
        }
});

/*
<----------------------->
main process runs here
<----------------------->
*/

function main(){
    if(!isNaN(fullPrice)){
        if(fullPrice < 1000000 && currency.value != "currency"){
            priceRange(fullPrice, parts)
            build(postion, fullPrice)
        }else{
            if(currency.value != "currency" && fullPrice > 1000000){
                error(fullPrice, "is so big for a number")
            }else{
                error("$" , "Please select a currency")
            }
        }
        
    }else{
        error("$" , "Make sure that the input is a vaild number")   
    }
    
}

/*
<---------------------------------->
gets the class of your price range
<---------------------------------->
*/

function priceRange(price, parts){
    if(!isNaN(price)){
        postion = null;
        for(var i = 0;i < parts.classes.length;i++){
            if(price >= parts.classes[i].pricerange){
                postion = parts.classes[i]
                break;
            }            
        }

    } 
}

/*
<---------------------------------->
gets parts from the json file
<---------------------------------->
*/

function arrayOut(arr){
    arrout = []
    for(var i = 0; i < arr.length; i++){
        farr = arrout.push(arr[i])
    }
    return farr;
}

/*
<---------------------------------->
gets the parts for your pc
<---------------------------------->
*/

function getArrOut(arrayName, price, compatibilityMode){
    if(compatibilityMode.name === "CPU"){
        arrayOut(arrayName)   
        arrout = arrout.reduce((prev, curr) => Math.abs(curr.price - price) < Math.abs(prev.price - price) ? curr : prev);    
    }else if(compatibilityMode.name === "MOBO"){
        arrayOut(arrayName)
        var filterArray = arrout.filter(a => a.socket === compatibilityMode.compatibilitymode.socket ? true:a.socket[1] === compatibilityMode.compatibilitymode.socket[1])  
        arrout = filterArray.reduce(function (prev, curr) { 
            if(Math.abs(curr.price - price) < Math.abs(prev.price - price)){
                return curr;
            }else{
                return prev;
           }
         });  
    }else if(compatibilityMode.name === "GPU"){
        if(compatibilityMode.compatibilitymode.GPU != null && compatibilityMode.compatibilitymode.GPU.gaming && postion.stage === "F"){
            if(compatibilityMode.compatibilitymode.GPU.gaming){
                return compatibilityMode.compatibilitymode.GPU;
            }
        }else{
            arrayOut(arrayName)   
            arrout = arrout.reduce((prev, curr) => Math.abs(curr.price - price) < Math.abs(prev.price - price) ? curr : prev);
        }
        
    }else if(compatibilityMode.name === "WIFI"){
        arrayOut(arrayName)   
        arrout = arrout.reduce((prev, curr) => Math.abs(curr.price - price) < Math.abs(prev.price - price) ? curr : prev);    
    }else if(compatibilityMode.name === "RAM"){
        if(compatibilityMode.compatibilitymode.GPU != null){
            if(compatibilityMode.compatibilitymode.GPU.gaming){
                arrayOut(arrayName)  
                var filterArray =  arrout.filter(a => a.speed >= 3000 )
                arrout = filterArray.reduce((prev, curr) => Math.abs(curr.price - price) < Math.abs(prev.price - price) ? curr : prev);
            }
        }else{
            arrayOut(arrayName)
            arrout = arrout.reduce((prev, curr) => Math.abs(curr.price - price) < Math.abs(prev.price - price) ? curr : prev);
        }
        
    }

    return arrout
}
/*
<---------------------------------->
error /*\
<---------------------------------->
*/

function error(price, err){
        for(var i = 0; i < rows.length; i++){
            rows[i].textContent = "";
        }
        if(!isNaN(price)){
            errorElement.textContent = `${Math.round(priceConverter(currency.value, price, "out"))} ${currency.value} ` + err
        }else{
            errorElement.textContent =  err;
        }
       
        setTimeout(()=>{
            errorElement.textContent = "";
        }, 2500)  
}

/*
<---------------------------------->
builds the computer here
<---------------------------------->
*/

function build(postion, price){
    
    if(postion != null){
        if(postion.supported){
            let ConvertedCPUPrice;
            let ConvertedMOBOPrice;
            let ConvertedGPUPrice;
            let ConvertedRAMrice;
            let ConvertedWIFIPrice;
            let ConvertedPrice;


            CPUP  = (price * 25)  / 100;
            MOBOP = (price * 10)  / 100;
            GPUP  = (price * 35)  / 100;
            WIFIP = (price * 2)   / 100;
            RAMP  = (price * 10)  / 100;

            CPUP = getArrOut(parts.CPUs, CPUP, {
                name:"CPU",
                compatibilitymode:null               
            })
            MOBOP = getArrOut(parts.MOBOs, MOBOP, {
                name:"MOBO",
                compatibilitymode:CPUP
            })
            GPUP = getArrOut(parts.GPUs, GPUP, {
                name:"GPU",
                compatibilitymode:CPUP
            }) 
            if(wifi.checked){
                WIFIP = getArrOut(parts.WifiBuletooth, WIFIP, {
                    name:"WIFI",
                    compatibilitymode:null
                })
                
            }
            RAMP = getArrOut(parts.RAM, RAMP, {
                name:"RAM",
                compatibilitymode:CPUP
            })

            ConvertedCPUPrice = Math.round(priceConverter(currency.value, CPUP.price, "out"))
            ConvertedMOBOPrice = Math.round(priceConverter(currency.value, MOBOP.price, "out"))
            ConvertedGPUPrice = Math.round(priceConverter(currency.value, GPUP.price, "out"))
            ConvertedRAMrice =  Math.round(priceConverter(currency.value, RAMP.price, "out"))
            ConvertedWIFIPrice = Math.round(priceConverter(currency.value, WIFIP.price, "out"))
            ConvertedPrice = Math.round(priceConverter(currency.value, price, "out"))
            
            total = ConvertedCPUPrice + ConvertedMOBOPrice + (isNaN(ConvertedGPUPrice)?0:ConvertedGPUPrice) + (wifi.checked ? ConvertedWIFIPrice:0);

            rows[0].innerHTML = `<span class="part">CPU:</span> ${CPUP.name} <span class="price">${ConvertedCPUPrice} ${currency.value}</span>` 
            rows[1].innerHTML = `<span class="part">MotherBoard:</span> ${MOBOP.name} <span class="price">${ConvertedMOBOPrice} ${currency.value}</span>`
            rows[2].innerHTML = `<span class="part">GPU:</span> ${GPUP.name} <span class="price">${isNaN(ConvertedGPUPrice)?"CPU graphics card":ConvertedGPUPrice} ${isNaN(ConvertedGPUPrice)?"":currency.value}</span>`
            rows[4].innerHTML = `<span class="part">RAM:</span> ${RAMP.name} <span class="price">${ConvertedRAMrice} ${currency.value}</span>`
            if(wifi.checked){
                rows[6].innerHTML = `<span class="part">WIFI & Bluetooth:</span> ${WIFIP.name} <span class="price">${ConvertedWIFIPrice} ${currency.value}</span>` 
            }else{
                rows[6].innerHTML = "";
            }
            
            rows[rows.length - 2].textContent = `Total: ${total} ${currency.value}`
            rows[rows.length - 1].textContent = `Savings: ${ConvertedPrice - total} ${currency.value}`
            }   
            
            body.classList.add("move-right");
    }else if(postion == null && !isNaN(price) && price !== ""){
        error(price , "is so low for a pc")
        
    }
    
}

/*
<---------------------------------->
price converter
<---------------------------------->
*/

function priceConverter(priceValue, price, type){
    if(type == "in"){
        switch (priceValue) {
            case "SAR":
                price /= 3.75;
                return price;
            case "EGP":
                price *= 0.062;
                return price;
            case "EUR":
                price *= 1.12;
                return price;  

            default:
                return price;
        }
    }else if(type == "out"){
        switch (priceValue) {
            case "SAR":
                price *= 3.75;
                return price;
            case "EGP":
                price /= 0.062;
                return price;
            case "EUR":
                price /= 1.12;
                return price;
        
            default:
                return price;
        }
    }
    
}

/*
<---------------------------------->
comment here
<---------------------------------->
*/

returnButton.addEventListener("click", ()=>{
    body.classList.remove("move-right")
})