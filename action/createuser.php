<?php
session_start();
$username = $_POST['userName'];
$passWord = $_POST['passWord'];
$tel = $_POST['tel'];
$sex = $_POST['sex'];
$info = $_POST['info'];
$res = array(
	"data" => array(),
	"errno" => 0
);
echo json_encode($res);
?>