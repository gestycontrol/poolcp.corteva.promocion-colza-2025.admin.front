const exportToPdf = function (pages, basename = 'export', padding = 0) {
    return Promise.all([
        import('jspdf'),
        import('html2canvas')
    ]).then(([jspdfModule, html2canvasModule]) => {
        const jsPDF = jspdfModule.jsPDF;
        const html2canvas = html2canvasModule.default;
        return processPagesToPdf(pages, basename, padding, jsPDF, html2canvas);
    });
};

async function processPagesToPdf(pages, basename, padding, jsPDF, html2canvas) {
    let images = [];
    let imageSizes = [];

    for (const page of pages) {
        const canvas = await html2canvas(page);
        images.push(canvas.toDataURL('image/png'));
        imageSizes.push({
            width: canvas.width,
            height: canvas.height
        });
    }

    let doc = new jsPDF('p', 'pt', [595.28, 841.89]);
    doc.setFontSize(40);

    images.forEach((image, index) => {
        if (index > 0) {
            doc.addPage();
        }

        let { image_width, image_height } = getScaledImageSize(imageSizes[index], padding);

        doc.addImage(
            image,
            'PNG',
            Math.floor((595 - padding * 2 - image_width) / 2) + padding,
            Math.floor((841 - padding * 2 - image_height) / 2) + padding,
            image_width,
            image_height
        );
    });

    await doc.save(basename + '.pdf', { returnPromise: true });
}

function getScaledImageSize(imageSize, padding) {
    let image_width = imageSize.width;
    let image_height = imageSize.height;
    const max_image_width = 595 - padding * 2;
    const max_image_height = 841 - padding * 2;

    if (imageSize.width > imageSize.height) {
        if (imageSize.width > max_image_width) {
            image_height = imageSize.height / imageSize.width * max_image_width;
            image_width = max_image_width;
        }
    } else if (imageSize.height > max_image_height) {
        image_width = imageSize.width / imageSize.height * max_image_height;
        image_height = max_image_height;
    }

    return { image_width, image_height };
}

export { exportToPdf };
