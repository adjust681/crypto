<?php
include_once __DIR__ . '/include/general_inc.php';
include_once __DIR__ . '/include/Settings.php';
use crypto\includ\setting\Settings;?>
<!DOCTYPE HTML>
<html lang='ru'>
<head>
    <title>crypto</title>
    <meta charset=utf-8>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
          integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="
          crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel='stylesheet' href='resources/css/main.min.css'/>
    <script src='script/js/jquery-2.1.3.min.js'></script>
    <script src='script/js/crypto.js'></script>
    <script>
        api_url = '<?= Settings::$binance_url; ?>';
        id_list = <?= json_encode(Settings::id_list()); ?>;
        ticket_list = <?= json_encode(Settings::$ticket_list); ?>;
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
                 echo "<li id='$id'>
                            <tc>$ticket</tc>
                            <inf></inf>
                            <prc></prc>
                            <span id='$id-cm' class='fa-solid fa-spinner fa-sm' title='Compute'></span>
                            <span id='$id-fx' class='fa-solid fa-arrow-right fa-sm left-25' title='Fix price'></span>
                            <pr id='$id-cm'>&nbsp;0.0%</pr>
                            <tm id='$id-tm'>&nbsp;-------</tm>
                      </li>";
            }
    echo '</ul>       
          <div id="computeall" class="fa-solid fa-spinner fa-sm grey" title="Compute all"></div>
          <div id="fixpriceall" class="fa-solid fa-arrow-right fa-sm left-25 grey" title="Fix all"></div>
          <div id="timer"><i id="min"></i>мин.<i id="sec"></i>сек.</div>
          </div>';?>
</content>
</body>
</html>
