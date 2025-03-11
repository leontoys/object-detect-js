//load transformers.js
//pipeline is API by transformer library - which we can use to do tasks
import { pipeline,env } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers";

//skip local model check
env.allowLocalModels = false;

//read DOM elements
const fileUpload = document.getElementById("file-upload")
const imageContainer = document.getElementById("image-container")
const status = document.getElementById("status")

status.textContent = 'Loading Model...'

//for now we will be doing this in the main thread
//ideally in production apps - we have to use web workers for multi threaded
//so that the UI won't freeze
//pipeline accepts task and model
const detector = await pipeline("object-detection","Xenova/detr-resnet-50")

//after it is loaded
status.textContent = 'Ready'

//wait for file upload
fileUpload.addEventListener("change",(event)=>{
    //file object
    const file = event.target.files[0]

    if(!file){
        return
    }

    //use file reader API
    const reader = new FileReader()

    //we need a call back function after file is read
    reader.onload = (e)=>{
        //clear the image
        imageContainer.innerHTML = ""
        //create
        const image = document.createElement("img")
        image.src = e.target.result //this will be the file url after it is read
        imageContainer.appendChild(image)

        //TODO-detect image
    }


    //read file
    reader.readAsDataURL(file)

})

