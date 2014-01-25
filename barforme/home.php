<!DOCTYPE html>
<html>
	<head>
		<title>Bar For Me</title>
		<!-- Bootstrap -->
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js" type="text/javascript"></script>
		<script src="bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
		<script src="bar.js" type="text/javascript"></script>
		<link href="bootstrap/css/bootstrap.min.css" rel="stylesheet" media="screen">
	</head>
	<body>
		<div class='container'>
			<div class='page-header'>
			    <div class="hero-unit">
				    <a href="home.php"><h1>Bar For Me</h1></a>
				</div>
			</div>
			
			<form class="navbar-search pull-right">
	  			<input type="text" class="search-query" placeholder="Search">
			</form>
			
			<ul class='nav nav-tabs' id="mainTabs">
				<li><a href='#find'>Find Neighborhood</a></li>
				<li class='active'><a href='#search'>Bar Search</a></li>
				<li><a href='#deals'>Deals For Me</a></li>
			</ul>
			
			
			<div class='tab-content'>
				<div class='tab-pane' id='find'>
					<h2 class="text-center">Find Neighborhood Page</h2>
				</div>
				<div class='tab-pane active' id='search'>
					<?php
					if(!isset($_REQUEST['bar'])) {
						include('search.html');
					} else {
						include('bar.html');
					}
					?>
				</div>
				<div class='tab-pane' id='deals'>
					<h2 class="text-center">Deals Page</h2>
				</div>
			<div>
		</div>
	</body>
</html>