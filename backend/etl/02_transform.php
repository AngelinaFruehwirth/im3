<?php 

$data = include('01_extract.php');

$transformed_data = [];

foreach ($data as $row) {
    $transformed_data[] = [
        'borough'        => $row['borough'],
        'complaint_type' => $row['complaint_type'],
        'descriptor'     => $row['descriptor'],
    ];
}


echo '<pre>';
print_r($transformed_data);
echo '</pre>';




