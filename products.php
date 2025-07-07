<?php
header("Content-Type: application/json");


$curl = curl_init();

curl_setopt_array($curl, array(
    CURLOPT_URL => "https://api.metalpriceapi.com/v1/latest?api_key=dd26e9b1695e7c8f328d809c20661ffe&base=XAU&currencies=USD",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
));

$response = curl_exec($curl);
curl_close($curl);

$data = json_decode($response, true);
$goldPriceUsdPerOunce = $data['rates']['USD'];
$goldPriceUsdPerGram = $goldPriceUsdPerOunce / 31.1035;
$goldPriceUsdPerOunce = $goldPriceUsdPerGram;


$jsonData = file_get_contents("products.json");
$products = json_decode($jsonData, true);


foreach ($products as &$product) {
    $popularityScore = $product["popularityScore"];
    $weight = $product["weight"];
    $product["price"] = calculatePrice($popularityScore, $weight, $goldPriceUsdPerOunce);
    $product["popularityScore"] = calculatePopularityScore($popularityScore);
}


function calculatePrice($popularityScore, $weight, $goldPrice)
{
    return round(($popularityScore + 1) * $weight * $goldPrice, 2);
}

function calculatePopularityScore($popularityScore)
{
    return round($popularityScore * 5, 1);
}


echo json_encode($products);
?>