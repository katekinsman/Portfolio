<?php
  require('Blog1.php');
  require('Entry.php');
  $blog = new Blog();

  foreach ($blog->entries() as $entry) { ?>
    <article>
      <h4><?= $entry->title ?></h4>
      <div class="byline">
        by <?= $entry->author ?>
        on <?= date('M, $entry->timestamp); ?>
      </div>
      <div class="content">
        <?= $entry->content // __get() calls wiki2html to un-wikify content! ?>
      </div>
    </article>
  <?php } ?>