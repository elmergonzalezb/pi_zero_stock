"use strict"

class Pihut {
  constructor(modules) {
    this.modules = modules;
    this.baseProductIds = [14062715972, 30332705425];
  }

  _pullCounts(url) {

    return new Promise((resolve, reject) => {
      let options = {
        url: url,
        headers: {
          "User-Agent": "stockalert.alexellis.io",
        },
        "json": true
      };

      this.modules.request.get(options, (err, response, body) => {
        let total = 0;
        try {
          if(body && body.variants) {
            body.variants.forEach((v) => {
               if(this.baseProductIds.indexOf(v.id) > -1 && v.inventory_quantity) {
                 let val = Number(v.inventory_quantity);
                 if(val > 0 && v.price > 0) {
                    total += val;
                 }
               }
            });
          }
        } catch(e) {
          console.error(e);
          return resolve(0);
        }
        resolve(total);
      });
    });
  }

  refresh(done) {
    var stock = {};
    var total = 0;
    var urls = [
      "https://thepihut.com/products/raspberry-pi-zero.js",
      "https://thepihut.com/collections/raspberry-pi/products/raspberry-pi-zero-w.js"
    ];
    var promises = [];
    urls.forEach((url)=> {
      promises.push(this._pullCounts(url));
    });

    Promise.all(promises)
    .then((results) => {

      results.forEach((r)=> {
        total+=r;
      });
      done(null, {stock: total>0, totalAmount: total});
    })
    .catch((e) => {
      console.error(e);
      done(null, {stock: total>0, totalAmount: total});
    });
  }
}

module.exports = Pihut;
