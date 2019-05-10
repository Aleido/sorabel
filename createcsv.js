exports.createcsv=function(data,filename){
    const fs = require('fs');
    const path = require('path');
    const os = require('os');

    // output file in the same folder
    const filepath = path.join(__dirname,filename);
    const output = []; // holds all rows of data

    var dataheader = Object.keys(data[0]) 
    const headerrow = []; // just header
    dataheader.forEach((e) =>{
        headerrow.push(e);
     })
    output.push(dataheader.join()); // just header
    data.forEach((d) => {
        const datakeys = Object.keys(d)
        const row = []; // a new array for each row of data
        datakeys.forEach((e) =>{
            row.push(d[e]);
        })

    output.push(row.join()); // by default, join() uses a ','
    });

    fs.appendFileSync(filepath, output.join(os.EOL));
}