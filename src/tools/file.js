import api from "@/api.js";

export const imageMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
];

export const videoMimeTypes = [
    'video/webm',
    'video/ogg',
    'video/mp4',
];

export const fileMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];

export const getFileBase64Info = (file) => {
    if (!file) return Promise.resolve(null);

    return new Promise((resolve) => {
        getFileBase64(file).then((base64_data_url) => {
            getFileInfo(file).then((obj) => {
                obj.url = base64_data_url;
                delete obj.binary;
                resolve(obj);
            });
        });
    });
};

export const getFileInfo = (file, without_loading) => {
    if (!file) return Promise.resolve(null);

    return new Promise((resolve) => {
        let obj = {
            name: file.name,
            extension: (file.name.includes('.') ? file.name.split('.').pop() : '').toLowerCase(),
            size: file.size,
            type: file.type,
            is_image: imageMimeTypes.indexOf(file.type) != -1,
            is_svg_image: file.type === 'image/svg+xml',
            is_video: videoMimeTypes.indexOf(file.type) != -1,
            binary: file,
        };

        if (!without_loading) {
            if (obj.is_video) {
                getFileVideoDuration(file).then(duration => {
                    obj.duration = Math.round(duration);
                    resolve(obj);
                });
            } else if (obj.is_image) {
                getFileImageDimensions(file).then(dimensions => {
                    obj.dimensions = dimensions;
                    resolve(obj);
                });
            } else {
                resolve(obj);
            }
        } else {
            resolve(obj);
        }
    });
};

export const getFileBase64 = (file) => {
    if (!file) return Promise.resolve(null);

    return new Promise((resolve) => {
        let reader = new FileReader();

        reader.addEventListener('loadend', () => {
            resolve(reader.result);
        });

        reader.readAsDataURL(file);
    });
};

export const getFileImageDimensions = (file) => {
    if (typeof (URL) == 'undefined' ||
        !URL.createObjectURL) {
        return Promise.resolve({
            width: -1,
            height: -1
        });
    }

    return new Promise(resolve => {
        try {
            let img = new Image();

            img.onload = function () {
                resolve({
                    width: img.width,
                    height: img.height
                });
            };

            img.src = URL.createObjectURL(file);
        } catch (e) {
            resolve({
                width: -1,
                height: -1
            });
        }
    });
};

export const getFileVideoDuration = (file) => {
    if (typeof (URL) == 'undefined' ||
        !URL.createObjectURL) {
        return Promise.resolve(-1);
    }

    return new Promise(resolve => {
        try {
            let video = document.createElement('video');
            video.preload = 'metadata';

            video.onloadedmetadata = function () {
                window.URL.revokeObjectURL(video.src);
                resolve(video.duration);
            };

            video.src = URL.createObjectURL(file);

            if (typeof (video.debugLoad) === 'function') {
                video.debugLoad();
            }
        } catch (e) {
            resolve(-1);
        }
    });
};

export const resizeImage = (file, maxImageSideSize) => {
    return new Promise((resolve, reject) => {
        getFileBase64(file).then(url => {
            const image = new Image();
            const resized_mime_type = file.type === 'image/png' ? 'image/png' : 'image/jpeg';

            image.onload = () => {
                const canvas = document.createElement('canvas');
                let new_width = 1,
                    new_height = 1;

                if (image.width > maxImageSideSize ||
                    image.height > maxImageSideSize) {
                    if (image.width > image.height) {
                        new_width = Math.round(maxImageSideSize);
                        new_height = Math.round(new_width * image.height / image.width);
                    } else {
                        new_height = Math.round(maxImageSideSize);
                        new_width = Math.round(new_height * image.width / image.height);
                    }

                    canvas.width = new_width;
                    canvas.height = new_height;
                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, new_width, new_height);
                    ctx.drawImage(image, 0, 0, new_width, new_height);
                    const dataUrl = canvas.toDataURL(resized_mime_type);
                    resolve(dataURItoBlob(dataUrl));
                } else {
                    resolve(file);
                }
            };

            image.src = url;

            if (typeof (image.debugLoad) === 'function') {
                image.debugLoad();
            }
        }).catch(reject);
    });
};

