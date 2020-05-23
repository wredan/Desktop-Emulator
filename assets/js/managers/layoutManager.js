var dragging = false;
var offset = {}
var activeDragable;
var docWidth = $(document).width();
var docHeight = $(document).height();
var menuTopPosition;
var menu = false;

/* ********** ANIMATION ********** */

function openWindowAnimation(appId) {
    let posIconaX = $('#' + $(appId).data('iconid')).offset().left;
    let posIconaY = $('#' + $(appId).data('iconid')).offset().top;
    $(appId).css({ top: posIconaY, bottom: docHeight - posIconaY, left: posIconaX, right: docWidth - posIconaX })
        .removeClass('minimized')       
        .show();
    if ($(appId).hasClass("maximized") || docWidth < 500)
        maximizeAnimation(appId)
    else {
        let dim = getStandardWindowDim(appId);       
        $(appId).animate({ top: dim.top + "%", bottom: dim.bottom + "%", left: dim.left + "%", right: dim.right + "%"});
    }
}

function minimizeWindowAnimation(id) {
    let posIconaX = $('#' + $(id).data('iconid')).offset().left;
    let posIconaY = $('#' + $(id).data('iconid')).offset().top;
    $(id).animate({ top: posIconaY, bottom: docHeight - posIconaY, left: posIconaX, right: docWidth - posIconaX})        
        .addClass("minimized")
        .removeClass("window-open");

    $('#' + $(id).data('iconid')).removeClass('open');
}

function maximizeAnimation(id) {
    let windowContainerElement = $(id).find('.window-container');
    $(id).css({ width: 'auto', height: 'auto' });
    let left = windowContainerElement.css('left').split('px')[0];
    let right = windowContainerElement.css('right').split('px')[0];
    let bot = windowContainerElement.css('bottom').split('px')[0];
    $(id)
        .animate({ top: 0, bottom: (44 - bot) + "px", left: (0 - left) + "px", right: (0 - right) + "px"}, "fast")
        .addClass("maximized");
    if (id.indexOf("bash") >= 0)
        $(id + ' .bash-container').addClass("pd-bot-2");
}

function getBackFromMaximizeAnimation(id) {    
    let dim = getStandardWindowDim(id);
    $(id).animate({ top: dim.top + "%", bottom: dim.bottom + "%", left: dim.left + "%", right: dim.right + "%"}, "fast")
        .removeClass("maximized");
    if (id.indexOf("bash") >= 0)
        $(id + ' .bash-container').removeClass("pd-bot-2");
}

var deleteWindow = (id, type) => {
    let arrayId = Number(id.split('-')[1]);
    $('#' + $(id).data('iconid')).remove();
    $(id).fadeOut().remove();
    switch (type) {
        case "bash":
            appInstances.terminali = $.grep(appInstances.terminali, function (value) {
                return value != arrayId;
            });
            break;
        case "filemanager":
            appInstances.filemanager = $.grep(appInstances.filemanager, function (value) {
                return value != arrayId;
            });
            break;
        default:
            break;
    }
}

function getStandardWindowDim(id){
    let arrayId = Number(id.split('-')[1]);
    let size = 15;
    let reduceLeftAndRight = (docWidth < 1024) ? 0 : 8;
    let dim = {
        top: (size - 4) + arrayId,
        bottom: size - arrayId,
        left: (size + reduceLeftAndRight) + arrayId,
        right: (size + reduceLeftAndRight) - arrayId
    }
    return dim;
}

/* ********** DRAG & DROP ********** */

function iconDragAndDorp(selector) {    
    $(selector).mousedown(function (e) {
        e.preventDefault();        
        dragging = true;
        offset = {
            top: (e.pageY - $(this).offset().top),
            left: (e.pageX - $(this).offset().left)
        };
        activeDragable = selector;
    })
    $("#main-container").mousemove(function (e) {
        if (dragging) {
            $(activeDragable).css({ top: e.pageY - offset.top, left: e.pageX - offset.left });
        }
    }).mouseup(function (e) {
        dragging = false;
    }).mouseleave(function (e) {
        $(selector).css('z-index', 5);
        dragging = false;
    });
}

