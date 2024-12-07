<?php
namespace crypto\sql\helper;
include_once __DIR__. '/../include/Config.php';
use crypto\includ\config\Config;
use Exception;
use PDO;
use PDOException;

class PriceSqlHelper
{
    /**
     * @return PDO
     */
    function getConn() {
        $conn = new PDO(Config::MYSQL_DSN, Config::MYSQL_USER,Config::MYSQL_PASSWORD);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conn;
    }

    /**
     * use wrapper.php | $check = $mysql->checkTicketRow($ticket);
     * @param $ticket | 'LTCUSDT'
     * @return Exception|mixed|PDOException | array
     */
    public function checkTicketRow($ticket){
        try {
            $conn = $this->getConn();
            $sql = "SELECT * FROM ".Config::MYSQL_TABLE_NAME." WHERE ticket='$ticket';";
            $statement = $conn->prepare($sql);
            $statement->execute();
            $result = $statement->fetch();
            $conn = NULL;
            return $result;
        } catch (PDOException $e) {
            $conn = NULL;
            return NULL;
        }
    }

    /**
     * use from wrapper.php | $mysql->insertHistory(time(), $ticket, $price);
     * @param $date | 1733334729
     * @param $ticket | 'LTCUSDT'
     * @param $price | '125.28000000'
     * @return string | void
     */
    public function insertHistory($date, $ticket, $price){
        try {
            $conn = $this->getConn();
            $statement = $conn->prepare("INSERT INTO ".Config::MYSQL_TABLE_NAME." (date, ticket, price) VALUES (?,?,?)");
            $statement->execute(array($date, $ticket, $price));
            $conn = null;
            return 'ok';
        } catch (PDOException $ex) {
            $conn = null;
            return $ex->getMessage();
        }
    }

    /**
     * use wrapper.php | $mysql->updateHistoryValue($check['id'], time(), $price);
     * @param $id | 1
     * @param $date | time()
     * @param $price | '125.28000000'
     * @return void
     */
    public function updateHistoryValue($id, $date, $price){
        try {
            $conn = $this->getConn();
            $statement = $conn->prepare("UPDATE ".Config::MYSQL_TABLE_NAME." SET date=?, price=? WHERE id=$id");
            $statement->execute(array($date, $price));
            $conn = null;
        }catch (PDOException $e) { $conn = null; }
    }


}