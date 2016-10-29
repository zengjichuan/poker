
// load config
$.getScript("../js/app_config.js", function(){});

var num_players = 4;
var players = [];
var deal_offset = 0;
var play_offset = 0;
var total_card_num = 54;
var remain_card_num = 3;
var under_cards =[];
var card_left = jQuery.extend({}, code_book);
var cards_pool = [];
var enable_play = false;

$(document).ready(function(){
    init_variables();

    // model selection
    $('#num_players').click(function(){
        var op = $('#ts');
        num_players = op.val();
        refresh();
    });

    // deal position
    $('#fs').on('change', function(){
        deal_offset = this.value - 1;
        refresh();
    });
    //
    // reload page btn
    $('#reload_page').click(function(){
        refresh();
    });

    //
    $("#Enter").on('click', function(){
        $(this).hide();
    });

    // when card is selected while dealing
    $(".card2choose").on('click', function(){
        $(this).hide();
        // submit the card to player
        send_card2player($(this).attr("id"));
        total_card_num--;
        delete card_left[getKeyByValue(card_left, $(this).attr("id"))];
        under_cards.splice(under_cards.indexOf($(this).attr("id")),1);
        //alert("total "+total_card_num+" remain "+remain_card_num+" under " + under_cards.length);
        if(total_card_num - remain_card_num == 0){
            invalidate_under();

        }
    });

    // when card is selected while playing
    //$(".card2play").on("click", function(){
    //    // use this method to check is the right card can be play
    //    alert($(this).attr("id") + "playoffset: "+play_offset);
    //    if($(this).attr("id") in players[play_offset].cards){
    //        play_card(play_offset, $(this).attr("id"));
    //    }
    //});
    $("td.card_container").on("click", ".card2play", function(){
        // use this method to check is the right card can be play

        if(/*players[play_offset].cards.indexOf($(this).attr("id")) != -1 && */enable_play){
            var player_idx = parseInt($(this).attr("id")[$(this).attr("id").length - 1]);
            var card_idx = $(this).attr("id").substring(0, $(this).attr("id").length - 2);
            play_card(player_idx, card_idx);
        }
    });
    // sort btn
    $(".sort_btn").click(function(){
        player_to_sort = $(this).attr("id");
        index = parseInt(player_to_sort[player_to_sort.length - 1]);    // last num
        sort_cards(index);
    });
    // call btn
    $(".call_btn").click(function(){
        player_to_call = $(this).attr("id");
        index = parseInt(player_to_call[player_to_call.length - 1]);
        var lord_label = document.createElement("label");
        lord_label.setAttribute("class", "lord_label");
        lord_label.innerHTML = "地主";
        $("#player_"+index).append(lord_label);
        call_cards(index);
        enable_play = true;
        $(".choose-panel").hide();
    });
    /*
    This is for card decode
     */
    $('#cid').keyup(function(){
        if(event.keyCode == 13){
            $('#cid_btn').click();
        }
    });

    $('#cid_btn').click(function(){
        $('#cid_notfound').html("");
        card_id = card_left[$('#cid').val()];
        if (card_id == undefined){
            $('#cid_notfound').html("<b>编码不正确</b>");
            return;
        }
        //delete card_left[$('#cid').val()];
        $("#"+card_id).click();
    });
});

function init_variables(){
    // get all the cards
    card_left = jQuery.extend({}, code_book);
    // show all the cards for deal
    $(".card2choose").show();
    $(".choose-panel").show();
    if (num_players == 3){
        total_card_num = 54;
        remain_card_num = 3;
        $(".player_row_3").hide();
        // hide deal order option for player 4
        $("#fs4").hide();
        $("#4_0").show();
        $("#4_1").show();
    }else{
        total_card_num = 52;
        $(".player_row_3").show();
        remain_card_num = 4;
        delete card_left["w1"];
        delete card_left["w2"];
        // show deal order option for player 4
        $("#fs4").show();
        // hide kings
        $("#4_0").hide();
        $("#4_1").hide();
    }

    // init under card
    under_cards = [];
    for (var key in card_left)
        under_cards.push(card_left[key]);
    // init player
    players = [];
    for (var i = 0; i < num_players; i++){
        players.push(new player(i, [], false, []));
    }
    cards_pool = [];
    // remove lord label
    $(".lord_label").remove();
    // hide sort button
    $(".sort_btn").hide();
    $(".call_btn").hide();
    $('#cid_notfound').html("");
    enable_play = false;
}

