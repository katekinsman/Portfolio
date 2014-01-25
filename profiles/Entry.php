class Entry {
  private $id;
  public $title, $author, $timestamp;
  private $blog;

  public function __construct($entry = array(), $blog) {
    $this->blog = $blog;
    foreach ($entry as $field => $value) {
      $this->$field = $value;
    }
  }

  public function __get($field) {
    switch ($field) {
      case 'title':
      case 'author':
        return $this->$field;
        break;
      case 'content':
        // interpret wiki text in this entry's content
        return $this->wiki2html($this->content);
    }
  }
  public function save() {
    if ($this->id) {
      $this->blog->update($this);
    } else {
      $this->blog->add($this);
    }
  }

  private function wiki2html($text) {
    $text = preg_replace("/'''(.*?)'''/", '<strong>$1</strong>', $text);
    $text = preg_replace("/''(.*?)''/", '<em>$1</em>', $text);

    $text = str_replace("\r\n\r\n", '</p><p>', $text);
    $text = '<p>'.$text.'</p>';
    return $text;
  }
}
