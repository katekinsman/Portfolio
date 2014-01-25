<?php
  $BASE_URL = dirname($_SERVER['SCRIPT_NAME']);
  $cur_page = isset($_REQUEST['page']) ?
                $_REQUEST['page'] : 'home';
  $nav = json_decode(file_get_contents("site_contents.json"), true);
  $pageheader = $cur_page == 'home' ? '' : $nav['navigation'][$cur_page];
  $pagetitle =($cur_page == 'home' ? '' : "$pageheader -") .'My Website';
?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<!--
		template.html
		HTML template for Lab 5: Multi-Page Website
		INFO 344 Spring 2013
		Morgan Doocy
		-->
		<title><?= $pagetitle ?></title>
		
		<link href='http://fonts.googleapis.com/css?family=Droid+Sans:400,700' rel='stylesheet' type='text/css'>
		<link rel="stylesheet" href="<?= $BASE_URL ?>/styles.css">
		
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
		<script src="<?= $BASE_URL ?>/scripts.js"></script>
	</head>
	<body>
		<header>
			<h1><?= $pagetitle ?></h1>
		</header>
		
		<aside>
			<nav>
				<ul>
					<?php foreach ($nav['navigation'] as $pageid => $title) { ?>
						<li <?= $cur_page == $pageid ? 'class="current"' : ''; ?>>
							<a href="<?= $BASE_URL ?>/<?= $pageid ?>/"><?= $title ?></a>
							<?php if($pageid == 'portfolio'){ ?>
							<ul>
							    <?php if(isset($_REQUEST['client'])){
                                    foreach ($nav['clients'] as $client) {
                                        $saniClient = preg_replace("/ /", '-', $client);
                                        $saniClient = preg_replace("/&/", 'and', $saniClient);
                                        $saniClient = preg_replace("/,/", '', $saniClient);
                                        $saniClient = preg_replace("/\./", '', $saniClient);
                                        $saniClient = mb_strtolower($saniClient);  ?>
                                        <li>
                                            <a href="<?=$BASE_URL?>/portfolio/<?= $saniClient ?>"><?=
                                            $client?></a>
                                        </li>
                                    <?php }
                                }else{}?>
                            </ul>
                            <?php }else{} ?>
						</li>
					<?php } ?>
				</ul>
			</nav>
		</aside>
		
		<section id="main_content">
			<h2><?= $pageheader ?></h2>
			<!-- Begin contents of the page, to be loaded dynamically -->
			<?php
			global $cur_page;
			global $BASE_URL;
			$key = array_search($pageheader, $nav);
			include_once "$cur_page.php";
			?>
			<!-- End dynamic content -->
		</section>
		
		<footer><p>©2013 me.</p></footer>
	</body>
</html>
