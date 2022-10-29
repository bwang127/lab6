import AreaChart from './AreaChart.js';
import StackedAreaChart from './StackedAreaChart.js';

let unemployed; 

async function loadData(url){
    let data = await d3.csv(url, d3.autoType);
    return data;
}

async function main(){
    unemployed = await loadData("unemployment.csv");

    let total_arr = [];
    unemployed.forEach(function callback(e, i){
        let total = 0;
        for (const [key, value] of Object.entries(e)) {
            if (key == "date") continue;
            total += value;
        }
        e.total = total;
        total_arr.push(total);
    });
  
    const areaChart = AreaChart(".areaChart");
    areaChart.update(unemployed);
  
    const stackedAreaChart = StackedAreaChart(".stackedAreaChart");
    stackedAreaChart.update(unemployed);

    areaChart.on("brushed", (range)=>{
        stackedAreaChart.filterByDate(range); 
    })

}


main();

