<?php
include_once __DIR__ . '/include/Settings.php';
use crypto\includ\setting\Settings;?>
<!DOCTYPE HTML>
<html lang='ru'>
<head>
    <title>crypto</title>
    <meta charset=utf-8>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.6.0/css/fontawesome.min.css"
          integrity="sha384-NvKbDTEnL+A8F/AA5Tc5kmMLSJHUO868P+lDtTpJIeQdGYaUIuLr4lVGOEA1OcMy" crossorigin="anonymous">
    <link rel='stylesheet' href='resources/css/main.min.css'/>
    <script src='script/js/jquery-2.1.3.min.js'></script>
    <script src='script/js/crypto.js'></script>
    <script>
        api_url = '<?= Settings::$binance_url; ?>';
        id_list = <?= json_encode(Settings::id_list()); ?>;
        ticket_list = <?= json_encode(Settings::$ticket_list); ?>;
        refreshTime = 600000;
        setInterval(function() { window.location.reload(1); }, refreshTime);
    </script>
</head>
<body>
<section>
    <noscript><p>Your browser does not support JavaScript!</p></noscript>
</section>
<content>
    <?php
    $_id_list = Settings::id_list();
    echo '<div class="crypto">
          <h3>Binance.com</h3>
          <ul>';
            for($x=0; $x<count(Settings::$ticket_list);$x++) {
                $id = $_id_list[$x];
                $ticket = str_replace('USDT', ' / USDT:', Settings::$ticket_list[$x]);
                 echo "<li id='$id'>$ticket
                            <inf></inf>
                            <prc></prc>
                            <span id='$id-cm' class='fa-solid fa-spinner fa-sm left-1' title='Compute'></span>
                            <span id='$id-fx' class='fa-solid fa-arrow-right fa-sm left-2' title='Fix price'></span>
                            <pr id='$id-cm'>&nbsp;0.0%</pr>
                            <tm id='$id-tm'>&nbsp;-------</tm>
                      </li>";
            }
    echo '</ul>
          <input type="submit" id="updateall" value="Update all" hidden=""/>
          <span id="computeall" class="fa-solid fa-spinner fa-sm left-1 grey" title="Compute all"></span>
          <span id="fixpriceall" class="fa-solid fa-arrow-right fa-sm left-2 grey" title="Fix all"></span>
          </div>';?>
</content>
</html>
