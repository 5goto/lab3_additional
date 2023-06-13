import {buildings} from "./data.js"


const element = document.querySelector("#showTable")
element.onclick = function() {
 if (this.value === "Показать таблицу") {

 this.value = "Скрыть таблицу";
 // создать таблицу, вывести ее содержимое
 // см. стр. 9-10 Теоретического материала к ЛР
const tmp = Object.keys(buildings[0])
for (let item of tmp) {
    d3.select("div.table")
        .select("table").append('th').append('td').text(item)
}

// for (let index = 0; index < .length; index++) {
//     d3.select("div.table")
//     .select("table").append('th').append('td').text(buildings[0].keys[index])
    
// }


 d3.select("div.table")
 .select("table")
 .selectAll("tr")
 .data(buildings)
 .enter()
 .append('tr');

 d3.select("div.table")
 .select("table")
 .selectAll("tr")
 .data(buildings)
 .html( function(d){
 return `<td>${d['Название']}</td><td>${d["Тип"]}</td><td>${d["Страна"]}</td><td>${d["Город"]}</td>
 <td>${d["Год"]}</td><td>${d["Высота"]}</td><td>${d["Этажность"]}</td>`;
 })
 .style("display", "");

 } else {
 this.value = "Показать таблицу";
 // удалить строки таблицы
 d3.select("div.table")
 .select("table").selectAll("tr, th").remove();

 }
};



function getArrGraph(arrObject, fieldX, fieldY) {

    // сформируем список меток по оси OX (различные элементы поля fieldX)
     // см. стр. 8-9 Теоретического материала к ЛР
     let tmp = d3.group(arrObject, d => d[fieldX])
     const groupObj = []
    // console.log(tmp);
    for (let key of tmp) {
        groupObj.push(key[0])
    }

     const arrGroup = []; // массив объектов для построения графика
     for(let entry of tmp) {

        let hiArr = []
        for(let hie of entry[1]) {
            hiArr.push(hie[fieldY])
        }
    
     //выделяем минимальное и максимальное значения поля fieldY
     //для очередной метки по оси ОХ
     let minMax = d3.extent(hiArr)
     let elementGroup = {};
     elementGroup.labelX = entry[0]
     elementGroup.valueMin = minMax[0]
     elementGroup.valueMax = minMax[1]

     arrGroup.push(elementGroup);
     }
     return arrGroup;
    }


function drawGraph(data, onlyY) {
    // формируем массив для построения диаграммы
    let arrGraph = data;
    let marginX = 50;
    let marginY = 50;
    let height = 400;
    let width = 800;
   
    let svg = d3.select("svg")
    .attr("height", height)
    .attr("width", width);
   
    // очищаем svg перед построением
    svg.selectAll("*").remove();
    // определяем минимальное и максимальное значение по оси OY
    let min = 0;
    let max = 0
    if(onlyY.length == 2) {
        min = d3.min(arrGraph.map(d => d.valueMin)) * 0.95;
        max = d3.max(arrGraph.map(d => d.valueMax)) * 1.05;
    } else if(onlyY[0] == min) {
        min = d3.min(arrGraph.map(d => d.valueMin)) * 0.95
        max = 1500;
    } else {
        max = d3.max(arrGraph.map(d => d.valueMax)) * 1.05
        min = 0;
    }
    let xAxisLen = width - 2 * marginX;
    let yAxisLen = height - 2 * marginY;
   
    // определяем шкалы для осей
    let scaleX = d3.scaleBand()
    .domain(arrGraph.map(function(d) {
    return d.labelX;
    })
    )
    .range([0, xAxisLen],1);
   
    let scaleY = d3.scaleLinear()
    .domain([min, max])
    .range([yAxisLen, 0]);
    // создаем оси
    let axisX = d3.axisBottom(scaleX); // горизонтальная
   
    let axisY = d3.axisLeft(scaleY);// вертикальная
   
    // отображаем ось OX, устанавливаем подписи оси ОX и угол их наклона
    svg.append("g")
    .attr("transform", `translate(${marginX}, ${height - marginY})`)
    .call(axisX)
    .attr("class", "x-axis")
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function (d) {
    return "rotate(-45)";
    });
   
    // отображаем ось OY
    svg.append("g")
    .attr("transform", `translate(${marginX}, ${marginY})`)
    .attr("class", "y-axis")
    .call(axisY);
   
    // создаем набор вертикальных линий для сетки
    d3.selectAll("g.x-axis g.tick")
    .append("line") // добавляем линию
    .classed("grid-line", true) // добавляем класс
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", - (yAxisLen));
   
    // создаем горизонтальные линии сетки
    d3.selectAll("g.y-axis g.tick")
    .append("line")
    .classed("grid-line", true)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", xAxisLen)
    .attr("y2", 0);
   
    // отображаем данные в виде точечной диаграммы
    svg.selectAll(".dot")
    .data(arrGraph)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("cx", function(d) { return scaleX(d.labelX); })
    .attr("cy", function(d) { return scaleY(d.valueMax); })
    .attr("transform",
    `translate(${marginX + scaleX.bandwidth()/2}, ${marginY})`)
    .style("fill", "red")
    svg.selectAll(".dot")
    .data(arrGraph)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("cx", function(d) { return scaleX(d.labelX); })
    .attr("cy", function(d) { return scaleY(d.valueMin); })
    .attr("transform",
    `translate(${marginX + scaleX.bandwidth()/2}, ${marginY})`)
    .style("fill", "blue")
   }


