<?php
  $nav = json_decode(file_get_contents("site_contents.json"), true);
?>

<?php
if(isset($_REQUEST['client'])){
    $client = $_REQUEST['client'];
    include_once "$client.php";
}else {?>
    <ul>
        <?php foreach ($nav['clients'] as $client) {
            $saniClient = preg_replace("/ /", '-', $client);
            $saniClient = preg_replace("/&/", 'and', $saniClient);
            $saniClient = preg_replace("/,/", '', $saniClient);
            $saniClient = preg_replace("/\./", '', $saniClient);
            $saniClient = mb_strtolower($saniClient);  ?>
            <li>
                <a href="<?= $BASE_URL ?>/portfolio/<?= $saniClient ?>/"><?= $client ?></a>
            </li>
        <?php } ?>
    </ul>
<?php } ?>