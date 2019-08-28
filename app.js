window.addEventListener('load', e => {
    $("#find-button").click(function () {
        $("#uk-span").html("...");
        $("#us-span").html("...");
        var word = $("#word-input").val().toLowerCase().trim();
        var autoplay = $("input[name='autoplay']:checked").val();
        if (word != "") {
            $.get("https://dictionary.cambridge.org/dictionary/english/" + word, function(response) {
                render_phonetics(response);
                render_voices(response);
            }).fail(function() {
                $.get("https://api.codetabs.com/v1/proxy?quest=https://dictionary.cambridge.org/dictionary/english/" + word, function(response) {
                    render_phonetics(response);
                    render_voices(response);
                    if (autoplay == "uk") {
                        $("#uk-button").trigger("click");
                    } else if (autoplay == "us") {
                        $("#us-button").trigger("click");
                    }
                }).fail(function() {
                    alert("Connection error!");
                });
            });
        }
    });
    registerSW(); 
});

async function registerSW() {
    if ("serviceWorker" in navigator) { 
        try {
            await navigator.serviceWorker.register("./sw.js?v=20190828-1"); 
        } catch (e) {
            alert("ServiceWorker registration failed!"); 
        }
    }
}

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