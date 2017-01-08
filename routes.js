module.exports = (app)=>{
  app.get('/', (req, res)=>{
    res.sendFile('index.html', {root : './public/html'});
  });
  app.get('/signup', (req, res)=>{
    res.sendFile('signup.html', {root: './public/html'})
  })
}
