#!/usr/bin/env node

const { execSync } = require('node:child_process');

/**
 * Prints and returns updates and notifications that are relevant to a current
 *     user of this package. It is styled as a newspaper where each article is a
 *     notification.
 * */

/**
 * TODO:
 * - Show a different banner on the pre-installation page and
 *   post-installation page. "There's something you should know"? "Supplementary
 *   material"?
 * */

// Run the code when it's called as an executable
if (require.main === module) {
  /**
   * Accept command line args to return a string representing html for updates
   *     about ALKiln and ALKilnInThePlayground or about mismatches between
   *     ALKiln and ALKilnInThePlayground versions or an error.
   * 
   * @param {str} [alkiln_current_version] Command line arg. The author's
   *     server's current version of ALKiln
   * @param {str} [alkiln_desired_version] Command line arg. A version of ALKiln
   *     the author is trying to update to
   * @param {str} [alkip_version] Command line arg. An author's server's current
   *     version of ALKilnInThePlayground
   * 
   * @returns {str} String of html of updates or error object. I assume it can't
   *     be used.
   * 
   * Examples of running the file:
   * node lib/breaking_news.js --alkiln_desired_version=5.15.0 --alkip_version=1.3.1
   * node lib/breaking_news.js --alkiln_current_version=5.15.0 --alkip_version=1.4.1
   * 
   * Examples of running the package.json script for linux-based OSs:
   * npm run news -- --alkiln_desired_version=5.15.0 --alkip_version=1.3.1
   * npm run news -- --alkiln_desired_version=5.15.1 --alkip_version=1.3.0
   * npm run news -- --alkiln_current_version=5.15.0 --alkip_version=1.4.1
   * 
   * Windows-based Oss may need different syntax for running the package.json script:
   * npm run news -- -- --alkiln_desired_version=5.15.0 --alkip_version=1.3.1
   * npm run news -- -- --alkiln_desired_version=5.15.1 --alkip_version=1.3.0
   * npm run news -- -- --alkiln_current_version=5.15.0 --alkip_version=1.4.1
   * See https://stackoverflow.com/a/65530483/14144258
   * 
   * Example of process.argv: 
   * [
   *   '/Users/me/.nvm/versions/node/v18.17.0/bin/node'
   *   '/Users/me/code/alkiln/lib/breaking_news.js'
   *   '--alkiln_desired_version=6.20.0'
   *   '--alkip_version=1.0.0'
   * ]
   * */
  const argv = require(`minimist`)( process.argv.slice(2) );
  let {
    alkiln_desired_version,
    alkiln_current_version,
    alkip_version,
  } = argv;

  let news = try_to_break_the_news_gently({
    alkiln_desired_version,
    alkiln_current_version,
    alkip_version,
  });
  return news;
}

// Export the function if it is being imported
module.exports = { try_to_break_the_news_gently };


function try_to_break_the_news_gently({
    alkiln_desired_version,
    alkiln_current_version,
    alkip_version,
  } = {}) {
  /**
   * Returns a string representing html for updates about ALKiln and
   *     ALKilnInThePlayground or about mismatches between ALKiln and
   *     ALKilnInThePlayground versions or a string representing an error
   *     object.
   * 
   * Note that the function prints the value to the console before returning the
   *     value. This is the only way ALKilnInThePlayground can get the value.
   * 
   * @param {str} [alkiln_current_version] The author's server's current version
   *     of ALKiln
   * @param {str} [alkiln_desired_version] A version of ALKiln the author is
   *     trying to update to
   * @param {str} [alkip_version] An author's server's current version of
   *     ALKilnInThePlayground
   * 
   * @returns {str} String of html of updates or error object.
   * 
   * Examples:
   * try_to_break_the_news_gently({ alkiln_desired_version: "5.15.0", alkip_version: "1.3.1" })
   * try_to_break_the_news_gently({ alkiln_desired_version: "5.15.1", alkip_version: "1.3.0" })
   * try_to_break_the_news_gently({ alkiln_current_version: "5.15.0", alkip_version: "1.4.0" })
   * try_to_break_the_news_gently({ alkiln_current_version: "5.15.0", alkip_version: "1.4.1" })
   * try_to_break_the_news_gently()
   * */
  let news = null;
  try {
    news_str = break_the_news({
      alkiln_desired_version,
      alkiln_current_version,
      alkip_version,
    });

  } catch ( breaking_news_error ) {

    let code = `ALK0279`;
    news_str = JSON.stringify({
      ok: false, code: code, types: `note`,
      error: `🖊️ ${ code } NOTE breaking news: Unable to break any news.\n${ breaking_news_error.stack }\n`
    });
  }

  let alkip_str = news_str + `\n`;
  if (require.main === module) { process.stdout.write( alkip_str ); }
  return news_str;
}


