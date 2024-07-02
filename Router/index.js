
const express=require('express')
const jwt=require("jsonwebtoken");
const session = require('express-session');
const pool=require("../database");
// const app=express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const router=express.Router();
const multer = require('multer');
const controller=require("../Controller/controller");
router.use(bodyParser.urlencoded({extended:true}))
router.use(bodyParser.json())
router.use(cookieParser())
const objectId = require('mongodb')._id;
const flightdetail = require("../Controller/member_dashboard_controller");

//const session = require('express-session');

// router.use(session({
//   secret: 'yourVerySecretKey1234567890',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false } // Set to true if using HTTPS
// }));

// router.use((req, res, next) => {
//   console.log('Session:', req.session);
//   next();
// });
  
var fs = require('fs');
var path = require('path');
require('dotenv/config');

router.get('/signup',async(req,res)=>{
    const z=await controller.datahere(req,res);
    console.log(z);
    res.render("signup")
})
router.get('/upload',async(req,res)=>{
    res.render("image")
})
router.get('/try',async(req,res)=>{
    res.render("try")
})
router.get('/result',async(req,res)=>{
    res.render("result")
})
// router.get('/profile',async(req,res)=>{
//     const email=req.cookies.email
//     console.log('this is email check for profile')
//     res.render("profile" ,{layout: false,  email:email});
//     console.log('this is email check for profile')
// })



/*view profile*/
const Image = require('../model'); // Import the Image model or use your own model

//-----------------------------------------------------------------------------------
// router.get('/profile', async (req, res) => {
//     try {
//       const email = req.cookies.email;
  
//       // Retrieve the image document from MongoDB based on the email ID
//       const image = await Image.findOne({ emailid: email });
  
//       // Access the image data and content type from the document
//       const imageData = image ? image.img.data : null;
//       const imageContentType = image ? image.img.contentType : null;
//       const name = image ? image.name : null;
//       const mobile_no=image?image.mobile_no:null;
//       const dob=image?image.dob:null;
//       const type_of_drone_experience=image?image.type_of_drone_experience:null;
//       const honors_and_achievements=image?image.honors_and_achievements:null;
//       const duration1=image?image.duration1:null;
//       const duration2=image?image.duration2:null;
//       const id=image?image._id:null;

  
//       console.log('This is the email check for profile');
  
//       // Render the profile view with the appropriate data
//       res.render('profile', {
//         layout: false,
//         email,
//         imageData,
//         name,
//         imageContentType,
//         mobile_no,
//         dob,
//         type_of_drone_experience,
//         honors_and_achievements,
//         duration1,
//         duration2,
//         id
//       });
  
//       console.log('This is the email check for profile');
//     } catch (error) {
//       // Handle any errors that occur during the process
//       console.error(error);
//       res.status(500).send('Internal Server Error');
//     }
//   });

