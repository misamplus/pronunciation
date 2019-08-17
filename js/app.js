async function registerSW() {
    if ('serviceWorker' in navigator) { 
        try {
            await navigator.serviceWorker.register('./js/sw.js?v=20190817-1'); 
        } catch (e) {
            alert('ServiceWorker registration failed. Sorry about that.'); 
        }
    } else {
        document.querySelector('.alert').removeAttribute('hidden'); 
    }
}

window.addEventListener('load', e => {
    $("#find-button").click(function () {
        $("#uk-span").html("...");
        $("#us-span").html("...");
        var word = $("#word-input").val().toLowerCase().trim();
        $.get("https://dictionary.cambridge.org/dictionary/english/" + word, function(response) {
            render_phonetics(response);
            render_voices(response);
        }).fail(function() {
            $.get("https://goxcors.appspot.com/cors?method=GET&url=https://dictionary.cambridge.org/dictionary/english/" + word, function(response) {
                render_phonetics(response);
                render_voices(response);
            }).fail(function() {
                alert("Connection error!");
            });
        });
    });
    registerSW(); 
});

function render_phonetics(response) {
    var de1 = '<span class="ipa">';

    var uk_start = response.search(de1) + de1.length;
    var remind = response.substring(uk_start, response.length);
    var uk_end = remind.search('</span>');
    var uk = remind.substring(0, uk_end);

    response = remind;     

    var us_start = response.search(de1) + de1.length;
    var remind = response.substring(us_start, response.length);
    var us_end = remind.search('</span>');
    var us = remind.substring(0, us_end);

    $("#uk-span").html("/" + uk + "/");
    $("#us-span").html("/" + us + "/");
}

function createAudio(eid, src) {
    output = '<audio id="' + eid + '">';
    output += '<source src="' + src + '" type="audio/mp3" />';
    output += '</audio>';
    return output
}

function render_voices(response) {
    var de1 = 'data-src-mp3="';

    var uk_start = response.search(de1) + de1.length;
    var remind = response.substring(uk_start, response.length)
    var uk_end = remind.search('"');
    var uk = 'https://dictionary.cambridge.org/' + remind.substring(0, uk_end);

    response = remind;     

    var us_start = response.search(de1) + de1.length;
    var remind = response.substring(us_start, response.length);
    var us_end = remind.search('"');
    var us = 'https://dictionary.cambridge.org/' + remind.substring(0, us_end);

    $("#uk-button").click(function () {
        $("#uk-audio").replaceWith($(createAudio("uk-audio", uk)));
        $("#uk-audio")[0].play();
    });
    $("#us-button").click(function () {
        $("#us-audio").replaceWith($(createAudio("us-audio", us)));
        $("#us-audio")[0].play();
    });
}