function windowDragAndDorp(selector) {
    $(selector).find('.window-bar').mousedown(function (e) {
        let parentWindow = $(this).parent();
        e.preventDefault();
        setFrontWindow('#' + parentWindow.attr('id'));
        parentWindow.focus();
        dragging = true;
        if(parentWindow.hasClass('maximized'))
            dragging = false;        
        let posTop = parentWindow.offset().top;
        let posLeft = parentWindow.offset().left;
        offset = {
            top: (e.pageY - posTop),
            left: (e.pageX - posLeft),
            right: ((docWidth - e.pageX) - (docWidth - (posLeft + parentWindow.width()))),
            bottom: ((docHeight - e.pageY) - (docHeight - (posTop + parentWindow.height()))),
        };
        activeDragable = selector;
    });
    $("#main-container").mousemove(function (e) {
        if (dragging) {
            $(activeDragable).css({ top: e.pageY - offset.top, left: e.pageX - offset.left, right: (docWidth - e.pageX) - offset.right, bottom: (docHeight - e.pageY) - offset.bottom });
        }
    }).mouseup(function (e) {
        dragging = false;
    }).mouseleave(function () {
        dragging = false;
    });
}

/* ********** EVENT LISTENER ********** */

function setActionBarEvent(id) {
    $(id + " .minimize").click(function (e) {
        minimizeWindowAnimation(id);
    });

    $(id + " .maximize").click(function (e) {
        if ($(id).hasClass('maximized')) {
            getBackFromMaximizeAnimation(id);
        } else {
            maximizeAnimation(id);
        }
    });

    $(id + " .close").click(function (e) {
        deleteWindow(id, $(id).data('iconid').split('-')[1]);
    });

    $(id + " .window-bar").dblclick(function (e) {
        if ($(id).hasClass('maximized')) {
            getBackFromMaximizeAnimation(id);
        } else {
            maximizeAnimation(id);
        }
    });
}

function setIconAndWindowEvent(id) {
    setFrontWindow(id);

    $(id).on('focusin', function () {
        setFrontWindow(id);
    })

    $('#' + $(id).data('iconid')).click(function () {
        if ($(id).hasClass("minimized")) {
            setFrontWindow(id);
            openWindowAnimation(id);
        } else if ($(id).hasClass("window-open")) {
            minimizeWindowAnimation(id);
        } else {
            setFrontWindow(id);
        }
    })
}

function setFrontWindow(id) {
    $('.window-open').removeClass('window-open');
    $(id).addClass('window-open');
    $('#application-bar .open').removeClass('open');
    $('#' + $(id).data('iconid')).addClass('open');
}

/* ********** START UP RENDERING ********** */

function toggleMenu() {
    if (!menu) {
        $('#menu').animate({ top: menuTopPosition + "px" }, "fast");
        menu = true;
    } else {
        $('#menu').animate({ top: docHeight + "px" }, "fast");
        menu = false;
    }
}

function generateMenuOptions(excludedAppList) {
    let menuVoice = "";
    for (value of appList) {
        if (!(excludedAppList.indexOf(value) > -1))
            menuVoice += menuOptions[value]();
    }
    $('#menu').append(menuVoice);
    $(".app-menu-icon").click(function () {
        toggleMenu();
    });

    $(".menu-option").click(function () {
        selectAppIstance($(this).data('option'));
        toggleMenu();
    });
}

function generateDesktopIcon(excludedAppList) {
    let icons = "";
    appList.forEach(value => {
        if (excludedAppList.indexOf(value) < 0){
            icons += `
                    <div id="desktop-icon-` + value + `" class="desktop-icon" style="top: ` + ((appList.indexOf(value) + 1) * 100) + `px; left: ` + 50 + `px">
                    ` + desktopIcons[value]() + `
                    </div>
                ` ;            
        }   
    });
    $('#desktop-icons-area').append(icons);
    appList.forEach(value => {
        iconDragAndDorp("#desktop-icon-"+ value);
    });
    $('.desktop-icon').dblclick(function (e) {
        selectAppIstance($(this).find('.base-text').data('app'));
    });
}

function generateUIAppEntryPoint(excludedAppList) {
    generateMenuOptions(excludedAppList);
    generateDesktopIcon(excludedAppList);
}

/* ********** ON READY ********** */

$(document).ready(function () {
    let excludedAppList = [];
    menuTopPosition = (docHeight - 44) - ((appList.length - excludedAppList.length) * 50);
    appInstances.terminali = [];
    appInstances.filemanager = [];

    generateUIAppEntryPoint(excludedAppList);
    $('#main-container').fadeIn('slow');

    $("#main-container").on('mouseup', function(e){
        if(e.which == 1)
            $('#contextmenu').hide().empty();
    });
   
});
