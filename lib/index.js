var fetch = require('./fetch')

document.body.innerHTML = '<table><tbody id="t"></tbody></table>'
var t = document.getElementById('t')

var ress = fetch.lastResults()
if (ress)
  t.innerHTML = ress.reverse().map(row).join('')

fetch().on('results', function(results) {
  console.log(results)
  t.innerHTML = results
    .reverse().map(row).join('') + t.innerHTML
})

function row(l) {
  return '<tr>' + [
    'owner',
    'label',
    'count',
    'updated',
    'description',
    'image',
    'id'
  ].map(function(k) { return cell(l[k]) }).join('') + '</tr>'
}

function cell(x) {
  return '<td>'+x+'</td>'
}
