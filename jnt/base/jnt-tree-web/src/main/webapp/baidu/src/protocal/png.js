if (!kity.Browser.ie) {
    KityMinder.registerProtocal('png', function() {
        function loadImage(url, callback) {
            var image = document.createElement('img');
            image.onload = callback;
            image.src = url;
        }

        return {
            fileDescription: 'PNG 图片',
            fileExtension: '.png',
            encode: function(json, km) {
                var originZoom = km._zoomValue;

                var paper = km.getPaper(),
                    paperTransform = paper.shapeNode.getAttribute('transform'),
                    domContainer = paper.container,
                    svgXml,
                    $svg,

                    bgDeclare = km.getStyle('background').toString(),
                    bgUrl = /url\((.+)\)/.exec(bgDeclare),
                    bgColor = kity.Color.parse(bgDeclare),

                    renderContainer = km.getRenderContainer(),
                    renderBox = renderContainer.getRenderBox(),
                    width = renderBox.width + 1,
                    height = renderBox.height + 1,
                    padding = 20,

                    canvas = document.createElement('canvas'),
                    ctx = canvas.getContext('2d'),
                    blob, DomURL, url, img, finishCallback;

                paper.shapeNode.setAttribute('transform', 'translate(0.5, 0.5)');
                renderContainer.translate(-renderBox.x, -renderBox.y);

                svgXml = paper.container.innerHTML;

                renderContainer.translate(renderBox.x, renderBox.y);

                paper.shapeNode.setAttribute('transform', paperTransform);

                $svg = $(svgXml).filter('svg');
                $svg.attr({
                    width: renderBox.width + 1,
                    height: renderBox.height + 1,
                    style: 'font-family: Arial, "Microsoft Yahei","Heiti SC";'
                });

                // need a xml with width and height
                svgXml = $('<div></div>').append($svg).html();

                // svg 含有 &nbsp; 符号导出报错 Entity 'nbsp' not defined
                svgXml = svgXml.replace(/&nbsp;/g, '&#xa0;');

                blob = new Blob([svgXml], {
                    type: 'image/svg+xml;charset=utf-8'
                });

                DomURL = window.URL || window.webkitURL || window;

                url = DomURL.createObjectURL(blob);

                canvas.width = width + padding * 2;
                canvas.height = height + padding * 2;

                function fillBackground(ctx, style) {
                    ctx.save();
                    ctx.fillStyle = style;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.restore();
                }

                function drawImage(ctx, image, x, y) {
                    ctx.drawImage(image, x, y);
                }

                function generateDataUrl(canvas) {
                    var url = canvas.toDataURL('png');
                    return url;
                }

                function drawSVG() {
                    loadImage(url, function() {
                        var svgImage = this;
                        var downloadUrl;
                        drawImage(ctx, svgImage, padding, padding);
                        DomURL.revokeObjectURL(url);
                        downloadUrl = generateDataUrl(canvas);
                        if (finishCallback) {
                            finishCallback(downloadUrl);
                        }
                    });
                }

                if (bgUrl) {
                    loadImage(bgUrl[1], function() {
                        fillBackground(ctx, ctx.createPattern(this, 'repeat'));
                        drawSVG();
                    });
                } else {
                    fillBackground(ctx, bgColor.toString());
                    drawSVG();
                }

                return {
                    then: function(callback) {
                        finishCallback = callback;
                    }
                };
            },
            recognizePriority: -1
        };
    });
}