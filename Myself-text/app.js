const express = require('express')
const mysql = require('mysql')
const moment = require('moment')
// 引入中间件
const bodyParser = require('body-parser')

// 1.创建express服务器
const app =express()

//16.连接mysql服务器
const conn = mysql.createConnection({
    host: '127.0.0.1',
    database: 'my_blog',
    user: 'root',
    password: 'root'
})



// 2.设置默认采用的模板引擎名称
app.set('view engine', 'ejs')

//3.设置默认模板引擎存放的路径
app.set('views', './views')
  
//15.注册解析表单数据的中间件
app.use(bodyParser.urlencoded({ extended: false}))


//7.将node_modules托管为静态资源目录，这样茨木露露下面的文件都可以被访问
app.use('/node_modules', express.static('./node_modules'))

//6.监听客户传来的数据
app.get('/', (req, res) => {
    res.render('index.ejs', {})
})


//8.当用户请求的是登录页面的时候
app.get('/login', (req, res) => {
    res.render('./user/login.ejs', {})
})

//9.当用户请求的是注册页面的时候
app.get('/register', (req, res) => {
    res.render('./user/register', {})
})

//10.当用户注册页面的时候
app.post('/register', (req, res) => {
    //16.拿到用户传过来的数据
    const body = req.body
    // console.log(body)
    //验证用户提交过来的数据是否完整
    if(body.username.trim().length <= 0 || body.password.trim().length <= 0 || body.nickname.trim().length <= 0) {
        res.send({msg: '请填写完整的表单数据后在提交', status: 501})
    }
    //17.查询用户名是否重复
    const sql1 = 'select count(*) as count from my_blog1 where username = ?'
   //连接数据库
   conn.query(sql1, body.username, (err, result) => {
       //如果查询失败，则告诉用户查询失败
       if (err) return res.send({msg: '查重失败', status: 502})
    //    console.log(result)
    if(result[0].count !== 0) return res.send({msg: '注册名重复，请更换', status: 503})
    body.ctime = moment().format('YYYY-MM-DD HH:mm:ss') 
    
    const sql2 = 'insert into my_blog1 set ?'
    console.log(body)
    conn.query(sql2, body, (err, result) => {
        // if(err) return res.send({msg: })
        console.log(err)

    })
   })
    // res.send({msg: '注册用户成功', status: 200})
})

//5.启动服务器
app.listen(80, () => {
    console.log('server runing at http://127.0.0.1')
})