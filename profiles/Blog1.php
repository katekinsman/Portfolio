class Blog {
    $username = 'kkinsman';
    $password = 'zj6eNNu38tRu2';
    $hostname = 'localhost';
    $database = 'kkinsman';

  private $db;

  public function __construct() {
    $this->db = new PDO(
      "mysql:dbname={$this->database};host={$this->hostname}",
       $this->username, $this->password
    );
    $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  }

  public function entries($limit = null) {
    $sql = "SELECT * FROM entries ORDER BY timestamp DESC";
    $replacements = null;
    if ($limit) {
      $sql .= " LIMIT :l";
      $replacements = array(':l' => $limit);
    }
    $rows = $this->query($sql, $replacements);
    $entries = array();
    foreach ($rows as $row) {
      array_push($entries, new Entry($row, $this));
    }
    return $entries;
  }
  public function add($entry) {
    $replacements = array(
      ':t' => $entry->title,
      ':a' => $entry->author,
      ':c' => $entry->content,
    );
    $this->query(
      "INSERT INTO entries (title, author, contents, timestamp)
       VALUES (:t, :a, :c, UNIX_TIMESTAMP(NOW()))", $replacements
    );
  }

  public function update($entry) {
    $replacements = array(
      ':i' => $entry->id,
      ':t' => $entry->title,
      ':a' => $entry->author,
      ':c' => $entry->content,
    );
    $this->query("UPDATE entries SET
                  title = :t, author = :a, contents = :c
                  WHERE id = :i", $replacements);
  }

  private function query($sql, $params = null) {
    $q = $this->db->prepare($sql);
    $q->execute($params);
    $id = $this->db->lastInsertId();
    if ($id && stristr($sql, 'insert')) {
      return $id;
    } else if (stristr($sql, 'select')) {
      return $q->fetchAll(PDO::FETCH_ASSOC);
    }
  }
}