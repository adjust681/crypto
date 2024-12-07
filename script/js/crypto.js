let id_list = [];
let ticket_list = [];
let api_url = '';
let refreshTime = 30000;

let timing = {
    min: 'мин.', hour1: 'час', hour2: 'часа', hour3: 'часов',
    day1: 'день', day2: 'дня', day3: 'дней', month: ' более 1 мес.'
};

let tag_inform   = ' inf';
let tag_price    = ' prc';
let tag_percent  = ' pr';
let tag_time     = '-tm';
let tag_conpute_icon  = '-cm';
let tag_fixprice_icon = '-fx';

$(document).ready(function () {

    computeAllPrice();

    // region set listener from array ticket

    for(let i=0; i<ticket_list.length; i++) {
        let _id = '#' + id_list[i];
        let _ticket = ticket_list[i];

        //button 'compute' individually
        $(_id + tag_conpute_icon).click(function () {
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

    // region 3 button bottom list

    //button 'Update all'
    $('#updateall').click(function () {
        updateAllPrice();
    });

    //button 'Compute all'
    $('#computeall').click(function () {
        computeAllPrice();
    });

    //button 'Fixprice all'
    $('#fixpriceall').click(function () {
        fixAllPrice();
    });

    // endregion 3 button bottom list

    // region update display

    /**
     * used for click button 'compute' once
     * @param id
     * @param ticket
     */
    function updateTicker(id, ticket){
        updateTickerGet(id, ticket).done(function (data) {
            let _newprice = data.price;

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
                $(id + tag_inform).text('');
                $(id + tag_price).text(response.price);
            }
        });
    }

    /**
     * call in getAllPrice()
     * @param id
     * @param ticket
     * @returns {Promise<void>}
     */
    async function updateTickerMultiple(id, ticket) {
        var timerId = setInterval(function () {
            $.ajax({
                url: api_url + ticket,
                method: "GET",
                timeout: 0,
                beforeSend: function () {
                    $(id + tag_price).text('');
                    $(id + tag_inform).text('request...');
                    $('#updateall').val('Waiting');
                },
                success: function (response) {
                    $(id + tag_inform).text('');
                    $(id + tag_price).text(response.price);
                    $('#updateall').val('Update all');
                    clearInterval(timerId);
                }
            });
        }, 50)
    }

    /**
     * used for click button 'Update all'
     */
    function updateAllPrice(){
        for(var i=0; i<ticket_list.length;) {
            updateTickerMultiple('#' + id_list[i], ticket_list[i]);
            i++;
        }
    }

    /**
     * used for click button 'Compute all'
     */
    function computeAllPrice(){
        for(let i=0; i<ticket_list.length; i++) {
            let _id = '#' + id_list[i];
            let _ticket = ticket_list[i];
            updateTicker(_id, _ticket);
        }
    }

    /**
     * used for click button 'Fixprice all'
     */
    function fixAllPrice(){
        for(let i=0; i<ticket_list.length; i++) {
            let _id = '#' + id_list[i];
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
                //console.log('response: '+ response);
            },
            error: function (error) {
                //console.log('error: ', error);
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
                //console.log('response: ', response);
            },
            error: function (error) {
                //console.log('getDataBase.error: ', error);
            }
        });
    }

    // endregion database read / write

    // region compute percent, date

    /**
     * used in the button 'compute' individually
     * @param savprice
     * @param newprice
     * @returns {string}
     */
    function comparePrice(savprice, newprice) {
        let _savprice = parseFloat(savprice);
        let _newprice = parseFloat(newprice);
        var percentComplete = (((_newprice - _savprice) / _newprice) * 100).toFixed(2);

        //console.log('comparePrice._savprice: ' + _savprice);
        //console.log('comparePrice._newprice: ' + _newprice);
        //console.log('percentComplete: ' + percentComplete + '%');
        return percentComplete;
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
        //console.log('subtract: ', _subtract); //5860

        if(_subtract < 3600) {
            let _minute = parseInt(parseFloat(_subtract / 60).toString().split('.')[0]);
            out = _minute + ' ' + timing.min;
        }else if (_subtract < 3600*24) {
            let _hour = parseInt(parseFloat(_subtract / 3600).toString().split('.')[0]);
            if (_hour < 2 || (_hour >= 21 && _hour < 22))
                out = _hour + ' ' + timing.hour1;
            else if ((_hour >= 2 && _hour < 5) || (_hour >= 22 && _hour < 24))
                out = _hour + ' ' + timing.hour2;
            else if (_hour >= 5 && _hour < 21)
                out = _hour + ' ' + timing.hour3;
        }else if(_subtract >= 3600*24) {
            let _day = parseInt(parseFloat(_subtract / 3600*24).toString().split('.')[0]);
            if((_day >= 1 && _day < 2) || (_day >= 21 && _day < 22))
                out = _day + ' ' + timing.day1;
            else if((_day >= 2 && _day < 5) || (_day >= 22 && _day < 24) || _day === 31)
                out = _day + ' ' + timing.day2;
            else if((_day >= 5 && _day < 21) || (_day >= 25 && _day < 30))
                out = _day + ' ' + timing.day3;
            else if(_day > 31)
                out = ' ' + timing.month;
        }else {
            out = 'error';
        }
        return out;
    }

    // endregion compute percent, date

});