function drawGraphGisto(data_, onlyY) {
    let data = data_
    let width = 1500;
    let height = 500;
    let marginX = 50;
    let marginY = 40;

    let svg = d3.select("svg")
    .attr("height", height)
    .attr("width", width);


     // очищаем svg перед построением
     svg.selectAll("*").remove();
    let min = 0
    let max = 0
    if(onlyY.length == 2) {
        min = d3.min(data.map(d => d.valueMin)) * 0.95;
        max = d3.max(data.map(d => d.valueMax)) * 1.05;
    } else if(onlyY[0] == min) {
        min = d3.min(data.map(d => d.valueMin)) * 0.95
        max = 1500;
    } else {
        max = d3.max(data.map(d => d.valueMax)) * 1.05
        min = 0;
    }

    let xAxisLen = width - 2 * marginX;
    let yAxisLen = height - 2 * marginY;
    // функции шкалирования
    let scaleX = d3.scaleBand()
    .domain(data.map(function(d) {
    return d['labelX'];
    }))
    .range([0, xAxisLen])
    .padding(0.2);
    let scaleY = d3.scaleLinear()
    .domain([min, max])
    .range([yAxisLen, 0]);
    // создание осей
    let axisX = d3.axisBottom(scaleX); // горизонтальная

    let axisY = d3.axisLeft(scaleY);// вертикальная

    svg.append("g")
    .attr("transform", `translate(${marginX}, ${height - marginY})`)
    .call(axisX)
    .attr("class", "x-axis");
    svg.append("g")
    .attr("transform", `translate(${marginX}, ${marginY})`)
    .call(axisY);
    //цвета столбиков
    let color = d3.scaleOrdinal(d3.schemeCategory10);
    //создание и отрисовка столбиков гистограммы
    g =svg.append("g")
    .attr("transform", `translate(${ marginX}, ${ marginY})`)
    .selectAll(".rect")
    .data(data)
    .enter().append("rect")
    .attr("x", function(d) { return scaleX(d['labelX']) ; })
    .attr("width", scaleX.bandwidth())
    .attr("y", function(d) { return scaleY(d['valueMax']); })
    .attr("height", function(d) { return yAxisLen - scaleY(d['valueMax']); })
    .attr("fill", function(d) { return color(d['labelX']); });

}

document.querySelector('#drawButton').addEventListener("click", () => {
    let radios = document.querySelectorAll('#data-form input[type="radio"]')
    let checkboxes = document.querySelectorAll('#data-form input[type="checkbox"]')
    let graph = document.querySelectorAll('#graph-from input[type="radio"]')

    let graphType = ''
    let oX = ''
    let oY = []
    for (let rad of radios) {
        if(rad.checked) {
            oX = rad.value
        }
    }
    for (let box of checkboxes) {
        if(box.checked) {
            oY.push(box.value)
        }
    }
    for (let rad of graph) {
        if(rad.checked) {
            graphType = rad.value
        }
    }


    if(oY.length == 0) {
        alert('Не было выбрано значениe по оси OY')
    } else {
        if(graphType == 'dot') {
            drawGraph(getArrGraph(buildings, oX, 'Высота'), oY)
        } else {
        drawGraphGisto(getArrGraph(buildings, oX, 'Высота'), oY)
        }
    }
});

window.addEventListener("DOMContentLoaded", (event) => { // дефолтная диаграмма при загрузке страницы
    const oY = ['Max']
    drawGraph(getArrGraph(buildings, 'Страна', 'Высота'), oY)
  });