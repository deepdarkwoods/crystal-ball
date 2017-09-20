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
        var queryForecast = ("SELECT customernumber,customername,sku,description,month1,month2,month3,month4,month5,month6 FROM forecast WHERE customernumber=" + arg + "");
   
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
        var queryForecast = ("SELECT customernumber,customername,sku,description,month1,month2,month3,month4,month5,month6 FROM forecast WHERE sku = '" + arg + "' ");
       
        connection.query(queryForecast,function(error,forecast,fields){
            if (error) console.log(error);   
           
            mainWindow.webContents.send('mysql:results-forecastbysku', forecast);            
    
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