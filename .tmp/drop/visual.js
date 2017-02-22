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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual_1) {
            var PBI_CV_90CF7C04_2D19_4DD1_8D69_A5FE218BE58B;
            (function (PBI_CV_90CF7C04_2D19_4DD1_8D69_A5FE218BE58B) {
                var Visual = (function () {
                    function Visual(options) {
                        console.log('Visual constructor', options);
                    }
                    Visual.prototype.init = function (options) {
                        var visual = options.element[0];
                        this.updateCount = 0;
                        var counter = document.createElement("em");
                        counter.classList.add("counter");
                        var paragraph = document.createElement("p");
                        paragraph.appendChild(document.createTextNode("Update count:"));
                        paragraph.appendChild(counter);
                        visual.appendChild(paragraph);
                        this.target = counter;
                    };
                    Visual.prototype.update = function (options) {
                        console.log('Visual update', options);
                        this.target.innerHTML = (this.updateCount++).toString();
                    };
                    return Visual;
                }());
                PBI_CV_90CF7C04_2D19_4DD1_8D69_A5FE218BE58B.Visual = Visual;
            })(PBI_CV_90CF7C04_2D19_4DD1_8D69_A5FE218BE58B = visual_1.PBI_CV_90CF7C04_2D19_4DD1_8D69_A5FE218BE58B || (visual_1.PBI_CV_90CF7C04_2D19_4DD1_8D69_A5FE218BE58B = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var plugins;
        (function (plugins) {
            plugins.PBI_CV_90CF7C04_2D19_4DD1_8D69_A5FE218BE58B_DEBUG = {
                name: 'PBI_CV_90CF7C04_2D19_4DD1_8D69_A5FE218BE58B_DEBUG',
                displayName: 'TestVisual',
                class: 'Visual',
                version: '1.0.0',
                apiVersion: '1.5.0',
                create: function (options) { return new powerbi.extensibility.visual.PBI_CV_90CF7C04_2D19_4DD1_8D69_A5FE218BE58B.Visual(options); },
                custom: true
            };
        })(plugins = visuals.plugins || (visuals.plugins = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
//# sourceMappingURL=visual.js.map