//-----------------------------------------------------------------------------------
/*edit profile*/
router.get('/editprofile', async (req, res) => {
    try {
      const email = req.cookies.email;
      const emailExists = await flightdetail.isEmailInProfileData(email);
      const username=email.split('@')[0];

    const result = await pool.query(`SELECT * FROM profile_data WHERE emailid = $1`, [email]);
    const profileData = result.rows[0];
   // const originalname = req.session.originalname;
    //const originalFileName=req.file.originalname;
    // console.log("oooooooooooooogggggggggggggggggggg");
    // console.log(originalname);
    // console.log("oooooooooooooogggggggggggggggggggg");

    if (!profileData) {
      return res.status(404).send('Profile not found');
    }
      const imageUrl = await controller2.generateDownloadURL(username); 
      console.log("get edit profile GEPGEPGEPGEPGEPGEP");
      console.log("Profile Data:", profileData);
      console.log("Image URL:", imageUrl);
      console.log("DATEDATEADTE");
      console.log(profileData.dob);
      console.log("DATEDATEADTE");
      console.log("get edit profile GEPGEPGEPGEPGEPGEP");
      res.render('editprofile.ejs', { profileData, imageUrl,emailExists});

  
      
  
      console.log('This is the email check for profile');
    } catch (error) {
      // Handle any errors that occur during the process
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });




  /*insert the record*/

  
  var storage = multer.diskStorage({
      destination: (req, file, cb) => {
          cb(null, 'uploads')
      },
      filename: (req, file, cb) => {
          cb(null, file.fieldname + '-' + Date.now())
      }
  });
  // var upload = multer({ storage: storage });
  var upload=multer();

//   const upload = multer({
//     storage: multer.memoryStorage(), // Store files in memory as buffers (you can change this based on your needs)
//     limits: {
//         fileSize: 5 * 1024 * 1024, // 5 MB file size limit (adjust as necessary)
//     },
// });



  const controller2=require('../s3.js')

  router.get('/insertnewprofile', async (req, res) => {
    try {

      
      const email = req.cookies.email;
      const emailExists = await flightdetail.isEmailInProfileData(email);
      const { url } = await controller2.generateUploadURL(); 
      res.render('insertnewprofile', { url, email ,emailExists});
    } catch (err) {
      console.error('An error occurred:', err);
      res.status(500).send('An error occurred');

    }
  });

  // const { url } =controller2.generateUploadURL().then(res => res.json());
  // console.log(url);
  const fetch = require('node-fetch');

  const AWS = require('aws-sdk');
const { error, Console } = require('console');
  const s3 = new AWS.S3();


  router.post('/insertnewprofile',upload.single('image'),async (req, res) => {
    try{
    const emailid=req.body.emailid;
    //const originalname=req.file.originalname;
    const username = email.split('@')[0];
    console.log("only the username of email is is "+username);
    const url = await controller2.generateUploadURL(username); 
    console.log("Generate upload url"+url);
    const file = req.file.buffer;

    console.log("file received");
    console.log(req.body);
    const originalname=req.file.originalname;
    console.log(req.file.originalname);
    //console.log(file);
    console.log("file received");
    console.log(file);
    console.log(req.file.mimetype);
    console.log("print print ");
    
    // const fileBuffer = req.file.buffer;
    //const contentType = req.file.mimetype;
    const response=await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type":"multipart/form-data"
      },
      body: file
    });
    if (response.ok) {
      console.log('Image uploaded to S3');
      // req.session.originalname = originalname;
      // console.log('Original name stored in session:', req.session.originalname);
  } else {
      
      const errorInText = await response.text();
      console.error('Failed to upload image to S3:',errorInText );
      return;
  }
  const j=await controller.profile(req,res);
console.log(j);

  res.redirect('/profile'); 
} catch (error) {
  console.error('Error uploading image to S3:', error.message);
}
  });


  
  router.get('/profile', async (req, res) => {
    try {
      const email=req.cookies.email;
      const username=email.split('@')[0];
      const emailExists = await flightdetail.isEmailInProfileData(email);

    const result = await pool.query(`SELECT * FROM profile_data WHERE emailid = $1`, [email]);
    const profileData = result.rows[0];
    console.log("ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc");
    //console.log(req.file.originalname);

    if (!profileData) {
      return res.status(404).send('Profile not found');
    }

    const durationResult = await pool.query('SELECT COALESCE(SUM(duration),0) AS total_duration FROM flight_description WHERE emailid = $1', [email]);
    const totalDurationInSeconds = durationResult.rows[0].total_duration;
    console.log(totalDurationInSeconds);


    const sim_durationResult = await pool.query('SELECT COALESCE(SUM(total_minutes),0) AS total_duration FROM simulation WHERE email = $1', [email]);
    const sim_totalDurationInMinutes = sim_durationResult.rows[0].total_duration;
    console.log(sim_totalDurationInMinutes);





        // Convert total duration from seconds to hours, minutes, and seconds
        // const totalHours = Math.floor(totalDurationInSeconds / 3600);
        // const totalMinutes = Math.floor((totalDurationInSeconds % 3600) / 60);
        // const totalSeconds = totalDurationInSeconds % 60;
      const imageUrl = await controller2.generateDownloadURL(username); 
      console.log("pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp");
      console.log("Profile Data:", profileData);
      console.log("Image URL:", imageUrl);
      // console.log("Total Duration (Hours):", totalHours);
      //   console.log("Total Duration (Minutes):", totalMinutes);
      //   console.log("Total Duration (Seconds):", totalSeconds);
      console.log("pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp");
      //console.log(req.file.originalname);
      res.render('profile.ejs', { profileData, imageUrl,totalDurationInSeconds,sim_totalDurationInMinutes,emailExists});
  } catch (error) {
      console.error('Error retrieving object URL from S3:', error);
      res.status(500).send('Failed to retrieve image URL from S3');
  }
  });
  












