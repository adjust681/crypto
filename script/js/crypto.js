
/*
 * variables init value into index.php
 */
let id_list= [];
let ticket_list = [];
let api_url= '';

/**
 * used in refreshPage(refreshTime);
 * second format
 * @type {number}
 */
let refreshTime= 60*10;

/**
 * used in stopTimer(timer);
 * @type {number}
 */
let timer      = 0;

let _sharp           = '#';
let tag_inform       = ' inf';
let tag_price        = ' prc';
let tag_percent      = ' pr';
let tag_time         = '-tm';
let tag_minute       = '#min';
let tag_second       = '#sec';
let tag_compute_icon = '-cm';
let tag_fixprice_icon= '-fx';

let timing = {
    min: 'мин.', hour: ['час', 'часа', 'часов'], day: ['день', 'дня', 'дней'], month: ' более мес.'
};

$(document).ready(function () {

    computeAllPrice();
    refreshPage(refreshTime);

    // region set listener from array ticket

    for(let i=0; i<ticket_list.length; i++) {
        let _id = _sharp + id_list[i];
        let _ticket = ticket_list[i];

        //button 'compute' individually
        $(_id + tag_compute_icon).click(function () {
            updateTicker(_id, _ticket);
        });

        //button 'fixprice'  individually
        $(_id + tag_fixprice_icon).click(function () {
            let _price = $(_id + tag_price).text();
            sendDataBase(_ticket, _price);
            updateTicker(_id, _ticket);
        });
    }

    // endregion set listener from array ticket

    // region button bottom list

    //button 'Compute all'
    $('#computeall').click(function () {
        computeAllPrice();
        stopTimer(timer);
        refreshPage(refreshTime);
    });

    //button 'Fixprice all'
    $('#fixpriceall').click(function () {
        fixAllPrice();
        stopTimer(timer);
        refreshPage(refreshTime);
    });

    // endregion button bottom list

    // region update display

    /**
     * used for click button 'compute' once
     * @param id
     * @param ticket
     */
    function updateTicker(id, ticket){
        updateTickerGet(id, ticket).done(function (data) {
            let _newprice = data.price;
            _newprice = pricePrepare(_newprice);
            $(id + tag_inform).text('');
            $(id + tag_price).text(_newprice);

            getDataBase(ticket).done(function (data) {
                const _data = data.split('|');
                let _historytime = parseInt(_data[0]);
                let _historyprice = _data[1];

                let _percent = comparePrice(_historyprice, _newprice);
                if (_percent >= 0.00) {
                    $(id + tag_percent).text('+' + _percent + '%');
                    $(id + tag_percent).removeClass("grey");
                    $(id + tag_percent).removeClass("red");
                    $(id + tag_percent).addClass("grn");
                } else {
                    $(id + tag_percent).text(_percent + '%');
                    $(id + tag_percent).removeClass("grey");
                    $(id + tag_percent).removeClass("grn");
                    $(id + tag_percent).addClass("red");
                }
                $(id + tag_time).text(compareDate(_historytime));
            });
        });
    }

    /**
     * call in updateTicker()
     * @param price
     * @returns {string}
     */
    function pricePrepare(price) {
        let numberCount = n => 1 + Math.max(Math.floor(Math.log10(Math.abs(n))), 0);
        let ncount = 8 - numberCount(price) + 1;
        return parseFloat(price).toFixed(ncount);
    }

    /**
     * call in updateTicker()
     * @param id
     * @param ticket
     * @param timeout
     * return response.price
     */
    function updateTickerGet(id, ticket, timeout=0) {
        return $.ajax({
            url: api_url + ticket,
            method: "GET",
            timeout: timeout,
            beforeSend: function () {
                $(id + tag_price).text('');
                $(id + tag_inform).text('request...');
            },
            success: function (response) {
            }
        });
    }

    /**
     * used for click button 'Compute all'
     */
    function computeAllPrice(){
        for(let i=0; i<ticket_list.length; i++) {
            let _id = _sharp + id_list[i];
            let _ticket = ticket_list[i];
            updateTicker(_id, _ticket);
        }
    }

    /**
     * used for click button 'Fixprice all'
     */
    function fixAllPrice(){
        for(let i=0; i<ticket_list.length; i++) {
            let _id = _sharp + id_list[i];
            let _ticket = ticket_list[i];
            let _price = $(_id + tag_price).text();
            sendDataBase(_ticket, _price);
            updateTicker(_id, _ticket);
        }
    }

    // endregion update display

    // region database read / write

    /**
     * used in the button 'fixprice' once
     * @param ticket
     * @param price
     */
    function sendDataBase(ticket, price) {
        $.ajax({
            url: "sql/wrapper.php",
            method: "POST",
            data: { post: 'true', ticket: ticket, price: price },
            success: function (response) {
            },
            error: function (error) {
            }
        });
    }

    /**
     * call in updateTicker()
     * @param ticket
     * @returns {*|jQuery}
     */
    function getDataBase(ticket) {
        return $.ajax({
            url: "sql/wrapper.php",
            method: "GET",
            data: { get: 'true', ticket: ticket },
            success: function (response) {
            },
            error: function (error) {
            }
        });
    }

    // endregion database read / write

    // region compute percent, date

    /**
     * used in the button 'compute' individually
     * @param saveprice
     * @param newprice
     * @returns {string}
     */
    function comparePrice(saveprice, newprice) {
        let _saveprice = parseFloat(saveprice);
        let _newprice = parseFloat(newprice);
        return (((_newprice - _saveprice) / _newprice) * 100).toFixed(2);
    }

    /**
     * call in the method updateTicker(id, ticket)
     * used in the button 'compute' individually =>
     * @param savetime
     * @returns {string}
     */
    function compareDate(savetime) {
        let out = '';
        let _newtime = parseInt(parseFloat(Date.now() / 1000).toFixed(0));
        let _subtract  = _newtime - savetime;

        if(_subtract < 3600) {
            let _minute = parseInt(parseFloat(_subtract / 60).toString().split('.')[0]);
            out = _minute + ' ' + timing.min;
        }else if (_subtract < 3600*24) {
            let _hour = parseInt(parseFloat(_subtract / 3600).toString().split('.')[0]);
            if (_hour < 2 || (_hour >= 21 && _hour < 22))
                out = _hour + ' ' + timing.hour[0];
            else if ((_hour >= 2 && _hour < 5) || (_hour >= 22 && _hour < 24))
                out = _hour + ' ' + timing.hour[1];
            else if (_hour >= 5 && _hour < 21)
                out = _hour + ' ' + timing.hour[2];
        }else if(_subtract >= 3600*24) {
            let _day = parseInt(parseFloat(_subtract / 3600*24).toString().split('.')[0]);
            if((_day >= 1 && _day < 2) || (_day >= 21 && _day < 22))
                out = _day + ' ' + timing.day[0];
            else if((_day >= 2 && _day < 5) || (_day >= 22 && _day < 24) || _day === 31)
                out = _day + ' ' + timing.day[1];
            else if((_day >= 5 && _day < 21) || (_day >= 25 && _day < 30))
                out = _day + ' ' + timing.day[2];
            else if(_day > 31)
                out = ' ' + timing.month;
        }else {
            out = 'error';
        }
        return out;
    }

    // endregion compute percent, date

    //region Timer / refresh page

    function refreshPage(refreshTime) {
        let countdown = refreshTime;
        function t(){
            countdown--;
            let minutes = Math.floor(countdown / 60);
            let seconds = countdown - minutes * 60;
            $(tag_minute).text(minutes);
            $(tag_second).text(seconds);
            if(!countdown) {
                clearInterval(timer);
                window.location.reload(1);
            }
        }
        timer = setInterval(t, 1000);
    }

    function stopTimer(timer) {
            $(tag_minute).text('-');
            $(tag_second).text('-');
            clearInterval(timer);
    }

    //endregion Timer / refresh page

});