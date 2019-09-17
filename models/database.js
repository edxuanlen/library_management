const mysql = require('mysql')
const config = require('../config/defaults')

const pool = mysql.createPool(config.mysql_info)

let query = function (sql, values) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log(err)
                reject(err)
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        console.log(err)
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release()
                })
            }
        })
    })
}

// pool.query("select * from `Course`", function(err, res, fields){
//     if(err) throw err;
//     for (i in res) {
//         console.log("the solution is ", res[i].cno)
//     }
// })

exports.query = query



// sql = "select * from ?? where ?? = ?"
// var inserts = ['Users', 'email', email]
// sql = mysql.format(sql, inserts) // select * from users where id = 1

// var result = await query(sql)    // console.log(result);


// sql = "insert into Users ( `name`, `email`, `code` ) values   (?, ?, ?  )
// var inserts = [name, email, code]


// sql = "update Users set ?? = ?, ?? = ? where ?? = ?"

