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
        .addClass('window-open')
        .show();
    if ($(appId).hasClass("maximized"))
        maximizeAnimation(appId)
    else {
        let arrayId = Number(appId.split('-')[1]);
        let size = 15;
        let top = (size - 3) + arrayId;
        let bottom = size - arrayId;
        let left = size + arrayId;
        let right = size - arrayId;

        $(appId).animate({ top: top + "%", bottom: bottom + "%", left: left + "%", right: right + "%", opacity: 1 });
    }
}

function minimizeWindowAnimation(id) {
    let posIconaX = $('#' + $(id).data('iconid')).offset().left;
    let posIconaY = $('#' + $(id).data('iconid')).offset().top;
    $(id).animate({ top: posIconaY, bottom: docHeight - posIconaY, left: posIconaX, right: docWidth - posIconaX, opacity: 0 })
        .removeClass("window-open")
        .addClass("minimized");

    $('#' + $(id).data('iconid')).removeClass('open');
}

function maximizeAnimation(id) {
    $(id).css({ width: 'auto', height: 'auto' });
    $(id)
        .animate({ top: 0, bottom: 44, left: 0, right: 0, opacity: 1 }, "fast")
        .addClass("maximized");
    if (id.indexOf("bash") >= 0)
        $(id + ' .bash-container').addClass("pd-bot-2");
}

function getBackFromMaximizeAnimation(id) {
    let arrayId = Number(id.split('-')[1]);
    let size = 15;
    let top = size + arrayId;
    let bottom = size + arrayId;
    let left = size + arrayId;
    let right = size + arrayId;
    $(id).animate({ top: top + "%", bottom: bottom + "%", left: left + "%", right: right + "%", opacity: 1 }, "fast")
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
        case "fileuploader":
            appInstances.fileuploader = $.grep(appInstances.fileuploader, function (value) {
                return value != arrayId;
            });
            break;
        default:
            break;
    }
}

/* ********** DRAG & DROP ********** */

function iconDragAndDorp(selector) {    
    $(selector).mousedown(function (e) {
        e.preventDefault();
        $(this).css('z-index', 110);
        dragging = true;
        offset = {
            top: (e.pageY - $(this).offset().top),
            left: (e.pageX - $(this).offset().left)
        };
        activeDragable = selector;
    })
    $(".main-container").mousemove(function (e) {
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
        e.preventDefault();
        $('.window-open').removeClass('window-open');
        $(this).parent().addClass('window-open');
        dragging = true;
        let terminal = $(this).parent();
        let posTop = terminal.offset().top;
        let posLeft = terminal.offset().left;
        offset = {
            top: (e.pageY - posTop),
            left: (e.pageX - posLeft),
            right: ((docWidth - e.pageX) - (docWidth - (posLeft + terminal.width()))),
            bottom: ((docHeight - e.pageY) - (docHeight - (posTop + terminal.height()))),
        };
        activeDragable = selector;
    });
    $(".main-container").mousemove(function (e) {
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
    $('.window-open').removeClass('window-open');
    $(id).addClass('window-open');

    $('#application-bar .open').removeClass('open');
    $('#' + $(id).data('iconid')).addClass('open');

    $('.bash-window').on('focusin', function () {
        $('.window-open').removeClass('window-open');
        $(this).addClass('window-open');

        $('#application-bar .open').removeClass('open');
        $('#' + $(id).data('iconid')).addClass('open');
    })

    $('#' + $(id).data('iconid')).click(function () {
        if ($(id).hasClass("minimized")) {
            $('.window-open').removeClass('window-open');
            openWindowAnimation(id);
            $('#application-bar .open').removeClass('open');
            $('#' + $(id).data('iconid')).addClass('open');
        } else if ($(id).hasClass("window-open")) {
            minimizeWindowAnimation(id);
        } else {
            $('.window-open').removeClass('window-open');
            $(id).addClass('window-open');
            $('#application-bar .open').removeClass('open');
            $('#' + $(id).data('iconid')).addClass('open');
        }
    })
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
    appInstances.fileuploader = [];

    generateUIAppEntryPoint(excludedAppList);
    $('.main-container').fadeIn('slow');
   
});
