const mysql=require('mysql');
const dotenv=require('dotenv')
let instance=null;

dotenv.config();

const connection=mysql.createConnection({
    host:process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database:process.env.DATABASE,
    port: process.env.DB_PORT
})

connection.connect((err)=>{
    if(err){
        console.log(err);
    }
    console.log('database ' + connection.state);
});

class DbService{
    static getDbServiceInstance(){
        return instance?instance:new DbService();
    }

    async getAllData(){
        try {
            const res=await new Promise((resolve,reject)=>{
                const query="SELECT * FROM names;";

                connection.query(query, (err,results)=>{
                    if(err) reject(new Error(err.message));
                    resolve(results);
                })
            })
            return res;
        } catch (error) {
            console.log(error)
        }
    }
    async insertNewName(name){
        try {
            const dateAdded=new Date();
            const insertId=await new Promise((resolve,reject)=>{
                const query="INSERT INTO names (name,date_added) VALUES (?,?);";

                connection.query(query, [name,dateAdded],(err,results)=>{
                    if(err) reject(new Error(err.message));
                    resolve(results.insertId);
                })
            })
            // return res;
            return {
                id: insertId,
                name: name,
                dateAdded:dateAdded
            }
        } catch (error) {
            console.log(error)
        }
    }

    async deleteRowById(id){
        try {
            id=parseInt(id,10);
            const res=await new Promise((resolve,reject)=>{
                const query="DELETE FROM names WHERE id = ?";
    
                connection.query(query, [id],(err,result)=>{
                    if(err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            }) 
            return res===1?true:false;
        } catch (error) {
            console.log(error)
            return false;
        }
        

    }
}



module.exports=DbService;