function break_the_news({
    alkiln_desired_version,
    alkiln_current_version,
    alkip_version,
  }) {
  /**
   * Returns a string representing html for updates about ALKiln and
   *     ALKilnInThePlayground or about mismatches between ALKiln and
   *     ALKilnInThePlayground versions. The string may say that there are none
   *     of those that are currently relevant.
   * 
   * Discuss: Should we integrate Log into here for, e.g., debugging?
   * 
   * @param {str} [alkiln_current_version] The author's server's current version
   *     of ALKiln
   * @param {str} [alkiln_desired_version] A version of ALKiln the author is
   *     trying to update to
   * @param {str} [alkip_version] An author's server's current version of
   *     ALKilnInThePlayground
   * 
   * @returns HTML string of the notifications to show the author styled as a
   *     newspaper. May be a notification of no notifications.
   * 
   * Examples:
   * break_the_news({ alkiln_desired_version: "5.15.0", alkip_version: "1.3.1" })
   * break_the_news({ alkiln_desired_version: "5.15.1", alkip_version: "1.3.0" })
   * break_the_news({ alkiln_current_version: "5.15.0", alkip_version: "1.4.0" })
   * break_the_news({ alkiln_current_version: "5.15.0", alkip_version: "1.4.1" })
   * break_the_news({})
   * */
  let alkiln_desired_semver = get_semver_parts( alkiln_desired_version );
  let alkiln_current_semver = get_semver_parts( alkiln_current_version );
  let alkip_semver = get_semver_parts( alkip_version );

  // Hard-coded metadata for "article" (notification) categories
  // Discuss: Abstract `notification_types`?
  let notification_types = {
    feature: {
      // This icon won't show up well on a light background
      icon: `✨`, short: "Feature", body: `New feature`, types: `feature info news`,
      subheads: [
        `A new feature is here!`,
        `A new feature is sweeping the nation`,
        `"I can't imagine living without this feature!"`,
        `Everyone is talking about this new feature`,
        `Do your neighbors already have this feature?`,
        `"Wow. This feature. Just wow."`,
        `"This feature made my day"`,
        `When will you get your hands on this feature?`,
        `A new feature for you to savor`,
      ],
    },
    fix: {
      icon: `🛠️`, short: "Fix", body: `Bug fix`, types: `fix warning news`,
      subheads: [
        `"Gosh was I happy to get this fix!"`,
        `9 out of 10 doctors agree—this fix is top notch`,
        `"This fix came just in time for my wedding!"`,
        `"It's darn time to squash this bug"`,
        `Squash one bug a day—that's when we slay`,
        // `Don't go astray, squash one bug a day`,
        `Squash one bug a week—now that's some cheek`,
        `Squash one bug biweekly—that's getting sneaky`,
        `Squash one bug a month when we're under a crunch`,
        `Squash one bug a year, almost perfect my dear`,
      ],
    },
    versions: {
      icon: `🔀`, short: "Version mismatch", body: `ALKiln and ALKilnInThePlayground have misaligned versions`, types: `versions warning news`,
      subheads: [
        `City under threat of version confusion`,
        `"Was that your version or mine?"`,
        `Versions under pressure!`,
        `On a roll with version control`,
        `"My folks told me to choose my versions wisely."`,
        `Mayor warns: "Watch those versions!"`,
        `"Got my versions crossed and this solved it"`,
      ],
    },
    newsless: {
      icon: `🌈`, short: `No news`, body: `No news`, types: `info news`,
      subheads: [ `When news doesn't break and no one can hear it, does it make a sound?`, ],
    },
  }

  // Hard-coded logic and data for articles and whether they should be included
  // Discuss: abstract `articles_data`?
  let articles_data = [
    {
      // This first one is for testing and will never be seen in real runs—
      //     Authors would need to update ALKiP > 1.3.x, ALKiln > 5.15.1 to see
      //     this article at which point `relevant` would be `false`.

     // * npm run news -- --alkiln_desired_version=5.15.0 --alkip_version=1.3.1
     // * node lib/breaking_news.js --alkiln_desired_version=5.15.0 --alkip_version=1.3.1
      headline: `Generate randomized tests`,
      body: [`Install ALKiln <span class="version">5.15.0</span> or above on your server to create the new <a target="_blank" href="https://assemblyline.suffolklitlab.org/docs/components/ALKiln/writing/#constrained_random">constrained randomized test generator table</a>. An author can make a generator ".feature" file. In that file, an author can write a table that contains many possible interview answers. ALKiln can generates many tests by picking random answers from that table. ALKiln then saves and runs those tests. Follow the instructions in the linked documentation to create a generator ".feature" file. If you are seeing this announcement then something has gone wrong. This shouldn't be possible. Find your closest developer and report this to them at once.`],
      relevant: (
        none_are_null( alkiln_desired_semver, alkip_semver )
        && (
          (
            semver_a_more_recent_than_b( alkiln_desired_semver, [5, 15, 0] )  // ex: 5.15.1
            || semver_a_same_as_b( alkiln_desired_semver, [5, 15, 0] )  // ex: 5.15.0
          ) && (
            semver_a_less_recent_than_b( alkip_semver, [1, 4, 0] )  // ex: 1.4.0
          )
        )
      ),
      log_code: `ALK0280`,
      date_written: `July 22, 2025`,
      version_at_publication: `5.15.1`,
      publication_volume: 1,
      notification_types: [ notification_types.versions ],
    },
    {
      // This one is impossible too. Breaking news won't appear till ALKiln >=
      //     5.15.1 and ALKip > 1.3.1
      headline: `Get ALKiln notifications`,
      body: [`Install ALKilnInThePlayground <span class="version">1.3.1</span> or above on your server to get updates about ALKiln and ALKilnInThePlayground. Then you can get notifications here about any mismatches between your ALKiln version and your ALKilnInThePlayground version, new features, bug fixes, and more. If you are seeing this announcement then something has gone wrong. This shouldn't be possible. Find your closest developer and report this to them at once.`],
      relevant: ( none_are_null( alkiln_current_semver, alkip_semver )
        && semver_a_less_recent_than_b( alkiln_current_semver, [5, 16, 0] )  // ex: 5.15.0
        && (
          semver_a_more_recent_than_b( alkip_semver, [1, 4, 0] )  // ex: 1.4.1
          || semver_a_same_as_b( alkip_semver, [1, 4, 0] )  // ex: 1.4.0
        )
      ),
      log_code: `ALK0281`,
      date_written: `July 22, 2025`,
      version_at_publication: `5.15.1`,
      publication_volume: 1,
      notification_types: [ notification_types.feature ],
    },
    {
      is_no_news_notification: true,
      headline: `Nothing to see here, folks`,
      body: [`No broken news. Probably.`],
      relevant: true,
      log_code: `ALK0278`,
      date_written: `Every day in hope`,
      version_at_publication: `All`,
      publication_volume: 1,
      notification_types: [ notification_types.newsless ],
    },
  ];

  let { articles_section, publication_volume } = get_relevant_articles_parts({ articles_data });

  let news = [
    `<div class="outer_limits">`, [
      `<div class="news layout">`, [
        // What is a masthead? The whole top? Each row that has metadata?
        ...get_top_masthead_parts(),
        `<h2 class="flag nameplate">The Furnace</h2>`,
        ...get_flag_masthead_parts({ publication_volume }),
        // BREAKING NEWS!!! with kerning adjustments
        `<div class="banner"><span class="smaller_right">BREA</span><span>K</span><span class='bigger_left bigger_right'>I</span><span class="bigger_left">N</span><span class="smaller_left">G</span> <span class="bigger_right">N</span>E<span>W</span><span class="smallest_left">S!!!</span></div>`,
        ...articles_section,
        `<footer class="footer">~ Every person, a universe ~</footer>`,
      ], `</div>`,
    ], `</div>`,
  ];

  let all_parts = wrap_inner_parts( ...get_css_and_svg(), news );
  let news_html = get_html( all_parts );
  return news_html;
}