export const dataURItoBlob = (dataURI) => {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;

    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(dataURI.split(',')[1]);
    } else {
        byteString = decodeURIComponent(dataURI.split(',')[1]);
    }

    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    let ia = new Uint8Array(byteString?.length);

    for (let i = 0; i < byteString?.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {
        type: mimeString
    });
};

const uploadDocument = (container_code, document_type_code, file, basename, metadata, uploadedBy, sortMetadata) => {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('document_type_code', document_type_code);
        formData.append('file', file);
        if (basename) formData.append('name', basename);
        metadata.uploadedby = [uploadedBy?.first_name, uploadedBy?.last_name].filter(Boolean).join(' ');

        api.postFormData(api.urls.gd + 'containers/' + container_code + '/documents', formData)
            .then(document => {
                if (sortMetadata) {
                    metadata[sortMetadata] = document.id;
                }

                document.metadata = metadata;
                document.uploaded = (new Date()).toISOString();

                return api.put(api.urls.gd + 'containers/' + container_code + '/documents/' + document.id + '/metadata', metadata)
                    .then(() => resolve(document))
                    .catch(() => resolve(document)); // Resolve even if metadata update fails
            })
            .catch(reject);
    });
};

const handleImageResize = (file, maxImageSideSize) => {
    return getFileInfo(file).then((info) => {
        if (info.is_image) {
            return resizeImage(file, maxImageSideSize);
        }

        return file;
    });
};

export const uploadFile = function (container_code, document_type_code, file) {
    const basename = arguments[3];
    const metadata = arguments[4] || {};
    const uploadedBy = arguments[5];
    const maxImageSideSize = arguments[6];
    const sortMetadata = arguments[7];

    metadata.uploadedby = [uploadedBy?.first_name, uploadedBy?.last_name].filter(Boolean).join(' ');

    return new Promise((resolve, reject) => {
        if (!maxImageSideSize) {
            uploadDocument(container_code, document_type_code, file, basename, metadata, uploadedBy, sortMetadata)
                .then(resolve)
                .catch(reject);
        } else {
            handleImageResize(file, maxImageSideSize)
                .then(newFile => uploadDocument(container_code, document_type_code, newFile, basename, metadata, uploadedBy, sortMetadata))
                .then(resolve)
                .catch(reject);
        }
    });
};

export const updateFile = (container_code, document_id, document_type_code, metadata) => {
    return new Promise((resolve, reject) => {
        api.put(api.urls.gd + 'containers/' + container_code + '/documents/' + document_id, {
            document_type_code,
        }).then(
            document => {
                document.metadata = metadata;

                api.put(api.urls.gd + 'containers/' +
                    container_code + '/documents/' +
                    document.id + '/metadata', metadata)
                    .then(() => {
                        resolve(document);
                    }).catch(() => {
                        resolve(document);
                    });
            }).catch(() => {
                reject()
            });
    });
};

export const downloadFile = async (fetchResult, filename) => {
    window.fetchResult = fetchResult;
    let data = await fetchResult.blob();

    if (!filename) {
        filename = 'file';
    }

    // It is necessary to create a new blob object with mime-type explicitly set
    // otherwise only Chrome works like it should
    const blob = new Blob([data], {
        type: data.type || 'application/octet-stream'
    });

    // Other browsers
    // Create a link pointing to the ObjectURL containing the blob
    const blobURL = window.URL.createObjectURL(blob);
    const tempLink = document.createElement('a');
    tempLink.style.display = 'none';
    tempLink.href = blobURL;
    tempLink.setAttribute('download', filename);

    // Safari thinks _blank anchor are pop ups. We only want to set _blank
    // target if the browser does not support the HTML5 download attribute.
    // This allows you to download files in desktop safari if pop up blocking
    // is enabled.
    if (typeof tempLink.download === 'undefined') {
        tempLink.setAttribute('target', '_blank');
    }

    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);

    setTimeout(() => {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(blobURL);
    }, 100);
};

export const getContainer = function (container_type_code, container_reference) {
    return api.post(api.urls.gd + 'containers', {
        'container_type_code': container_type_code,
        'reference': container_reference,
    });
};