/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

module powerbi.extensibility.visual {

    interface ICategory {
        name: string;
        value: number;
    }

    enum Direction {
        LEFT,
        RIGHT
    }

    // const TEST_DATA: Array<ICategory> = [
    //     { name: "Asia", value: 100 },
    //     { name: "Europe", value: 236 },
    //     { name: "Africa", value: 54 },
    //     { name: "America", value: 321 }
    // ]

    const MAX_ROTATE: number = 720;

    export class Visual implements IVisual {
        private pieChart: SVGSVGElement;
        private legendElement: HTMLElement;

        private circleElement: SVGCircleElement;
        private direction: Direction = Direction.LEFT;
        constructor(options: VisualConstructorOptions) {
            this.init(options);
         }

        public init(options: VisualConstructorOptions) {
            let visual: HTMLElement = options.element;
            this.initMarkup(visual);
        }

        public update(options: VisualUpdateOptions) {
            if ( options.type !== VisualUpdateType.Data) {
                return;
            }
            let categories: Array<ICategory> = this.visualTransform(options);
            // let categories: Array<ICategory> = TEST_DATA;
            let sumValues = categories.reduce((prev, current) => prev + current.value, 0);
            let aggregation = sumValues;
            this.cleanElement(this.pieChart);
            this.cleanElement(this.legendElement);

            let counter = 0;
            while (aggregation !== 0) {

                let color = this.getRandomColor();
                let value = aggregation;

                // Add 1 procent for first element for fixing round issues
                if (counter === 0) {
                    value += sumValues / 100;
                }
                this.pieChart.appendChild(this.createPieSection(value, sumValues, color));

                let label = this.addChartLabel(categories[counter].name, color);
                this.legendElement.appendChild(label);
                aggregation -= categories[counter].value;
                counter++;
            }
        }

        private createPieSection(value: number, sum: number, color: string) {
            let circle = this.circleElement.cloneNode() as SVGCircleElement;
            circle.setAttribute("stroke-dasharray", `${Math.round((value / sum) * 100)} 100`);
            circle.setAttribute("stroke", color);
            return circle;
        }

        private addChartLabel(label: string, color: string): HTMLElement {
            let legendBlock = document.createElement("span");
            legendBlock.classList.add("fortune-wheel__item");
            let labelElement = document.createElement("label");
            labelElement.classList.add("fortune-wheel__legend-label");
            labelElement.appendChild(document.createTextNode(label));

            let colorElement = document.createElement("span");
            colorElement.classList.add("fortune-wheel__legend-indicator");
            colorElement.appendChild(document.createTextNode(" "));
            colorElement.style.backgroundColor = color;

            legendBlock.appendChild(colorElement);
            legendBlock.appendChild(labelElement);

            return legendBlock;
        }

        private cleanElement(chart: Element): void {
            while (chart.firstChild) {
                chart.removeChild(chart.firstChild);
            }
        }

        private initMarkup(parent: HTMLElement): void {
            // <figure class="fortune-wheel">
            //     <figcaption>
            //         Wheel of Fortune
            //     </figcaption>
            //     <div class="fortune-wheel__legend"></div>
            //     <svg class="fortune-wheel__pie" viewBox="0 0 32 32">
            //         // Place to pie chart
            //     </svg>
            //  <button class="fortune-wheel__button"></button>
            // </figure>

            const NS = "http://www.w3.org/2000/svg";
            let figure = document.createElement("figure");
            figure.classList.add("fortune-wheel");
            let figureCaption = document.createElement("figcaption");
            figureCaption.appendChild(document.createTextNode("Wheel of Fortune"));

            let legend = document.createElement("div");
            legend.classList.add("fortune-wheel__legend");

            let svg = document.createElementNS(NS, "svg");
            svg.setAttribute("viewBox", "0 0 32 32");
            svg.style.borderRadius = "50%";
            svg.classList.add("fortune-wheel__pie");

            let button = document.createElement("button");
            button.appendChild(document.createTextNode("Spin"));
            button.classList.add("fortune-wheel__button");
            button.addEventListener("click", () => {this.spin()});

            figure.appendChild(figureCaption);
            figure.appendChild(legend);
            figure.appendChild(svg);
            figure.appendChild(document.createElement("br"));
            figure.appendChild(button);
            parent.appendChild(figure);
            this.pieChart = svg;

            let circle = document.createElementNS(NS, "circle");
            circle.setAttribute("r", "16");
            circle.setAttribute("cx", "16");
            circle.setAttribute("cy", "16");
            circle.setAttribute("stroke-width", "32");
            circle.setAttribute("fill", "none");
            this.circleElement = circle;
            this.legendElement = legend;
        }
        private spin(): void {
            let randomRotate = Math.floor(Math.random() * MAX_ROTATE);
            randomRotate = this.direction === Direction.RIGHT ? -1 * randomRotate : randomRotate;
            this.pieChart.style.transform = `rotate(${randomRotate}deg)`;
            debugger;
        }

        private visualTransform(options: VisualUpdateOptions): Array<ICategory> {
            let dataViews = options.dataViews;
            let categories: Array<ICategory> = [];
            if (!dataViews
                || !dataViews[0]
                || !dataViews[0].categorical
                || !dataViews[0].categorical.categories
                || !dataViews[0].categorical.categories[0].source
                || !dataViews[0].categorical.values) {
                return categories;
            }
            let categorical = dataViews[0].categorical;
            let category = categorical.categories[0];
            let dataValue = categorical.values[0];

            for (let i = 0, len = Math.max(category.values.length, dataValue.values.length); i < len; i++) {
                categories.push({
                    name: category.values[i].toString(),
                    value: dataValue.values[i] as number
                });
            }
            return categories;
        }

        private getRandomColor(): string {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }
    }
}