<!DOCTYPE html>

<?php
    $cur_page = isset($_REQUEST['page']) ? $_REQUEST['page'] : 'home';
    $nav = json_decode(file_get_contents("site_contents.json"), true);
    $pageheader = ($cur_page == 'home' ? $nav['navigation'][$cur_page] : "Kate Kinsman - $pageheader");
    $pagetitle =($cur_page == 'home' ? $pageheader : "Kate Kinsman - $pageheader");
?>

<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title><?= $pagetitle ?></title>

    <link rel="stylesheet" href="foundation-5.4.5.custom/css/foundation.css" />
    <script src="foundation-5.4.5.custom/js/vendor/modernizr.js"></script>

    <link href="style.css" type="text/css" rel="stylesheet">
    <link href='http://fonts.googleapis.com/css?family=Quicksand:300,400,700' rel='stylesheet' type='text/css'>
</head>

<body>

<nav class="top-bar" data-topbar role="navigation" data-options="is_hover: false">
    <ul class="title-area">
        <li class="name">
            <h1><a href="index.php?page=home">Kate Kinsman</a></h1>
        </li>
        <li class="toggle-topbar menu-icon">
            <a href="#"><span></span></a>
        </li>
    </ul>

    <section class="top-bar-section">
        <!-- Right Nav Section -->
        <ul class="right hidden-for-small-only">
        <?php foreach ($nav['social'] as $media => $url) { ?>
            <li>
                <a href="<?= $url ?>">
                    <img src="<?= $media ?>32.png" alt="<?= $media ?>">
                </a>
            </li>
            <?php } ?>
        </ul>

        <!-- Left Nav Section -->
        <ul class="left">
        <?php foreach ($nav['navigation'] as $pageid => $title) { ?>
            <li>
                <a href="/index.php?page=<?= $pageid ?>"><?= $title ?></a>
            </li>
        <?php } ?>
        </ul>
    </section>
</nav>

<main>
<!-- Begin contents of the page, to be loaded dynamically -->
<?php
    include_once "$cur_page.php";
?>
<!-- End dynamic content -->
</main>

<footer>
    <div class="row inline-list show-for-small-only">
        <?php foreach ($nav['social'] as $media => $url) { ?>
        <div class="small-3 column">
            <a href="<?= $url ?>">
                <img src="<?= $media ?>32.png" alt="<?= $media ?>">
            </a>
        </div>
        <?php } ?>
    </div>
    <p>&copy;2014 Kate Kinsman</p>
</footer>

<script src="foundation-5.4.5.custom/js/vendor/jquery.js"></script>
<script src="foundation-5.4.5.custom/js/foundation.min.js"></script>
<script>
    $(document).foundation();
</script>
</body>

</html>