function send_card2player(card_id){
    players[deal_offset].cards.push(card_id);
    invalidate_cards(deal_offset);
    deal_offset = (deal_offset + 1) % num_players;
}

function play_card(player_idx, card_idx){
    var idx_ = players[player_idx].cards.indexOf(card_idx);
    players[player_idx].cards.splice(idx_, 1);
    invalidate_cards(player_idx);
    players[player_idx].cards_played.push(card_idx);
    cards_pool.push(card_idx);
    invalidate_pool();
    invalidate_playedcards(player_idx);
    play_offset = (play_offset + 1) % num_players;
}

// display cards according to the players.cards
function invalidate_cards(index){
    var player_cards = $("#player"+index);
    player_cards.empty();
    if(players[index].sorted == true)
        players[index].cards.sort(sort_func);
    players[index].cards.forEach(function(card){
        var div = document.createElement("div");
        div.setAttribute("class", "play_brightness");
        var elem = document.createElement("img");
        elem.setAttribute("id", card+"_"+index);
        elem.setAttribute("class", "card2play");
        elem.setAttribute("src", "./images/cards/"+card+".jpeg");
        elem.setAttribute("height", "100");
        div.append(elem);
        player_cards.append(div);
    });
}

function invalidate_playedcards(index){
    var playedcards_holder = $("#player_r"+index);
    playedcards_holder.empty();
    players[index].cards_played.forEach(function(card){
        var elem = document.createElement("img");
        elem.setAttribute("src", "./images/cards/"+card+".jpeg");
        elem.setAttribute("height", "70");
        playedcards_holder.append(elem);
    });
}
// display under cards according to the under_cards
function invalidate_under(){
    var under_cards_holder = $("#under");
    under_cards_holder.empty();
    if (under_cards.length != remain_card_num)
        return;
    under_cards.forEach(function(card){
        var elem = document.createElement("img");
        elem.setAttribute("src", "./images/cards/"+card+".jpeg");
        elem.setAttribute("height", "70");
        under_cards_holder.append(elem);
    });
    $(".card2choose").hide();
    $(".sort_btn").show();
    $(".call_btn").show();
}

function invalidate_pool(){
    var cards_pool_holder = $(".cards_pool");
    cards_pool_holder.empty();
    cards_pool.forEach(function(card){
        var elem = document.createElement("img");
        elem.setAttribute("src", "./images/cards/"+card+".jpeg");
        elem.setAttribute("height", "50");
        cards_pool_holder.append(elem);
    });
}

function sort_cards(idx){
    players[idx].sorted = true;
    invalidate_cards(idx);
}

function sort_func(a, b){
    return sort_squence[a] - sort_squence[b];
}

function call_cards(idx){
    players[idx].cards = players[idx].cards.concat(under_cards);
    invalidate_cards(idx);
    play_offset = idx;
    $(".call_btn").hide();
    under_cards = [];
    invalidate_under();
}

function enable_play(){
    // when card is selected while playing
    //$(".card2play").on("click", function(){
    //    // use this method to check is the right card can be play
    //    alert($(this).attr("id") + "playoffset: "+play_offset);
    //    if($(this).attr("id") in players[play_offset].cards){
    //        play_card(play_offset, $(this).attr("id"));
    //    }
    //});
}

// invalidate the view
function refresh(){
    // clear the state
    init_variables();
    for (var i = 0; i < num_players; i++){
        invalidate_cards(i);
        invalidate_playedcards(i);
    }
    invalidate_under();
    invalidate_pool();
}
function player(id, cards, sorted, cards_played){
    this.id = id;
    this.cards = cards;
    this.sorted = sorted;
    this.cards_played = cards_played;
}

function getKeyByValue(dict, value){
    for (var key in dict){
        if(dict[key] == value)
            return key;
    }
}