// =============
// Helpers
// =============

function get_relevant_articles_parts({ articles_data }) {
  /**
   * Returns a nested list of HTML strings or lists of HTML strings or both for
   *     the articles for each relevant notification, as well as the most recent
   *     "publication volume" number.
   * 
   * @param {obj} obj - Named arguments
   * @param {arr} obj.articles_data - List of data for every possible "article"
   *     where an article is the data for notifications that might be useful to
   *     an author based on their current versions of ALKiln and
   *     ALKilnInThePlayground, or for other reasons.
   * @param {bool} [obj.articles_data[n].is_no_news_notification] - True if this
   *     is the notification that there is no relevant information for the
   *     author.
   * @param {str} obj.articles_data[n].headline - Short description of the
   *     content of the notification.
   * @param {arr} obj.articles_data[n].body - Paragraphs in the article
   * @param {bool} obj.articles_data[n].relevant - Whether to show the article
   * @param {str} obj.articles_data[n].log_code - ALKiln log code (see Log.js)
   * @param {str} obj.articles_data[n].date_written - Date the developer added
   *     the article to the file
   * @param {str} obj.articles_data[n].version_at_publication - Semver ALKiln
   *     version of the file when the developer added the article to the file
   * @param {int} obj.articles_data[n].publication_volume - Incrementing number
   *     identifying a group of articles that were published together. The
   *     volumes are incremented in chronological order.
   * @param {arr} obj.articles_data[n].notification_types - List of 1 or more
   *     objs containing metadata that could be useful for an article. For
   *     example, why this is being shown (e.g. because this is a new feature).
   * @param {str} obj.articles_data[n].notification_types[n].icon - UTF-8 emoji
   *     for this notification type
   * @param {str} obj.articles_data[n].notification_types[n].short - Summary of
   *     the notification type. E.g. "Feature".
   * @param {str} obj.articles_data[n].notification_types[n].body - Long
   *     description of the notification type
   * @param {str} obj.articles_data[n].notification_types[n].types -
   *     Space-separated categories for the notification type. Aligns with
   *     Log.js types. Discuss other possible property names.
   * @param {} obj.articles_data[n].notification_types[n].subheads - List of 1
   *     or more "news article" subheadings. These are flavor text.
   *
   * @returns {obj} obj - Named return values
   * @returns {arr} obj.articles_section - Nested lists of HTML strings or lists
   *     of HTML strings or both
   * @returns {int} obj.publication_volume - The number of the most recent group
   *     of published articles
   * */

  let articles_section = [];
  let subheads_used = {};
  let used_exclamation = false;
  let used_question = false;
  let used_quotes = false;
  let final_publication_volume = 0;
  for ( let article of articles_data ) {

    if ( !article.relevant ) { continue; }
    let there_is_some_news = articles_section.length > 0;
    if ( there_is_some_news && article.is_no_news_notification ) { continue; }

    let shuffled_subheads = get_shuffled_subheads({ article });

    let final_subhead = `We do what we must because we can`;
    for ( let subhead of shuffled_subheads ) {
      
      if ( subhead.includes(`!`) && used_exclamation ) { continue; }
      if ( subhead.includes(`?`) && used_question ) { continue; }
      if ( subhead.includes(`"`) && used_quotes ) { continue; }
      if ( subheads_used[ subhead ]) { continue; }

      if ( subhead.includes(`!`)) { used_exclamation = true; }
      if ( subhead.includes(`?`)) { used_question = true; }
      if ( subhead.includes(`"`)) { used_quotes = true; }

      final_subhead = subhead;
      subheads_used[ subhead ] = true;
    }

    if ( article.publication_volume > final_publication_volume ) {
      final_publication_volume = article.publication_volume
    }

    articles_section.push( get_one_articles_parts({ article: article, subhead: final_subhead }));
  }  // end for each article

  return {
    articles_section: wrap_articles({ articles: articles_section }),  // Discuss: the name of the returned object's property and the name of the articles variable should not be the same - `articles_section`
    publication_volume: final_publication_volume,
  };
};


