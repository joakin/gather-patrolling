var JSONP = require('browser-jsonp')
var EventEmitter = require('events').EventEmitter

var INTERVAL = 5000

var events = new EventEmitter()

exports = module.exports = function() {
  // Get last result from localstorage
  var lastTime = lastCheck()
  if (!lastTime || Date.now() - lastTime > INTERVAL) {
    bringResults()
  } else {
    setTimeout(bringResults, INTERVAL)
  }
  return events
}

var hosts = exports.hosts = {
  en: 'http://en.wikipedia.org'
}

function get(host, continues, next) {
  JSONP({
    url: host + '/w/api.php',
    data: {
      action: 'query',
      format: 'json',
      list: 'lists',
      lstlimit: 20,
      lstmode: 'allpublic',
      lstprop: [
        'label', 'description', 'public', 'image',
        'count', 'updated', 'owner'
      ].join('|'),
      continues: continues
    },
    success: next.bind(null, null),
    error: next
  });
}

function bringResults() {
  get(hosts.en, '', function(err, res) {
    if (err) window.alert(JSON.stringify(err, null, 2))
    var lastRes = lastResults()||[]
    var results = res.query.lists.reverse()
    if (lastRes && lastRes.length)
      results = getNewResults(res.query.lists)
    else
      lastCheck(Date.now())
    if (results.length) {
      lastResults(lastRes.concat(results))
      events.emit('results', results)
    }
    setTimeout(bringResults, INTERVAL)
  })
}

function getNewResults(results) {
  var lastTime = lastCheck() || 0
  var newResults = results.reduce(function(a, list) {
    var date = new Date(list.updated).getTime()
    if (date > lastTime) {
      a.push(list)
      lastTime = date
    }
    return a;
  }, [])
  lastCheck(lastTime)
  return newResults
}

function prop(key, value) {
  if (value) localStorage.setItem(key, JSON.stringify(value))
  else return JSON.parse(localStorage.getItem(key))
}

function lastCheck(check) { return prop('last-check', check) }
function lastResults(results) { return prop('last-results', results) }
exports.lastResults = lastResults


