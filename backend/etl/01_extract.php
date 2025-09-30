<?php

function fetchNycData() {
    $url = "https://data.cityofnewyork.us/resource/erm2-nwe9.json";

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    curl_close($ch);

    return json_decode($response, true);
}

return fetchNycData();