function get_shuffled_subheads({ article }) {
  /**
   * Return a list of all the subheadings for all the notification_types for one article,
   *     shuffled into a pseudo random order.
   * 
   * @param {obj} obj - Named arguments
   * @param {obj} obj.article - Data for one alkiln notification
   * @param {arr} obj.article.notification_types - One or more notification type
   * @param {[str]} obj.article.notification_types[n].subheads - One or more
   *     possible article subheadings that come with this notification type
   * 
   * @returns {[str]} - Shuffled list of possible subheadings for this article
   * */

  let notification_types_subheads = [];
  for ( let one_notification_type of article.notification_types ) {
    notification_types_subheads = notification_types_subheads.concat( one_notification_type.subheads );
  }
  let shuffled_subheads = get_shuffled_copy(notification_types_subheads);

  return shuffled_subheads;
};


function get_shuffled_copy( to_shuffle ) {
  /**
   * Return a shuffled copy of `to_shuffle`. `to_shuffle` stays unchanged.
   * https://stackoverflow.com/a/2450976/14144258
   * 
   * @param {arr} to_shuffle - A list of 0 or more items to copy shallowly and
   *     shuffle
   * 
   * @returns {arr} - A shuffled copy of the given array
   * */
  let shuffled = [...to_shuffle];
  let current_index = shuffled.length;

  // While there remain elements to shuffle...
  while ( current_index != 0 ) {

    // Pick a remaining element...
    let random_index = Math.floor(Math.random() * current_index);
    current_index--;

    // And swap it with the current element.
    [ shuffled[current_index], shuffled[random_index] ] = [
      shuffled[random_index], shuffled[current_index] ];
  }
  return shuffled;
};


function get_one_articles_parts({ article, subhead }) {
  /**
   * Return the html parts of the appropriate article as a nested list
   * 
   * @param {obj} obj - Named arguments
   * @param {obj} obj.article - Data for the "article"/notification
   * @param {str} obj.article.headline - Summary of the notification
   * @param {[str]} obj.article.body - 1 or more paragraphs describing the
   *     notification
   * @param {str} obj.article.log_code - Unique identifier for this message
   * @param {str} obj.subhead - Flavor text for the "article"
   * 
   * @returns {[str | [...]]} - Strs and nested lists - the article html parts
   * */
  let article_parts = [
    `<div class="article">`,
    [
      `<h3 class="headline">${ article.headline }</h3>`,
      `<div class="subhead">${ subhead }</div>`,
      ...get_paragraphs({ paragraphs: article.body }),
      `<p class="byline">- Log code <span class="log_code">${ article.log_code }</span></p>`,
      // `<p class="body_copy date_written">Written: ${ article.date_written }</p>`,
    ],
    `</div>`,
  ];

  return article_parts;
};  // Ends get_one_articles_parts()


function get_paragraphs({ paragraphs }) {
  /**
   * Returns the same list of strs, but wrapped in appropriate html paragraphs
   * 
   * @param {obj} obj - Named arguments
   * @param {[str]} paragraphs - Text of the paragraphs of an article
   * 
   * @returns [str] - The same strings except wrapped in the appropriate html
   * */
  let html_paragraphs = [];
  for ( let one_paragraph of paragraphs ) {
    html_paragraphs.push(`<p class="body_copy">${ one_paragraph }</p>`);
  }
  return html_paragraphs;
};


function wrap_articles({ articles }) {
  /**
   * Returns the expanded articles list surrounded by the appropriate html tags
   *     to contain the articles
   * 
   * @param {obj} obj - Named arguments
   * @param {arr} obj.articles - List. The contents are irrelevant.
   * 
   * @returns {[str | [...]]} List of strs and nested lists of the same
   *     containing the given `articles`
   * */
  return [
    `<div class="articles">`,
    ...articles,
    `</div>`,
  ];
}


function get_top_masthead_parts() {
  /**
   * Return a list of the html parts of top-most broadsheet metadata
   * 
   * @returns {[str | [...]]} List of html strs and nested lists of the same
   * */

  // Discuss: Only have one slogan or pick from multiple slogan options?
  let slogans = [`Turning up the heat since 2020`];
  // Other possible options:
  // Baked well/Well baked/Baking well since...
  // Fired up since/Fired up in...
  // Strengthening good work since...

  return [
    `<div class="top_masthead">`,
    [
      `<span class="distributor">${ process.env.DISTRIBUTOR || "ALKilnInThePlayground" }</span>`,
      `<span class="slogan">${ slogans[ Math.floor( Math.random() * slogans.length )] }</span>`,
    ],
    `</div>`,
  ];
};


function get_flag_masthead_parts({ publication_volume }) {
  /** Return the html parts of the metadata (below the flag) as a nested list
   * 
   * @param {obj} obj - Named arguments
   * @param {str | int} obj.publication_volume - Volume of the latest printing
   * 
   * @returns [str | [...]] - List of the nested html parts of the flag masthead
   * */
  let { version, date } = get_data_for_the_last_change_in_this_file();
  return [
    `<div class="flag_masthead">`,
    [
      `<span><span class="price"><span class="amount">0</span><span class="cents">¢</span></span>/<span class="volume">Vol. ${ publication_volume }</span></span>`,
      `<span class="syndicate"><span>Via</span> <span class="name">ALKiln</span> <span class="version">v${ version }</span></span>`,
      `<span class="commit_date">${ date }</span>`,
    ],
    `</div>`,
  ];
};


