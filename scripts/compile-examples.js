const fs = require('fs');
const path = require('path');

const Handlebars = require('handlebars');

const EXAMPLES_DIR = './src/examples';
const OUTPUT_DIR = './examples';
const STANDALONE_OUTPUT_DIR = OUTPUT_DIR + '/standalone';

const CONFIG_PATH = EXAMPLES_DIR + '/config.json';

const CONTENT_DIR = EXAMPLES_DIR + '/content';
const LAYOUT_DIR = EXAMPLES_DIR + '/layout';
const DEFAULT_LAYOUT_PATH = LAYOUT_DIR + '/default.hbs';
const STANDALONE_LAYOUT_PATH = LAYOUT_DIR + '/standalone.hbs';

function render(filename, data) {
  const source = fs.readFileSync(filename, 'utf8');
  return Handlebars.compile(source)(data);
}

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

config.pages.forEach(function (page) {
  const data = Object.assign({ pages: config.pages }, page);
  const templateFileName = page.key + '.hbs';
  const pageFileName = page.key + '.html';

  const content = fs.readFileSync(path.join(CONTENT_DIR, templateFileName), 'utf8');
  Handlebars.registerPartial('content', content);

  Handlebars.registerHelper('activePage', function (key, options) {
    return key === page.key ? options.fn(this) : options.inverse(this);
  });

  const defaultPage = render(DEFAULT_LAYOUT_PATH, data);
  const standalonePage = render(STANDALONE_LAYOUT_PATH, data);

  fs.writeFileSync(path.join(OUTPUT_DIR, pageFileName), defaultPage);
  fs.writeFileSync(path.join(STANDALONE_OUTPUT_DIR, pageFileName), standalonePage);
});
