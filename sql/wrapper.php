<?php
include_once __DIR__ . '/PriceSqlHelper.php';
use crypto\sql\helper\PriceSqlHelper;
$mysql = new PriceSqlHelper();

if (isset($_POST['post']) && isset($_POST['ticket']) && isset($_POST['price'])) {
    $res = $mysql->checkTicketRow($_POST['ticket']);
    if ($res) {
        $mysql->updateHistoryValue(intval(trim($res['id'])), time(), $_POST['price']);
        echo 'updateHistoryValue id: ' . $res['id'];
    } else {
        $mysql->insertHistory(time(), $_POST['ticket'], $_POST['price']);
        echo 'insertHistory price: ' . $_POST['ticket'];
    }
}

if (isset($_GET['get']) && isset($_GET['ticket'])) {
    $res = $mysql->checkTicketRow($_GET['ticket']);
    echo $res['date'] . '|' .  $res['price'];
}