//----------------------------------------------------------------------------
  // router.get('/insertnewprofile', (req, res) => {
  //   const email = req.cookies.email;

  //     Image.find({}, (err, items) => {
  //         if (err) {
  //             console.log(err);
  //             res.status(500).send('An error occurred', err);
  //         }
  //         else {
  //             res.render('insertnewprofile', { items: items,email });
  //         }
  //     });
  // });
//----------------------------------------------------------------------------
  
//   router.post('/insertnewprofile', upload.single('image'), (req, res, next) => {

//     var obj = {
//         name: req.body.name,
//         emailid: req.body.emailid,
//         mobile_no:req.body.mobile_no,
//         dob:req.body.dob,
//         duration1:req.body.duration1,
//         duration2:req.body.duration2,
//         type_of_drone_experience:req.body.type_of_drone_experience,
//         honors_and_achievements:req.body.honors_and_achievements,
        
         
//         img: {
//             data: fs.readFileSync(path.join('uploads/' + req.file.filename)),
//             contentType: 'image/png'
//         }
//     }
//     Image.create(obj, (err, items) => {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             // item.save();
//             console.log("Your details inserted succesfully")
//             res.redirect("/profile");
//         }
//     });
// });

//----------------------------------------------------------------------------


/*update the pilot details*/
// router.get('/update', async (req, res) => {
//   try {
//     const objectIdToEdit = req.params.id;

//     const document = await Image.findById(objectIdToEdit);

//     if (document) {
//       res.render('editprofile', { layout: false,document:document,aa:req.params.id});
//     } else {
//       res.status(404).send('Document not found.');
//     }
//   } catch (error) {
//     console.error('Error fetching document:', error);
//     res.status(500).send('An error occurred while fetching the document.');
//   }
// });


router.post('/update', upload.single('image'), async (req, res) => {
  try{
    //var name=req.body.emailid;
    const username = email.split('@')[0];
    console.log("only the username of email is is "+username);
    const url = await controller2.generateUploadURL(username); 
    console.log("Generate upload url"+url);
    const file = req.file.buffer;

    console.log("file received");
    console.log(req.body);
    console.log(req.file);
    //console.log(file);
    console.log("file received");
    console.log(file);
    console.log(req.file.mimetype);
    console.log("print print ");
    
    // const fileBuffer = req.file.buffer;
    //const contentType = req.file.mimetype;
    const response=await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type":"multipart/form-data"
      },
      body: file
    });
    if (response.ok) {
      console.log('Image updated to S3');
  } else {
      
      const errorInText = await response.text();
      console.error('Failed to update image to S3:',errorInText );
      return;
  }
  const j=await controller.updateProfile(req,res);
console.log(j);

  res.redirect('/profile'); 
} catch (error) {
  console.error('Error updating image to S3:', error.message);
}
});


router.get('/logout',(req,res)=>{
    const authcookie=req.cookies.authcookie
    const email=req.cookies.email
    res.clearCookie('authcookie');
    res.redirect('/login');
})

// router.post('/signup',async(req,res)=>{
//     const n=await controller.check(req,res);
//         console.log(n)
        
//         res.render("signup")
// });


// const upload = multer({
//     storage: multer.memoryStorage(),
//     limits: {
//       fileSize: 5 * 1024 * 1024 // limit file size to 5 MB
//     }
//   });



router.post('/signup',async(req,res)=>{
    // const n=await controller.check(req,res);
        
    const h=req.body;
    console.log("Checking signup req body");
    console.log(req.body);
    console.log("Checking signup req body");
        const y=await controller.signup(req,res);
        console.log(y);
        
        // res.render("signup")
        res.setHeader('ejs','signup')
});

// router.post('/upload',upload.single('image_data'),async(req,res,next)=>{
//     try{
//     const x=await controller.imageupload(req,res,next);
//     console.log(x);
//     }
//     catch(err)
//     {
//         next(err);
//     }
// })

