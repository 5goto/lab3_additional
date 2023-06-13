'use strict'


function cardioid_coordinates(r, t) {
    let x = 2 * r * Math.sin(t) + r * Math.sin(t * 2) + 350
    let y = 2 * r * Math.cos(t) + r * Math.cos(t * 2) + 250
    return [x, y]
}

document.querySelector('#drawButton').addEventListener("click", () => {
    const amount = document.querySelector('.nums').value;

    d3.select('svg').selectAll("*").remove();

    const coord = []
    for (let index = 0; index < amount; index++) {
        coord.push(cardioid_coordinates(100, index / amount * 2 * Math.PI))
    }

    for (let index = 0; index < coord.length; index++) {
        d3.select('svg').append("circle")
        .attr("cx", coord[index][0])
        .attr("cy", coord[index][1])
        .attr("r", 10)
        .style("fill", "#988aa1")
    }

})

document.querySelector('#graphButton').addEventListener("click", () => {
    
    let width = 700;
    let height = 700;
    
    let marginX = 50;
    let marginY = 50;
    
    d3.select('.graph').selectAll("*").remove();
    
    function f(x) {
        return (Math.pow(Math.E, x)) / Math.log(1/(x - 3))
    }
    
    const a = parseFloat(document.querySelector('input[name="by"]').value);
    const b = parseFloat(document.querySelector('input[name="until"]').value);
    const n = 40;
    const h = (b - a) /(n - 1);
    console.log(a, b);
    let arrGraph =[];
    for(let i = 0; i < n; i++) {
        let x = a + i * h;
        arrGraph.push({'x': x, 'f': f(x)});
    }
    console.log(arrGraph);
    
    let minMaxF = d3.extent(arrGraph.map(d => d.f));
    let min = minMaxF[0];
    let max = minMaxF[1];

   
    let scaleX = d3.scaleLinear()
    .domain([a, b])
    .range([0, width - 2 * marginX]);

    let scaleY = d3.scaleLinear()
    .domain([min, max])
    .range([height - 2 * marginY, 0]);
    // создание осей
    let axisX = d3.axisBottom(scaleX); // горизонтальная
    let axisY = d3.axisLeft(scaleY); // вертикальная
    // отрисовка осей в SVG-элементе
    
    d3.select('.graph').append("g")
    .attr("transform", `translate(${marginX}, ${scaleY(0) + marginY})`)
    .call(axisX);
    d3.select('.graph').append("g")
    .attr("transform", `translate(${marginX + scaleX(0)}, ${marginY})`)
    .call(axisY);
    
    
    let lineF = d3.line()
    .x(function(d) {
    return scaleX(d.x);
    })
    .y(function(d) {
    return scaleY(d.f);
    })

    
    d3.select('.graph').append("path") // добавляем путь
    // созданному пути добавляются данные массива arrGraph в качестве атрибута
    .datum(arrGraph)
    // вычисляем координаты концов линий с помощью функции lineF
    .attr("d", lineF)
    // помемещаем путь из линий в область построения
    .attr("transform", `translate(${marginX}, ${marginY})`)
    // задаем стиль линии графика
    .style("stroke-width", "2").style("stroke", "red")

})
