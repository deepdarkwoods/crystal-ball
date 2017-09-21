const electron = require('electron');
const {app,BrowserWindow,ipcMain } = electron;
const path = require('path')
const url = require('url')
var mysql = require('mysql')


let mainWindow;

app.on('ready',()=>{

    mainWindow = new BrowserWindow({});

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
      }))
});



//mySQL request for forecasts
//arg variable is customer number
ipcMain.on('mysql:request-forecast',(event,arg)=>{
    var connection = mysql.createConnection({
        host        :'localhost',
        user        :'root',
        password    :'root',
        database    :'dw' 
    });
    connection.connect(function(err){
        if(err){
              console.log(err.code);
        }
        else{
              console.log("Connected to mysql")
        }
  });
        var queryForecast = (   `SELECT forecast.customernumber,forecast.customername,forecast.sku,forecast.description,month1,month2,month3,month4,month5,month6,s201701,s201702,s201703,s201704,s201705,s201706,s201707,s201708  
                                 FROM forecast 
                                 LEFT JOIN shiphistory on forecast.customernumber = shiphistory.customernumber AND forecast.sku = shiphistory.sku                                    
                                 WHERE forecast.customernumber=` + arg + "");
   
        connection.query(queryForecast,function(error,forecast,fields){
            if (error) console.log(error);   
           
            mainWindow.webContents.send('mysql:results-forecast', forecast);            
    
        });
        connection.end(function(){
            console.log("Connection Terminated");
        });


});
//***************************************************************************************** */


//mySQL request for forecasts by SKU
//arg variable is customer number is sku
ipcMain.on('mysql:request-forecastbysku',(event,arg)=>{
    var connection = mysql.createConnection({
        host        :'localhost',
        user        :'root',
        password    :'root',
        database    :'dw' 
    });
    connection.connect(function(err){
        if(err){
              console.log(err.code);
        }
        else{
              console.log("Connected to mysql")
        }
  });
        var queryForecast = (   `SELECT forecast.customernumber,forecast.customername,forecast.sku,forecast.description,month1,month2,month3,month4,month5,month6,s201701,s201702,s201703,s201704,s201705,s201706,s201707,s201708 
                                FROM forecast 
                                LEFT JOIN shiphistory on forecast.customernumber = shiphistory.customernumber AND forecast.sku = shiphistory.sku   
                                WHERE forecast.sku = '` + arg + "' ");
       
        connection.query(queryForecast,function(error,forecast,fields){
            if (error) console.log(error);   
           
            mainWindow.webContents.send('mysql:results-forecast', forecast);            
    
        });
        connection.end(function(){
            console.log("Connection Terminated");
        });


});
//***************************************************************************************** */



//** mySQL request for customer names **//
ipcMain.on('mysql:request-customerlist',(event)=>{
    
        console.log('request for customer names received');
    
        var connection = mysql.createConnection({
            host        :'localhost',
            user        :'root',
            password    :'root',
            database    :'dw' 
        });
        connection.connect(function(err){
            if(err){
                  console.log(err.code);
            }
            else{
                  console.log("Connected to mysql")
            }
      });
            var queryCustomerName = (`SELECT DISTINCT customernumber,customername 
                                  FROM forecast
                                  ORDER BY customername` ); 
            connection.query(queryCustomerName,function(error,names,fields){
                if (error) console.log(error);        
                    mainWindow.webContents.send('mysql:results-customernames', names);            
                    
            });
            connection.end(function(){
                console.log("Connection Terminated");
            });
    
    
    });

    //***************************************************************************************** */

    
//** mySQL request for list of SKUS **//
ipcMain.on('mysql:request-skulist',(event)=>{
    
        console.log('request for list of skus received');
    
        var connection = mysql.createConnection({
            host        :'localhost',
            user        :'root',
            password    :'root',
            database    :'dw' 
        });
        connection.connect(function(err){
            if(err){
                  console.log(err.code);
            }
            else{
                  console.log("Connected to mysql")
            }
      });
            var queryCustomerName = (`SELECT DISTINCT sku,description 
                                  FROM forecast
                                  ORDER BY sku` ); 
            connection.query(queryCustomerName,function(error,skus,fields){
                if (error) console.log(error);        
                    mainWindow.webContents.send('mysql:results-skulist', skus);            
                    
            });
            connection.end(function(){
                console.log("Connection Terminated");
            });
    
    
    });

    //***************************************************************************************** */