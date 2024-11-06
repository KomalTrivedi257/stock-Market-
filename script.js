 let allStockCharts 
 let allStockSummary 
 let allStockStats 
 let stockTitle = document.getElementById("title")
 let stockdesc = document.getElementById("desc")
let term = '1mo'
    let chartRef = null

        async function getChartData() {
    try{
        const res = await fetch("https://stocksapi-uhe1.onrender.com/api/stocks/getstocksdata")
        const data = await res.json()
        console.log(data)
        buildChart(data.stocksData[0]['AAPL'][term],"AAPL")
    }catch (error) {
        console.log(error)
    }
}
getChartData()

function buildChart(data,name){
const ctx = document.getElementById('myChart');
 if  (chartRef){
        chartRef.destroy()
    }
const updatedLabels = data.timeStamp.map(t => new Date(t*1000).
  toLocaleDateString())
 chartRef = new Chart(ctx, {
    type: 'line',
    data: {
      labels:updatedLabels, 
      datasets: [{
        label: name,
        data: data.value,
        borderWidth: 2,
      }]
    },
});
}

function changeTerm(newTerm) {
    // chartRef.destroy();
    term = newTerm
    getChartData()
}
    
async function fetchStockDetails() {
    const [chartDetails,summaryResponse, statsResponse] = await Promise.all([
        fetch("https://stocksapi-uhe1.onrender.com/api/stocks/getstocksdata"),
      fetch(
        "https://stocksapi-uhe1.onrender.com/api/stocks/getstocksprofiledata"
      ),
      fetch("https://stocksapi-uhe1.onrender.com/api/stocks/getstockstatsdata"),
    ]);
    const charts = await chartDetails.json()
    const summary = await summaryResponse.json();
    const stats = await statsResponse.json();
    allStockCharts = [charts.stocksData[0]]
    allStockSummary = [...summary.stocksProfileData]
    allStockStats = [...stats.stocksStatsData]
    //  stockTitle.innerHTML=`<span> AAPL</span><span>${allStockStats[0]["AAPL"].bookValue}%</span><span>${allStockStats[0]["AAPL"].profit}</span>`
    stockTitle.innerHTML = `
    <span style="color: white; margin-right: 10px;">${"AAPL"}</span>
    <span style="color:#45C82D; margin-right: 10px;">${allStockStats[0]["AAPL"].bookValue}%</span>
    <span style="color: white;"> $${allStockStats[0]["AAPL"].profit}</span>
  `;
         stockdesc.innerHTML= `<p>${allStockSummary[0]["AAPL"].summary}</p>`
    console.log(  allStockSummary );
 }
  
  fetchStockDetails();

function getDetails(stockName){
    if(!allStockCharts || !allStockSummary|| !allStockStats){
        return 
    }
 Object.keys(allStockCharts[0]).forEach(key=>{
    if(key === stockName){
        buildChart(allStockCharts[0][stockName]['1mo'],stockName)
    }
 })
 Object.keys(allStockStats[0]).forEach(key=>{
    if(key===stockName){
        stockTitle.innerHTML=''
      //  stockTitle.innerHTML=`<span class="custum">${key}</span><span class="perc">${allStockStats[0][key].bookValue}%</span ><span class="doller">${allStockStats[0][key].profit}</span>`
      stockTitle.innerHTML = `
  <span style="color: white; margin-right: 10px;">${key}</span>
  <span style="color:#45C82D ; margin-right: 10px;">${allStockStats[0][key].bookValue}%</span>
  <span style="color:white;"> $${allStockStats[0][key].profit}</span>
`;
        console.log(allStockStats[0][key])

    }
 })
 Object.keys(allStockSummary[0]).forEach(key =>{
    if(key === stockName){
        stockdesc.innerHTML = ''
        stockdesc.innerHTML= `<p>${allStockSummary[0][key].summary}</p>`
        console.log(allStockSummary[0][key])
    }
 })

}
 
const stockElements = document.querySelectorAll('.custum'); 
    let currentIndex = 0; 

    function showNextStock() {
        if (currentIndex < stockElements.length) {
            stockElements[currentIndex].style.display = 'block'; 
            currentIndex++;
            setTimeout(showNextStock, 1000); 
        }
    }


    showNextStock();
