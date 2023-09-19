<?php

$x = isset($_GET['x']) ? floatval($_GET['x']) : null;
$y = isset($_GET['y']) ? floatval($_GET['y']) : null;
$r = isset($_GET['r']) ? floatval($_GET['r']) : null;
$currentTime = isset($_GET['timeClient']) ? $_GET['timeClient'] : null;
if ($currentTime === null) {
    $formattedTime = 'Нет данных'; // Здесь можно установить любое значение по умолчанию
} else {
    // Если $currentTime существует, то форматируем его как дату и время
    $formattedTime = date('H:i:s:ms', time() - $currentTime * 60);
}


session_start();
if (!check_values($x, $y, $r)) {
    http_response_code(400);
    return;
}
$res = check_area($x, $y, $r) ? "<span style='color: #439400'>Попала</span>" : "<span style='color: #94002D'>Не попала</span>";
$time = microtime(true) - $_SERVER["REQUEST_TIME_FLOAT"];

$resultData = [
    'x' => $x,
    'y' => $y,
    'r' => $r,
    'formattedTime' => $formattedTime,
    'time' => $time,
    'res' => $res,
];
$_SESSION['results'][] = $resultData;

function check_values($x, $y, $r)
{
    return in_array($x, [-1.5, -1.0, -0.5, 0.0, 0.5, 1.0, 1.5, 2.0])
        and is_numeric($y) and $y > -5 and $y < 5
        and in_array($r, [1.0, 1.5, 2.0, 2.5, 3.0]);
}

function check_area($x, $y, $r)
{
    if ($x == 0) {
        return ($y <= 0 and ($x * $x + $y * $y <= $r * $r / 4)) //часть окружности
            or ($y <= 0 and $y >= -$r); //прямоугольник;
    } else if ($x > 0) {
        return ($y >= 0 and $y <= -$x + $r); // треугольник
    } else return ($y >= 0 and ($x * $x + $y * $y <= $r * $r / 4)) //часть окружности
    or ($x >=  -$r/2 and $y<= 0 and $y >= -$r);
}

$jsonResult = json_encode($_SESSION['results']);
echo $jsonResult;
?>

