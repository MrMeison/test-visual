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

    export class Visual implements IVisual {
        private pieChart: SVGSVGElement;
        private legendElement: HTMLElement;

        private circleElement: SVGCircleElement;

        public init(options: VisualConstructorOptions) {
            let visual: HTMLElement = options.element[0];
            this.initMarkup(visual);
        }

        public update(options: VisualUpdateOptions) {
            let categories: Array<ICategory> = this.visualTransform(options).sort((a, b) => b.value - a.value);
            let sumValues = categories.reduce((prev, current) => prev + current.value, 0);
            let prevAggregation = 0;
            this.cleanElement(this.pieChart);
            this.cleanElement(this.legendElement);
            for (let i = 0; i > categories.length; i++) {
                let value = categories[i].value + prevAggregation;

                // Add 1 procent for last element for fixing round issues
                if (i === categories.length - 1) {
                    value += sumValues / 100;
                }
                this.pieChart.appendChild(this.createPieSection(categories[i].value, sumValues));
                prevAggregation += value;

                this.addChartLabel(categories[i].name, "black");
            }
        }

        private createPieSection(value: number, sum: number) {
            let circle = this.circleElement.cloneNode() as SVGCircleElement;
            circle.setAttribute("stroke-dasharray", `${Math.round(value / sum)} 100`);
            circle.setAttribute("fill", "black");
            return circle;
        }

        // TODO: implement it  
        private addChartLabel(label: string, color: string) {

        }

        private cleanElement(chart: Element) {
            while (chart.firstChild) {
                chart.firstChild.removeChild(chart.firstChild.firstChild);
            }
        }

        private initMarkup(parent: HTMLElement) {
            // <figure>
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
            let figureCaption = document.createElement("figcaption");
            figureCaption.appendChild(document.createTextNode("Wheel of Fortune"));

            let legend = document.createElement("div");
            legend.classList.add("fortune-wheel__legend");

            let svg = document.createElementNS(NS, "svg");
            svg.setAttribute("viewBox", "0 0 32 32");
            svg.classList.add("fortune-wheel__pie");

            let button = document.createElement("button");
            button.classList.add("fortune-wheel__button");

            figure.appendChild(figureCaption);
            figure.appendChild(legend);
            figure.appendChild(svg);
            figure.appendChild(button);
            parent.appendChild(figure);
            this.pieChart = svg;

            let circle = document.createElementNS(NS, "circle");
            circle.setAttribute("r", "16");
            circle.setAttribute("cx", "16");
            circle.setAttribute("cy", "16");
            this.circleElement = circle;
            this.legendElement = legend;
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
    }
}