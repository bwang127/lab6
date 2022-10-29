export default function AreaChart(container){
    //initialization

    const margin = ({top: 20, right: 50, bottom: 20, left: 50})
    const width = 800 - margin.left - margin.right;
    const height = 150 - margin.top - margin.bottom;

    const svg = d3.select(container)
                    .append('svg') 
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
	                  .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    let xScale = d3.scaleTime()
                    .range([0, width]);

    let yScale = d3.scaleLinear()
                    .range([height, 0]);       
    
    svg.append("path").attr("class", "areaChart");

    function update(unemployed){ 

    //update
    //console.log(unemployed);
    xScale.domain(d3.extent(unemployed, d=>d.date));
    yScale.domain([0,d3.max(unemployed, d => d.total)]);

    let xAxis = d3.axisBottom()
                .scale(xScale);

    let yAxis = d3.axisLeft()
                .ticks(3)
                .scale(yScale);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);
    
    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(0, ${width}`)
        .call(yAxis);

    svg.select(".areaChart")
    .datum(unemployed)
    .attr("fill", "lightblue")
    .attr("d", d3
              .area()
              .x(d => xScale(d.date))
              .y1(d => yScale(d.total))
              .y0(yScale(0)));
      
    }
  
    //brush

    function brushed(event) {
        if (event.selection) {
            listeners["brushed"](event.selection.map(xScale.invert));
        }
    }

    function brushend(event){
        if (!event.selection){
            svg.select(".brush").call(brush.move, xScale.range());
        }
    }
  
    const brush = d3
                .brushX()
                .extent( [ [0,0], [width,height] ] )
                .on("brush", brushed)
                .on("end", brushend);

    svg.append("g").attr('class', 'brush').call(brush);



    const listeners = { brushed: null };
  
    function on(event, listener) {
	    listeners[event] = listener;
    }
    

    return {
      update, on // ES6 shorthand for "update": update
    };
  }


  