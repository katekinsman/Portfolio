<?php
// twitter.php
// PHP script for Lab 3: Twitter Service
// INFO 344, Spring 2013
// Kate Kinsman

$username = 'kkinsman';
$password = 'zj6eNNu38tRu2';
$hostname = 'localhost'; // This will always need to be localhost on our server.
$database = 'kkinsman';

// Create a connection to the database.
$db = new PDO("mysql:dbname=$database;host=$hostname", $username, $password);

// Make any SQL syntax errors result in PHP errors.
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$DEBUG = true;
parse_str(file_get_contents('php://input'), $_POST);

/*
header('Content-Type: application/json');
$q = $db->prepare("SELECT * FROM tweets ORDER BY timestamp");
$q->execute();
$rows = $q->fetchAll(PDO::FETCH_ASSOC);
print json_encode($rows);
*/


switch ($_SERVER['REQUEST_METHOD']) {
   case 'GET':
		if(isset($_REQUEST['newer_than'])){
			$sql = "SELECT * FROM tweets WHERE timestamp > :t ORDER BY timestamp ASC";
			$params = array(':t' => $_REQUEST['newer_than']);

			$rows = query($sql, $params);

			// continue to poll the database as long as this query returns 0 results
			while (!count($rows)) {
				// wait a fixed amount of time in microseconds (100,000 μs = 100 ms = 0.1 s)
				usleep(300000);
				// make query again
				$rows = query($sql, $params);
			}
			// (When we get here, we've finally gotten results from the query.)

			// Compose an object that contains a timestamp and the data.
			$response = array(
				// Use the first row's timestamp for the timestamp of this response.
				// (The first row will be the newest since we did ORDER BY.)
				'newest_record' => $rows[0]['timestamp'],
				// The data itself.
				'results' => $rows
			);
		} else {
            // Fetch entire list of tweets.
            $response = query("SELECT * FROM tweets WHERE username IN (
                                  SELECT follower FROM followers WHERE username = :u
                               ) ORDER BY timestamp DESC");
        }
        output($response);
	   // [Perform SQL SELECT, then output the results as JSON...]
	   $query = "SELECT * FROM tweets ORDER BY timestamp";
	   $rows = query($query);
	   output($rows);


   case 'POST':

	   if (!isset($_REQUEST['tweet'])) {
		   http_die(400, "Invalid Request", "The parameter 'tweet' is required and missing.");
	   }

	   $sql = "INSERT INTO tweets (tweet, username, timestamp) VALUES (:t, :u, NOW())";
       $params = array(
           ':t' => $_REQUEST['tweet'],
           ':u' => $_REQUEST['username']
       );
	   $id = query($query, $params);

	   // [Perform SQL INSERT with provided data...]
	   $params2 = array(':id' => $id);
	   $query2 = "SELECT * FROM tweets WHERE id = :id";
	   $json = query($query2, $params2);

	   output($json);

}

function http_die($code, $status, $message) {
       header("HTTP/1.1 $code $status");
       header("Content-type: text/plain");
       die($message);
   }

function output($results) {
    $headers = apache_request_headers();
	if(isset($headers['Accept'])) {
		switch ($headers['Accept']) {
		  case 'application/xml':
			header('Content-type: application/xml');
			print xml_encode($results);
			print "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
			?>
			<tweets>
			<?php foreach ($data as $tweet) { ?>
			   <tweet id="<?= $tweet['id'] ?>" timestamp="<?= $tweet['timestamp'] ?>"><![CDATA[<?= $tweet['tweet'] ?>]]></tweet>
			<?php } ?>
			</tweets>
			<?php
			break;
		  case 'application/json':
			header('Content-type: application/json');
			print json_encode($results);
			break;
		}
	}
}
   
   
   // Perform the given SQL query, applying the supplied parameters (if any) to any
   // placeholder markers. Returns the entire resultset in the case of a SELECT query,
   // or the last inserted id in the case of an INSERT. Dies with an HTTP 500 error
   // if the query fails.
   function query($sql, $params = null) {
       global $db;
       try {
           // Prepare and execute the query.
           $q = $db->prepare($sql);
           $q->execute($params);
           // Get the last inserted id, if any. (Will be 0 if we did not perform an INSERT.)
           $id = $db->lastInsertId();
           $insert = substr($sql, 0, 6);
           if ($id && $insert == "INSERT") {
               // Return the last inserted ID.
               return $id;
           } else {
               // Return the entire resultset.
               return $q->fetchAll(PDO::FETCH_ASSOC);
           }
       } catch (PDOException $e) {
           // Something went wrong with the query. Die with an HTTP 500 error.
           if ($DEBUG) {
               // Specific error (for debugging only).
               http_die(500, "Internal Server Error", "There was an error with the SQL query:\n\n" . $e->getMessage());
           } else {
               // Vague error (for production).
               http_die(500, "Internal Server Error", "Something went wrong. Sorry.");
           }
       }
   }

?>

