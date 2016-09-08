
var sort_squence = {
    '0_0': 45,
    '0_1': 49,
    '0_2': 1,
    '0_3': 5,
    '0_4': 9,
    '0_5': 13,
    '0_6': 17,
    '0_7': 21,
    '0_8': 25,
    '0_9': 29,
    '0_10': 33,
    '0_11': 37,
    '0_12': 41,
    '1_0': 47,
    '1_1': 51,
    '1_2': 3,
    '1_3': 7,
    '1_4': 11,
    '1_5': 15,
    '1_6': 19,
    '1_7': 23,
    '1_8': 27,
    '1_9': 31,
    '1_10': 35,
    '1_11': 39,
    '1_12': 43,
    '2_0': 46,
    '2_1': 50,
    '2_2': 2,
    '2_3': 6,
    '2_4': 10,
    '2_5': 14,
    '2_6': 18,
    '2_7': 22,
    '2_8': 26,
    '2_9': 30,
    '2_10': 34,
    '2_11': 38,
    '2_12': 42,
    '3_0': 44,
    '3_1': 48,
    '3_2': 0,
    '3_3': 4,
    '3_4': 8,
    '3_5': 12,
    '3_6': 16,
    '3_7': 20,
    '3_8': 24,
    '3_9': 28,
    '3_10': 32,
    '3_11': 36,
    '3_12': 40,
    '4_0': 52,
    '4_1': 53,
};

var code_book = {
    '12': '0_0',
    '22': '0_1',
    '32': '0_2',
    '42': '0_3',
    '52': '0_4',
    '62': '0_5',
    '72': '0_6',
    '82': '0_7',
    '92': '0_8',
    '102': '0_9',
    'j2': '0_10',
    'q2': '0_11',
    'k2': '0_12',
    '14': '1_0',
    '24': '1_1',
    '34': '1_2',
    '44': '1_3',
    '54': '1_4',
    '64': '1_5',
    '74': '1_6',
    '84': '1_7',
    '94': '1_8',
    '104': '1_9',
    'j4': '1_10',
    'q4': '1_11',
    'k4': '1_12',
    '13': '2_0',
    '23': '2_1',
    '33': '2_2',
    '43': '2_3',
    '53': '2_4',
    '63': '2_5',
    '73': '2_6',
    '83': '2_7',
    '93': '2_8',
    '103': '2_9',
    'j3': '2_10',
    'q3': '2_11',
    'k3': '2_12',
    '11': '3_0',
    '21': '3_1',
    '31': '3_2',
    '41': '3_3',
    '51': '3_4',
    '61': '3_5',
    '71': '3_6',
    '81': '3_7',
    '91': '3_8',
    '101': '3_9',
    'j1': '3_10',
    'q1': '3_11',
    'k1': '3_12',
    'w1': '4_0',
    'w2': '4_1',
};

var num_players = 4;
var players = [];
var offset = 0;
var total_card_num = 54;
var remain_card_num = 3;
var under_cards =[];
var card_left = jQuery.extend({}, code_book);

$(document).ready(function(){
    init_variables();
    $('#num_players').click(function(){
        var op = $('#ts');

        refresh();
        num_players = op.val();
        if (num_players == 3){
            $("#player_row_3").hide();
            remain_card_num = 3;
        } else{
            $("#player_row_3").show();
            remain_card_num = 4;
        }
    });

    $('#reload_page').click(function(){
        refresh();
    });

    $("#Enter").on('click', function(){
        $(this).hide();
    });
    $(".card2choose").on('click', function(){

        //alert($(this).attr("id") + " Please add at least 3 members");
        // cover the card
        //$(this).prop("src", "./images/cards/A4.jpg");
        $(this).hide();
        // submit the card to player
        send_card2player($(this).attr("id"));
        total_card_num--;
        under_cards.splice(under_cards.indexOf($(this).attr("id")),1);
        if(total_card_num - remain_card_num == 0){
            invalidate_under();
        }
    });

    $(".sort_btn").click(function(){
        player_to_sort = $(this).attr("id");
        index = parseInt(player_to_sort[player_to_sort.length - 1]);
        sort_cards(index);
    });

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
        delete card_left[$('#cid').val()];
        $("#"+card_id).click();
    });
});

function init_variables(){
    players = [];
    under_cards = [];
    card_left = jQuery.extend({}, code_book);
    total_card_num = 54;
    offset = 0;
    for (var key in sort_squence)
        under_cards.push(key);

    for (var i = 0; i < num_players; i++){
        players.push(new player(i, [], false));
    }
    // hide sort button
    $(".sort_btn").hide();
    $('#cid_notfound').html("");
}

function send_card2player(card_id){
    players[offset].cards.push(card_id);
    invalidate_cards(offset);
    offset = (offset + 1) % num_players;
}

function invalidate_cards(offset){
    var player_cards = $("#player"+offset);
    player_cards.empty();
    if(players[offset].sorted == true)
        players[offset].cards.sort(sort_func);
    players[offset].cards.forEach(function(card){
        var elem = document.createElement("img");
        elem.setAttribute("src", "./images/cards/"+card+".jpeg")
        elem.setAttribute("height", "100");
        player_cards.append(elem);
    });
}

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
}

function sort_cards(idx){
    players[idx].sorted = true;
    invalidate_cards(idx);
}

function sort_func(a, b){
    return sort_squence[a] - sort_squence[b];
}

function refresh(){
    // clear the state
    init_variables();
    for (var i = 0; i < num_players; i++){
        invalidate_cards(i);
    }
    invalidate_under();
    $(".card2choose").show();
}
function player(id, cards, sorted){
    this.id = id;
    this.cards = cards;
    this.sorted = sorted;
}