function wrap_inner_parts() {
  /**
   * Return a list of the outermost html of the broadsheet bracketing the given
   *     arguments. Includes comments.
   * 
   * @param {[*]} arguments - Probably nested lists of strs and lists
   * 
   * @returns {[str, arguments, str]} - The expanded arguments sandwiched
   *     between the starting and ending html of the whole broadsheet
   * */
  return [
    `<!--
  Based on:
  - https://stackoverflow.com/a/62484130/14144258
  - https://github.com/SuffolkLITLab/docassemble-AssemblyLine-documentation/pull/499
  - https://codepen.io/chipChocolate/pen/yyaGWx

  See newspaper terms at
  - https://nieonline.com/coloradonie/downloads/journalism/GlossaryOfNewspaperTerms.pdf
  - https://blogs.bsu.edu/journalismworkshops/2016/06/07/newspaper-terms-to-know/
  - https://www.quia.com/jg/1261398list.html
  - https://www.slideshare.net/slideshow/newspaper-layout-and-features-of-front-page/238865354
  - https://www.juicyenglish.com/blog/elements-of-a-newspaper
  -->

  <!--
  Slogans:
  - Baked well/Well baked/Baking well since...
  - Fired up since/Fired up in...
  - Strengthening good work since...
  -->

  <div id="broadsheet" class="pullout_section">`,
    ...arguments,
    `</div>`,
  ];
};


function get_html( html_list ) {
  /**
   * Returns a flat list of strings
   * */
  let flattened = indent_and_flatten_html_list( html_list );
  return flattened.join(`\n`);
}


function indent_and_flatten_html_list( list_or_str, indent=0 ) {
  /** Return a list of lists or strings or both as a flat list of strings.
   *     If given a string, return a list with that string. In addition,
   *     each string will get indented by a number of spaces. The number of
   *     spaces increases as the lists become more deeply nested.
   * 
   * At the moment, this function only adds indentation to the start of each
   *     string. It doesn't handle indenting every new line.
   * 
   * Watch out—it's recursive.
   * 
   * Example:
   * foo = [ `<div>`, [ `<span>Some stuff</span>`, `<div>`, [ `<span>Other text</span>` ], </div> ], `</div>`, ]
   * console.log(indent_and_flatten_html_list(nested_html))
   * [ `<div>`, `  <span>Some stuff</span>`, `  <div>`, `    <span>Other text</span>`, `  </div>`, `</div>` ]
   * 
   * @param {[arr | str]} - List or string
   * @param {int >= 0} - Level of indentation (determines the number of spaces
   *     to put at the start of a string)
   * 
   * @returns {[str]} - List of 0 or more strings
   * */

  // Terminal case
  if ( typeof list_or_str === `string` ) {
    indent_str = `  `.repeat( indent );
    return [ indent_str + list_or_str ];
  }

  let flattened = [];
  for ( let nested_str_or_list of list_or_str ) {
    let result = indent_and_flatten_html_list(
      nested_str_or_list,
      indent + 1
    );
    // // .concat() feels evil because it accepts a string as well
    // flattened = flattened.concat( result );
    flattened.push( ...result );
  }
  
  return flattened;
}


function get_semver_parts( version_str ) {
  /** Given a semver (https://semver.org) formatted version string, return a
   *     list of ints, and possibly strings, that make up the parts of that
   *     version string. Otherwise returns null.
   * 
   * Note: This makes assumptions about our semver format:
   *     - There will be three or less `.` characters.
   *     - After the final period will come an integer which may be followed by
   *        - Nothing or
   *        - A `-` followed by other valid semver characters
   * 
   * @example
   * // returns [3, 1, 15, `feat-news-1`]
   * get_semver_parts(`3.1.15-feat-news-1`)
   * @example
   * // returns null
   * get_semver_parts(`3.a.15-feat-news-1`)
   * 
   * @param {str} version_str - See ./docs/version_formatting_rules.md
   * 
   * @returns {[int, int, ...int|str]} - Version as ints and maybe also strs.
   * */
  if ( !version_str || typeof( version_str ) !== `string` ) { return null; }

  let v_parts_strs = version_str.split(`.`);
  let initial_parts = strs_to_ints_or_strs( v_parts_strs );

  if ( initial_parts.length < 3 ) { return null; }
  if (
    typeof( initial_parts[0] ) !== `number`
    || typeof( initial_parts[1] ) !== `number` ) {
    return null;
  }

  let version_parts = [ initial_parts[0], initial_parts[1] ];

  // Handle "experimental" versions. E.g. "3.1.15-feat-news"
  if ( typeof( initial_parts[2] ) === `string`) {
    let patch_parts = split_around_first_dash( initial_parts[2] );
    let patch_num = str_to_int_or_str( patch_parts[0] );
    version_parts.push( patch_num, patch_parts[1] );

  } else if ( typeof( initial_parts[2] ) === `number`) {
    version_parts.push( initial_parts[2] );

  } else {
    return null;
  }

  return version_parts;
}


function strs_to_ints_or_strs( strs ) {
  /** Given a list of strings, turn each int string into an actual int and
   *     leaves the rest as-is.
   * 
   * @example
   * // returns [ 2, 10, 1 ]
   * strs_to_ints_or_strs([ `2`, `10`, `1` ])
   * 
   * @example
   * // returns [ 2, 10, `1-fix-typo` ]
   * strs_to_ints_or_strs([ `2`, `10`, `1-fix-typo` ])
   * 
   * @params {[str]} strs - Strings
   * 
   * @returns {[int|str]} - List of ints or strings or both
   * 
   * */
  let ints_and_or_strs = [];
  for ( let one_str of strs ) {
    ints_and_or_strs.push( str_to_int_or_str( one_str ));
  }

  return ints_and_or_strs;
}


function str_to_int_or_str( original_str ) {
  /** Converts a string to an int if it contains only digits. Otherwise, returns
   *     the original string.
   *
   * @param {str} original_str - The string to convert.
   * 
   * @returns {int|str} - An int if reasonable, otherwise the original string.
   */
  try {

    if ( includes_non_digit( original_str )) { return original_str; }
    return parseInt( original_str );

  } catch ( str_to_int_error ) {
    return original_str;
  }
}


function includes_non_digit( original_str ) {
  /** Returns whether the given string contains any non-digit characters.
   *
   * @param {str} original_str - The string to check.
   * 
   * @returns {bool} - true if the string has non-digit chars, otherwise false.
   */
  return original_str.match(/\D/);
}


