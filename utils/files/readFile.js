const testFile = require('./testFile')
const Issue = require('../../utils/issues').Issue
const fs = require('fs')
const isNode = typeof window === 'undefined'
/**
 * Read
 *
 * A helper method for reading file contents.
 * Takes a file object and a callback and calls
 * the callback with the binary contents of the
 * file as the only argument.
 *
 * In the browser the file should be a file object.
 * In node the file should be a path to a file.
 *
 */
function readFile(file) {
  return new Promise((resolve, reject) => {
    if (fs) {
      testFile(file, function(issue) {
        if (issue) {
          process.nextTick(function() {
            return reject(issue)
          })
        }
        fs.readFile(file.path, 'utf8', function(err, data) {
          process.nextTick(function() {
            return resolve(data)
          })
        })
      })
    } else {
      var reader = new FileReader()
      reader.onloadend = function(e) {
        if (e.target.readyState == FileReader.DONE) {
          if (!e.target.result) {
            return reject(new Issue({ code: 44, file: file }))
          }
          return resolve(e.target.result)
        }
      }
      reader.readAsBinaryString(file)
    }
  })
}

module.exports = readFile
