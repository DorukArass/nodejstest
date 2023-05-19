const express = require('express');
const mysql = require('mysql');
const path = require('path');
const json2xls = require('json2xls');
const fs = require('fs');

const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'dorukaras',
  password: 'dorukaras123',
  database: 'formveriler'
});

connection.connect((err) => {
  if (err) {
    console.error('Veritabanına bağlanılamadı: ' + err.stack);
    return;
  }
  console.log('Veritabanı bağlantısı başarılı.');
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/veriler', (req, res) => {
  const query = 'SELECT * FROM veriler';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Veriler alınırken bir hata oluştu: ' + error.stack);
      return res.status(00).json({ message: 'Veriler alınırken bir hata oluştu' });
    }
    return res.status(200).json(results);
  });
});

app.post('/api/kaydet', (req, res) => {
  const ad = req.body.ad;
  const soyad = req.body.soyad;
  const unvan = req.body.unvan;
  const kurum = req.body.kurum;
  const email = req.body.email;
  const telnum = req.body.telnum;
  const ulke = req.body.ulke;
  const dil = req.body.dil;
  const baslik = req.body.baslik;
  const ingbaslik = req.body.ingbaslik;
  const bildiriozet = req.body.bildiriozet;
  const ingbildiriozet = req.body.ingbildiriozet;
  const anahtarkelime = req.body.anahtarkelime;
  const inganahtarkelime = req.body.inganahtarkelime;

  if (!ad || !soyad) {
    return res.status(400).json({ message: 'Lütfen tüm alanları doldurun' });
  }

  const query = 'INSERT INTO veriler (ad, soyad, unvan, kurum, email, telnum, ulke, dil, baslik, ingbaslik, bildiriozet, ingbildiriozet, anahtarkelime, inganahtarkelime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [ad, soyad, unvan, kurum, email, telnum, ulke, dil, baslik, ingbaslik, bildiriozet, ingbildiriozet, anahtarkelime, inganahtarkelime];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error('Veriler kaydedilirken bir hata oluştu: ' + error.stack);
      return res.status(500).json({ message: 'Veriler kaydedilirken bir hata oluştu' });
    }
    console.log('Veriler başarıyla kaydedildi.');
    return res.status(200).json({ message: 'Veriler başarıyla kaydedildi' });
  });
});

app.get('/api/indir', (req, res) => {
  const query = 'SELECT * FROM veriler';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Veriler alınırken bir hata oluştu: ' + error.stack);
      return res.status(500).json({ message: 'Veriler alınırken bir hata oluştu' });
    }

    const xlsData = json2xls(results);
    const fileName = 'veriler.xlsx';

    fs.writeFileSync(fileName, xlsData, 'binary');
    res.download(fileName, (err) => {
      if (err) {
        console.error('Dosya indirilirken bir hata oluştu: ' + err.stack);
      }
      fs.unlinkSync(fileName);
    });
  });
});

app.delete('/api/sil', (req, res) => {
  const query = 'DELETE FROM veriler';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Veriler silinirken bir hata oluştu: ' + error.stack);
      return res.status(500).json({ message: 'Veriler silinirken bir hata oluştu' });
    }
    
    console.log('Veriler başarıyla silindi.');
    return res.status(200).json({ message: 'Veriler başarıyla silindi' });
  });
});

app.use(express.static(path.join(__dirname, '')));

app.use((req, res) => {
  res.status(404).send('Sayfa bulunamadı');
});

app.listen(port, () => {
  console.log(`Sunucu başlatıldı. Port: ${port}`);
});

function submitForm() {
  var ad = document.getElementById('ad').value;
  var soyad = document.getElementById('soyad').value;
  var unvan = document.getElementById('unvan').value;
  var kurum = document.getElementById('kurum').value;
  var email = document.getElementById('email').value;
  var telnum = document.getElementById('telnum').value;
  var ulke = document.getElementById('ulke').value;
  var dil = document.querySelector('input[name="dil"]:checked').value;
  var baslik = document.getElementById('baslik').value;
  var ingbaslik = document.getElementById('ingbaslik').value;
  var bildiriozet = document.getElementById('bildiriozet').value;
  var ingbildiriozet = document.getElementById('ingbildiriozet').value;
  var anahtarkelime = document.getElementById('anahtarkelime').value;
  var inganahtarkelime = document.getElementById('inganahtarkelime').value;

  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/kaydet', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        console.log('Veriler başarıyla kaydedildi.');
        
      } else {
        console.error('Veriler kaydedilirken bir hata oluştu.');
      }
    }
  };

  var data = JSON.stringify({
    ad: ad,
    soyad: soyad,
    unvan: unvan,
    kurum: kurum,
    email: email,
    telnum: telnum,
    ulke: ulke,
    dil: dil,
    baslik: baslik,
    ingbaslik: ingbaslik,
    bildiriozet: bildiriozet,
    ingbildiriozet: ingbildiriozet,
    anahtarkelime: anahtarkelime,
    inganahtarkelime: inganahtarkelime
  });

  xhr.send(data);
}