function split_around_first_dash( original_str ) {
  /** Splits a string into two parts around the 1st dash (`-`). Excludes the
   *     dash itself.
   * 
   * @example
   * // returns [ 3, `feat-2` ]
   * split_around_first_dash( `3-feat-2` )
   *
   * @param {str} original_str - The string to be split.
   * 
   * @returns {[str, str]} - The str before the 1st dash and the str after.
   */
  let parts = original_str.match(/^([^-])-(.+)$/);
  return [ parts[1], parts[2] ];
}


function none_are_null( ...items ) {
  /** Returns true if all items are not `null`. Otherwise, returns false.
   *
   * @param {...*} items - The items to be checked.
   * 
   * @returns {bool} - true if none of the items are null, otherwise false.
   */
  return items.every(( item ) => { return item !== null; });
}


function semver_a_more_recent_than_b( semver_a, semver_b ) {
  /** Compares two semvers to see if the 1st semver is more recent than the 2nd.
   *
   * WARNING: This function doesn't differentiate well between different dev
   *     versions, as described in ./docs/version_formatting_rules.md
   *
   * @param {[int|str]} semver_a - The 1st semver (more recent semver?)
   * @param {[int|str]} semver_b - The 2nd semver.
   * 
   * @returns {bool} - true if semver_a is more recent than semver_b, otherwise
   *     false.
   */
  for ( let index = 0; index < semver_a.length; index++ ) {
    if ( semver_b[ index ] === undefined ) {
      // a is longer than b
      return true;
    }
    if ( semver_a[ index ] > semver_b[ index ] ) {
      return true;
    }
    if ( semver_a[ index ] < semver_b[ index ] ) {
      return false;
    }
  }

  return false;
}

function semver_a_less_recent_than_b( semver_a, semver_b ) {
  /** Compares two semvers to see if the 1st semver is less recent than the 2nd.
   *
   * @param {[int|str]} semver_a - The 1st semver (less recent semver?)
   * @param {[int|str]} semver_b - The 2nd semver.
   * 
   * @returns {bool} - true if semver_a is less recent than semver_b, otherwise
   *     false.
   */
  let is_less = true;
  if ( semver_a_more_recent_than_b( semver_a, semver_b )) {
    return false;
  }
  if ( semver_a_same_as_b( semver_a, semver_b )) {
    return false;
  }
  return true;
}


function semver_a_same_as_b( semver_a, semver_b ) {
  /** Compares two semver arrays to see if they are the same.
   *
   * @param {[int|str]} semver_a - The 1st semver as an array of ints &/or strs.
   * @param {[int|str]} semver_b - The 2nd semver as an array of ints &/or strs.
   * 
   * @returns {bool} - true if semver_a is the same as semver_b, otherwise
   *     false.
   * */
  let str_a = semver_a.join(``);
  let str_b = semver_b.join(``);
  return str_a === str_b;
}


function get_data_for_the_last_change_in_this_file() {
  /**
   * If possible, return the version of ALKiln when it last changed this file
   *     and the string of the date when it was changed. If that's not possible,
   *     return the current version and the current date.
   * 
   * @returns {{version: str, date: str}} - A version number & a formatted date
   * */
  try {
    // If we switch to module (import) instead of common (require), use
    // https://nodejs.org/api/esm.html#importmetafilename for file path
    let most_recent_file_sha = execSync(
      `git rev-list -1 HEAD -- "${ __filename }"`
    ).toString().trim();

    let package_json_str = execSync(
      `git show ${ most_recent_file_sha }:package.json`
    ).toString().trim();
    let package_json = JSON.parse( package_json_str );

    let date = get_commit_date({ sha: most_recent_file_sha });

    return {
      version: package_json.version,
      date,
    };

  } catch ( version_error ) {
    // We need the stdout to be clean, so we can't log errors unless debugging
    let date = new Date();
    let month_name = new Intl.DateTimeFormat("en-US", { month: "long" })
      .format( date );
    return {
      version: process.env.npm_package_version,
      date: `${ month_name } ${ date.getDate() }, ${ date.getFullYear() }`,
    };
  }
};


function get_commit_date({ sha }) {
  /** Return the date of the commit, nicely formatted (whatever that means)
   * 
   * Git params:
   * Date:
   * %-d  8   Day of the month as a decimal number. (Platform specific)
   * %B  September   Month as locale’s full name.
   * %Y  2013  Year with century as a decimal number.
   * --date="format-local:%B %-d, %Y"
   * 
   * Exclude diffs
   * --no-patch
   * 
   * Isolate date:
   * --pretty="%ad"
   * 
   * See:
   * https://git-scm.com/docs/git-log#:~:text=has%20no%20effect.-,%2D%2Ddate%3Dformat%3A...,-feeds%20the%20format
   * https://strftime.org/
   * https://git-scm.com/docs/git-log#Documentation/git-log.txt---no-patch
   * https://git-scm.com/docs/git-log#_commit_formatting
   * https://git-scm.com/docs/git-log#Documentation/git-log.txt-ad
   * 
   * Example:
   * git show 6346c169ee95270a8d6bd4c45eb975751bfe4383 --no-patch --pretty="%ad" --date="format-local:%B %-d, %Y"
   * 
   * @param {obj} obj - Named arguments
   * @param {str} obj.sha - Commit hash (sha) of a commit in this repo
   * 
   * @returns {str} - Formatted date: "<month name> <date int>, <4-digit year>"
   * */
  let full_month = `%B`, day_of_month_min_digits = `%-d`, year_4_digit = `%Y`;
  let date_format = `format-local:${ full_month } ${ day_of_month_min_digits }, ${ year_4_digit }`;
  let just_date = ` --no-patch --pretty="%ad" --date="${ date_format }"`;
  let date = execSync( `git show ${ sha } ${ just_date }` ).toString().trim();
  return date;
};


