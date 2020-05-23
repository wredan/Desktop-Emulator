function initFileManager(fileId) {
    var appId = fileId;
    checkAndLoadFiles(appId);
    var progressBarContainer = $(appId).find(".progress-bar-container");
    var progressBar = progressBarContainer.find(".progress");
    var uploadInput = $(appId).find("input[name='uploadedFile']");

    function resetUploader() {
        progressBarContainer.hide();
        progressBar.css({ width: "1%" });
        uploadInput.val("");
    }

    function progress(e) {
        if (e.lengthComputable) {
            progressBar.css({ width: ((e.loaded * 100) / e.total) + "%" });
        }
    }

    function deleteFile(fileName, path) {
        if (fileName && path) {
            let successCallback = (response) => {
                console.log(response)
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
            }
            let errorCallback = (error) => {
                console.log(error);
            }
            let data = {
                fileName: fileName,
                path: path
            }
            ajaxCall.getCall('./php/delete_file.php', data, successCallback, errorCallback);
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

    function checkAndLoadFiles(appId = appId, resource = '/') {
        let data = { resource: resource };
        let successCallback = (response) => {
            response = JSON.parse(response);
            console.log(response)
            if (response.esito == "success") {
                responseSuccessLoadFile(response.data, appId);
            } else if (response.esito == "error") {
                alert(response.message)
            }
        }
        let errorCallback = (error) => {
            console.log(error);
            $(appId).find(".file-table").html("<div class='montserrat-600 center-block text-center pd-top-2'>Impossibile connettersi al web server</div>");
        }
        ajaxCall.getCall('./php/file_list.php', data, successCallback, errorCallback);
    }

    $(`#upload-input-${appId.split('#')[1]}`).on('change', function (e) {
        e.preventDefault();
        var file = $(this)[0].files[0];
        let path = $(appId + ' .file-manager-path').val().split('Path: ')[1];
        console.log(file)
        if (file && path) {
            progressBarContainer.show();
            let formData = new FormData();
            formData.append("uploadedFile", file);
            formData.append("path", path);
            $.ajax({
                type: 'POST',
                url: './php/upload_files.php',
                data: formData,
                processData: false,
                contentType: false,
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
                    resetUploader();
                },
                error: function (error) {
                    console.log(error);
                    resetUploader();
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

    function getPath(appId) {
        return $(appId + ' .file-manager-path').val().split('Path: ')[1];
    }

    $('.file-area').on('contextmenu', function (e) {
        e.preventDefault();
        let contextmenuContent = `
            <div class="contextmenu-voices" data-id="${appId}">
                <div class="contextmenu-voice">
                    <div class="menu-label">
                        Crea <div class="contextmenu-arrow"><svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 0 24 24" width="14"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg></div>
                        
                        <div class="contextmenu-subvoices">
                            <div class="contextmenu-voice">
                                <div class="menu-label" data-action="create_directory">
                                    Cartella

                                </div>                         
                            </div>                         
                        </div>
                    </div>         
                </div>

                <div class="contextmenu-voice">
                    <div class="menu-label" data-action="refresh">
                        Aggiorna 
                    
                    </div>                       
                </div>
            </div>
        `;
        $('#contextmenu')
            .show()
            .css({ top: e.pageY, left: e.pageX })
            .html(contextmenuContent);

            setContextMenuListener();
    });

    function createDirectory(id) {
        let fileTable = $(id).find('.file-table');
        let createDirString = `
            <div class="row item montserrat-500 pd-bot-1">                                    
                <div class="col col-md-3"><input type="text" id="create-directory-input" placeholder="Nome Cartella" value="Nuova Cartella" autofocus/></div>
                <div class="col col-md-3"></div>
                <div class="col col-md-3"></div>
                <div class="col col-md-2"></div>                                  
                <div class="col col-md-1"></div>                                    
            </div>     
        `;
        fileTable.append(createDirString);

        $('#create-directory-input').on('focusout', function (e) {
            createDirectoryQuery(getPath(id), $(this).val());
        });
        $('#create-directory-input').on('keydown', function (e) {
            if (e.key == "Enter")
                createDirectoryQuery(getPath(id), $(this).val());
        });
    }

    function createDirectoryQuery(path, name) {
        let data = {
            path: path,
            name: name ? name : "Nuova Cartella",
        }
        let successCallback = (response) => {
            console.log(response)
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
        }
        let errorCallback = (error) => {
            console.log(error);
            checkAndLoadFiles(appId, path);
        }
        ajaxCall.getCall('./php/create_dir.php', data, successCallback, errorCallback);
    }

    function setContextMenuListener() {
        $('.menu-label').on('mousedown', function (e) {
            let action = $(this).data('action');
            console.log(action)
            if (action) {
                let id = $(this).parents('.contextmenu-voices').data('id');
                switch (action) {
                    case 'create_directory': createDirectory(id);
                        break;
                    case 'refresh': checkAndLoadFiles(id, getPath(appId));
                        break;
                    default:
                        break;
                }
            }
        });
        
    }

}   