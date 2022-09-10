const width = 650
const height = 600

const marginTop = 20
const marginRight = 10
const marginLeft = 50
const marginBottom = 30

d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json").then((data) => {
  //DATES ARE UNDER d[0]
  //NUMBERS ARE UNDER d[1]
  const dataset = data.data.map(d => d)

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, d => d[1])])
    .range([height, 0]);

  const xScale = d3.scaleTime()
    .domain([new Date(d3.min(dataset, (d) => d[0])), new Date(d3.max(dataset, d => d[0]))])
    .range([0, width])

  const barWidth = width / dataset.length

  const yAxis = d3.axisLeft(yScale)
  const xAxis = d3.axisBottom(xScale)

  const svg = d3.select("svg")
    .style("height", height + marginTop + marginBottom)
    .style("width", width + marginLeft + marginRight)
    .style("background", "#d8f3dc")
    .attr("class", "graph")
    .append("g")
    .attr("transform", `translate(${marginLeft}, ${marginTop})`)

  const tooltip = d3.select("tooltip")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0)
    .style("background-color", "white")
    .style("padding", "2px")
    .style("position", "absolute")
    .style("z-index", 10)

  const mouseover = function(event, d) {
    tooltip.transition()
    .duration(200)
    .style("opacity", 1)

    let month = ''
    
    switch (d[0].split('-')[1]) {
      case "01":
        month = "Jan"
        break;
      case "04":
        month = "Apr"
        break;
      case "07":
        month = "Jul"
        break;
      case "10":
        month = "Oct"
        break;
    }

        tooltip.html(`Quarter: ${month} ${d[0].split('-')[0]} Amount: $${d[1]} Billion`)
            .attr("data-date", d[0])
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
    }
    
  const mouseout = function(event, d) {
    tooltip.transition()
    .duration(200)
    .style("opacity", 0)
  }

  svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("fill", "#2d6a4f")
    .attr("stroke", "#d8f3dc")
    .attr("data-date", d => d[0])
    .attr("data-gdp", d => d[1])
    .attr("width", barWidth)
    .attr("height", d => height - yScale(d[1]))
    .attr("x", (d, i) => i * barWidth)
    .attr("y", d => yScale(d[1]))
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)

  svg.append("g")
    .attr("transform", `translate(0, 0)`)
    .attr("id", "y-axis")
    .call(yAxis)

  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .attr("id", "x-axis")
    .call(xAxis)
})
