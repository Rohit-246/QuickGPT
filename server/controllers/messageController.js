import axios from "axios";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import imagekit from "../configs/imageKit.js";
import openai from "../configs/openai.js";


// text-based ai chat message controller 
 export const  textMessageController = async (req, res) => {
   try {
    const userId = req.user._id;

     
        if(req.user.credits<1){
            return res.json({success: false, message:"you don't have enough credits to use this feature"})

        }

    const { chatId , prompt} = req.body
      

    const chat = await Chat.findOne({userId, _id: chatId})
    chat.messages.push({role: "user", content: prompt, timestamp: Date.now() , isImage: false})

    const {choices} = await openai.chat.completions.create({
    model: "gemini-3.6-flash",
    messages: [
       
        {
            role: "user",
            content: prompt,
        },
    ],
});
    

   const reply = {...choices[0].message , timestamp: Date.now() , isImage: false}

   chat.messages.push(reply)
   await chat.save()
   await User.updateOne({_id: userId} ,{$inc: {credits: -1}})

    res.json({success: true, reply})

   } catch (error) {
     res.json({success: false, message: error.message})
   }
    
 }






 /// image genratin msaagecontrollwer

 export const imaggeMessageController = async (req, res)=>{
    try {
        const userId = req.user._id;
        //check credits

        if(req.user.credits<2){
            return res.json({success: false, message:"you don't have enough credits to use this feature"});

        }

        const {prompt,chatId,isPublished} = req.body;
        ///find chat
         const chat = await Chat.findOne({userId, _id: chatId});

         //pushs user message
         chat.messages.push({role: "user", content: prompt, timestamp: Date.now() , isImage: false});
         /// encode the prompt
         const encodedPrompt = encodeURIComponent(prompt);

         // construct Imaagekit Ai genretion url

         const generatedImageUrl =  `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png`;
               //console.log("url" ,generatedImageUrl);

         ///// trigger genetion by fetching 
     const aiImageResponse =  await axios.get(generatedImageUrl, {responseType: "arraybuffer"});
    //  .catch(error => {

    //         console.log(
    //             "IMAGEKIT ERROR:",
    //             error.response?.data?.toString()
    //         );

    //         console.log(
    //             "STATUS:",
    //             error.response?.status
    //         );

    //         console.log(
    //             "HEADERS:",
    //             error.response?.headers
    //         );

    //         throw error;
    //     });
    

     // covert to base 64

     const base64Image = `data:image/png;base64, ${Buffer.from(aiImageResponse.data,"binary").toString('base64')}`;

     //upload to Iamarkit media libary

     const uploadResponse = await imagekit.files.upload({
        file: base64Image,
        fileName: `${Date.now()}.png`,
        folder: "quickgpt"
     });

     const reply = {role:'assistant',
        content: uploadResponse.url , timestamp: Date.now() , isImage: true, isPublished };
      
        
       chat.messages.push(reply);
       await chat.save();
       await User.updateOne({_id: userId} ,{$inc: {credits: -2}});
        
       return res.json({success: true, reply});
 
    } catch (error) {
       return res.json({success: false, message: error.message})
    }
 }