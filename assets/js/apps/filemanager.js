function initFileManager(fileId) {
    var appId = fileId;
    checkAndLoadFiles(appId);
    var progressBarContainer = $(appId).find(".progress-bar-container");
    var progressBar = progressBarContainer.find(".progress");

    function resetForm(form) {
        progressBarContainer.hide();
        progressBar.css({ width: "1%" });
        form.find("input[name='uploadedFile']").val("");
    }

    function progress(e) {
        if (e.lengthComputable) {
            progressBar.css({ width: ((e.loaded * 100) / e.total) + "%" });
        }
    }

    function deleteFile(fileName, path) {
        if(fileName && path){
            $.ajax({
                type: 'GET',
                url: './php/delete_file.php?fileName=' + fileName + '&path=' + path,
                success: function (response) {
                    if (response.indexOf('<') < 0) {
                        response = JSON.parse(response);
                        if (response.esito == "success") {
                            checkAndLoadFiles(appId, path);
                        } else {
                            alert("Errore di eliminazione del file");
                        }
                    } else {
                        alert("Errore - guarda la console.");
                        console.log(response);
                    }
    
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }        
    }

    function setFileListListener(appId) {
        $(appId + " .delete-file").on("click", function (e) {
            let fileName = $(this).data("name");
            let path = $(appId + ' .file-manager-path').val().split('Path: ')[1];
            deleteFile(fileName, path);
        });
        $(appId + ' .file-manager-folder').on('click', function (e) {
            e.preventDefault();
            let resource = $(this).data('resource');
            $(this).parents('.file-manager-container').find('.file-manager-path').val('Path: ' + resource);
            checkAndLoadFiles(appId, resource);
        });
    }

    function loadFileTable(data) {
        let table = `
                <div class="row montserrat-600 pd-bot-2">
                    <div class="col col-md-3">Nome</div>
                    <div class="col col-md-3">Ultima modifica</div>
                    <div class="col col-md-3">Tipo</div>
                    <div class="col col-md-2">Dimensione</div>
                    <div class="col col-md-1">Azioni</div>
                </div>                                                           
            `;
            data.forEach(item => {
                table += `   
                    <div class="row item montserrat-500 pd-bot-1">                                    
                                <div class="col col-md-3">${(item.type == "Cartella") ? '<a href="" data-resource="' + item.resource + '" class="file-manager-folder" target="_blank">' + item.name + '</a>' : '<a href="' + item.resource + '" target="_blank">' + item.name + '</a>'}</div>
                                <div class="col col-md-3">${item.date}</div>
                                <div class="col col-md-3">${item.type}</div>
                                <div class="col col-md-2">${(item.type != "Cartella") ? item.size : ""}</div>                                  
                        <div class="col col-md-1"><div class="delete-file" data-name="${item.name}.${item.ext}"><svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="1 0 21 21" width="18"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg></div> </div>                                    
                    </div>                                          
                `;
            });
            return table;
    }

    function responseSuccessLoadFile(data, appId) {
        if (data.length > 0) {            
            $(appId).find(".file-table").html(loadFileTable(data));
            setFileListListener(appId);
        } else {
            $(appId).find(".file-table").html("<div class='montserrat-600 center-block text-center pd-top-2'>Non ci sono file</div>");
        }
    }

    function checkAndLoadFiles(appId, resource = '/') {
        $.ajax({
            type: 'GET',
            url: './php/file_list.php?resource=' + resource,
            success: function (response) {
                response = JSON.parse(response);
                if (response.esito == "success") {
                    responseSuccessLoadFile(response.data, appId);
                } else if (response.esito == "error") {
                    alert(response.message)
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    $('.upload-file-form').on('submit', function (e) {
        e.preventDefault();
        var form = $(this);
        var file = this.uploadedFile.files[0];
        let path = $(appId + ' .file-manager-path').val().split('Path: ')[1];
        if (file && path) {
            progressBarContainer.show();
            let formData = new FormData();
            formData.append("uploadedFile", file);
            formData.append("path", path);
            $.ajax({
                type: 'POST',
                url: './php/upload_files.php',
                data: formData,
                processData: false, //tell jquery not to process data
                contentType: false, //tell jquery not to set content-type
                xhr: function () {
                    var myXhr = $.ajaxSettings.xhr();
                    if (myXhr.upload) {
                        myXhr.upload.addEventListener('progress', progress, false);
                    }
                    return myXhr;
                },
                success: function (response) {
                    if (response.indexOf('<') < 0) {
                        response = JSON.parse(response);
                        if (response.esito == "success") {
                            checkAndLoadFiles(appId, path);
                        } else {
                            alert(data.response.message)
                        }
                    } else {
                        alert("Errore - guarda la console.");
                        console.log(response);
                    }
                    resetForm(form);
                },
                error: function (error) {
                    console.log(error);
                    resetForm(form);
                }
            });
        } else {
            alert("Seleziona un file prima di procedere all'upload");
        }
    });

    $(appId + ' .upload-form .refresh-file').on('click', function (e) {
        e.preventDefault();
        let resource = $(appId + ' .file-manager-path').val().split('Path: ')[1];
        if (resource)
            checkAndLoadFiles(appId, resource);
    })

    $(appId + ' .file-manager-path').on('keydown', function (e) {
        this.value = 'Path: /' + this.value.split('Path: /')[1];
        if (e.key == "Enter") {
            let resource = $(this).val().split('Path: ')[1];
            if (resource.slice(-1) != '/') {
                resource += '/';
                this.value = 'Path: ' + resource;
            }
            if (resource)
                checkAndLoadFiles(appId, resource);
        }
    });

    $(appId + ' .back-path-button').on('click', function (e) {
        e.preventDefault();
        let resourceInput = $(appId + ' .file-manager-path');
        let resource = resourceInput.val().split('Path: ')[1];
        if (resource != '/') {
            let resourceArray = resource.split('/');
            let len = resourceArray.length;
            let path = "";
            for (let i = 0; i < len - 2; i++)
                path += resourceArray[i] + "/";
            resourceInput.val('Path: ' + path);
            checkAndLoadFiles(appId, path);
        }
    });

}   