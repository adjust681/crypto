<?php
namespace crypto\includ\setting;
class Settings
{
    public static $binance_url = 'https://api.binance.com/api/v3/ticker/price?symbol=';

    public static $ticket_list = [
        'LTCUSDT', 'DOGEUSDT', 'NEOUSDT', 'SOLUSDT', 'XLMUSDT',
        'BTCUSDT', 'TRXUSDT', 'FILUSDT', 'HBARUSDT', 'XRPUSDT',
        'TONUSDT', 'NOTUSDT', 'DOGSUSDT', 'SHIBUSDT', 'DOTUSDT',
        'MASKUSDT', 'ASTRUSDT', 'PYTHUSDT', 'PEPEUSDT'
    ];

    /**
     * used index.php
     * in: ['LTCUSDT', ...]
     * out: ['ltc', ...]
     * @return array
     */
    public static function id_list(): array
    {
        $_id_list = [];
        for ($x = 0; $x < count(self::$ticket_list); $x++) {
            $_id_list[$x] = strtolower(str_replace('USDT', '', self::$ticket_list[$x]));
        }
        return $_id_list;
    }
}