router.get('/flying',checkToken,async(req,res)=>{
    
    const data=await controller.droneslistdata(req,res);
    console.log(data);
    // res.render('flying',{options});
    // const {t}=await pool.query("SELECT drone_name FROM  drones");
    // console.log({t})
    // // console.log(t)
    // console.log("Hi")
    // const options=t.map(row=>row.drone_name);
    // console.log({options})
    // res.render('flying',{ options: options})



    const c=await controller.flightdata(req,res);
    console.log(c);
    // res.render("flying",{options:[]});
   
})

router.get('/viewdetails',checkToken,async(req,res)=>{
  const email=req.cookies.email;
  const emailExists = await flightdetail.isEmailInProfileData(email);
    
    console.log("working");
    const data=await controller.viewdetails(req,res);
    
    
    res.render('viewdetails',{data,emailExists});
    // res.send(y);
    // console.log(y);
    // res.send("Displaying current user details")
    // res.render('admin')
    
})

router.post('/flying',checkToken,async(req,res)=>{
    console.log("post flying.................................")
    const h=req.body;
    console.log(h)
    console.log("Hi")
    const y=await controller.flying(req,res);
    console.log("post flying.................................")
    console.log(y);
    // res.render("login");
    // res.send("Report Submission Done")
    // alert("done");
})

router.post('/crash',checkToken,async(req,res)=>{
    const p=req.body
    console.log(p);
    const t=await controller.crashdetails(req,res);
    console.log(t)
    // res.render('crash');
})
router.get('/login',(req,res)=>{
    res.render('login');
})
router.post('/login',async(req,res)=>{
    const h=req.body;
    const y=await controller.logincheck(req,res);
    console.log(y);

    
})
// router.get('/protected',(req,res)=>{
//     const token=req.headers['authorization'];

//     if(!token)
//     {
//         res.status(401).send('No token provided');
//         return;
//     }
//     jwt.verify(req.token,'sfhsfhsfhfsiofhiosghiogjiogjdoghfioghioghfodiofghdfiogh',(err,decoded)=>{
//         if(err){
//             res.status(401).send('Invalid token');
//             return;
//         }
//         // If the token is valid, return a success message with the decoded token payload
//     res.send(`Hello, ${decoded.email}!`);
//     res.render('/flying')
//     console.log("Token done")
//     })
// })
router.get('/api',checkToken,(req,res)=>{
    // function auth(val,err)
    // {
    //     if(val)
    //     {
    //         res.render('crash')
    //     }
    //     else if(err)
    //     {
    //         res.render('/login')
    //     }
    // }
    res.render('crash');
})
function checkToken(req,res,next){
    //get authcookie from request

    const authcookie=req.cookies.authcookie
    const email=req.cookies.email
    console.log(email)
    console.log(authcookie)

    //verify token which is in cookie value
    jwt.verify(authcookie,"sfhsfhsfhfsiofhiosghiogjiogjdoghfioghioghfodiofghdfiogh",(err,data)=>{
        if(err){
            res.sendStatus(403)
        }
        else {
           req.user=data;//Set the decoded data in the req.user object
           next();
            
        }
    })
}
// router.post('/insert_damaged_parts', async (req, res) => {
//     try {
//       console.log("insert_damaged_parts_router")
//       const totalPrice = await controller.insertdamagedparts(req, res);
//       console.log(totalPrice);
//       res.json({ totalPrice });
//     } catch (err) {
//       console.error('Error calculating price:', err);
//       res.status(500).json({ error: 'Error calculating price' });
//     }
//   });
  
router.post('/insert_damaged_parts', async (req, res) => {
  try {
    console.log("insert_damaged_parts_router");
    console.log("insert_damaged_parts_router1");
 
    const { flightId, selectedItems } = req.body;
    console.log(req.body);
    console.log("Flight ID:", flightId);
    console.log("Flight ID type:", typeof flightId);
    console.log("Selected Items:", selectedItems);
    const item= await controller.insertdamagedparts(req,res);
    
  } catch (err) {
    console.error('Error', err);
    
  }
});   

// router.post('/insert_damaged_parts', async (req, res) => {
//   var name = req.body;
//   if (name.insert_damaged_parts!= undefined){
//     console.log("insert_damaged_parts_router");
//     console.log("insert_damaged_parts_router1");
 