function get_css_and_svg() {
  /**
   * Return a list with 1 str - the css and svg of the page. These could be
   *     variables, but this avoids putting the variable definitions at the top
   *     of the page where they would cause a fair amount of scrolling.
   * 
   * Discuss: keep these, and possibly other hard-coded values in separate files
   * 
   * @returns {[str]} - List of 1 string for the css and svg html
   * */
  return [ `<style>
    @charset "UTF-8";

    #meta.notes {
      note: "@ charset only works at the top of a file. I'm keeping it here in case we decide to later generate a file for the css. Maybe with this method${":"} stackoverflow.com/a/217833/14144258"
    }

    body {
      margin: 0;
      padding: .05em;
    }

    #broadsheet {
      position: relative;
    }

    #meta.section.notes {
      note: "The above @charset makes sure the special utf-8 symbols I use in here will appear as I intend. See stackoverflow.com/questions/2526033/why-specify-charset-utf-8-in-your-css-file";
      note: "These 'notes' do nothing to the DOM. They're my way of avoiding CSS commenting (which I consider evil because you can't comment over other comments).";
    }

    #meta.section.notes {
      note: "Font stuff";
      note: "To pick font-family fallbacks, I tried fonts on my own computer (has custom fonts I can't differentiate from others) and found the ones that did actually appear and adjusted them with at-rule font-face so they each looked decent with line height etc.";
      note: "www.cssfontstack.com/";
      note: "fonts.google.com/knowledge/glossary/system_font_web_safe_font";
    }

    @font-face {
      note: "Example of possibly useful rules";
      font-family: local-font;
      src: local(Local Font);
      line-gap-override: 125%;
      ascent-override: 100%;
      size-adjust: 80%;
    }

    @font-face {
      font-family: "RockDown";
      src: local("Rockwell");
      ascent-override: 100%;
    }

    :root {
      note: "Font stuff";

      note: "Vars";
      --default-ink-color: dimgray;
      --ink-light-roc: color-mix(in srgb, var(--default-ink-color), white 5%);
      note: "RocDown is an font-face at-rule. I've tested the succession.";
      --default-font-family: RockDown, "Courier Bold", Courier, Georgia, Times, serif;

      note: "Styles";
      font-family: var(--default-font-family);
      font-size: 1.1rem;
      note: "Lighter or darker color can affect appearance of font thickness";
      color: var(--default-ink-color);
    }

    .flag {
      note: "font stuff";
      font-family: "Times", serif;
      font-size: 2.2em;
      font-variant-caps: small-caps;
    }

    .top_masthead {
      note: "Font stuff";
      font-size: .6em;
    }

    @font-face {
      font-family: "RockDown";
      src: local("Rockwell");
      ascent-override: 100%;
    }

    .flag_masthead {
      note: "Font stuff";
      font-size: .8em;
      line-height: 1.2em;
    }

    .price {
      note: "Font stuff";
      note: "Has a line through the 0. Can't do this for every 0, so maybe not a great idea, but it just doesn't look great otherwise.";
      font-family: Monaco, monospace;
      font-weight: bold;
      font-size: .95em;
      line-height: 1em;
    }

    .cents {
      note: "Font stuff";
      note: "Line goes all the way through the 'cents' character";
      font-family: Times, serif;
    }

    .banner {
      note: "Font stuff";
      font-family: Times, serif;
      font-size: 2em;
      transform: scaley(1.7);
      letter-spacing: 0.15em;
    }

    .headline {
      note: "Font stuff";
      note: "Georgia numbers look bad. Also tried Consolas, monaco, Baskerville(too thin), RockDown (font-face Rockwell)(too thick)";
      note: "No at-rule font-face needed. I've tested the succession.";
      font-family: Didot, "Hoefler Text", "Baskerville", "Times New Roman", Times, serif;
      font-weight: 100;
      letter-spacing: 0.1rem;
      font-size: 1.7em;
      line-height: 1em;
    }

    @font-face {
      note: "Font stuff";
      font-family: "RockThic";
      src: local("Rockwell Bold");
      ascent-override: 100%;
    }

    .subhead {
      note: "Font stuff";
      font-family: "RockThic", var(--default-font-family);
    }

    .article {
      note: "Font stuff";
      font-size: .8em;
      line-height: 1.3em;
    }

    .article p {
      note: "Font stuff";
      font-size: 1.1em;
      note: "Rejected${":"} Baskerville font-family";
      color: var(--ink-light-roc);
      letter-spacing: .05em;
      note: "overflow-wrap${":"} break-word;";
      note: "hyphens${":"} auto;";
      hyphens: auto;
    }

    .footer {
      note: "Font stuff";
      font-family: Times, serif;
      color: var(--ink-light-roc);
      font-variant-caps: all-small-caps;
      font-size: .8em;
      letter-spacing: .2em;
    }

    #meta.section.notes {
      note: "############################";
      note: "Not font stuff";
    }

    :root {
      note: "Not font stuff";
      --alkiln-page-dark: 181, 181, 181;
      --alkiln-page-light: 255, 255, 255;
    }

    .headline {
      note: "Not font stuff";
      text-align: center;
      margin: 0;
      margin-bottom: .2em;
    }

    .flag {
      note: "Not font stuff";
      margin: 0 auto;
      text-align: center;
      margin-top: -.4em;
      margin-top: .3em;
    }

    .top_masthead {
      note: "Not font stuff";
      position: relative;
      display: flex;
      justify-content: space-between;
    }

    .flag_masthead {
      note: "Not font stuff";
      display: flex;
      justify-content: space-between;
      padding-top: .1em;
      border-top: 1px solid var(--default-ink-color);
      border-bottom: 1px solid var(--default-ink-color);
    }

    .article p {
      note: "Not font stuff";
      margin-top: .5em;
    }

    .article p:has(+.byline) {
      margin-bottom: 0em;
    }

    .footer {
      note: "Not font stuff";
      display: flex;
      justify-content: center;
    }

    #meta.section.notes {
      note: "#####################";
      note: "Unordered";
    }

    body {
      note: "This doesn't look as good with a dark background"
      note: "Idea for dark mode${":"} chalkboard, black marque (like for bingo).";
    }

    .newsprint {
      position: absolute;
      z-index: -1;
    }

    .newsprint_texture, .newsprint_fill {
      width: 99.5%;
      height: 99.5%;
      width: calc(100% - 3px);
      height: calc(100% - 3px);
    }

    .news.artifacts {
      note: "Hide the actual text";
      color: transparent;
      width: 100%;
      height: 100%;
      padding: 0.4em 0.2em;
      margin: -0.4em -0.2em;
      note: "Create folds and shading";
      background: linear-gradient(
          104deg,
          rgba(var(--alkiln-page-dark), 0) 0.9%,
          rgba(var(--alkiln-page-dark), 1.25) 2.4%,
          rgba(var(--alkiln-page-dark), 0.5) 5.8%,
          rgba(var(--alkiln-page-dark), 0.1) 92%,
          rgba(var(--alkiln-page-dark), 0.7) 96%,
          rgba(var(--alkiln-page-dark), 0.31) 98%
        ),
        linear-gradient(
          183deg,
          rgba(var(--alkiln-page-dark), 0) 0%,
          rgba(var(--alkiln-page-dark), 0.3) 7.9%,
          rgba(var(--alkiln-page-dark), 0.05) 15%
        );
      note: "Create visual artifacts";
      text-shadow: -7px 0px 6px rgba(var(--alkiln-page-dark), .3), 21px -18.1px 4px rgba(var(--alkiln-page-light), .1);
      note: "WARNING${":"} background-size must come after background linear gradients";
      background-size: 99%;
    }

    .outer_limits {
      note: "Prevents the text shadows from bleeding out of the newsprint";
      overflow: hidden;
    }

    .news {
      width: 95%;
      margin: 0 auto;
      text-align: justify;
    }

    .layout {
      position: relative;
      left: -.1em;
      margin-top: .3em;
      padding-bottom: 1rem;
      text-shadow: -7px 0px 8px rgba(var(--alkiln-page-dark), .4), 21px -18.1px 4px rgba(var(--alkiln-page-light), .2), -4.1px -1.3px 5px rgba(var(--alkiln-page-light), 1);
    }

    .banner {
      text-align: center;
      margin-top: .6em;
      margin-bottom: .5em;
    }
    #meta.notes {
      note: "Font stuff? Banner kerning";
    }
    .banner .smaller_right {
      margin-right: -.02em;
    }
    .banner .bigger_right {
      margin-right: .03em;
    }
    .banner .bigger_left {
      margin-left: .02em;
    }
    .banner .smallest_left {
      margin-left: -.09em;
    }

    #meta.notes {
      note: "Grid layout";
    }
    .articles {
      width: 100%;
      display: grid;
      grid-template-columns: 53% 43%;
      gap: 4%;
      grid-auto-rows: minmax(100px, auto);
    }
    .article${":"}first-child {
      grid-column: span 1;
    }
    .article${":"}last-child {
      grid-column: span 1;
    }
    .article${":"}first-child${":"}last-child {
      note: "When there's only 1 column, fill the space";
      grid-column: span 2;
    }

    .subhead {
      note: "Not font stuff";
      text-align: center;
      border-top: 1px solid var(--default-ink-color);
      border-bottom: 1px solid var(--default-ink-color);
    }

    .article .byline {
      font-size: .9em;
    }

    a {
      text-decoration: underline;
      note: "why is cursor${":"} pointer necessary here? Why isn't it automatic as usual?";
      cursor: pointer;
    }
    a${":"}after {
      content: '⇱'/ 'external link';
      display: inline-block;
      transform: scale( -1, 1);
      font-size: 1lh;
    }
    a${":"}not(${":"}visited) {
      color: color-mix(in srgb, var(--ink-light-roc), blue 40%);
    }

    .article .version {
      note: "Makes version nums more visible";
      padding-left: .15em;
      padding-right: .15em;
      color: color-mix(in srgb, var(--default-ink-color), black 20%);
    }

  </style>

  <!-- Class "newsprint" is only one part of the texturing -->
  <svg class="newsprint mask" viewport="0 0 100% 100%" width="100%" height="100%">
    <defs>
      <filter id="turbulenceFilter">
        <feTurbulence baseFrequency="0.1" numOctaves="3" result="turbulence" />
        <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="2" />
      </filter>
      <mask id="raggedMask">
        <rect width="100%" height="100%" fill="black" />
        <rect class="newsprint_texture" fill="white" filter="url(#turbulenceFilter)" />
      </mask>
    </defs>

    <!-- Match effect when filling with white background -->
    <rect class="newsprint_fill" fill="white"  filter="url(#turbulenceFilter)" />

    <foreignObject width="100%" height="100%" mask="url(#raggedMask)">
      <div class="news artifacts" aria-hidden=true>
      <!-- Text much longer than we could ever need to create the "visual artifacts" of gray lines (text on the back of the page? printing artifacts?). -->
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
          in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
          in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
          in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem
          quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam
          eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit
          qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
          in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem
          quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam
          eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit.
          in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
          in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
          in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem
          qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.
        </p>
      </div>
    </foreignObject>
  </svg>` ];
};
