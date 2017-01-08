module.exports = (app)=>{
  app.get('/', (req, res)=>{
    res.sendFile('index.html', {root : './public/html'});
  });
  app.get('/signup', (req, res)=>{
    res.sendFile('signon.html', {root: './public/html'})
  })
  app.get('/signin', (req, res)=>{
    res.sendFile('signin.html', {root: './public/html'})
  })
}