//     const { flightId, selectedItems } = req.body;
//     console.log(req.body);
//     console.log("Flight ID:", flightId);
//     console.log("Flight ID type:", typeof flightId);
//     console.log("Selected Items:", selectedItems);
//     const item= await controller.insertdamagedparts(req,res);
//   }
  
//   else if(name.cost_of_damage!= undefined){
//     console.log("this is else block...........");
//     const flightId = cost_of_damage.value;
//     const cost=await controller.costofdamage(req,res);
//     console.log("Flight ID:", flightId);
//     console.log("this is else block...........");
//     res.render('cost_of_damage', { layout: false,cost});

//   }
    
 
// }); 






  router.get('/dashboard',checkToken,async(req,res)=>{
    
    try{
      const email=req.cookies.email;
      const emailExists = await flightdetail.isEmailInProfileData(email);
        console.log("Working");
        const { totalDuration,results,crashDetails,crashdetailsrows,trueCount,falseCount,itemcost,flighttime}=await controller.flightdetails(req,res);
        console.log(crashDetails);
        console.log(totalDuration);
        console.log("dashboard details.......")
        console.log(crashdetailsrows)
        console.log('nishmitha......................................')
        console.log(itemcost)
        console.log(flighttime)
        console.log('aditi......................................')
        res.render('dashboard',{totalDuration,results,query4:crashDetails,crashdetails:crashdetailsrows,trueCount,falseCount,itemcost,flighttime,emailExists})
    }
    catch(err)
    {
        console.log(err);
        res.render('dashboard',{totalDuration:0,results:[],query4:[],crashdetails:[],emailExists});
    }
    
  })
  

router.get('/pilotflightdetails',checkToken,async(req,res)=>{
    
  try{
    const email=req.cookies.email;
    const emailExists = await flightdetail.isEmailInProfileData(email);
      console.log("Working");
      const { totalDuration,results,crashdetailsrows,cost}=await controller.flightdetails(req,res);
      const {crashDetails}=await controller.flightdetails(req,res);
      // const cost=await controller.costofdamage(req,res);
      console.log(crashDetails);
      console.log(totalDuration);
      res.render('member_successful_flight_details',{totalDuration,results,query4:crashDetails||[],crashdetails:crashdetailsrows,cost,emailExists})
  }
  catch(err)
  {
      console.log(err);
      res.render('member_successful_flight_details',{totalDuration:0,results:[],query4:[],crashdetails:[],cost:0},emailExists);
  }
  
})


router.get('/pilotcrashdetails',checkToken,async(req,res)=>{
  const email=req.cookies.email;
  const emailExists = await flightdetail.isEmailInProfileData(email);
    
  try{
      console.log("Working");
      const { totalDuration,results,crashDetails,crashdetailsrows,items_name}=await controller.flightdetails(req,res);
      console.log(crashDetails);
      console.log(totalDuration);
      console.log("hello pilot")
      console.log(crashdetailsrows)
      res.render('member_crash_details',{totalDuration,results,query4:crashDetails,crashdetails:crashdetailsrows,items_name,emailExists})
  }
  catch(err)
  {
      console.log(err);
      res.render('member_crash_details',{totalDuration:0,results:[],query4:[],crashdetails:[],emailExists});
  }
  
})


/*damage cost of each plane*/
router.get('/cost_details', (req, res) => {
  const { flightId } = req.query;

  // Query the database to get the cost details
  const query = `
    SELECT
      SUM(c.items_cost) AS total_cost,
      f.items_name
    FROM
      cost_details c
    JOIN
      flight_crash_items f ON f.items_name = c.items_name
    WHERE
      f.flight_id = $1
    GROUP BY
      f.items_name;
  `;

  // Execute the query
  pool.query(query, [flightId], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Error retrieving cost details' });
      return;
    }

    const rows = result.rows;

    // Extract the total cost and items name from the query results
    // const totalCost = rows.reduce((acc, row) => acc + row.total_cost, 0);
    const itemsName = rows.map(row => row.items_name);
    const totalCost = rows.map(row => row.total_cost);
    // Construct the response object with the retrieved data
    const responseData = {
      total_cost: totalCost,
      items_name: itemsName
    };

    res.json(responseData);
  });
});










/*admin realted*/
router.get('/pilotprofile',async(req,res)=>{
    res.render("pilotprofile")
})

module.exports=router;
