var ajaxCall = {
    getCall: (path, data, successCallback, errorCallback) => {
        $.ajax({
            type: 'GET',
            url: path,
            data: data,
            success: successCallback,
            error: errorCallback
        });
    },
    postCall: (path, data, successCallback, errorCallback) => {
        $.ajax({
            type: 'POST',
            url: path,
            data: data,
            success: successCallback,
            error: errorCallback
        });
    },
    postFormDataCall: (path, formData, successCallback, errorCallback) => {
        $.ajax({
            type: 'POST',
            url: path,
            data: formData,
            processData: false, 
            contentType: false, 
            success: successCallback,
            error: errorCallback
        });
    },
    postFormDataCallWithXhr: (path, formData, xhrCallback, successCallback, errorCallback) => {
        $.ajax({
            type: 'POST',
            url: path,
            data: formData,
            processData: false, 
            contentType: false, 
            xhr: xhrCallback,
            success: successCallback,
            error: errorCallback
        });
    }
}