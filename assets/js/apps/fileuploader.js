function initFileUploader(fileId) {
    var appId = fileId;
    checkAndLoadFiles(appId);
    var progressBarContainer = $(appId).find(".progress-bar-container");
    var progressBar = progressBarContainer.find(".progress");

    function resetForm(form) {
        progressBarContainer.hide();
        progressBar.css({width: "1%"});
        form.find("input[name='uploadedFile']").val("");
    }

    function progress(e) {
        if (e.lengthComputable) {
            progressBar.css({width: ((e.loaded * 100) / e.total) + "%"});
        }
    }

    function deleteFile(fileName) {
        $.ajax({
            type: 'GET',
            url: './php/delete_file.php?fileName=' + fileName,
            success: function (response) {
                if(response.indexOf('<') < 0) {
                    response = JSON.parse(response);
                    if(response.esito == "success"){
                        checkAndLoadFiles(appId);                    
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

    // function downloadFile(fileName) {
    //     $.ajax({
    //         type: 'GET',
    //         url: './php/download_file.php?fileName=' + fileName,
    //         success: function (response) {
    //             response = JSON.parse(response);
    //             if(response.esito == "success"){

    //             } else {
    //                 alert("Errore di eliminazione del file");
    //             }                            
    //         },
    //         error: function (error) {
    //             console.log(error);
    //         }
    //     });
    // }

    function checkAndLoadFiles(appId){
        $.ajax({
            type: 'GET',
            url: './php/file_list.php',
            success: function (response) {
                response = JSON.parse(response);
                if(response.esito == "success"){
                    if(response.data.length > 0){
                        let table = `
                            <div class="row montserrat-600 pd-bot-2">
                                <div class="col col-md-3">Nome</div>
                                <div class="col col-md-3">Ultima modifica</div>
                                <div class="col col-md-3">Tipo</div>
                                <div class="col col-md-2">Dimensione</div>
                                <div class="col col-md-1">Azioni</div>
                            </div>                                                           
                        `;
                        response.data.forEach(item => {
                            //cambiare con sistema grid per inglobare il link resource
                            table += `   
                                <div class="row item montserrat-500 pd-bot-1">
                                    <a href="${item.resource}" target="_blank">
                                        <div class="col col-md-3">${item.name}</div>
                                        <div class="col col-md-3">${item.date}</div>
                                        <div class="col col-md-3">${item.type}</div>
                                        <div class="col col-md-2">${item.size}</div>
                                        <div class="col col-md-1"><div class="delete-file" data-name="${item.name}.${item.ext}"><svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="1 0 21 21" width="18"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg></div> </div>
                                    </a>
                                </div>                                          
                            `;
                        });
                        $(appId).find(".file-table").html(table);
                        $(appId + " .delete-file").on("click", function (e) {
                            let fileName = $(this).data("name");
                            deleteFile(fileName);
                        });
                    } else {
                        $(appId).find(".file-table").html("<div class='montserrat-600 center-block text-center pd-top-2'>Non ci sono file</div>");
                    }
                    
                    // $(appId + " .download-file").on("click", function (e) {
                    //     let fileName = $(this).data("name");
                    //     downloadFile(fileName);
                    // })                   
                }                                
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    $('.upload-form .refresh-file').on('click', function (e) {
        e.preventDefault();
        checkAndLoadFiles(appId); 
    })

    $('.upload-file-form').on('submit', function (e) {
        e.preventDefault();
        var form = $(this);
        var file = this.uploadedFile.files[0];
        if (file) {
            progressBarContainer.show();
            let formData = new FormData();
            formData.append("uploadedFile", file);
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
                success: function (data) {                    
                    if(data.indexOf('<') < 0) {
                        data = JSON.parse(data);
                        if(data.response == "success"){                        
                            checkAndLoadFiles(appId);                        
                        } else {
                            alert(data.response.message)
                        }
                    } else {
                        alert("Errore - guarda la console.");
                        console.log(data);
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
}   